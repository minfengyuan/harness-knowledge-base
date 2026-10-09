import { constants as fsConstants } from "node:fs";
import fs from "node:fs/promises";
import os from "node:os";
import path from "node:path";
import { createHash, randomUUID } from "node:crypto";

export const MANIFEST_NAME = ".hkb-dev-mode.json";

function isMissing(error) {
  return error?.code === "ENOENT";
}

async function lstatOrNull(filePath, fsApi = fs) {
  try {
    return await fsApi.lstat(filePath);
  } catch (error) {
    if (isMissing(error)) return null;
    throw error;
  }
}

export function codexHome(env = process.env, home = os.homedir()) {
  return path.resolve(env.CODEX_HOME || path.join(home, ".codex"));
}

export function adapterPaths({ scope, cwd = process.cwd(), env = process.env, home = os.homedir(), canonicalPath }) {
  if (scope === "global") {
    const root = codexHome(env, home);
    return {
      sourceDir: path.join(canonicalPath ?? path.join(root, "skills", "dev-mode"), "agents"),
      targetDir: path.join(root, "agents"),
    };
  }
  return {
    sourceDir: path.join(canonicalPath ?? path.join(path.resolve(cwd), ".agents", "skills", "dev-mode"), "agents"),
    targetDir: path.join(path.resolve(cwd), ".codex", "agents"),
  };
}

export async function listCanonicalAgents(sourceDir, fsApi = fs) {
  let entries;
  try {
    entries = await fsApi.readdir(sourceDir, { withFileTypes: true });
  } catch (error) {
    if (isMissing(error)) return null;
    throw error;
  }
  const sources = [];
  for (const entry of entries) {
    if (!entry.name.endsWith(".toml")) continue;
    if (entry.name !== path.basename(entry.name)) throw new Error(`Unsafe Codex agent name: ${entry.name}`);
    if (entry.isSymbolicLink()) throw new Error(`Codex agent source must not be a symlink: ${entry.name}`);
    if (!entry.isFile()) throw new Error(`Codex agent source must be a regular file: ${entry.name}`);
    sources.push({ name: entry.name, path: path.join(sourceDir, entry.name) });
  }
  return sources.sort((left, right) => left.name.localeCompare(right.name));
}

function digest(content) {
  return createHash("sha256").update(content).digest("hex");
}

async function readManifest(targetDir, fsApi = fs) {
  let raw;
  try {
    raw = await fsApi.readFile(path.join(targetDir, MANIFEST_NAME), "utf8");
  } catch (error) {
    if (isMissing(error)) return {};
    throw error;
  }
  let value;
  try {
    value = JSON.parse(raw);
  } catch (error) {
    throw new Error(`Invalid HKB manifest: ${path.join(targetDir, MANIFEST_NAME)}`, { cause: error });
  }
  const files = value && typeof value.files === "object" && value.files !== null ? value.files : {};
  return Object.fromEntries(Object.entries(files).filter(([name, hash]) => {
    return name === path.basename(name) && name.endsWith(".toml") && typeof hash === "string";
  }));
}

async function writeManifest(targetDir, files, fsApi = fs) {
  const manifestPath = path.join(targetDir, MANIFEST_NAME);
  const names = Object.keys(files).sort();
  if (names.length === 0) {
    await fsApi.rm(manifestPath, { force: true });
    return;
  }
  const temporary = path.join(targetDir, `.hkb-manifest-${randomUUID()}.tmp`);
  const content = { version: 1, files: Object.fromEntries(names.map((name) => [name, files[name]])) };
  try {
    await fsApi.writeFile(temporary, `${JSON.stringify(content, null, 2)}\n`);
    await fsApi.rename(temporary, manifestPath);
  } catch (error) {
    await fsApi.rm(temporary, { force: true }).catch(() => {});
    throw error;
  }
}

// Agent files are installed as plain copies. HKB ownership is tracked by the manifest
// (name -> sha256 of the installed copy); symlinks into the canonical skill are legacy installs.
async function readTarget(targetPath, sourceDir, expectedSource, recordedHash, fsApi = fs) {
  const stat = await lstatOrNull(targetPath, fsApi);
  if (!stat) return { state: "missing", targetPath, owned: false };
  if (stat.isDirectory()) return { state: "directory-conflict", targetPath, owned: false };
  if (stat.isSymbolicLink()) {
    const link = await fsApi.readlink(targetPath);
    const resolved = path.resolve(path.dirname(targetPath), link);
    const owned = path.dirname(resolved) === path.resolve(sourceDir)
      || (expectedSource !== undefined && resolved === path.resolve(expectedSource));
    if (!owned) return { state: "symlink-conflict", targetPath, link, resolved, owned: false };
    return { state: expectedSource ? "legacy-link" : "stale", targetPath, link, resolved, owned: true };
  }
  if (!stat.isFile()) return { state: "file-conflict", targetPath, owned: false };
  const hash = digest(await fsApi.readFile(targetPath));
  const unmodified = recordedHash !== undefined && hash === recordedHash;
  if (expectedSource) {
    if (hash === digest(await fsApi.readFile(expectedSource))) return { state: "correct", targetPath, hash, owned: true };
    if (unmodified) return { state: "outdated", targetPath, hash, owned: true };
    return { state: "file-conflict", targetPath, hash, owned: recordedHash !== undefined };
  }
  if (unmodified) return { state: "stale", targetPath, hash, owned: true };
  return { state: "file-conflict", targetPath, hash, owned: false };
}

async function targetTomlNames(targetDir, fsApi = fs) {
  try {
    const entries = await fsApi.readdir(targetDir, { withFileTypes: true });
    return entries.filter((entry) => entry.name.endsWith(".toml")).map((entry) => entry.name);
  } catch (error) {
    if (isMissing(error)) return [];
    throw error;
  }
}

