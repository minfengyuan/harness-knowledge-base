import assert from "node:assert/strict";
import fs from "node:fs/promises";
import os from "node:os";
import path from "node:path";
import test from "node:test";
import { fileURLToPath } from "node:url";
import { stripVTControlCharacters } from "node:util";
import {
  adapterPaths,
  adapterProblems,
  inspectCodexAgents,
  removeOwnedLinks,
  snapshotOwnedLinks,
  syncCodexAgents,
} from "../installer/codex.mjs";
import { parseAddJson, runSkills } from "../installer/skills.mjs";

const repositoryRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");

async function successful(args, options) {
  const result = await runSkills(args, { ...options, stdin: "ignore" });
  assert.equal(result.code, 0, result.stderr || result.stdout);
  return result;
}

test("skills@1.7.0 discovers all 15 repository skills", async () => {
  const result = await successful(["add", repositoryRoot, "--list"], { cwd: repositoryRoot });
  const output = stripVTControlCharacters(result.stdout + result.stderr);
  assert.match(output, /Found 15 skills/);
});

test("fixed upstream CLI and adapter complete project and global lifecycles", async (t) => {
  const root = await fs.mkdtemp(path.join(os.tmpdir(), "hkb-upstream-"));
  t.after(() => fs.rm(root, { recursive: true, force: true }));

  const project = path.join(root, "project");
  await fs.mkdir(project);
  const projectAdd = parseAddJson((await successful([
    "add", repositoryRoot, "--skill", "dev-mode", "--agent", "codex", "--yes", "--json",
  ], { cwd: project })).stdout)[0];
  const projectPaths = adapterPaths({ scope: "project", cwd: project, canonicalPath: projectAdd.path });
  await syncCodexAgents(projectPaths);
  assert.equal((await fs.readdir(projectPaths.targetDir)).filter((name) => name.endsWith(".toml")).length, 7);
  await successful(["update", "dev-mode", "--project", "--yes"], { cwd: project });
  await removeOwnedLinks(await snapshotOwnedLinks(projectPaths));
  await successful(["remove", "--skill", "dev-mode", "--agent", "codex", "--yes"], { cwd: project });

  const home = path.join(root, "home");
  const customCodexHome = path.join(root, "codex-home");
  await fs.mkdir(home);
  const env = { HOME: home, CODEX_HOME: customCodexHome };
  const globalAdd = parseAddJson((await successful([
    "add", repositoryRoot, "--skill", "dev-mode", "--agent", "codex", "--global", "--yes", "--json",
  ], { cwd: project, env })).stdout)[0];
  const globalPaths = adapterPaths({
    scope: "global", cwd: project, env, home, canonicalPath: globalAdd.path,
  });
  await syncCodexAgents(globalPaths);
  assert.equal(globalPaths.targetDir, path.join(customCodexHome, "agents"));
  await successful(["update", "dev-mode", "--global", "--yes"], { cwd: project, env });

  await fs.rm(globalAdd.path, { recursive: true });
  const dangling = await inspectCodexAgents(globalPaths);
  assert.equal(dangling.installed, false);
  assert.equal(adapterProblems(dangling).length, 7);
  await removeOwnedLinks(await snapshotOwnedLinks(globalPaths));
  await successful(["remove", "--skill", "dev-mode", "--agent", "codex", "--global", "--yes"], {
    cwd: project,
    env,
  });
});
