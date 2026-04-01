---
name: autoplan
description: Use when a user request is broad or underspecified and you need to turn it into an executable implementation plan, optionally sharpening it with product and engineering review passes
---

# Autoplan

## Overview

Autoplan converts a user request into a plan that is ready to implement.

It is an orchestration skill: it clarifies the request, decides whether idea-shaping is needed, drafts the implementation plan, optionally runs product and engineering review passes, and returns a final execution-ready plan.

**Core principle:** do not jump from a vague request straight into implementation. First produce a plan that is narrow, explicit, and testable.

## When to Use

Use this skill when:
- the user asks for a feature without enough implementation detail
- the request mixes product intent and engineering execution
- the task is large enough that sequencing matters
- you need to decide whether discovery, scope review, or engineering review should happen before coding

Do not use this skill when:
- the user already has a decision-complete plan
- the task is a tiny, obvious fix
- the user explicitly wants direct implementation and the work is straightforward

## High-Level Flow

1. Understand the user request.
2. Determine whether the problem statement is already clear.
3. If not clear, run `office-hours` style discovery first.
4. Draft an initial implementation plan.
5. If product scope or ambition is uncertain, apply `plan-ceo-review`.
6. If engineering details or risk are uncertain, apply `plan-eng-review`.
7. Merge the results into one final implementation plan.

## Step-by-Step Process

### Step 1: Understand the request

Extract:
- goal
- user or audience
- desired outcome
- constraints
- implied scope
- whether the request is product-first or implementation-first

If the request is missing core problem definition, user definition, or wedge, do not draft the final plan yet.

### Step 2: Decide whether discovery is needed

Use `office-hours` style discovery when:
- the request is exploratory
- the problem is not well-defined
- the target user is vague
- the first version is still unclear

Skip discovery when:
- the request is already concrete
- the user has a clear plan or narrow implementation target

### Step 3: Draft the first plan

Create a first-pass implementation plan with:
- objective
- major workstreams
- interfaces or behavior changes
- verification strategy
- key assumptions

This first draft should be strong enough to critique, not necessarily final.

### Step 4: Decide whether to apply CEO review

Apply `plan-ceo-review` when:
- the scope feels too timid or too broad
- product value is uncertain
- the request may be solving the wrong problem
- the user explicitly wants strategic or product-level critique

Skip it when the user wants a narrow execution plan and the wedge is already clear.

### Step 5: Decide whether to apply engineering review

Apply `plan-eng-review` when:
- the task touches multiple components
- architecture choices matter
- there are meaningful risks around data flow, testing, rollout, or performance
- the user wants a plan that another engineer could implement directly

Skip it when the task is too small to benefit from a formal engineering review.

### Step 6: Merge into a final plan

The final plan must:
- preserve the core user goal
- make major implementation decisions explicit
- identify tests and verification
- call out assumptions and open tradeoffs
- be ready for execution without hidden dependencies on external tooling or repo-specific infrastructure

## Output Format

Use this structure:

```markdown
# Implementation Plan

## Summary
- What will be built
- Why this scope is correct

## Key Changes
- Major behavior, interface, or architectural changes

## Test Plan
- Required validation steps
- Important scenarios to cover

## Assumptions
- Defaults chosen
- Constraints or dependencies assumed
```

## Decision Rules

Prefer `office-hours` first when the request is vague.
Prefer `plan-ceo-review` when the value proposition or scope is the main uncertainty.
Prefer `plan-eng-review` when engineering execution quality is the main uncertainty.

A good Autoplan result is:
- narrow enough to execute
- detailed enough to verify
- explicit about assumptions
- free of repository-specific process dependencies unless the current repository actually requires them

## Integration

Related skills:
- `office-hours` for discovery and idea shaping
- `plan-ceo-review` for product-level scope critique
- `plan-eng-review` for engineering-level plan critique
- `executing-plans` for carrying the final plan into implementation
