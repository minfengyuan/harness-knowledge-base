---
name: clarifying-requirements
description: Turn vague ideas or requirements into a shared, actionable brief through iterative questions and confirmation. Use when the user wants help defining what they need, narrowing scope, or resolving ambiguity before planning or implementation.
---

# Clarifying Requirements

Help the user discover and express what they actually need. The result should be clear enough to guide the next requested step, with confirmed decisions, assumptions, and unresolved questions kept distinct. Match the user's language and level of technical familiarity.

## Establish the current understanding

Read the supplied conversation, documents, and relevant local context first. Recover discoverable facts yourself rather than asking the user to repeat them. Briefly restate the intended outcome, who needs it, and the apparent scope; identify what remains uncertain. Treat proposed solutions as proposals until accepted, and preserve explicit choices and exclusions.

If the idea is very early, start from a concrete situation: who encounters the problem, what they do today, what goes wrong, and what a better outcome would look like. Avoid choosing a stack or inventing a feature list before the problem is understood.

## Ask, update, and ask again

Work in focused rounds. Ask the highest-impact questions whose prerequisites are already settled; defer questions that depend on unanswered choices. A short batch of independent questions is useful, but one question may be enough. Do not require a fixed number of questions or rounds.

For each question, make the decision understandable: explain why it matters when useful, offer concrete alternatives and tradeoffs, and give a recommendation when supported. Allow a free-form answer. Use the available question tool when it fits the interaction; otherwise ask numbered questions in chat and wait for the response. Do not interpret silence as a decision.

After each answer:

- Update the working understanding and briefly reflect meaningful changes.
- Explore consequences of the answer, including new ambiguities or conflicts with earlier decisions. Revisit only the decisions affected by a correction.
- Turn vague terms such as “simple,” “fast,” or “smart” into examples or observable behavior. Walk through a realistic user action from trigger to result, including a relevant failure case.
- If the user is unsure, help them compare options or identify a small experiment. If they delegate a choice, make a reasonable recommendation and label it as an assumption rather than repeatedly asking them to decide.

Keep the evolving brief available in the conversation. Link existing artifacts instead of copying them, and save or update a file only when the task calls for it.

## Probe what can change the result

Use these lenses selectively, not as a questionnaire to exhaust:

- **Value:** beneficiary, problem, current workaround, desired outcome, and evidence of success.
- **Scope:** essential capability, priority, first useful version, and explicit exclusions or deferred work.
- **Behavior:** main journey, roles, permissions, state transitions, and concrete acceptance examples.
- **Data:** inputs, outputs, ownership, persistence, and relevant loss, recovery, or sharing expectations.
- **Constraints:** platform, existing integrations, compatibility, time or budget, and measurable quality needs.
- **Blind spots:** likely failures, empty or invalid inputs, and conventional features the user may not need.

Raise an edge case when its consequence matters. The user may accept a limitation or defer it; discovering a risk does not automatically add a requirement. Separate product needs from implementation options, and avoid turning clarification into unsolicited architecture design.

## Combine other skills when useful

This workflow stands alone. If a companion skill is available, read it only when its contribution is needed:

- **batch-grill-me:** use for an explicitly requested exhaustive planning interview, batching decisions whose dependencies are settled. Ordinary clarification does not require exhaustive grilling.
- **plan-ceo-review:** use when product value, direction, or scope needs challenge. Feed proposed changes back into the discussion rather than silently expanding the brief.
- **plan-eng-review:** use once a written plan exists and feasibility, interfaces, failure behavior, or verification needs review. Bring material findings back as targeted questions; do not demand engineering detail from an early idea.

If these skills are unavailable, continue the relevant clarification directly. Combining skills does not require delegating to another agent.

## Converge and hand off

Stop asking when the decisions that could materially change the next step are settled, relevant acceptance behavior is understandable, and remaining assumptions or unknowns are explicit. Avoid pursuing hypothetical completeness. If the user ends the interview early, provide the current brief and identify consequential gaps without claiming alignment.

Summarize the goal and users, agreed scope and exclusions, main behavior and acceptance examples, relevant constraints, and remaining assumptions or open decisions. Keep it proportional to the task; a small change does not need a full PRD. Invite correction or confirmation of this shared understanding.

Once aligned, proceed to the next step the user requested, such as a PRD or implementation plan. Clarification alone does not authorize coding. If implementation was also requested, resolve consequential uncertainty and present the approach before editing; do not introduce an extra approval gate when shared understanding and authorization are already established.

## Source

Adapted from [VibeVibe: 与 AI 确认需求](https://www.vibevibe.cn/Advanced/03-prd-doc-driven/02-discuss-with-ai.html), especially its iterative discussion and understanding-confirmation approach. This skill applies those ideas proportionally rather than requiring every checklist item for every task.
