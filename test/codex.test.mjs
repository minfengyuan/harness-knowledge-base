import assert from "node:assert/strict";
import fs from "node:fs/promises";
import os from "node:os";
import path from "node:path";
import test from "node:test";
import {
  adapterPaths,
  adapterProblems,
  inspectCodexAgents,
  listCanonicalAgents,
  MANIFEST_NAME,
  removeOwnedLinks,
  restoreOwnedLinks,
  snapshotOwnedLinks,
  syncCodexAgents,
} from "../installer/codex.mjs";

async function fixture(t, names = ["delegate.toml", "worker.toml"]) {
  const root = await fs.mkdtemp(path.join(os.tmpdir(), "hkb-codex-"));
  t.after(() => fs.rm(root, { recursive: true, force: true }));
  const sourceDir = path.join(root, ".agents", "skills", "dev-mode", "agents");
  const targetDir = path.join(root, ".codex", "agents");
  await fs.mkdir(sourceDir, { recursive: true });
  for (const name of names) await fs.writeFile(path.join(sourceDir, name), name);
  await fs.writeFile(path.join(sourceDir, "openai.yaml"), "ignored: true\n");
  return { root, sourceDir, targetDir };
}

test("copies agent files instead of linking and repeated sync is idempotent", async (t) => {
  const paths = await fixture(t);
  const first = await syncCodexAgents(paths);
  assert.equal(first.created.length, 2);
  const target = path.join(paths.targetDir, "delegate.toml");
  const stat = await fs.lstat(target);
  assert.equal(stat.isSymbolicLink(), false);
  assert.equal(stat.isFile(), true);
  assert.equal(await fs.readFile(target, "utf8"), "delegate.toml");
  const second = await syncCodexAgents(paths);
  assert.equal(second.created.length, 0);
  assert.equal(second.unchanged.length, 2);
});

test("refreshes outdated copies after the canonical skill changes", async (t) => {
  const paths = await fixture(t, ["worker.toml"]);
  await syncCodexAgents(paths);
  await fs.writeFile(path.join(paths.sourceDir, "worker.toml"), "worker v2");
  const report = await inspectCodexAgents(paths);
  assert.deepEqual(adapterProblems(report).map((problem) => problem.problem), ["outdated"]);
  const synced = await syncCodexAgents(paths);
  assert.equal(synced.created.length, 1);
  assert.equal(await fs.readFile(path.join(paths.targetDir, "worker.toml"), "utf8"), "worker v2");
  assert.deepEqual(adapterProblems(await inspectCodexAgents(paths)), []);
});

test("does not overwrite locally edited copies without force", async (t) => {
  const paths = await fixture(t, ["worker.toml"]);
  await syncCodexAgents(paths);
  const target = path.join(paths.targetDir, "worker.toml");
  await fs.writeFile(target, "edited by user");
  await assert.rejects(syncCodexAgents(paths), /file conflict/);
  assert.equal(await fs.readFile(target, "utf8"), "edited by user");
  await syncCodexAgents({ ...paths, force: true });
  assert.equal(await fs.readFile(target, "utf8"), "worker.toml");
});

test("replaces legacy HKB symlinks with copies", async (t) => {
  const paths = await fixture(t, ["worker.toml", "retired.toml"]);
  await fs.mkdir(paths.targetDir, { recursive: true });
  for (const name of ["worker.toml", "retired.toml"]) {
    await fs.symlink(path.relative(paths.targetDir, path.join(paths.sourceDir, name)), path.join(paths.targetDir, name));
  }
  await fs.rm(path.join(paths.sourceDir, "retired.toml"));
  const report = await inspectCodexAgents(paths);
  assert.deepEqual(adapterProblems(report).map((problem) => problem.problem), ["stale", "legacy-link"]);
  const synced = await syncCodexAgents(paths);
  assert.deepEqual(synced.removed.map((item) => path.basename(item)), ["retired.toml"]);
  const target = path.join(paths.targetDir, "worker.toml");
  assert.equal((await fs.lstat(target)).isSymbolicLink(), false);
  assert.equal(await fs.readFile(target, "utf8"), "worker.toml");
  await assert.rejects(fs.lstat(path.join(paths.targetDir, "retired.toml")), { code: "ENOENT" });
});

test("removes stale owned copies and reports dangling links when the skill is gone", async (t) => {
  const paths = await fixture(t);
  await syncCodexAgents(paths);
  await fs.rm(path.join(paths.sourceDir, "worker.toml"));
  const synced = await syncCodexAgents(paths);
  assert.deepEqual(synced.removed.map((item) => path.basename(item)), ["worker.toml"]);

  await fs.rm(path.dirname(paths.sourceDir), { recursive: true });
  const report = await inspectCodexAgents(paths);
  assert.equal(report.installed, false);
  assert.deepEqual(adapterProblems(report).map((problem) => problem.problem), ["dangling"]);
});

