# Harness Knowledge Base

A small, opinionated knowledge base of reusable Codex skills for planning, implementation, debugging, review, and documentation workflows.

This repository is organized as a set of task-specific skill folders under `skills/`. Each skill is defined primarily by a `SKILL.md` file, and some skills include supporting references, prompts, or helper scripts.

## What's In This Repo

The repository currently contains 16 skills, including:

- planning and scope shaping: `autoplan`, `office-hours`, `plan-ceo-review`, `plan-eng-review`
- implementation workflow: `executing-plans`, `subagent-driven-development`, `dispatching-parallel-agents`
- quality and verification: `test-driven-development`, `systematic-debugging`, `verification-before-completion`
- review workflow: `requesting-code-review`, `receiving-code-review`, `finishing-a-development-branch`
- documentation and formatting: `better-readme`, `conventional-commits`, `recipe-formatter`

Several skills also ship supporting materials such as:

- reference docs, for example `skills/better-readme/references/readme-playbook.md`
- review or implementation prompts, for example files in `skills/subagent-driven-development/`
- helper artifacts, for example `skills/systematic-debugging/find-polluter.sh`

## Quick Start

Browse the available skills:

```bash
find skills -maxdepth 2 -type f | sort
```

Open a skill definition:

```bash
sed -n '1,200p' skills/autoplan/SKILL.md
```

Start with these depending on the job:

- vague request that needs a concrete implementation plan: `skills/autoplan/SKILL.md`
- bug or failing test: `skills/systematic-debugging/SKILL.md`
- feature or bugfix work: `skills/test-driven-development/SKILL.md`
- final verification before claiming success: `skills/verification-before-completion/SKILL.md`
- README creation or rewrite: `skills/better-readme/SKILL.md`

## Repository Structure

```text
skills/
  <skill-name>/
    SKILL.md
    references/        # optional supporting docs
    scripts/           # optional helpers
    prompts/templates  # optional workflow assets
LICENSE
AGENTS.md
```

Each skill directory is self-contained. `SKILL.md` explains when to use the skill, its workflow, and the expected output. Supporting files add references, examples, or helper prompts where needed.

## Design Principles

The skills in this repository are consistently direct and procedural. Common themes across the collection include:

- narrow scope per skill
- explicit decision rules
- evidence before claims
- strong workflow discipline
- minimal, high-signal output

The top-level `AGENTS.md` reinforces the same style: first-principles reasoning, early convergence, and concise outputs.

## Examples

A few representative skills:

- `autoplan`: turns a broad request into an execution-ready implementation plan
- `better-readme`: drafts a README from repository evidence rather than templates
- `systematic-debugging`: requires root-cause investigation before proposing fixes
- `test-driven-development`: enforces failing-test-first development
- `verification-before-completion`: requires fresh verification before making success claims

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
- [othneildrew/Best-README-Template](https://github.com/othneildrew/Best-README-Template)

## License

MIT. See [LICENSE](LICENSE).
