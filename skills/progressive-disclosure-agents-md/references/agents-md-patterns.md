# AGENTS.md Progressive Disclosure Patterns

## Root AGENTS.md Template

```markdown
# AGENTS.md

## Purpose

State what this repository is and what agents must optimize for.

## Always Follow

- Keep changes small and localized.
- Preserve public APIs, data formats, and defaults unless explicitly requested.
- Explain risky behavior changes in the final response.

## Repository Map

- `src/`: application code.
- `tests/`: test coverage and fixtures.
- `docs/`: human and agent reference docs.

## Common Commands

- Run tests: `...`
- Run type checks: `...`
- Start development server: `...`

## Context Routing

- If touching authentication, read `agent_docs/auth.md`.
- If touching persistence or migrations, read `agent_docs/data.md`.
- If touching UI behavior, read `agent_docs/frontend.md`.

## Definition of Done

- State what changed.
- State which tests were run.
- State any tests not run and why.
```

## Nested AGENTS.md Template

```markdown
# AGENTS.md for `path/to/subsystem`

## Scope

These instructions apply to files under this directory.

## Local Rules

- Describe rules that refine root guidance for this subsystem.
- Explain any local naming, layering, or compatibility constraints.

## Required Checks

- Run `...` when changing this subsystem.
```

## Context Routing Table Template

```markdown
## Context Routing

Read only the relevant file before making changes:

- If reviewing data loading, sharding, IO, cleaning, or filtering, read:
  `agent_docs/data_pipeline.md`.
- If reviewing model architecture, losses, optimizers, or schedulers, read:
  `agent_docs/training_loop.md`.
- If reviewing deployment, CI, or runtime configuration, read:
  `agent_docs/operations.md`.
```

## Review Checklist

- Root `AGENTS.md` contains only repo-wide rules, map, commands, routing, and done criteria.
- Every routed document has a concrete trigger condition.
- Nested `AGENTS.md` files have clear directory scope.
- Conflicts are resolved by explicit precedence, not agent guesswork.
- Required safety constraints are not hidden in optional reference docs.
- Repeated rules are consolidated at the highest valid layer.
- The system supports common task prompts without forcing unrelated context into the window.

## Anti-Patterns

- Huge root files that include every subsystem guide.
- Vague routing such as "read the relevant docs" without concrete conditions.
- Duplicating the same command, policy, or warning across several layers.
- Optional docs that secretly contain mandatory constraints.
- Nested instructions that contradict root guidance without saying they override it.
- Routing by organization names or labels that are not visible from paths, filenames, or user intent.

## Validation Prompts

- "Fix a bug in the data loader." Expected: root plus data-specific guidance.
- "Update a button style in the frontend." Expected: root plus frontend guidance only.
- "Review the test strategy." Expected: root plus testing guidance.
- "Make a small typo fix in docs." Expected: root only unless a docs-specific nested file exists.
