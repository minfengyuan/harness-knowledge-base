# Harness Knowledge Base

A small, opinionated collection of reusable agent skills for planning, implementation, debugging, review, research, and documentation workflows.

The repository contains 15 skills: 13 general skills under `skills/` and two Codex skills under `.codex/skills/`. The nested layout is supported by the official `skills` CLI and does not need to be flattened.

## Installation

The standard installer can discover and install every skill:

```sh
npx skills add minfengyuan/harness-knowledge-base
```

That command does not install the seven Codex custom-agent configurations bundled with `dev-mode`. For a complete `dev-mode` installation, use the HKB wrapper:

```sh
npx --package @minfengyuan/harness-knowledge-base hkb add
```

The wrapper delegates skill installation and updates to the pinned official `skills` CLI, then creates the additional Codex subagent links when required. It does not maintain a separate skill updater.

For non-interactive use, explicitly provide the scope, every skill, and every agent:

```sh
npx --package @minfengyuan/harness-knowledge-base hkb add \
  --project --skill dev-mode --agent codex --yes
```

Selecting `dev-mode` or `optimize-astra-instructions` makes the complete selection Codex-only. An explicitly incompatible agent is rejected before installation begins.

## HKB Commands

| Command | Purpose |
| --- | --- |
| `hkb add` | Select skills, install them with `skills add`, and run required adapters |
| `hkb update` | Run `skills update`, then synchronize Codex subagent links |
| `hkb remove` | Remove HKB-owned links, then remove skills; restore links if removal fails |
| `hkb sync` | Check and repair links for an installed `dev-mode` skill |
| `hkb list` | Show catalog compatibility, installation state, and adapter health |
| `hkb doctor` | Read-only adapter diagnostics; exits nonzero for missing, stale, dangling, or conflicting links |

Running `hkb` without a command is equivalent to `hkb add`. Common options are repeatable `--skill` and `--agent`, mutually exclusive `--project` and `--global`, plus `--yes` and `--force`. `list` and `doctor` also accept `--json`.

The adapter uses relative file symlinks. It never falls back to copying files. On Windows, enable Developer Mode or run in a terminal that has permission to create symlinks. Global installation respects `CODEX_HOME`; project installation writes agent links under `<project>/.codex/agents/`.

## Included Skills

- Development: `batch-grill-me`, `conventional-commits`, `executing-plans`, `plan-ceo-review`, `plan-eng-review`, `systematic-debugging`, `tdd`
- Productivity: `handoff`, `progressive-disclosure-agents-md`, `storm-research`
- Miscellaneous: `photo-illustration-styles`, `pi-coding-agent`, `recipe-formatter`
- Codex: `dev-mode`, `optimize-astra-instructions`

## Repository Structure

```text
.codex/
  skills/
    dev-mode/
      SKILL.md
      agents/          # source of seven Codex custom-agent TOML files
    optimize-astra-instructions/
skills/
  development/
  productivity/
  misc/
installer/             # hkb CLI, upstream bridge, catalog, and Codex adapter
scripts/
  generate-catalog.mjs
test/
AGENTS.md
LICENSE
package.json
```

The npm tarball contains only the installer, README, LICENSE, and package metadata. Skills remain sourced from the default branch of `minfengyuan/harness-knowledge-base`, preserving the official `skills update` lifecycle.

## Development

Requires Node.js 22.20.0 or newer.

```sh
npm ci
npm run catalog:check
npm test
npm pack --dry-run
```

`installer/catalog.json` is generated from every `skills/**/SKILL.md` and `.codex/skills/**/SKILL.md`. Run `npm run catalog` after adding, removing, renaming, or changing the frontmatter of a skill. CI rejects catalog drift.

Publishing is triggered by a GitHub Release tag matching `v<package.json version>`. Before the first release, configure npm Trusted Publishing for this repository and the publish workflow.

## Recommended Projects

- [mattpocock/skills](https://github.com/mattpocock/skills)
- [colbymchenry/codegraph](https://github.com/colbymchenry/codegraph)
- [DietrichGebert/ponytail](https://github.com/DietrichGebert/ponytail)

## Thanks

This repository was influenced by [obra/superpowers](https://github.com/obra/superpowers) and [garrytan/gstack](https://github.com/garrytan/gstack).

## License

MIT. See [LICENSE](LICENSE).
