# Skills for GPT-6 Astra

Review the Skill's description, entrypoint, supporting resources, invocation policy, and interaction with explicit user instructions as one routing system.

## Description

- State the concrete capability and the specific requests that should activate it.
- Remove broad topical triggers that attract adjacent work.
- Keep the description short enough to remain useful when many Skills are installed. Put workflows and examples in the body or supporting resources.
- Check nearby Skill descriptions for overlap or contradiction. Narrow the boundary rather than adding more trigger phrases.

## Instructions and resources

- Retain non-obvious workflow knowledge, domain constraints, tool requirements, permission boundaries, and fragile operational invariants.
- Remove generic advice Astra can infer, repeated platform rules, speculative edge cases, and fixed sequences that do not protect a concrete invariant.
- Treat explicit user requirements as stronger than a Skill's default workflow preference within the effective instruction hierarchy and the user's granted authority. Do not let a generic Skill gate create a second approval step for an already authorized action.
- Recast broad ask, confirm, approve, pause, or stop rules around the material decision or risk that actually requires user input. Let Astra resolve routine choices from context and conventions.
- Express open-ended work through outcomes and decision criteria. Reserve mandatory steps and exact parameters for correctness, safety, permissions, or genuinely fragile operations.
- Keep a simple Skill self-contained. For multiple substantial modes, make `SKILL.md` a small router and place conditional detail in focused references, scripts, or assets.
- Link every supporting resource from the point where its use becomes relevant. Do not require loading unrelated references.
- Preserve scripts that provide deterministic value; do not translate reliable automation into longer prose.
- Avoid fixed delegation, source-count, review, or test requirements unless they protect a concrete quality or risk boundary.
- Keep output formatting proportional to the deliverable. Do not require headings or categories merely to fill a template.

## Shared-model compatibility

Repository Skills may be used by models other than Astra. Do not remove scaffolding solely because Astra does not need it when another required model demonstrably does. Prefer model-neutral outcomes and invariants; isolate model-specific guidance only when the behaviors truly differ.

## Validation

Run the available Skill validator, verify referenced resources and invocation metadata, and inspect realistic triggering and non-triggering requests. Include at least one action request that should proceed without an extra confirmation and one material decision that should still stop. Judge observable routing and behavior rather than matching exact wording.
