import assert from "node:assert/strict";
import fs from "node:fs/promises";
import os from "node:os";
import path from "node:path";
import test from "node:test";
import { main } from "../installer/cli.mjs";

test("fake upstream covers add, update, remove, list, sync, doctor, and rollback", async (t) => {
  const cwd = await fs.mkdtemp(path.join(os.tmpdir(), "hkb-lifecycle-"));
  t.after(() => fs.rm(cwd, { recursive: true, force: true }));
  const canonical = path.join(cwd, ".agents", "skills", "dev-mode");
  const sourceAgents = path.join(canonical, "agents");
  await fs.mkdir(sourceAgents, { recursive: true });
  await fs.writeFile(path.join(sourceAgents, "worker.toml"), "worker");

  let installed = false;
  let failRemove = false;
  const calls = [];
  const runner = async (args) => {
    calls.push(args);
    if (args[0] === "add") {
      installed = true;
      return {
        code: 0,
        stderr: "",
        stdout: JSON.stringify([{
          name: "dev-mode",
          status: "installed",
          path: canonical,
          scope: "project",
          agents: ["Codex"],
        }]),
      };
    }
    if (args[0] === "list") {
      return {
        code: 0,
        stderr: "",
        stdout: JSON.stringify(installed ? [{
          name: "dev-mode",
          path: canonical,
          scope: "project",
          agents: ["Codex"],
          source: "minfengyuan/harness-knowledge-base",
          sourceUrl: null,
          sourceType: "github",
        }] : []),
      };
    }
    if (args[0] === "remove") {
      if (failRemove) return { code: 2, stdout: "", stderr: "remove failed\n" };
      installed = false;
    }
    return { code: 0, stdout: "", stderr: "" };
  };
  const dependencies = { cwd, env: {}, home: path.join(cwd, "home"), runner };
  const selection = ["--project", "--skill", "dev-mode", "--agent", "codex", "--yes"];

  await main(["add", ...selection], dependencies);
  const workerTarget = path.join(cwd, ".codex", "agents", "worker.toml");
  assert.equal((await fs.lstat(workerTarget)).isSymbolicLink(), true);

  await fs.writeFile(path.join(sourceAgents, "reviewer.toml"), "reviewer");
  await main(["update", "--project", "--yes"], dependencies);
  assert.equal((await fs.lstat(path.join(cwd, ".codex", "agents", "reviewer.toml"))).isSymbolicLink(), true);
  await main(["sync", "--project", "--yes"], dependencies);
  await main(["list", "--project", "--json"], dependencies);
  await main(["doctor", "--project", "--json"], dependencies);

  failRemove = true;
  await assert.rejects(main(["remove", ...selection], dependencies), /exit code 2/);
  assert.equal((await fs.lstat(workerTarget)).isSymbolicLink(), true, "failed removal restores links");
  failRemove = false;

  await fs.rm(canonical, { recursive: true });
  installed = false;
  const previousExitCode = process.exitCode;
  await main(["doctor", "--project", "--json"], dependencies);
  assert.equal(process.exitCode, 1, "doctor reports dangling links");
  process.exitCode = previousExitCode;

  await main(["remove", ...selection], dependencies);
  await assert.rejects(fs.lstat(workerTarget), { code: "ENOENT" });
  assert.ok(calls.some((args) => args[0] === "add"));
  assert.ok(calls.some((args) => args[0] === "update"));
  assert.ok(calls.some((args) => args[0] === "remove"));
  assert.ok(calls.some((args) => args[0] === "list"));
});
