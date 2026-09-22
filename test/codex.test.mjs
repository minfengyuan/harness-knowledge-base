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

test("creates relative links and repeated sync is idempotent", async (t) => {
  const paths = await fixture(t);
  const first = await syncCodexAgents(paths);
  assert.equal(first.created.length, 2);
  const link = await fs.readlink(path.join(paths.targetDir, "delegate.toml"));
  assert.equal(path.isAbsolute(link), false);
  assert.equal(path.resolve(paths.targetDir, link), path.join(paths.sourceDir, "delegate.toml"));
  const second = await syncCodexAgents(paths);
  assert.equal(second.created.length, 0);
  assert.equal(second.unchanged.length, 2);
});

test("removes stale owned links and reports dangling links when the skill is gone", async (t) => {
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
  await assert.rejects(syncCodexAgents(paths), /link conflict/);
  assert.equal(await fs.readFile(target, "utf8"), "user file");
  await syncCodexAgents({ ...paths, force: true });
  assert.equal((await fs.lstat(target)).isSymbolicLink(), true);
});

test("rejects a wrong expected symlink but ignores unrelated custom agents", async (t) => {
  const paths = await fixture(t, ["worker.toml"]);
  await fs.mkdir(paths.targetDir, { recursive: true });
  const target = path.join(paths.targetDir, "worker.toml");
  await fs.symlink("foreign-source.toml", target);
  await fs.writeFile(path.join(paths.targetDir, "personal.toml"), "user-owned");
  await assert.rejects(syncCodexAgents(paths), /link conflict/);
  await syncCodexAgents({ ...paths, force: true });
  const report = await inspectCodexAgents(paths);
  assert.deepEqual(adapterProblems(report), []);
  assert.equal(await fs.readFile(path.join(paths.targetDir, "personal.toml"), "utf8"), "user-owned");
});

test("force still refuses directories", async (t) => {
  const paths = await fixture(t, ["worker.toml"]);
  await fs.mkdir(path.join(paths.targetDir, "worker.toml"), { recursive: true });
  await assert.rejects(syncCodexAgents({ ...paths, force: true }), /Refusing to replace directory/);
});

test("rolls back replacements and new links after a mid-transaction failure", async (t) => {
  const paths = await fixture(t, ["a.toml", "b.toml"]);
  await fs.mkdir(paths.targetDir, { recursive: true });
  await fs.writeFile(path.join(paths.targetDir, "b.toml"), "keep me");
  let calls = 0;
  const failingFs = new Proxy(fs, {
    get(target, property) {
      if (property !== "symlink") return target[property];
      return async (...args) => {
        calls += 1;
        if (calls === 2) throw Object.assign(new Error("injected failure"), { code: "EIO" });
        return target.symlink(...args);
      };
    },
  });
  await assert.rejects(syncCodexAgents({ ...paths, force: true, fsApi: failingFs }), /injected failure/);
  await assert.rejects(fs.lstat(path.join(paths.targetDir, "a.toml")), { code: "ENOENT" });
  assert.equal(await fs.readFile(path.join(paths.targetDir, "b.toml"), "utf8"), "keep me");
  assert.deepEqual((await fs.readdir(paths.targetDir)).sort(), ["b.toml"]);
});

test("uses Windows file symlinks and never falls back to copying", async (t) => {
  const paths = await fixture(t, ["worker.toml"]);
  const calls = [];
  const recordingFs = new Proxy(fs, {
    get(target, property) {
      if (property !== "symlink") return target[property];
      return async (...args) => {
        calls.push(args);
        return target.symlink(args[0], args[1]);
      };
    },
  });
  await syncCodexAgents({ ...paths, platform: "win32", fsApi: recordingFs });
  assert.equal(calls[0][2], "file");

  const deniedRoot = await fixture(t, ["denied.toml"]);
  const deniedFs = new Proxy(fs, {
    get(target, property) {
      if (property !== "symlink") return target[property];
      return async () => { throw Object.assign(new Error("denied"), { code: "EPERM" }); };
    },
  });
  await assert.rejects(
    syncCodexAgents({ ...deniedRoot, platform: "win32", fsApi: deniedFs }),
    /Developer Mode/,
  );
  await assert.rejects(fs.lstat(path.join(deniedRoot.targetDir, "denied.toml")), { code: "ENOENT" });
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
  const snapshots = await snapshotOwnedLinks(paths);
  assert.deepEqual(snapshots.map((item) => path.basename(item.target)), ["worker.toml"]);
  await removeOwnedLinks(snapshots);
  await restoreOwnedLinks(snapshots);
  assert.equal((await fs.lstat(path.join(paths.targetDir, "worker.toml"))).isSymbolicLink(), true);
});

test("rejects source symlinks and source directories", async (t) => {
  const paths = await fixture(t, []);
  await fs.symlink("missing", path.join(paths.sourceDir, "linked.toml"));
  await assert.rejects(listCanonicalAgents(paths.sourceDir), /must not be a symlink/);
  await fs.rm(path.join(paths.sourceDir, "linked.toml"));
  await fs.mkdir(path.join(paths.sourceDir, "folder.toml"));
  await assert.rejects(listCanonicalAgents(paths.sourceDir), /regular file/);
});
