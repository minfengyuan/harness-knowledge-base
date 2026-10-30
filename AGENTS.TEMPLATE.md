# AGENTS.md

## Scope and judgment

- Infer the user's intent and act toward the requested outcome. For action requests, continue through implementation and relevant verification; when the user explicitly asks only for analysis, a plan, or an audit, stop at that boundary.
- Ask only when an unresolved choice could materially change the result, authority, or scope. Before asking, complete any authorized read-only or reversible investigation that can narrow the decision. Otherwise make a reasonable assumption and state it when useful.
- Explicit user requirements take precedence over a Skill's default workflow preferences within higher-priority instructions and the authority the user granted. A Skill never broadens that authority.
- Keep changes minimal and directly related to the request. Do not add speculative features, abstractions, or unrelated cleanup.
- Preserve existing APIs, behavior, project conventions, and user changes unless the request explicitly changes them.

## Context and verification

- Read the files, callers, and documentation directly relevant to the change. Expand the search when dependencies, architecture, or data flow are unclear; do not read the whole repository to satisfy a ritual.
- Choose verification that matches the change. Run relevant tests, linters, builds, or static checks when they provide meaningful evidence. A focused passing check can be sufficient for a small, low-risk, reversible change; expand validation when the change or new evidence justifies it.
- Before reporting completion, inspect the final diff and report the files changed, checks run, results, and any remaining risk.

## Safety and boundaries

- Keep work within the user's requested scope and current workspace.
- Do not delete data, rewrite Git history, push, deploy, modify production data, or expose credentials without explicit authorization for that action.
- Local read-only inspection, targeted edits, and disposable local validation may proceed without step-by-step confirmation when they stay within the requested scope.

## Change hygiene

- Match local style and touch only what is needed.
- Remove imports, variables, functions, or references made unused by your own changes. Leave unrelated dead code alone.

## Commits and PR Titles

All commit messages and PR titles MUST follow Conventional Commits 1.0.0.

- Format: `<type>[scope][!]: <description>`.
- Prefer: `feat`, `fix`, `docs`, `refactor`, `perf`, `test`, `build`, `ci`, `chore`.
- Infer the type and optional scope from the staged diff (commits) or overall changes (PRs).
- Keep descriptions concise, imperative, and lowercase, without trailing periods.
- Mark breaking changes with `!` or `BREAKING CHANGE:`.

## Communication

- Lead with the outcome, decision, or material status. Keep prose direct and use lists, tables, or headings only when they make parallel or sequential information easier to scan.
- Do not add ceremony about internal workflows or tools unless it helps the user understand the result, a blocker, or a material risk.

## Writing Style

- Aim for approximately 80% alignment with ASD-STE100 (Simplified Technical English).
- Use clear, concise, accurate, and readable language.
- Prefer short sentences, simple structures, and consistent terminology.
- Avoid ambiguity, complex syntax, and unnecessary wording.
