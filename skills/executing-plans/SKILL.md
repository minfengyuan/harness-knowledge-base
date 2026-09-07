---
name: executing-plans
description: Use when you have a written implementation plan to execute and want a disciplined flow with review checkpoints
---

# Executing Plans

## Overview

Load the plan, check that it still fits the current repository, execute the requested work, verify the result, and report only after the outcome is complete.

Announce at the start that you are using this skill. Use subagents only when they provide a concrete benefit and the work can be split without conflicting ownership.

## Process

### Step 1: Load and review the plan

1. Read the plan and identify its goal, scope, checks, and stop conditions.
2. Compare it with the current repository and surface material contradictions before editing.
3. Use a checklist when the work has multiple independent steps; do not create ceremony for a small change.

### Step 2: Prepare the workspace

Before editing, confirm the working-tree state, ownership of any files that may be changed, and the relevant verification commands. Use an isolated branch or workspace when the task or repository requires it.

### Step 3: Execute tasks in order

For each meaningful task, follow the plan unless new evidence proves it wrong, run the relevant check, and record the result before moving on.

### Step 4: Stop when blocked

Pause and report rather than guessing when:
- a dependency is missing
- the plan has a critical gap
- an instruction is ambiguous
- verification fails repeatedly or exposes a material scope or design problem
- the real implementation constraints differ from the plan in a material way

### Step 5: Finish cleanly

After the requested work is complete, run the final checks justified by the change, inspect the diff, and summarize what changed, what was verified, and any remaining risk.

## Review Expectations

Before execution:
- challenge unclear requirements
- check whether the plan is still valid for the current codebase
- identify risky steps early

During execution:
- do not silently skip plan steps
- do not drift into unrelated refactors
- do not claim success before verification evidence exists

## Integration

Related skills:
- `subagent-driven-development` for execution with subagents
- `verification-before-completion` before claiming success