export async function inspectCodexAgents({ sourceDir, targetDir, fsApi = fs }) {
  const sources = await listCanonicalAgents(sourceDir, fsApi);
  const sourceByName = new Map((sources ?? []).map((source) => [source.name, source.path]));
  const manifest = await readManifest(targetDir, fsApi);
  const names = new Set([...sourceByName.keys(), ...(await targetTomlNames(targetDir, fsApi))]);
  const links = [];
  for (const name of [...names].sort()) {
    const expectedSource = sourceByName.get(name);
    const target = await readTarget(path.join(targetDir, name), sourceDir, expectedSource, manifest[name], fsApi);
    if (expectedSource || target.owned) links.push({ name, ...target });
  }
  return { installed: sources !== null, sourceDir, targetDir, links };
}

const REPLACEABLE = ["stale", "outdated", "legacy-link"];
const CONFLICTS = ["file-conflict", "symlink-conflict"];

export async function syncCodexAgents({ sourceDir, targetDir, force = false, fsApi = fs }) {
  const report = await inspectCodexAgents({ sourceDir, targetDir, fsApi });
  if (!report.installed) return { ...report, created: [], removed: [], unchanged: [] };

  const sourceByName = new Map((await listCanonicalAgents(sourceDir, fsApi)).map((item) => [item.name, item.path]));
  const directoryConflict = report.links.find((link) => link.state === "directory-conflict");
  if (directoryConflict) throw new Error(`Refusing to replace directory: ${directoryConflict.targetPath}`);
  const conflicts = report.links.filter((link) => CONFLICTS.includes(link.state) && !force);
  if (conflicts.length > 0) {
    throw new Error(`Codex agent file conflict: ${conflicts.map((item) => item.targetPath).join(", ")}`);
  }
  const toBackup = report.links.filter((link) => REPLACEABLE.includes(link.state)
    || (force && CONFLICTS.includes(link.state)));
  const toCreate = report.links.filter((link) => sourceByName.has(link.name) && link.state !== "correct")
    .map((link) => ({ name: link.name, target: link.targetPath, source: sourceByName.get(link.name) }));
  const unchanged = report.links.filter((link) => link.state === "correct").map((link) => link.targetPath);
  const manifest = Object.fromEntries(report.links.filter((link) => link.state === "correct")
    .map((link) => [link.name, link.hash]));
  const backups = [];
  const created = [];
  const targetDirExisted = Boolean(await lstatOrNull(targetDir, fsApi));
  await fsApi.mkdir(targetDir, { recursive: true });
  try {
    for (const item of toBackup) {
      const backup = path.join(targetDir, `.hkb-${path.basename(item.targetPath)}-${randomUUID()}.bak`);
      await fsApi.rename(item.targetPath, backup);
      backups.push({ target: item.targetPath, backup });
    }
    for (const item of toCreate) {
      await fsApi.copyFile(item.source, item.target, fsConstants.COPYFILE_EXCL);
      created.push(item.target);
      manifest[item.name] = digest(await fsApi.readFile(item.target));
    }
    await writeManifest(targetDir, manifest, fsApi);
  } catch (error) {
    for (const target of created.reverse()) await fsApi.unlink(target).catch(() => {});
    for (const item of backups.reverse()) await fsApi.rename(item.backup, item.target).catch(() => {});
    if (!targetDirExisted) await fsApi.rmdir(targetDir).catch(() => {});
    throw error;
  }
  for (const item of backups) await fsApi.unlink(item.backup);
  return {
    ...report,
    created,
    removed: toBackup.filter((item) => !sourceByName.has(item.name)).map((item) => item.targetPath),
    unchanged,
  };
}

// Snapshots HKB-owned agent files (unmodified copies listed in the manifest, plus legacy
// symlinks into the canonical skill) and the manifest itself, so removal can be rolled back.
export async function snapshotOwnedLinks({ sourceDir, targetDir, fsApi = fs }) {
  const manifest = await readManifest(targetDir, fsApi);
  const snapshots = [];
  for (const name of await targetTomlNames(targetDir, fsApi)) {
    const target = path.join(targetDir, name);
    const state = await readTarget(target, sourceDir, undefined, manifest[name], fsApi);
    if (!state.owned) continue;
    if (state.link !== undefined) snapshots.push({ target, link: state.link });
    else snapshots.push({ target, content: await fsApi.readFile(target) });
  }
  snapshots.sort((left, right) => left.target.localeCompare(right.target));
  const manifestPath = path.join(targetDir, MANIFEST_NAME);
  if (await lstatOrNull(manifestPath, fsApi)) {
    snapshots.push({ target: manifestPath, content: await fsApi.readFile(manifestPath) });
  }
  return snapshots;
}

export async function removeOwnedLinks(snapshots, fsApi = fs) {
  const removed = [];
  try {
    for (const snapshot of snapshots) {
      await fsApi.unlink(snapshot.target);
      removed.push(snapshot);
    }
  } catch (error) {
    await restoreOwnedLinks(removed, { fsApi });
    throw error;
  }
}

export async function restoreOwnedLinks(snapshots, { platform = process.platform, fsApi = fs } = {}) {
  for (const snapshot of snapshots) {
    if (snapshot.content !== undefined) await fsApi.writeFile(snapshot.target, snapshot.content);
    else if (platform === "win32") await fsApi.symlink(snapshot.link, snapshot.target, "file");
    else await fsApi.symlink(snapshot.link, snapshot.target);
  }
}

export function adapterProblems(report) {
  if (!report.installed) {
    return report.links.filter((link) => link.owned).map((link) => ({ ...link, problem: "dangling" }));
  }
  return report.links.filter((link) => link.state !== "correct").map((link) => ({ ...link, problem: link.state }));
}
