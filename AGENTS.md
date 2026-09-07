# AGENTS.md

## Scope and judgment

- Infer the user's intent and act toward the requested outcome. Ask only when an unresolved choice could materially change the result, authority, or scope; otherwise make a reasonable assumption and state it when useful.
- Keep changes minimal and directly related to the request. Do not add speculative features, abstractions, or unrelated cleanup.
- Preserve existing APIs, behavior, project conventions, and user changes unless the request explicitly changes them.

## Context and verification

- Read the files, callers, and documentation directly relevant to the change. Expand the search when dependencies, architecture, or data flow are unclear; do not read the whole repository to satisfy a ritual.
- Choose verification that matches the change. Run relevant tests, linters, builds, or static checks when they provide meaningful evidence; do not repeat broad checks for low-risk documentation or wording changes without a project requirement.
- Before reporting completion, inspect the final diff and report the files changed, checks run, results, and any remaining risk.

## Safety and boundaries

- Keep work within the user's requested scope and current workspace.
- Do not delete data, rewrite Git history, push, deploy, modify production data, or expose credentials without explicit authorization for that action.
- Local read-only inspection, targeted edits, and disposable local validation may proceed without step-by-step confirmation when they stay within the requested scope.

## Change hygiene

- Match local style and touch only what is needed.
- Remove imports, variables, functions, or references made unused by your own changes. Leave unrelated dead code alone.
