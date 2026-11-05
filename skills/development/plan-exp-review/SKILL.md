---
name: plan-exp-review
description: Review a task, prompt, or plan for expert-level depth and rewrite its instructions around primary evidence, specific methods, and independent validation. Use when the user wants a more rigorous approach without expanding scope.
---

# Expert Depth Review

Make the work deeper while preserving its intended outcome, deliverables,
constraints, and authorization boundaries.

## Establish the Input

Use the task, prompt, or plan supplied by the user or explicitly identified
in the conversation. If none is identified, ask for it before reviewing.
Do not invent a task or select an unrelated plan.

Read any supplied source material needed to understand the request.
Distinguish observed facts, assumptions, and proposed investigation.
Do not imply that unavailable evidence has been inspected.

## Review Before Rewriting

Address these four questions in the context of the actual task:

1. **Expert practice:** What would a top professional in the relevant field
   do here that the request does not yet ask for? Identify concrete changes
   to the reasoning, investigation, or execution that improve the same
   outcome. Avoid prestige claims and generic advice.

2. **Raw material:** What primary or least-processed evidence would they
   start from instead of relying on summaries or interpretations? Name
   the relevant artifacts, their provenance, and how they would be obtained.
   Explain when existing processed material is sufficient.

3. **Methods and tools:** Which specific methods and tools would they use,
   for what purpose, and why do they fit this task? Prefer the smallest
   sufficient set. Distinguish available tools from proposed tools or
   resources that require access.

4. **Independent validation:** What evidence, test, benchmark, external
   standard, observable outcome, or qualified review could establish that
   the result is right beyond agreement between the user and assistant?
   State practical acceptance criteria. For judgment-based work, identify
   a suitable rubric or audience evaluation and its limits.

Choose improvements that materially increase rigor. Do not add adjacent
features, new deliverables, or a broader project merely to appear thorough.
Flag any necessary change to scope, access, cost, or authority separately
instead of silently incorporating it.

## Rewrite the Prompt

After the review, provide one self-contained prompt that incorporates the
selected improvements and can be used directly.

Preserve the original goal and explicit constraints. Specify the relevant
source material, methods, expected result, and validation criteria.
Mark missing inputs as missing; do not invent facts or available access.

Make the rewritten prompt proportional to the task. Do not copy every
suggestion into it when a smaller set achieves the intended depth.

Use the user's language unless they request another language.
Stop after delivering the review and rewritten prompt. This skill does
not authorize execution of the rewritten task.
