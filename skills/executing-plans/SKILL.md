---
name: executing-plans
description: Use when you have a written implementation plan to execute and want a disciplined flow with review checkpoints
---

# Executing Plans

## Overview

Load the plan, review it critically, execute tasks in order, verify results, and report only after the work is actually complete.

**Announce at start:** "I'm using the executing-plans skill to implement this plan."

If the execution environment supports subagents and the plan can be split safely, prefer `subagent-driven-development` for higher parallelism and tighter review loops.

## Process

### Step 1: Load and review the plan

1. Read the plan completely.
2. Review it critically before touching code.
3. Identify gaps, contradictions, or unclear steps.
4. If concerns are material, raise them before starting implementation.
5. If the plan is sound, create a task checklist and proceed.

### Step 2: Prepare the workspace

Before editing:
- confirm you are not starting work directly on `main` or `master` without explicit user approval
- if isolation is needed, create an appropriate working branch or workspace using the tools available in the current environment
- identify the verification commands you will need later

### Step 3: Execute tasks in order

For each task:
1. Mark it `in_progress` in your task checklist.
2. Follow the plan exactly unless new evidence proves the plan is wrong.
3. Run the verification steps required for that task.
4. Mark the task `completed` only after verification passes.

### Step 4: Stop when blocked

Stop and ask for clarification rather than guessing when:
- a dependency is missing
- the plan has a critical gap
- an instruction is ambiguous
- verification fails repeatedly
- the real implementation constraints differ from the plan in a material way

### Step 5: Finish cleanly

After all tasks are complete and verified:
- run the final verification set for the whole change
- summarize what changed and what was verified
- complete the branch using `finishing-a-development-branch`

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
- `finishing-a-development-branch` after all work is complete
