import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import path from "node:path";
import test from "node:test";
import { fileURLToPath } from "node:url";
import {
  generateCatalog,
  isCatalogCurrent,
  serializeCatalog,
} from "../scripts/generate-catalog.mjs";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");

test("catalog comparison ignores CRLF but preserves other differences", () => {
  const generated = '{\n  "name": "example"\n}\n';
  assert.equal(isCatalogCurrent(generated.replaceAll("\n", "\r\n"), generated), true);
  assert.equal(isCatalogCurrent(generated.replace("example", "changed"), generated), false);
  assert.equal(isCatalogCurrent(generated.replaceAll("\n", "\r"), generated), false);
});

test("generated catalog contains all skills and matches the checked-in artifact", async () => {
  const catalog = await generateCatalog(root);
  assert.equal(catalog.length, 15);
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