test("rejects conflicts unless force can safely replace them", async (t) => {
  const paths = await fixture(t, ["worker.toml"]);
  await fs.mkdir(paths.targetDir, { recursive: true });
  const target = path.join(paths.targetDir, "worker.toml");
  await fs.writeFile(target, "user file");
  await assert.rejects(syncCodexAgents(paths), /file conflict/);
  assert.equal(await fs.readFile(target, "utf8"), "user file");
  await syncCodexAgents({ ...paths, force: true });
  assert.equal(await fs.readFile(target, "utf8"), "worker.toml");
});

test("rejects a wrong expected symlink but ignores unrelated custom agents", async (t) => {
  const paths = await fixture(t, ["worker.toml"]);
  await fs.mkdir(paths.targetDir, { recursive: true });
  const target = path.join(paths.targetDir, "worker.toml");
  await fs.symlink("foreign-source.toml", target);
  await fs.writeFile(path.join(paths.targetDir, "personal.toml"), "user-owned");
  await assert.rejects(syncCodexAgents(paths), /file conflict/);
  await syncCodexAgents({ ...paths, force: true });
  assert.equal((await fs.lstat(target)).isSymbolicLink(), false);
  const report = await inspectCodexAgents(paths);
  assert.deepEqual(adapterProblems(report), []);
  assert.equal(await fs.readFile(path.join(paths.targetDir, "personal.toml"), "utf8"), "user-owned");
});

test("force still refuses directories", async (t) => {
  const paths = await fixture(t, ["worker.toml"]);
  await fs.mkdir(path.join(paths.targetDir, "worker.toml"), { recursive: true });
  await assert.rejects(syncCodexAgents({ ...paths, force: true }), /Refusing to replace directory/);
});

test("rolls back replacements and new copies after a mid-transaction failure", async (t) => {
  const paths = await fixture(t, ["a.toml", "b.toml"]);
  await fs.mkdir(paths.targetDir, { recursive: true });
  await fs.writeFile(path.join(paths.targetDir, "b.toml"), "keep me");
  let calls = 0;
  const failingFs = new Proxy(fs, {
    get(target, property) {
      if (property !== "copyFile") return target[property];
      return async (...args) => {
        calls += 1;
        if (calls === 2) throw Object.assign(new Error("injected failure"), { code: "EIO" });
        return target.copyFile(...args);
      };
    },
  });
  await assert.rejects(syncCodexAgents({ ...paths, force: true, fsApi: failingFs }), /injected failure/);
  await assert.rejects(fs.lstat(path.join(paths.targetDir, "a.toml")), { code: "ENOENT" });
  assert.equal(await fs.readFile(path.join(paths.targetDir, "b.toml"), "utf8"), "keep me");
  assert.deepEqual((await fs.readdir(paths.targetDir)).sort(), ["b.toml"]);
});

test("never creates symlinks, including on Windows", async (t) => {
  const paths = await fixture(t, ["worker.toml"]);
  const noSymlinkFs = new Proxy(fs, {
    get(target, property) {
      if (property === "symlink") return async () => { throw new Error("symlink must not be called"); };
      return target[property];
    },
  });
  await syncCodexAgents({ ...paths, fsApi: noSymlinkFs });
  assert.equal(await fs.readFile(path.join(paths.targetDir, "worker.toml"), "utf8"), "worker.toml");
});

test("respects CODEX_HOME and snapshots only HKB-owned links", async (t) => {
  const paths = await fixture(t, ["worker.toml"]);
  const resolved = adapterPaths({
    scope: "global",
    env: { CODEX_HOME: path.join(paths.root, "custom-codex") },
    home: path.join(paths.root, "home"),
  });
  assert.equal(resolved.sourceDir, path.join(paths.root, "custom-codex", "skills", "dev-mode", "agents"));
  assert.equal(resolved.targetDir, path.join(paths.root, "custom-codex", "agents"));

  await syncCodexAgents(paths);
  await fs.symlink("elsewhere.toml", path.join(paths.targetDir, "foreign.toml"));
  await fs.writeFile(path.join(paths.targetDir, "personal.toml"), "user-owned");
  const snapshots = await snapshotOwnedLinks(paths);
  assert.deepEqual(snapshots.map((item) => path.basename(item.target)), ["worker.toml", MANIFEST_NAME]);
  await removeOwnedLinks(snapshots);
  await assert.rejects(fs.lstat(path.join(paths.targetDir, "worker.toml")), { code: "ENOENT" });
  assert.equal(await fs.readFile(path.join(paths.targetDir, "personal.toml"), "utf8"), "user-owned");
  await restoreOwnedLinks(snapshots);
  assert.equal(await fs.readFile(path.join(paths.targetDir, "worker.toml"), "utf8"), "worker.toml");
  assert.deepEqual(adapterProblems(await inspectCodexAgents(paths)), []);
});

test("rejects source symlinks and source directories", async (t) => {
  const paths = await fixture(t, []);
  await fs.symlink("missing", path.join(paths.sourceDir, "linked.toml"));
  await assert.rejects(listCanonicalAgents(paths.sourceDir), /must not be a symlink/);
  await fs.rm(path.join(paths.sourceDir, "linked.toml"));
  await fs.mkdir(path.join(paths.sourceDir, "folder.toml"));
  await assert.rejects(listCanonicalAgents(paths.sourceDir), /regular file/);
});
