# Harness Knowledge Base

A small, opinionated collection of reusable agent skills for engineering, research, documentation, and everyday agent workflows.

Most skills work with any agent supported by the [skills CLI](https://github.com/vercel-labs/skills). Codex-specific skills live under `.codex/skills/` and may include additional Codex agent configuration.

## Install

For most agents:

```sh
npx skills add minfengyuan/harness-knowledge-base
```

For Codex `dev-mode`, use the HKB installer so its custom agents are wired up as well:

```sh
npx --package @minfengyuan/harness-knowledge-base hkb add
```

For non-interactive project installation:

```sh
npx --package @minfengyuan/harness-knowledge-base hkb add \
  --project --skill dev-mode --agent codex --yes
```

The HKB wrapper also supports `update`, `remove`, `sync`, `list`, and `doctor`. Run `hkb --help` for options.

> [!NOTE]
> `dev-mode` uses symlinks for Codex subagents. On Windows, enable Developer Mode or otherwise allow symlink creation. The HKB wrapper requires Node.js 22.20.0 or newer.

## Skills

### Development

- [`batch-grill-me`](skills/development/batch-grill-me)
- [`conventional-commits`](skills/development/conventional-commits)
- [`executing-plans`](skills/development/executing-plans)
- [`plan-ceo-review`](skills/development/plan-ceo-review)
- [`plan-eng-review`](skills/development/plan-eng-review)
- [`systematic-debugging`](skills/development/systematic-debugging)
- [`tdd`](skills/development/tdd)

### Productivity

- [`handoff`](skills/productivity/handoff)
- [`progressive-disclosure-agents-md`](skills/productivity/progressive-disclosure-agents-md)
- [`storm-research`](skills/productivity/storm-research)

### Miscellaneous

- [`photo-illustration-styles`](skills/misc/photo-illustration-styles)
- [`pi-coding-agent`](skills/misc/pi-coding-agent)
- [`recipe-formatter`](skills/misc/recipe-formatter)

### Codex

- [`dev-mode`](.codex/skills/dev-mode) — coordinates seven specialized Codex subagents
- [`optimize-astra-instructions`](.codex/skills/optimize-astra-instructions) — audits and revises instructions for GPT-6 Astra

## Development

```sh
npm ci
npm run check
```

## Acknowledgements

Inspired by [obra/superpowers](https://github.com/obra/superpowers) and [garrytan/gstack](https://github.com/garrytan/gstack).

## License

[MIT](LICENSE)
