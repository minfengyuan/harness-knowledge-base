# Conventional Commits v1.0.0 Reference

Spec URL: https://www.conventionalcommits.org/en/v1.0.0/#summary

## Required Form

Use:

`<type>[optional scope][!]: <description>`

- `type` and `description` are required.
- `scope` is optional and goes in parentheses, for example: `feat(parser): add csv mode`.
- `!` marks a breaking change and appears before `:`.

## Optional Body and Footer

- Body is optional and should explain motivation or context when useful.
- Footer is optional and follows git trailer format.
- `BREAKING CHANGE: <details>` can appear in footer and is required when the break is not obvious from `!`.
- Issue references may appear in footer (for example `Refs: #123`).

## Common Types

- `feat`: add a feature
- `fix`: fix a bug
- `docs`: documentation-only changes
- `style`: formatting/style-only changes that do not affect meaning
- `refactor`: code restructuring without behavior changes
- `perf`: performance improvement
- `test`: add or correct tests
- `build`: build system or dependency changes
- `ci`: CI configuration/workflow updates
- `chore`: maintenance changes
- `revert`: revert a previous commit

## Validation Checklist

For each message, verify:

1. Header matches `<type>[scope][!]: <description>`.
2. `type` is lower-case and meaningful for the change.
3. `description` is concise and not empty.
4. Breaking changes are marked using `!` and/or `BREAKING CHANGE:` footer.
5. Body/footer, when present, are separated by a blank line.

## Rewrite Patterns

- Missing type:
  - Input: `update API endpoints`
  - Rewrite: `refactor(api): update endpoint structure`

- Missing colon separator:
  - Input: `fix(auth) handle token refresh`
  - Rewrite: `fix(auth): handle token refresh`

- Breaking change not marked:
  - Input: `feat(api): remove v1 endpoints`
  - Rewrite:
    - `feat(api)!: remove v1 endpoints`
    - Footer: `BREAKING CHANGE: remove legacy /v1 endpoints`

## Generation Heuristics from Diff

1. Prefer `fix` if behavior bug is corrected.
2. Prefer `feat` for net new user-visible behavior.
3. Prefer `refactor` for structural/internal cleanup with unchanged behavior.
4. Use `chore` only when no stronger type fits.
5. Keep scope short and bounded (`api`, `auth`, `ui`, `db`) when confident.
