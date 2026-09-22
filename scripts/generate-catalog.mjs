#!/usr/bin/env node

import { readdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import process from "node:process";
import { fileURLToPath } from "node:url";
import { parse } from "yaml";
import { enrichSkill } from "../installer/config.mjs";

const repositoryRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const outputPath = path.join(repositoryRoot, "installer", "catalog.json");

async function walk(directory) {
  const entries = await readdir(directory, { withFileTypes: true });
  const files = [];
  for (const entry of entries) {
    const entryPath = path.join(directory, entry.name);
    if (entry.isDirectory()) files.push(...(await walk(entryPath)));
    else if (entry.isFile() && entry.name === "SKILL.md") files.push(entryPath);
  }
  return files;
}

function parseFrontmatter(contents, skillPath) {
  const match = contents.match(/^---\r?\n([\s\S]*?)\r?\n---(?:\r?\n|$)/);
  if (!match) throw new Error(`${skillPath}: missing YAML frontmatter`);
  const metadata = parse(match[1]);
  if (!metadata || typeof metadata.name !== "string" || typeof metadata.description !== "string") {
    throw new Error(`${skillPath}: frontmatter must contain string name and description`);
  }
  return metadata;
}

export async function generateCatalog(root = repositoryRoot) {
  const roots = [path.join(root, "skills"), path.join(root, ".codex", "skills")];
  const skillFiles = (await Promise.all(roots.map(walk))).flat();
  const names = new Set();
  const catalog = [];
  for (const file of skillFiles) {
    const metadata = parseFrontmatter(await readFile(file, "utf8"), file);
    if (names.has(metadata.name)) throw new Error(`duplicate skill name: ${metadata.name}`);
    names.add(metadata.name);
    catalog.push(enrichSkill({
      name: metadata.name,
      description: metadata.description,
      path: path.relative(root, path.dirname(file)).split(path.sep).join("/"),
    }));
  }
  return catalog.sort((left, right) => left.name.localeCompare(right.name));
}

export function serializeCatalog(catalog) {
  return `${JSON.stringify(catalog, null, 2)}\n`;
}

export function isCatalogCurrent(current, generated) {
  const normalizeEol = (value) => value.replaceAll("\r\n", "\n");
  return normalizeEol(current) === normalizeEol(generated);
}

async function main() {
  const generated = serializeCatalog(await generateCatalog());
  if (process.argv.includes("--check")) {
    const current = await readFile(outputPath, "utf8").catch(() => "");
    if (!isCatalogCurrent(current, generated)) {
      console.error("installer/catalog.json is stale; run npm run catalog");
      process.exitCode = 1;
    }
    return;
  }
  await writeFile(outputPath, generated);
}

if (path.resolve(process.argv[1] ?? "") === fileURLToPath(import.meta.url)) await main();
