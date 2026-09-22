#!/usr/bin/env node

import { readFile } from "node:fs/promises";
import path from "node:path";
import process from "node:process";
import { fileURLToPath } from "node:url";
import { parseArgs } from "node:util";
import { cancel, confirm, isCancel, multiselect, select } from "@clack/prompts";
import {
  adapterPaths,
  adapterProblems,
  inspectCodexAgents,
  removeOwnedLinks,
  restoreOwnedLinks,
  snapshotOwnedLinks,
  syncCodexAgents,
} from "./codex.mjs";
import { SKILL_SOURCE } from "./config.mjs";
import {
  buildAddArgs,
  buildListArgs,
  buildRemoveArgs,
  buildUpdateArgs,
  parseAddJson,
  parseListJson,
  runSkills,
} from "./skills.mjs";

const installerDir = path.dirname(fileURLToPath(import.meta.url));
const catalog = JSON.parse(await readFile(path.join(installerDir, "catalog.json"), "utf8"));
const manifest = JSON.parse(await readFile(path.join(installerDir, "..", "package.json"), "utf8"));
const commands = new Set(["add", "update", "remove", "sync", "list", "doctor"]);

function usage() {
  return `Harness Knowledge Base installer ${manifest.version}

Usage: hkb [add|update|remove|sync|list|doctor] [options]

Options:
  -s, --skill <name>   Select a skill (repeatable)
  -a, --agent <name>   Select an agent (repeatable)
      --project        Use project scope
  -g, --global         Use global scope
  -y, --yes            Run non-interactively
      --force          Replace file or symlink adapter conflicts
      --json           JSON output for list and doctor
  -h, --help           Show help
  -v, --version        Show version
`;
}

export function parseCliArgs(argv) {
  const command = argv[0] && commands.has(argv[0]) ? argv[0] : "add";
  if (argv[0] && !argv[0].startsWith("-") && !commands.has(argv[0])) {
    throw new Error(`Unknown command: ${argv[0]}`);
  }
  const args = command === argv[0] ? argv.slice(1) : argv;
  const { values, positionals } = parseArgs({
    args,
    allowPositionals: true,
    strict: true,
    options: {
      skill: { type: "string", short: "s", multiple: true },
      agent: { type: "string", short: "a", multiple: true },
      project: { type: "boolean" },
      global: { type: "boolean", short: "g" },
      yes: { type: "boolean", short: "y" },
      force: { type: "boolean" },
      json: { type: "boolean" },
      help: { type: "boolean", short: "h" },
      version: { type: "boolean", short: "v" },
    },
  });
  if (positionals.length > 0) throw new Error(`Unexpected argument: ${positionals[0]}`);
  if (values.project && values.global) throw new Error("--project and --global are mutually exclusive");
  if (values.json && !["list", "doctor"].includes(command)) {
    throw new Error("--json is supported only by list and doctor");
  }
  return { command, values };
}

function validateSkills(names = []) {
  const known = new Set(catalog.map((skill) => skill.name));
  const unknown = names.filter((name) => !known.has(name));
  if (unknown.length > 0) throw new Error(`Unknown skill: ${unknown.join(", ")}`);
  return names;
}

export function resolveAgents(skillNames, requestedAgents = []) {
  const selected = skillNames.map((name) => catalog.find((skill) => skill.name === name));
  const requiresCodex = selected.some((skill) => skill?.agents?.length === 1 && skill.agents[0] === "codex");
  if (!requiresCodex) return requestedAgents;
  const incompatible = requestedAgents.filter((agent) => agent !== "codex");
  if (incompatible.length > 0) {
    throw new Error(`Selected skills require Codex; incompatible agent: ${incompatible.join(", ")}`);
  }
  return ["codex"];
}

async function chooseScope(values, command) {
  if (values.project) return "project";
  if (values.global) return "global";
  if (["list", "doctor"].includes(command)) return "project";
  if (values.yes) throw new Error("--yes requires an explicit --project or --global scope");
  const answer = await select({
    message: "Installation scope",
    options: [
      { value: "project", label: "Project" },
      { value: "global", label: "Global" },
    ],
  });
  if (isCancel(answer)) {
    cancel("Cancelled");
    return null;
  }
  return answer;
}

