---
name: dev-mode
description: Coordinate role-guided scout, researcher, context-builder, planner, worker, reviewer, oracle, and delegate subagents for substantial software-development tasks when delegation, parallel read-only discovery, context isolation, bounded execution, or independent review creates clear value. Keep unresolved decisions and final acceptance in the main thread. Use for complex development work; do not use for casual questions, simple lookups, obvious single-file edits, or tasks whose coordination cost exceeds the work.
---

# Dev Mode

Lead development from the main thread. Use the smallest useful set of specialized subagents to isolate noisy context, parallelize independent discovery, execute bounded work, or obtain fresh judgment. Do not turn the roles into a mandatory pipeline.

## Activation

When this Skill activates, immediately send one brief commentary update: `🛠️ 已开启开发模式。` Announce it once per task, not before every dispatch.

Activating Dev Mode does not require spawning a subagent. Keep clear, short, low-risk work in the main thread when delegation costs more than it adds.

## Dispatch Gate

The available `spawn_agent` interface accepts `task_name`, `message`, and `fork_turns`. It does not select a model, reasoning effort, sandbox, or Agent profile. Treat these names as routing roles, not tool arguments:

- `scout`
- `researcher`
- `context-builder`
- `planner`
- `worker`
- `reviewer`
- `oracle`
- `delegate`

Choose the role whose contract matches the work, encode that role and its boundaries in `message`, and use a descriptive snake_case `task_name` to label the child task. `task_name` does not select an Agent profile.

Keep safe work in the main thread when the current interface cannot enforce a capability the task requires. If a specific model or system-enforced sandbox is essential, report that the active runtime cannot guarantee it instead of assuming project configuration is loaded. Read [references/agent-profiles.md](references/agent-profiles.md) only when installing, repairing, verifying, or changing the optional profile configuration.

As a Dev Mode policy, keep all routing and fan-out in the main thread. In every child brief, instruct the child not to spawn descendants and to return evidence, artifacts, or blockers to the parent. This is a task constraint, not a runtime capability limit.

## Required Rules

- Before each spawn, identify a material benefit: useful parallelism, context isolation, bounded lower-cost execution, or independent judgment.
- Keep unresolved product, architecture, editorial, safety, and scope decisions in the main thread.
- Keep one writer per working tree, artifact, or mutable system.
- Do not let the main thread edit a target while a child owns its writes.
- Inspect actual sources, changed files, diffs, and verification output before accepting delegated work.
- Treat the parent task's live authority as the child's maximum authority. Delegation never authorizes commits, pushes, publishing, deployment, messaging, or external-state changes that the user did not request.
- Retry a transient failure at most once and only after inspecting partial output and shared artifacts.

## Dispatch Contract

Before every spawn, provide a self-contained brief with these labeled fields:

- `Outcome`: the independently finishable result the child must return.
- `Benefit`: why delegation is better than keeping this slice in the main thread.
- `Sources`: every path, URL, plan, dataset, or raw artifact required for factual work.
- `Scope`: allowed reads and writes, ownership, exclusions, external-action authority, and the instruction not to spawn descendants.
- `Checks`: acceptance criteria and validation the child owns.
- `Stop when`: the completion, blocker, or evidence threshold that ends the turn.
- `Return`: the concise report or artifact format expected by the parent.

Do not spawn while `Outcome`, `Benefit`, required `Sources`, `Checks`, or `Stop when` is missing. Keep the work in the main thread when the slice is not independently finishable or expected benefit does not exceed briefing, waiting, inspection, and rework cost.

For a `reviewer`, also provide:

- `Unresolved risk`: the concrete risk requiring independent judgment.
- `Evidence`: the exact artifact, diff, requirements, and sources to inspect.
- `Checks already passed`: validation that can be reused as evidence.
- `Do not repeat`: broad checks or settled questions outside the review.

Require the reviewer to return a usable partial verdict if `Stop when` arrives before exhaustive review.

