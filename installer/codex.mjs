import fs from "node:fs/promises";
import os from "node:os";
import path from "node:path";
import { randomUUID } from "node:crypto";

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

async function readTarget(targetPath, sourceDir, expectedSource, fsApi = fs) {
  const stat = await lstatOrNull(targetPath, fsApi);
  if (!stat) return { state: "missing", targetPath };
  if (stat.isDirectory()) return { state: "directory-conflict", targetPath };
  if (!stat.isSymbolicLink()) return { state: "file-conflict", targetPath };
  const link = await fsApi.readlink(targetPath);
  const resolved = path.resolve(path.dirname(targetPath), link);
  const owned = path.dirname(resolved) === path.resolve(sourceDir);
  const exists = Boolean(await lstatOrNull(resolved, fsApi));
  if (expectedSource && resolved === path.resolve(expectedSource)) {
    return { state: exists ? "correct" : "dangling", targetPath, link, resolved, owned: true };
  }
  if (owned && !exists) return { state: "stale", targetPath, link, resolved, owned: true };
  return { state: "symlink-conflict", targetPath, link, resolved, owned };
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
  const names = new Set([...sourceByName.keys(), ...(await targetTomlNames(targetDir, fsApi))]);
  const links = [];
  for (const name of [...names].sort()) {
    const expectedSource = sourceByName.get(name);
    const target = await readTarget(path.join(targetDir, name), sourceDir, expectedSource, fsApi);
    if (expectedSource || target.owned) links.push({ name, ...target });
  }
  return { installed: sources !== null, sourceDir, targetDir, links };
}

function windowsSymlinkHint(error, platform) {
  if (platform === "win32" && ["EPERM", "EACCES"].includes(error?.code)) {
    return new Error(`${error.message}. Enable Windows Developer Mode or use a terminal with permission to create file symlinks.`, { cause: error });
  }
  return error;
}

async function createFileSymlink(source, target, platform, fsApi) {
  const relativeSource = path.relative(path.dirname(target), source);
  try {
    if (platform === "win32") await fsApi.symlink(relativeSource, target, "file");
    else await fsApi.symlink(relativeSource, target);
  } catch (error) {
    throw windowsSymlinkHint(error, platform);
  }
}

export async function syncCodexAgents({ sourceDir, targetDir, force = false, platform = process.platform, fsApi = fs }) {
  const report = await inspectCodexAgents({ sourceDir, targetDir, fsApi });
  if (!report.installed) return { ...report, created: [], removed: [], unchanged: [] };

  const sourceByName = new Map((await listCanonicalAgents(sourceDir, fsApi)).map((item) => [item.name, item.path]));
  const directoryConflict = report.links.find((link) => link.state === "directory-conflict");
  if (directoryConflict) throw new Error(`Refusing to replace directory: ${directoryConflict.targetPath}`);
  const conflicts = report.links.filter((link) => {
    return ["file-conflict", "symlink-conflict"].includes(link.state) && !force;
  });
  if (conflicts.length > 0) {
    throw new Error(`Codex agent link conflict: ${conflicts.map((item) => item.targetPath).join(", ")}`);
  }
  const toBackup = report.links.filter((link) => ["stale", "dangling"].includes(link.state)
    || (force && ["file-conflict", "symlink-conflict"].includes(link.state)));
  const toCreate = report.links.filter((link) => sourceByName.has(link.name) && link.state !== "correct")
    .map((link) => ({ target: link.targetPath, source: sourceByName.get(link.name) }));
  const unchanged = report.links.filter((link) => link.state === "correct").map((link) => link.targetPath);
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
      await createFileSymlink(item.source, item.target, platform, fsApi);
      created.push(item.target);
    }
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

export async function snapshotOwnedLinks({ sourceDir, targetDir, fsApi = fs }) {
  const snapshots = [];
  for (const name of await targetTomlNames(targetDir, fsApi)) {
    const target = path.join(targetDir, name);
    const state = await readTarget(target, sourceDir, undefined, fsApi);
    if (state.owned) snapshots.push({ target, link: state.link });
  }
  return snapshots.sort((left, right) => left.target.localeCompare(right.target));
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
    if (platform === "win32") await fsApi.symlink(snapshot.link, snapshot.target, "file");
    else await fsApi.symlink(snapshot.link, snapshot.target);
  }
}

export function adapterProblems(report) {
  if (!report.installed) {
    return report.links.filter((link) => link.owned).map((link) => ({ ...link, problem: "dangling" }));
  }
  return report.links.filter((link) => link.state !== "correct").map((link) => ({ ...link, problem: link.state }));
}
