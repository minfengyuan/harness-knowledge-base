import { spawn } from "node:child_process";
import { createRequire } from "node:module";
import { dirname, join } from "node:path";
import { readFileSync } from "node:fs";

const require = createRequire(import.meta.url);

export function resolveSkillsCli() {
  const packagePath = require.resolve("skills/package.json");
  const manifest = JSON.parse(readFileSync(packagePath, "utf8"));
  const executable = typeof manifest.bin === "string" ? manifest.bin : manifest.bin?.skills;
  if (!executable) throw new Error("The installed skills package does not expose the skills executable");
  return join(dirname(packagePath), executable);
}

export async function runSkills(args, options = {}) {
  const passthrough = options.echo === true;
  const child = (options.spawnImpl ?? spawn)(
    process.execPath,
    [options.skillsCli ?? resolveSkillsCli(), ...args],
    {
      cwd: options.cwd,
      env: { ...process.env, ...options.env },
      shell: false,
      stdio: [options.stdin ?? "inherit", passthrough ? "inherit" : "pipe", passthrough ? "inherit" : "pipe"],
    },
  );
  let stdout = "";
  let stderr = "";
  child.stdout?.setEncoding("utf8");
  child.stderr?.setEncoding("utf8");
  child.stdout?.on("data", (chunk) => { stdout += chunk; });
  child.stderr?.on("data", (chunk) => { stderr += chunk; });
  const result = await new Promise((resolve, reject) => {
    child.once("error", reject);
    child.once("close", (code, signal) => resolve({ code: code ?? 1, signal, stdout, stderr }));
  });
  return result;
}

function parseJsonOutput(stdout, label) {
  try {
    return JSON.parse(stdout);
  } catch (error) {
    throw new Error(`${label} returned invalid JSON: ${error.message}`);
  }
}

export function parseAddJson(stdout) {
  const value = parseJsonOutput(stdout, "skills add");
  if (!Array.isArray(value)) throw new Error("skills add JSON must be an array");
  for (const item of value) {
    if (!item || typeof item !== "object" || typeof item.status !== "string") {
      throw new Error("skills add JSON contains an invalid result");
    }
    if (item.status === "installed") {
      if (typeof item.name !== "string" || typeof item.path !== "string"
        || !["project", "global"].includes(item.scope) || !Array.isArray(item.agents)) {
        throw new Error("skills add JSON contains an invalid installed result");
      }
    } else if (!["failed", "skipped"].includes(item.status)) {
      throw new Error(`skills add JSON contains unsupported status: ${item.status}`);
    }
  }
  return value;
}

export function parseListJson(stdout) {
  const value = parseJsonOutput(stdout, "skills list");
  if (!Array.isArray(value)) throw new Error("skills list JSON must be an array");
  for (const item of value) {
    if (!item || typeof item.name !== "string" || typeof item.path !== "string"
      || !["project", "global"].includes(item.scope) || !Array.isArray(item.agents)) {
      throw new Error("skills list JSON contains an invalid result");
    }
  }
  return value;
}

export function buildAddArgs({ source, skills, agents, scope, machine = true }) {
  const args = ["add", source];
  if (machine) args.push("--yes", "--json");
  for (const skill of skills) args.push("--skill", skill);
  for (const agent of agents) args.push("--agent", agent);
  if (scope === "global") args.push("--global");
  return args;
}

export function buildListArgs({ agents = [], scope }) {
  const args = ["list", "--json"];
  for (const agent of agents) args.push("--agent", agent);
  if (scope === "global") args.push("--global");
  return args;
}

export function buildRemoveArgs({ skills, agents = [], scope, yes }) {
  const args = ["remove"];
  for (const skill of skills) args.push("--skill", skill);
  for (const agent of agents) args.push("--agent", agent);
  if (scope === "global") args.push("--global");
  if (yes) args.push("--yes");
  return args;
}

export function buildUpdateArgs({ skills = [], scope, yes }) {
  const args = ["update", ...skills];
  args.push(scope === "global" ? "--global" : "--project");
  if (yes) args.push("--yes");
  return args;
}
