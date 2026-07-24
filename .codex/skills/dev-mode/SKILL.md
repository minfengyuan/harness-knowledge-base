---
name: dev-mode
description: Coordinate the project's eight specialized agents through planning, execution, review, debugging, and final acceptance for substantial software-development tasks. Use when a change benefits from independent discovery, a concrete plan, bounded implementation, fresh review, or a verified debugging loop. Do not use for simple questions or obvious low-risk edits where delegation costs more than it saves.
---

# Dev Mode

Lead from the main thread. Use the smallest useful set of roles defined in `.codex/agents/`; do not make every role a mandatory step. Keep product, scope, and external-action decisions in the main thread.

## Rules

- Before delegating, identify a concrete benefit: parallel discovery, context isolation, bounded execution, or independent judgment.
- Give each child a self-contained brief: outcome, sources, scope, checks, stop condition, and required return format. Instruct it not to spawn descendants.
- Keep one writer for each file, working tree, or mutable target. Do not edit a worker-owned target concurrently.
- Inspect sources, diffs, and check output before accepting a child result. Delegation never expands the user's authority.
- Reuse a working agent with a follow-up only when its context remains useful. Use a fresh `reviewer` for a revised implementation.

## Workflow

### 1. Plan

Clarify the goal, constraints, success criteria, and unresolved decisions in the main thread.

- Use `scout` to map relevant code, callers, tests, and change surfaces.
- Use `researcher` only for external facts, current documentation, or specifications.
- Use `context-builder` when several findings need a concise handoff.
- Use `planner` to create an executable, verifiable plan when the implementation is not already decision-complete.
- Use `oracle` only for consequential decisions, conflicting constraints, or possible decision drift.

Do independent read-only discovery in parallel. Resolve ambiguous requirements before execution.

### 2. Execute

Assign the approved implementation to one `worker` with explicit file ownership and targeted checks. Use `delegate` only for a small, independent auxiliary task with disjoint write ownership. Keep the main thread read-only on worker-owned targets until the result returns.

### 3. Review

Inspect the implementation and its validation in the main thread. For consequential, uncertain, or hard-to-check changes, ask a fresh `reviewer` to assess the exact requirements, diff, changed files, and checks already passed. Require blockers to include location, impact, and a minimal repair.

### 4. Debug

If validation or review finds a defect, reproduce and locate the root cause before changing code.

- Use `scout` to trace failing paths and sibling callers when the cause is unclear.
- Use `oracle` when the failure exposes a conflict with prior decisions.
- Give the owning `worker` the failing evidence and the smallest approved repair scope.
- Run the targeted failing check plus relevant regression checks. Return to review when the repair is consequential.

Do not close the task while a confirmed blocker remains.

### 5. Achieve the Goal

Accept the task only after the main thread confirms that the requested outcome, accepted review findings, and relevant checks all pass. If the goal cannot be achieved, report the precise blocker, evidence, and decision or external change required.

## Role Routing

| Role | Use for | Never use for |
| --- | --- | --- |
| `scout` | Focused local reconnaissance and failure tracing | Writing changes |
| `researcher` | Primary-source external evidence | Local implementation |
| `context-builder` | Consolidating broad evidence into a handoff | Making product decisions |
| `planner` | Concrete, verifiable implementation plans | Editing files |
| `worker` | Primary approved implementation and checks | Unapproved scope decisions |
| `reviewer` | Independent diff and validation review | Applying fixes |
| `oracle` | Decision consistency and hidden-assumption checks | Editing files |
| `delegate` | Small isolated auxiliary work | Overlapping writes or specialist work |
