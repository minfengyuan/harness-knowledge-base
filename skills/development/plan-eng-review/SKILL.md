---
name: plan-eng-review
description: Use proactively when a written plan needs engineering review for architecture, data flow, testing, edge cases, performance, and operational safety before implementation
---

# Engineering Plan Review

Turn a plausible plan into an executable one by stress-testing architecture, data flow, interfaces, verification, operational behavior, and failure modes.

Use this skill when a written plan or design is about to be implemented, when architecture or rollout risk needs review, or when edge cases and verification need to become explicit. If the underlying product problem is still materially unclear, use available context to narrow it and ask only when the answer would change the engineering direction.

## Inputs

Use the implementation plan or design doc plus the codebase context, project conventions, interface specs, and operational constraints that are relevant. Read project testing or architecture guidance when it exists; otherwise infer conventions from nearby code and tests rather than requiring separate confirmation.

## Review process

1. Restate the objective, components, data flow, and integration or rollout boundary.
2. Review decomposition, responsibility boundaries, interfaces, coupling, and unnecessary abstraction.
3. Trace inputs, outputs, state ownership, validation boundaries, failure and retry points, and concurrency or idempotency concerns when applicable.
4. Check meaningful invalid, partial, empty, extreme, compatibility, migration, observability, performance, and operational cases that the plan actually exposes.
5. Define verification at the smallest layer that provides credible evidence. Recommend unit, integration, end-to-end, static, build, migration, or operational checks according to the changed boundary; do not require every test layer by default.
6. Surface an open decision only when different choices materially affect architecture, compatibility, scope, rollout, permissions, or operational risk.

## Output

Use a concise structure that covers:
- **Architecture:** what is sound and what needs clarification or redesign.
- **Data flow:** main path, state ownership, boundaries, and important failure points.
- **Risks:** concrete correctness, performance, migration/rollout, or operational risks.
- **Verification:** scenarios and checks needed to establish acceptance.
- **Open decisions:** only decisions that truly require user or parent authority.
- **Plan tightening:** concrete edits that make the implementation decision-complete.

Strong findings are specific, tied to risk or verification, and actionable. Avoid generic advice such as "consider edge cases," style commentary without engineering impact, or extra abstractions without a demonstrated need.

Use `plan-ceo-review` first only when product direction itself is the material unresolved problem.
