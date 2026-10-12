import assert from "node:assert/strict";
import { readdir, readFile } from "node:fs/promises";
import path from "node:path";
import test from "node:test";
import { fileURLToPath } from "node:url";
import {
  generateCatalog,
  isCatalogCurrent,
  serializeCatalog,
} from "../scripts/generate-catalog.mjs";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");

async function discoverSkillPaths(directory) {
  const paths = [];
  for (const entry of await readdir(directory, { withFileTypes: true })) {
    const entryPath = path.join(directory, entry.name);
    if (entry.isDirectory()) {
      paths.push(...(await discoverSkillPaths(entryPath)));
    } else if (entry.isFile() && entry.name === "SKILL.md") {
      paths.push(path.relative(root, path.dirname(entryPath)).split(path.sep).join("/"));
    }
  }
  return paths;
}

test("catalog comparison ignores CRLF but preserves other differences", () => {
  const generated = '{\n  "name": "example"\n}\n';
  assert.equal(isCatalogCurrent(generated.replaceAll("\n", "\r\n"), generated), true);
  assert.equal(isCatalogCurrent(generated.replace("example", "changed"), generated), false);
  assert.equal(isCatalogCurrent(generated.replaceAll("\n", "\r"), generated), false);
});

test("generated catalog contains all skills and matches the checked-in artifact", async () => {
  const catalog = await generateCatalog(root);
  const skillRoots = [path.join(root, "skills"), path.join(root, ".codex", "skills")];
  const sourcePaths = (await Promise.all(skillRoots.map(discoverSkillPaths))).flat().sort();
  assert.deepEqual(catalog.map((skill) => skill.path).sort(), sourcePaths);
  assert.equal(new Set(catalog.map((skill) => skill.name)).size, catalog.length);
  assert.deepEqual(catalog.find((skill) => skill.name === "dev-mode")?.agents, ["codex"]);
  assert.equal(catalog.find((skill) => skill.name === "dev-mode")?.adapter, "codex-subagents");
  assert.deepEqual(catalog.find((skill) => skill.name === "optimize-astra-instructions")?.agents, ["codex"]);
  assert.equal(
    isCatalogCurrent(
      await readFile(path.join(root, "installer", "catalog.json"), "utf8"),
      serializeCatalog(catalog),
    ),
    true,
  );
});
