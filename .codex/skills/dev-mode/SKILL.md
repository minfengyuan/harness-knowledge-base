---
name: dev-mode
description: Coordinate the project's seven specialized agents through planning, execution, review, debugging, and final acceptance for substantial software-development tasks. Use when a change benefits from independent discovery, a concrete plan, bounded implementation, fresh review, or a verified debugging loop. Do not use for simple questions or obvious low-risk edits where delegation costs more than it saves.
---

# Dev Mode

Lead from the main thread. Use the smallest useful set of roles installed from this skill's `agents/` directory into `.codex/agents/`; the workflow below is routing guidance, not a mandatory pipeline. Keep product, scope, authority, and external-action decisions in the main thread.

Install this skill with `hkb add`, not only `npx skills add`: the upstream installer installs the skill itself, while `hkb` also creates the Codex custom-agent links. Run `hkb sync` to repair those links or `hkb doctor` to inspect them.

## Rules

- Before delegating, identify a concrete benefit: parallel discovery, context isolation, bounded execution, or independent judgment.
- Give each child a self-contained brief: outcome, relevant sources or context, scope and ownership, checks, stop condition, and required return format. The assignment itself authorizes work inside that brief; instruct the child not to spawn descendants.
- Keep one writer for each file, working tree, or mutable target. Do not edit a worker-owned target concurrently.
- Let children resolve routine implementation details from the brief, codebase, and established conventions. Escalate only a material product, architecture, scope, permission, or external-action decision that cannot be inferred safely.
- Inspect sources, diffs, and check output before accepting a child result. Delegation never expands the user's authority.
- Reuse a working agent with a follow-up only when its context remains useful. Use a fresh `reviewer` when independent judgment on a revised implementation is valuable.

## Workflow

### 1. Orient and plan

Establish the goal, constraints, success criteria, and any material unresolved decisions in the main thread.

- Use `scout` for focused local reconnaissance or failure tracing.
- Use `researcher` for external facts, current documentation, or specifications.
- Use `planner` when the implementation is not already decision-complete.
- Use `oracle` for consequential decisions, conflicting constraints, or possible decision drift.

Run independent read-only discovery in parallel when doing so saves time or improves coverage. Resolve only ambiguity that materially blocks dependent execution; continue other safe preparation instead of waiting unnecessarily.

### 2. Execute

Assign the authorized implementation to one `worker` with explicit write ownership and targeted checks. Use `delegate` only for a small, independent auxiliary task with disjoint write ownership. Keep the main thread read-only on worker-owned targets until the result returns.

### 3. Review

Inspect the implementation and its validation in the main thread. When a change is consequential, uncertain, difficult to verify, or benefits from independent judgment, ask a fresh `reviewer` to assess the exact requirements, diff, changed files, and checks already passed. Require blockers to include location, observable impact, evidence, and the smallest practical repair.

### 4. Debug

If validation or review finds a defect, reproduce and locate the root cause before changing code.

- Use `scout` to trace failing paths and sibling callers when the cause is unclear.
- Use `oracle` when the failure exposes a conflict with prior decisions.
- Give the owning `worker` the failing evidence and the smallest authorized repair scope.
- Run the targeted failing check plus regression checks justified by the repair. Return to independent review only when it adds material confidence.

Do not close the task while a confirmed blocker remains.

### 5. Achieve the goal

Accept the task only after the main thread confirms that the requested outcome, accepted review findings, and relevant checks all pass. If the goal cannot be achieved, report the precise blocker, evidence, and decision or external change required.

## Role Routing

| Role | Use for | Never use for |
| --- | --- | --- |
| `scout` | Focused local reconnaissance and failure tracing | Writing changes |
| `researcher` | Primary-source external evidence | Local implementation |
| `planner` | Concrete, verifiable implementation plans | Editing files |
| `worker` | Primary authorized implementation and checks | Unapproved material scope decisions |
| `reviewer` | Independent diff and validation review | Applying fixes |
| `oracle` | Decision consistency and hidden-assumption checks | Editing files |
| `delegate` | Small isolated auxiliary work | Overlapping writes or specialist work |
