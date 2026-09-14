# Task Prompts for GPT-6 Astra

Optimize the prompt around the requested result rather than prescribing the model's internal reasoning.

## Include when material

- The concrete goal and observable success criteria.
- Relevant inputs, sources of truth, constraints, and deliverable format.
- What is in and out of scope when the boundary is not evident.
- Authority for local changes or external actions when it affects execution.
- A completion condition that tells Astra whether to implement, run or inspect the result, fix related failures, and continue until the requested outcome is achieved.
- A bounded exploration target and stopping condition when the user wants investigation beyond the first plausible answer.

## Remove or revise

- Long step-by-step recipes when several approaches are valid.
- Generic reminders to reason carefully, inspect work, or use tools.
- Repeated system, permission, or repository instructions already present in the effective context.
- Arbitrary counts for searches, alternatives, reviewers, or tests without a product or risk reason.
- Mandatory pauses after intermediate milestones when the user only needs the finished result.
- Vague persistence such as "keep going" without defining the outcome or limit.

Preserve intentional constraints, required formats, exact text, named sources, and explicit approval boundaries. Do not use prompt optimization to broaden the task or grant authority the user did not provide.

## Validation

Compare the revised prompt with the original intent. Confirm that an implementer can identify the outcome, constraints, authority, and stopping condition without inheriting an unnecessary procedure. For shared prompts, keep any guidance required by supported non-Astra models or separate the Astra variant explicitly.
