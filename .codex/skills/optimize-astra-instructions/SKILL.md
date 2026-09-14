---
name: optimize-astra-instructions
description: Audit or revise Skills, AGENTS.md files, and agent task prompts specifically for GPT-6 Astra. Use when modernizing Astra instructions or diagnosing Astra context bloat, conflicts, overconstraint, or premature stopping.
---

# Optimize Astra Instructions

Improve instructions intended for GPT-6 Astra while preserving the user's goal, authority, and required behavior.

Confirm from the request or surrounding context that GPT-6 Astra is the target. If the target is another model, do not use this skill. If the target cannot be established and the proposed changes would be model-specific, ask which model the instructions must support.

Inspect the artifacts in scope and the effective instruction chain before changing them. Include parent and nested `AGENTS.md` files, referenced guidance, Skill resources, invocation metadata, and supplied task prompts only when they can affect the requested work. For shared instructions, account for every model the user says must remain supported.

Read only the references that match the artifacts being reviewed:

- For Skills, read [references/skills.md](references/skills.md).
- For `AGENTS.md`, read [references/agents-md.md](references/agents-md.md).
- For task prompts, read [references/task-prompts.md](references/task-prompts.md).

Prefer removing, consolidating, or routing instructions over adding more text. Keep instructions that materially affect domain correctness, safety, permissions, compatibility, or completion. Do not turn Astra-specific preferences into universal rules for shared artifacts; use a clearly scoped Astra layer or conditional wording when other models still need different guidance.

For an audit request, report findings and proposed changes without editing. For an authorized revision, make the smallest supported changes, validate the affected artifacts, inspect the final diff, and report changed files, checks, results, and remaining behavioral risk.
