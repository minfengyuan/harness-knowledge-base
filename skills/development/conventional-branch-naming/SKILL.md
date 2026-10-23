---
name: conventional-branch-naming
description: Generate one descriptive Git branch name from a task using Conventional Commits 1.0.0 types. Use when asked to name a branch or create a task branch.
---

# Conventional Branch Naming

Generate one descriptive Git branch name based on the task, aligned with Conventional Commits 1.0.0 type semantics. The branch format below is a naming convention; Conventional Commits specifies commit messages.

## Format

Use:

`<type>/[<scope>-][<issue-id>-]<description>`

Square brackets indicate optional components and are not literal characters.

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
- `revert`: revert a previous change

## Rules

- Infer the narrowest accurate type and optional scope from the task.
- Use lowercase kebab-case with a single `/` after the type.
- Keep the description concise, specific, and action-oriented.
- Include an issue ID only when provided; normalize it to lowercase kebab-case.
- Prefer names under 80 characters, including any collision suffix.
- Do not include agent names, timestamps, or random identifiers.
- Represent breaking changes in commits using `!` or `BREAKING CHANGE:`, not in branch names.
- Follow the project's branching workflow and base branch conventions.
- Validate the final name with `git check-ref-format --branch <name>` when Git execution is available. If unavailable, do not claim validation passed.
- For a naming-only request, return exactly one best branch name without code fences unless requested. Do not create or switch branches unless the user's request authorizes it.
- Before creating a branch, check existing local and known remote branches for collisions. Append `-2`, `-3`, etc. until the name is unused, and validate the final name again. If remote state is unavailable, do not claim remote uniqueness.
- Never overwrite branches or discard uncommitted changes. If creation or switching is blocked, report the blocker rather than forcing it.

## Examples

```text
feat/auth-add-oauth-login
fix/api-handle-token-expiration
refactor/payment-simplify-validation
perf/db-optimize-queries
docs/update-api-reference
style/format-imports
test/auth-add-unit-tests
build/upgrade-dependencies
ci/update-release-workflow
chore/remove-unused-config
revert/undo-cache-migration
fix/auth-proj-123-resolve-login-timeout
```
