---
name: executing-plans
description: Use when you have a written implementation plan to execute and want a disciplined flow with review checkpoints
---

# Executing Plans

## Overview

Load the plan, check that it still fits the current repository, execute the requested work, verify the result, and report only after the authorized outcome is complete.

Use subagents only when they provide a concrete benefit and the work can be split without conflicting ownership.

## Process

### Step 1: Load and review the plan

1. Read the plan and identify its goal, scope, checks, and stop conditions.
2. Compare it with the current repository and surface material contradictions before editing.
3. Use a checklist when the work has multiple independent steps; do not create ceremony for a small change.

Resolve routine implementation details from the plan, repository, and established conventions. Ask only when an unresolved choice could materially change product behavior, architecture, public interfaces, compatibility, scope, permissions, or another outcome the user should control.

### Step 2: Prepare the workspace

Before editing, inspect the working-tree state, ownership of files that may be changed, and the relevant verification commands. Use an isolated branch or workspace only when the task, repository, or concurrent ownership requires it.

### Step 3: Execute tasks

Follow the plan while it remains valid. For each meaningful task, make the smallest coherent change and run the check that provides useful evidence before moving on. If new evidence proves part of the plan wrong, adapt the implementation within the authorized outcome and record any material deviation.

### Step 4: Stop only for a material blocker

Report a blocker instead of guessing when:
- a required dependency or permission is unavailable
- the plan has a critical gap that cannot be resolved from repository evidence or conventions
- verification repeatedly fails and exposes a material scope or design problem
- the real constraints require a product, architecture, compatibility, destructive, or external-action decision not already authorized

Continue unrelated safe preparation or verification when a blocker affects only part of the plan.

### Step 5: Finish cleanly

After the requested work is complete, run the final checks justified by the change, inspect the diff, and summarize what changed, what was verified, any material plan deviation, and remaining risk.

## Review Expectations

Before execution:
- challenge requirements only when ambiguity can change the result
- check whether the plan is still valid for the current codebase
- identify risky steps early

During execution:
- do not silently skip material plan requirements
- do not drift into unrelated refactors
- do not claim success before verification evidence exists

## Integration

When work can be split without conflicting ownership, use independent delegates only for bounded tasks that benefit from parallel execution. Before claiming success, inspect the final result and the checks justified by the change.
