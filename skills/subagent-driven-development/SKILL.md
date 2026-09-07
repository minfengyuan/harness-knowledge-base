---
name: subagent-driven-development
description: Use when an approved implementation plan has independent work that benefits from bounded delegation and separate review.
---

# Subagent-Driven Development

Use delegation when it reduces context switching, enables safe parallel discovery, or adds independent judgment. Do not delegate merely to satisfy a workflow or for work that is faster and safer in the main thread.

## Decide first

- Delegate only after the goal, scope, ownership, and checks are clear.
- Use one writer per file or mutable target. Do not run overlapping implementation agents.
- Keep user authority and external-action permissions in the main thread.
- Match the agent and reasoning effort to task complexity.
- Keep a task in the main thread when it is small, tightly coupled, or difficult to review independently.

## Delegation brief

Give each child only the context it needs: outcome, relevant sources, owned files, permitted actions, checks, stop condition, and return format. Tell it not to spawn descendants unless that is explicitly part of the design.

## Review

Inspect the agent's actual files, diff, and check output. For consequential or uncertain work, use a fresh read-only reviewer; otherwise a main-thread inspection may be sufficient. Review requirements before style, and re-review a repair that changes the implementation materially.

Never accept an agent's success report without checking the resulting state. If an agent is blocked, provide missing context, narrow the task, change the assigned capability, or return the decision to the user; do not force an unchanged retry.

## Completion

The parent agent confirms that the requested outcome, relevant checks, and accepted review findings are complete. Report exact files, validation, and remaining risks. Delegation does not expand the user's authority or justify unrelated changes.
