import assert from "node:assert/strict";
import test from "node:test";
import { parseCliArgs, resolveAgents } from "../installer/cli.mjs";

test("defaults to add and accepts repeatable selectors", () => {
  const parsed = parseCliArgs([
    "--project", "--skill", "dev-mode", "--skill", "tdd", "--agent", "codex", "--yes",
  ]);
  assert.equal(parsed.command, "add");
  assert.deepEqual(parsed.values.skill, ["dev-mode", "tdd"]);
  assert.deepEqual(parsed.values.agent, ["codex"]);
});

test("rejects mutually exclusive scope and unsupported JSON", () => {
  assert.throws(() => parseCliArgs(["add", "--project", "--global"]), /mutually exclusive/);
  assert.throws(() => parseCliArgs(["sync", "--json"]), /supported only/);
  assert.throws(() => parseCliArgs(["unknown"]), /Unknown command/);
});

test("Codex-only skills force the entire selection before installation", () => {
  assert.deepEqual(resolveAgents(["dev-mode", "tdd"], []), ["codex"]);
  assert.deepEqual(resolveAgents(["optimize-astra-instructions"], ["codex"]), ["codex"]);
  assert.throws(() => resolveAgents(["dev-mode", "tdd"], ["cursor"]), /require Codex/);
  assert.deepEqual(resolveAgents(["tdd"], ["cursor"]), ["cursor"]);
});
