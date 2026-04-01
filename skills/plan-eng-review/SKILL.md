---
name: plan-eng-review
description: Use when a written plan needs engineering review for architecture, data flow, testing, edge cases, performance, and operational safety before implementation
---

# Engineering Plan Review

## Overview

Review a plan from an engineering-manager perspective.

This skill exists to turn a plausible plan into an executable one by stress-testing architecture, data flow, interfaces, test strategy, operational behavior, and failure modes.

**Core principle:** a plan is not ready when it sounds reasonable. It is ready when the main implementation decisions, risks, and verification paths are explicit.

## When to Use

Use this skill when the user:
- has a plan or design doc and is about to start coding
- wants an architecture review
- wants an engineering review before implementation
- wants sharper thinking about edge cases, testing, or rollout risk

If the product problem is still unclear, use `office-hours` or `plan-ceo-review` first.

## Inputs

Preferred inputs:
- implementation plan
- design doc
- relevant architecture notes
- existing codebase context
- test or operational constraints if available

Optional supporting inputs:
- project docs
- test commands
- interface specs
- current system behavior

If project conventions or testing docs exist, read them first. If they do not exist, infer likely conventions from the repository structure and existing tests.

## Review Process

### Step 1: Restate the plan

Summarize:
- objective
- main components involved
- expected data flow
- intended rollout or integration point

### Step 2: Architecture review

Check:
- whether the decomposition is sound
- whether responsibilities are cleanly separated
- whether the interfaces are explicit enough
- whether the plan introduces avoidable coupling or abstraction

### Step 3: Data flow and state review

Check:
- inputs and outputs at each major step
- where state lives
- validation boundaries
- failure and retry points
- concurrency, ordering, and idempotency concerns where applicable

### Step 4: Edge cases and operational review

Check:
- empty, invalid, partial, and extreme inputs
- backward compatibility constraints
- migration or rollout hazards
- observability and debugging needs
- performance risks or resource hotspots

### Step 5: Test plan review

Check:
- what unit, integration, and end-to-end coverage is needed
- how regressions would be detected
- whether failure modes are explicitly tested
- whether the acceptance criteria can be verified objectively

### Step 6: Produce a structured result

Do not stop at criticism. End with a plan-tightening output the implementer can use directly.

## Output Format

Use this structure:

```markdown
# Engineering Review Result

## Architecture
- What is sound
- What needs clarification or redesign

## Data Flow
- Main data path
- State ownership and boundaries
- Failure points to handle

## Risks
- Correctness risks
- Performance risks
- Rollout or migration risks
- Operational/debugging risks

## Test Plan
- Required test scenarios
- Regression coverage needed
- Acceptance checks before completion

## Open Decisions
- Tradeoffs that need explicit user confirmation

## Recommendation
- Ready as-is, ready with edits, or needs rework
```

## How to Handle Tradeoffs

When the plan contains meaningful tradeoffs, surface them one at a time and ask the user to confirm direction.

Examples:
- "Do you want a faster, narrower implementation or a more extensible design now?"
- "Should compatibility be preserved even if it adds complexity?"
- "Is lower operational risk more important than implementation speed here?"

Do not depend on repository-specific templates, logging systems, or external review tooling. Use the plan, the codebase, and the project context available in the current environment.

## Review Standards

Strong findings are:
- specific
- implementation-relevant
- tied to risk or verification
- actionable without inventing new ambiguity

Weak findings are:
- generic statements like "consider edge cases"
- style commentary without architectural impact
- test advice without naming scenarios
- abstractions added without a clear need

## Integration

Typical flow:
- use `office-hours` if the idea is still vague
- use `plan-ceo-review` if scope or product direction is unsettled
- use `plan-eng-review` to make the implementation plan decision-complete