async function chooseSkills(values, command) {
  if (values.skill?.length) return validateSkills(values.skill);
  if (command === "update") return [];
  if (!["add", "remove"].includes(command)) return [];
  if (values.yes) throw new Error("--yes requires at least one --skill");
  const answer = await multiselect({
    message: command === "add" ? "Select skills to install" : "Select skills to remove",
    options: catalog.map((skill) => ({ value: skill.name, label: skill.name, hint: skill.description })),
    required: true,
  });
  if (isCancel(answer)) {
    cancel("Cancelled");
    return null;
  }
  return answer;
}

async function invoke(runner, args, context, echo = false) {
  const result = await runner(args, { cwd: context.cwd, env: context.env, echo });
  if (result.code !== 0) {
    if (!echo) {
      if (result.stdout) process.stdout.write(result.stdout);
      if (result.stderr) process.stderr.write(result.stderr);
    }
    throw new Error(`skills ${args[0]} failed with exit code ${result.code}`);
  }
  return result;
}

async function installedSkills(runner, scope, agents, context) {
  const result = await invoke(runner, buildListArgs({ scope, agents }), context);
  return parseListJson(result.stdout);
}

function canonicalDevMode(installed) {
  return installed.find((skill) => skill.name === "dev-mode")?.path;
}

async function adapterContext(scope, context, canonicalPath) {
  return adapterPaths({
    scope,
    cwd: context.cwd,
    env: context.env,
    home: context.home,
    canonicalPath,
  });
}

async function commandAdd(values, scope, skills, runner, context) {
  if (values.yes && (!values.agent?.length || skills.length === 0)) {
    throw new Error("--yes requires explicit --scope, --skill, and --agent options");
  }
  const agents = resolveAgents(skills, values.agent ?? []);
  const machine = values.yes || agents.length > 0;
  const result = await invoke(
    runner,
    buildAddArgs({ source: SKILL_SOURCE, skills, agents, scope, machine }),
    context,
    !machine,
  );
  if (!machine) return;
  const records = parseAddJson(result.stdout);
  const failures = records.filter((record) => record.status !== "installed");
  if (failures.length > 0) throw new Error(`skills add did not install: ${failures.map((item) => item.name ?? item.error).join(", ")}`);
  if (skills.includes("dev-mode")) {
    const devMode = records.find((record) => record.name === "dev-mode" && record.status === "installed");
    if (!devMode) throw new Error("skills add did not return the canonical dev-mode path");
    try {
      const paths = await adapterContext(scope, context, devMode.path);
      await syncCodexAgents({ ...paths, force: values.force });
    } catch (error) {
      throw new Error(`dev-mode was installed, but its Codex agent links failed: ${error.message}. Run hkb sync to retry.`, { cause: error });
    }
  }
  process.stdout.write(`${JSON.stringify(records, null, 2)}\n`);
}

async function commandSync(values, scope, runner, context) {
  const installed = await installedSkills(runner, scope, ["codex"], context);
  const paths = await adapterContext(scope, context, canonicalDevMode(installed));
  const result = await syncCodexAgents({ ...paths, force: values.force });
  if (!result.installed) {
    process.stdout.write("dev-mode is not installed; no links changed.\n");
    return result;
  }
  process.stdout.write(`Codex agent links: ${result.created.length} created, ${result.removed.length} removed, ${result.unchanged.length} unchanged.\n`);
  return result;
}

async function commandUpdate(values, scope, skills, runner, context) {
  await invoke(runner, buildUpdateArgs({ skills, scope, yes: values.yes }), context, true);
  await commandSync(values, scope, runner, context);
}