For an `oracle`, also state the inherited decisions and constraints, the current trajectory or conflict, which decisions remain with the user or main thread, and the consistency judgment required. The oracle advises; it does not implement or expand scope.

## Route The Work

Use `fork_turns="none"` by default and give every child complete sources and constraints. The only standard exception is `oracle`, which uses `fork_turns="all"` to inspect inherited decisions and context drift. Always give a new `reviewer` fresh context with `fork_turns="none"`.

| Role | Route when | Boundary |
| --- | --- | --- |
| `scout` | Map local entry points, dependencies, call paths, tests, and likely change surfaces. | Must not write; targeted repository reconnaissance. |
| `researcher` | Verify current external documentation, specifications, versions, or primary evidence. | Must not write; source-backed research. |
| `context-builder` | Consolidate broad local and external evidence so the next role does not repeat discovery. | Must not write; high-signal handoff. |
| `planner` | Turn approved requirements and gathered context into an executable, verifiable plan. | Must not write, implement, or make hidden product decisions. |
| `worker` | Implement the primary approved change with explicit file ownership and checks. | Main workspace writer. |
| `reviewer` | Apply fresh judgment to complex, consequential, uncertain, or hard-to-check results. | Must not write or apply fixes. |
| `oracle` | Detect decision drift, contradictions, or hidden assumptions in a high-risk trajectory. | Must not write; advisory role with inherited context. |
| `delegate` | Complete a simple, general, bounded auxiliary task that does not need another specialist. | May write only its explicitly owned, isolated target. |

Do not run `worker` and `delegate` concurrently on overlapping files or the same mutable target. Parallel writers require disjoint, stable ownership; otherwise run them sequentially.

## Adaptive Development Flow

1. Clarify the goal, scope, constraints, success criteria, and unresolved user choices in the main thread.
2. Dispatch independent `scout` or `researcher` lanes only when their results unblock a decision or avoid costly context growth.
3. Use `context-builder` only when consolidating evidence prevents substantial rediscovery.
4. Use `planner` only when the implementation is not already decision-complete.
5. Use `oracle` before execution only when inherited decisions may conflict or a high-impact direction needs consistency review.
6. Use `worker` for the main implementation. Reserve `delegate` for small auxiliary work or isolated artifacts.
7. Inspect the resulting diff, files, and validation in the main thread.
8. Use a fresh `reviewer` only when independent judgment has clear value; do not make review an automatic final stage.
9. Resolve accepted findings and perform final acceptance in the main thread.

## Context And Reuse

- Assume a `fork_turns="none"` child knows nothing from the parent conversation. Name every source needed for factual claims.
- Reuse an existing scout, researcher, context-builder, planner, worker, or delegate with `followup_task` when new work belongs to the same workstream and its context remains useful.
- Start fresh when context is stale, authority changes, or independent judgment matters.
- Reuse a reviewer only to clarify its existing report. Use a fresh reviewer for a new review or revised work.
- Do not give a scout an expected conclusion. Do not tell a reviewer the desired verdict, suspected findings, or prior debate.

## Failures And Findings

- If a child errors, times out, or is interrupted, inspect shared artifacts, the current diff, and available return evidence before retrying.
- Retry once only for a clearly transient failure with no adequate result. Otherwise narrow the task, recover in the main thread, or request the missing decision.
- If a reviewer reaches its stop condition without a usable return, request a partial verdict once, then interrupt it and continue from the available evidence.
- Validate findings against underlying sources and requirements before acting.
- Apply accepted repairs in the main thread or delegate them under a new bounded write contract.
- Use a fresh reviewer after consequential repairs only when the remaining risk still warrants independent review.

## Guardrails

- Preserve unrelated user work and obey project instructions.
- For current research, prefer primary sources, record relevant dates, and distinguish fact from inference.
- Keep private-data access narrow and return only necessary evidence.
- Never copy credentials or secrets into a child brief.
- Resolve conflicting claims against the strongest available evidence and return one coherent result to the user.
