---
name: sync-catalog
description: Regenerate and verify installer/catalog.json after skill metadata or installer configuration changes that affect the catalog.
metadata:
  internal: true
---

# Sync catalog

Use this skill for repository maintenance when changes to exported skills or installer configuration may affect `installer/catalog.json`.

1. Work from the repository root. Check relevant changes to skill `SKILL.md` files and `installer/config.mjs` to understand the expected catalog entries.
2. Run `npm run catalog` to regenerate `installer/catalog.json`. Never edit this generated file by hand.
3. Inspect `git diff -- installer/catalog.json` and confirm each change follows from the source metadata or installer configuration. If there is no diff, report that the catalog is already current.
4. Run `npm run catalog:check` and report the result. If generation or verification fails, report the error rather than claiming the catalog is synchronized.
