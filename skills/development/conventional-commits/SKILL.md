---
name: conventional-commits
description: Generate Conventional Commits 1.0.0 messages from staged git changes. Use when asked to create a commit message from a staged diff.
---

# Conventional Commits

Generate one best Conventional Commit message from the actual staged diff.

## Format

Use:

`<type>[optional scope][!]: <description>`

Allowed types:

- `feat`: new feature
- `fix`: bug fix
- `docs`: documentation only
- `style`: formatting only, no behavior change
- `refactor`: code change without feature or bug fix
- `perf`: performance improvement
- `test`: adding or updating tests
- `build`: build system or dependencies
- `ci`: CI configuration
- `chore`: maintenance
- `revert`: revert a previous commit

## Rules

- Infer the narrowest accurate type and optional scope from the staged diff.
- Use lowercase type and scope.
- Keep the subject concise and imperative.
- Do not end the subject with a period.
- Use `!` and/or a `BREAKING CHANGE:` footer for breaking changes.
- Return exactly one best commit message, without code fences unless requested.
- If no staged diff is available, ask for a commit range or short change summary.
