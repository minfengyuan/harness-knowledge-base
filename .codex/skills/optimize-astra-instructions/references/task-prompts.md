# Task Prompts for GPT-6 Astra

Optimize the prompt around the requested result rather than prescribing the model's internal reasoning.

## Include when material

- The concrete goal and observable success criteria.
- Relevant inputs, sources of truth, constraints, and deliverable format.
- What is in and out of scope when the boundary is not evident.
- Authority for local changes or external actions when it affects execution.
- A completion condition that distinguishes execution from analysis-only work. If the user asks to implement, run, fix, or update something, do not stop at a plan or proposal unless a material blocker requires a decision.
- A bounded exploration target and stopping condition when the user wants investigation beyond the first plausible answer.
- Any material decision that must remain with the user rather than being inferred from context.

## Remove or revise

- Long step-by-step recipes when several approaches are valid.
- Generic reminders to reason carefully, inspect work, or use tools.
- Repeated system, permission, or repository instructions already present in the effective context.
- Arbitrary counts for searches, alternatives, reviewers, agents, or tests without a product or risk reason.
- Mandatory pauses after intermediate milestones when the user only needs the finished result.
- Approval language that accidentally asks the user to authorize work already covered by the request.
- Vague persistence such as "keep going" without defining the outcome or limit.
- Elaborate output templates when a shorter result would carry the same information.

Preserve intentional constraints, required formats, exact text, named sources, and explicit approval boundaries. Do not use prompt optimization to broaden the task or grant authority the user did not provide.

## Validation

Compare the revised prompt with the original intent. Confirm that an implementer can identify the outcome, constraints, authority, stopping condition, and verification expectation without inheriting an unnecessary procedure. Check that action requests proceed beyond planning, plan-only requests stop before implementation, routine ambiguity can be inferred safely, and material decisions still return to the user. For shared prompts, keep guidance required by supported non-Astra models or separate the Astra variant explicitly.