async function commandRemove(values, scope, skills, runner, context) {
  if (values.yes && !values.agent?.length) {
    throw new Error("--yes requires explicit --scope, --skill, and --agent options");
  }
  const agents = resolveAgents(skills, values.agent ?? []);
  if (!values.yes) {
    const confirmed = await confirm({ message: `Remove ${skills.join(", ")} from ${scope} scope?` });
    if (isCancel(confirmed) || !confirmed) {
      cancel("Cancelled");
      return;
    }
  }
  let snapshots = [];
  if (skills.includes("dev-mode")) {
    const installed = await installedSkills(runner, scope, ["codex"], context);
    const paths = await adapterContext(scope, context, canonicalDevMode(installed));
    snapshots = await snapshotOwnedLinks(paths);
    await removeOwnedLinks(snapshots);
  }
  try {
    await invoke(runner, buildRemoveArgs({ skills, agents, scope, yes: true }), context, true);
    if (skills.includes("dev-mode")) {
      const remaining = await installedSkills(runner, scope, ["codex"], context);
      if (remaining.some((skill) => skill.name === "dev-mode")) {
        throw new Error("skills remove returned without removing dev-mode");
      }
    }
  } catch (error) {
    await restoreOwnedLinks(snapshots);
    throw error;
  }
}

async function adapterReport(scope, installed, context) {
  const paths = await adapterContext(scope, context, canonicalDevMode(installed));
  const report = await inspectCodexAgents(paths);
  return { ...report, problems: adapterProblems(report) };
}

async function commandList(values, scope, runner, context) {
  const installed = await installedSkills(runner, scope, values.agent ?? [], context);
  const byName = new Map(installed.map((skill) => [skill.name, skill]));
  const adapter = await adapterReport(scope, installed, context);
  const adapterStatus = adapter.installed
    ? (adapter.problems.length === 0 ? "healthy" : "unhealthy")
    : (adapter.problems.length === 0 ? "not-installed" : "dangling");
  const rows = catalog.map((skill) => ({
    name: skill.name,
    compatibleAgents: skill.agents ?? null,
    installed: byName.get(skill.name) ?? null,
    adapter: skill.adapter ? {
      status: adapterStatus,
      problems: adapter.problems.map((problem) => ({ name: problem.name, state: problem.problem })),
    } : null,
  }));
  if (values.json) process.stdout.write(`${JSON.stringify(rows, null, 2)}\n`);
  else {
    for (const row of rows) {
      const state = row.installed ? "installed" : "not installed";
      const compatibility = row.compatibleAgents ? ` [${row.compatibleAgents.join(", ")}]` : "";
      const adapterState = row.adapter ? `; adapter ${row.adapter.status}` : "";
      process.stdout.write(`${row.name}${compatibility}: ${state}${adapterState}\n`);
    }
  }
}

async function commandDoctor(values, scope, runner, context) {
  const installed = await installedSkills(runner, scope, ["codex"], context);
  const report = await adapterReport(scope, installed, context);
  const output = {
    scope,
    installed: report.installed,
    healthy: report.problems.length === 0,
    problems: report.problems.map((problem) => ({
      name: problem.name,
      state: problem.problem,
      path: problem.targetPath,
    })),
  };
  if (values.json) process.stdout.write(`${JSON.stringify(output, null, 2)}\n`);
  else if (output.healthy) process.stdout.write("Codex subagent links are healthy.\n");
  else for (const problem of output.problems) process.stderr.write(`${problem.name}: ${problem.state} (${problem.path})\n`);
  if (!output.healthy) process.exitCode = 1;
}

export async function main(argv = process.argv.slice(2), dependencies = {}) {
  const { command, values } = parseCliArgs(argv);
  if (values.help) {
    process.stdout.write(usage());
    return;
  }
  if (values.version) {
    process.stdout.write(`${manifest.version}\n`);
    return;
  }
  const context = {
    cwd: dependencies.cwd ?? process.cwd(),
    env: dependencies.env ?? process.env,
    home: dependencies.home,
  };
  const runner = dependencies.runner ?? runSkills;
  const scope = await chooseScope(values, command);
  if (!scope) return;
  const skills = await chooseSkills(values, command);
  if (!skills) return;

  if (command === "add") await commandAdd(values, scope, skills, runner, context);
  else if (command === "update") await commandUpdate(values, scope, skills, runner, context);
  else if (command === "remove") await commandRemove(values, scope, skills, runner, context);
  else if (command === "sync") await commandSync(values, scope, runner, context);
  else if (command === "list") await commandList(values, scope, runner, context);
  else await commandDoctor(values, scope, runner, context);
}

if (path.resolve(process.argv[1] ?? "") === fileURLToPath(import.meta.url)) {
  main().catch((error) => {
    process.stderr.write(`hkb: ${error.message}\n`);
    process.exitCode = 1;
  });
}
