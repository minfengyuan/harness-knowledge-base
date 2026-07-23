# Harness Knowledge Base

A small, opinionated knowledge base of reusable AI agent skills for planning, implementation, debugging, review, and documentation workflows.

This repository is organized as a set of task-specific skill folders under `skills/`. Each skill is defined primarily by a `SKILL.md` file, and some skills include supporting references, prompts, or helper scripts.

## What's In This Repo

The repository currently contains 16 skills, including:

- planning and scope shaping: `autoplan`, `office-hours`, `plan-ceo-review`, `plan-eng-review`
- implementation workflow: `dev-mode`, `executing-plans`, `subagent-driven-development`
- quality and verification: `tdd`, `systematic-debugging`, `verification-before-completion`
- documentation and formatting: `better-readme`, `conventional-commits`, `recipe-formatter`

Several skills also ship supporting materials such as:

- reference docs, for example `skills/better-readme/references/readme-playbook.md`
- review or implementation prompts, for example files in `skills/subagent-driven-development/`
- helper artifacts, for example `skills/systematic-debugging/find-polluter.sh`

## Installation

### For Humans

Fetch the installation guide and follow it:

```text
https://raw.githubusercontent.com/minfengyuan/harness-knowledge-base/refs/heads/main/README.md
```

### For LLM Agents

Install skills as symlinks from this repository's `skills/` directory. Before installing, ask the user whether to place the symlinks in the agent's global skills directory or the skills directory at the current project root.

Then show the available skills and ask which ones to install. Install all skills by default when the user does not make a selection:

- `autoplan`
- `conventional-commits`
- `executing-plans`
- `grilling`
- `handoff`
- `office-hours`
- `pi-coding-agent`
- `plan-ceo-review`
- `plan-eng-review`
- `progressive-disclosure-agents-md`
- `recipe-formatter`
- `subagent-driven-development`
- `systematic-debugging`
- `tdd`
- `verification-before-completion`

## Repository Structure

```text
.codex/
  agents/              # Codex agent configuration
  skills/
    dev-mode/          # bundled Codex skill
skills/
  <skill-name>/
    SKILL.md
    references/        # optional supporting docs
    prompts/           # optional workflow prompts
    scripts/           # optional helpers or examples
    metadata.json      # optional skill metadata
AGENTS.md
LICENSE
README.md
```

Each skill directory is self-contained. `SKILL.md` explains when to use the skill, its workflow, and the expected output. Supporting files can add references, prompts, scripts, examples, or metadata where needed.

## Contributing

This repository does not currently include a separate `CONTRIBUTING.md`.

If you add or revise a skill, keep the format consistent with the existing collection:

- put the skill in its own directory under `skills/`
- define the workflow in `SKILL.md`
- add references or helper assets only when they materially improve execution
- keep instructions concrete, testable, and free of template filler

## Thanks

This repository was influenced by and learned from a few strong open-source examples and workflows:

- [obra/superpowers](https://github.com/obra/superpowers)
- [garrytan/gstack](https://github.com/garrytan/gstack)
- [mattpocock/skills](https://github.com/mattpocock/skills)

## License

MIT. See [LICENSE](LICENSE).
