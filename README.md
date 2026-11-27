# Harness Knowledge Base

A small, opinionated collection of reusable agent skills for engineering, research, documentation, and everyday agent workflows.

Most skills work with any agent supported by the [skills CLI](https://github.com/vercel-labs/skills). Codex-specific skills live under `.codex/skills/` and may include additional Codex agent configuration.

## Install

Install skills with the [skills CLI](https://github.com/vercel-labs/skills):

```sh
npx skills add minfengyuan/harness-knowledge-base
```

To install a specific skill:

```sh
npx skills add minfengyuan/harness-knowledge-base --skill <skill-name>
```

> [!NOTE]
> For Codex [`dev-mode`](.codex/skills/dev-mode), also copy [`.codex/agents/`](.codex/agents) into your project's `.codex/agents/` directory (or `$CODEX_HOME/agents/` for global installs) so its seven custom subagents are available.
>
> For [`hc-orchestrate`](skills/development/hc-orchestrate), also copy [`templates/`](skills/development/hc-orchestrate/templates) into `~/.config/herdr-core/templates/` (and adjust model flags or ensure `codex`, `agy`, and `claude` are on `hc`'s `PATH`).

## Skills

### Development

- [`batch-grill-me`](skills/development/batch-grill-me)
- [`blast-radius`](skills/development/blast-radius)
- [`conventional-branch-naming`](skills/development/conventional-branch-naming)
- [`conventional-commits`](skills/development/conventional-commits)
- [`correct`](skills/development/correct)
- [`hc-orchestrate`](skills/development/hc-orchestrate)
- [`how`](skills/development/how)
- [`no-comments`](skills/development/no-comments)
- [`plan-ceo-review`](skills/development/plan-ceo-review)
- [`plan-eng-review`](skills/development/plan-eng-review)
- [`plan-exp-review`](skills/development/plan-exp-review)
- [`systematic-debugging`](skills/development/systematic-debugging)
- [`tdd`](skills/development/tdd)

### Productivity

- [`clarifying-requirements`](skills/productivity/clarifying-requirements) — turns vague ideas into clear requirements through iterative questions
- [`handoff`](skills/productivity/handoff)
- [`progressive-disclosure-agents-md`](skills/productivity/progressive-disclosure-agents-md)
- [`storm-research`](skills/productivity/storm-research)
- [`unslop`](skills/productivity/unslop)
- [`writing-prd`](skills/productivity/writing-prd) — writes and revises PRD.md using the VibeVibe PRD template

### Miscellaneous

- [`photo-illustration-styles`](skills/misc/photo-illustration-styles)
- [`tailscale-api`](skills/misc/tailscale-api)
- [`tailscale-cli`](skills/misc/tailscale-cli)

### Codex

- [`dev-mode`](.codex/skills/dev-mode) — coordinates seven specialized Codex subagents
- [`optimize-astra-instructions`](.codex/skills/optimize-astra-instructions) — audits and revises instructions for GPT-6 Astra

## License

[MIT](LICENSE)
