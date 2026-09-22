import assert from "node:assert/strict";
import test from "node:test";
import {
  buildAddArgs,
  buildListArgs,
  buildRemoveArgs,
  buildUpdateArgs,
  parseAddJson,
  parseListJson,
  resolveSkillsCli,
} from "../installer/skills.mjs";

test("resolves the pinned skills executable", () => {
  assert.match(resolveSkillsCli(), /skills[/\\]bin[/\\]cli\.mjs$/);
});

test("constructs upstream arguments without a nested package runner", () => {
  assert.deepEqual(buildAddArgs({
    source: "owner/repo",
    skills: ["one", "two"],
    agents: ["codex"],
    scope: "global",
  }), [
    "add", "owner/repo", "--yes", "--json",
    "--skill", "one", "--skill", "two", "--agent", "codex", "--global",
  ]);
  assert.deepEqual(buildAddArgs({
    source: "owner/repo", skills: ["one"], agents: [], scope: "project", machine: false,
  }), ["add", "owner/repo", "--skill", "one"]);
  assert.deepEqual(buildListArgs({ scope: "project", agents: ["codex"] }), ["list", "--json", "--agent", "codex"]);
  assert.deepEqual(buildRemoveArgs({
    skills: ["one"], agents: ["codex"], scope: "global", yes: true,
  }), ["remove", "--skill", "one", "--agent", "codex", "--global", "--yes"]);
  assert.deepEqual(buildUpdateArgs({
    skills: ["one"], scope: "project", yes: true,
  }), ["update", "one", "--project", "--yes"]);
});

test("validates add and list JSON contracts", () => {
  assert.equal(parseAddJson(JSON.stringify([{
    name: "dev-mode",
    status: "installed",
    path: "/tmp/dev-mode",
    scope: "project",
    agents: ["Codex"],
  }]))[0].name, "dev-mode");
  assert.equal(parseListJson(JSON.stringify([{
    name: "dev-mode",
    path: "/tmp/dev-mode",
    scope: "global",
    agents: ["Codex"],
  }]))[0].scope, "global");
  assert.throws(() => parseAddJson("{}"), /must be an array/);
  assert.throws(() => parseAddJson('[{"status":"installed"}]'), /invalid installed result/);
  assert.throws(() => parseListJson('[{"name":"bad"}]'), /invalid result/);
});
