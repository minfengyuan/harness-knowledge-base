---
name: plan-ceo-review
description: Use when a user wants product-level review of a plan, especially to challenge scope, ambition, and user value before implementation
---

# CEO Review

## Overview

Review a plan from a founder or product-lead perspective.

This skill exists to challenge the premise, sharpen the product, and decide whether the current scope is too small, too large, or pointed at the wrong problem.

**Core principle:** do not treat the plan as fixed. Re-evaluate the user problem and the value of the proposed scope.

## When to Use

Use this skill when the user asks to:
- think bigger
- review the product direction
- challenge or expand scope
- decide whether a plan is ambitious enough
- decide whether a plan should be reduced to a sharper wedge

Use this skill after idea shaping but before implementation when product judgment matters more than engineering detail.

If the underlying user problem and wedge are still unclear, run `office-hours` first.

## Review Modes

Choose one of four modes before reviewing:

### 1. Scope Expansion

Use when the current plan is too timid and the user wants the strongest product direction.

Goal:
- identify what larger scope would create a meaningfully better product
- push for stronger user value, not just more features

### 2. Selective Expansion

Use when the current plan is mostly right but missing one or two high-leverage additions.

Goal:
- keep the core plan
- add only expansions that materially improve usefulness or differentiation

### 3. Hold Scope

Use when the priority is execution rigor and scope control.

Goal:
- keep the plan narrow
- reject nice-to-have additions
- protect focus and shipability

### 4. Scope Reduction

Use when the plan is overbuilt, slow, or solving too much at once.

Goal:
- strip to the smallest version that still creates real value
- remove speculative or low-leverage work

## Review Process

### Step 1: Restate the plan

Summarize the plan in plain language:
- what problem it claims to solve
- who it serves
- what the proposed solution includes
- what appears to be out of scope

### Step 2: Challenge the premise

Ask:
- Is this solving a real user problem or just organizing work?
- Is the target user concrete enough?
- Does the plan improve the user outcome in a visible way?
- Is the wedge sharp, or is it trying to serve too many cases?

### Step 3: Evaluate the scope

Check whether the plan is:
- too small to matter
- broad in ways that dilute the wedge
- missing a key product capability
- prematurely optimized for scale or edge cases

### Step 4: Make a mode-specific recommendation

Based on the chosen mode, explicitly say whether to:
- expand scope
- keep scope
- reduce scope
- reframe the problem before continuing

### Step 5: Produce a structured review

Always end with a decision-oriented review, not a stream of observations.

## Output Format

Use this structure:

```markdown
# CEO Review Result

## Premise
- What problem the plan is really solving
- Who benefits
- Main assumption the plan depends on

## Scope Assessment
- What is strong
- What is weak
- What is missing or unnecessary

## Risks
- Product risk
- Adoption risk
- Focus risk

## Recommendation
- Selected mode
- Recommended direction
- What to add, keep, remove, or reframe

## Next Step
- The single best next move before implementation
```

## How to Interact With the User

When there are meaningful tradeoffs, surface them explicitly and ask the user to choose.

Examples:
- "Do you want the strongest possible product direction, even if it expands scope?"
- "Should we preserve schedule certainty and keep the wedge narrow?"
- "Is the goal to maximize learning quickly or maximize completeness in v1?"

Do not rely on any repository-specific files or project-wide status systems. This skill should work from the plan content and local context alone.

## Review Standards

Good CEO review findings are:
- tied to user value
- opinionated
- concrete enough to change the plan
- focused on outcome, not implementation trivia

Weak findings are:
- generic feature requests
- architecture commentary without product impact
- expanding scope without a user-value reason
- reducing scope without protecting the wedge

## Integration

Typical flow:
- use `office-hours` if the problem or wedge is still unclear
- use `plan-ceo-review` to sharpen product direction
- use `plan-eng-review` to lock engineering execution
