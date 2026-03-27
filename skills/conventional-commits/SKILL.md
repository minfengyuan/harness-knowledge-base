---
name: conventional-commits
description: Generate and analyze commit messages using Conventional Commits v1.0.0. Use when asked to create commit messages from git changes, validate existing commit messages, rewrite non-compliant commits, or explain why a message does or does not follow the spec.
---

# Conventional Commits

## Overview

Produce one best Conventional Commit message from repository changes and validate/rewrite existing commit messages against the v1.0.0 specification.
Prioritize exact spec compliance and concise, implementation-aware commit summaries.

## Workflow

1. Determine the task mode:
- `generate` when asked to create a new commit message from changes.
- `analyze` when asked to check or rewrite existing commit message text.

2. Load the rule reference:
- Read [references/conventional-commits-v1.md](references/conventional-commits-v1.md) before classifying type, scope, and breaking-change markers.

3. Execute by mode:
- `generate`: inspect the relevant diff (`--staged`, requested commit/range, or user-provided summary), infer the smallest accurate `type`, optional `scope`, and concise description, then emit one best message.
- `analyze`: parse each provided commit line, report compliance verdict and violations, then provide a compliant rewrite.

4. Handle missing evidence:
- If there is no accessible diff or message text, ask for the specific commit/range or a short change summary before producing a final message.

## Output Contract

### Generate Mode
- Return exactly one best commit message.
- Use canonical shape: `<type>[optional scope][!]: <description>`.
- Add optional body/footer only when needed (breaking change details, issue refs, or meaningful context).
- Keep subject concise and imperative.

### Analyze Mode
- Return:
1. `status`: `compliant` or `non-compliant`
2. `violations`: short list (empty when compliant)
3. `rewrite`: one compliant commit message (always present)
- Keep rewrites faithful to the original intent; do not invent unrelated behavior.

## Type Selection Guidance

- `feat`: new user-facing capability
- `fix`: bug fix
- `refactor`: internal code change without behavior change
- `perf`: performance-focused behavior improvement
- `docs`: documentation-only changes
- `test`: adding or correcting tests
- `build`: build/dependency/tooling for build pipeline
- `ci`: CI configuration/workflow changes
- `chore`: maintenance change not fitting other types
- `revert`: revert of previous commit

Prefer the narrowest accurate type.
Use `!` and/or `BREAKING CHANGE:` footer when compatibility is broken.

## Guardrails

- Do not output multiple message options unless explicitly requested.
- Do not include markdown code fences around the commit message unless asked.
- Do not force a scope when evidence is weak.
- Prefer correctness over style preferences not defined by the spec.
