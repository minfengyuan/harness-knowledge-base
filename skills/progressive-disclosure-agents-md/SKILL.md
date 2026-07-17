---
name: progressive-disclosure-agents-md
description: Design, review, or create progressive-disclosure and layered AGENTS.md instruction systems for agentic coding workflows. Use when Codex needs to organize root and nested AGENTS.md files, route context by directory or task, split always-needed guidance from conditional docs, audit agent instructions for context bloat or conflicts, or help with AGENTS.md, agent instructions, progressive disclosure, layered instructions, 分层 AGENTS.md, 渐进式披露, or 多层代理说明.
---

# Progressive Disclosure AGENTS.md

## Overview

Design `AGENTS.md` systems that keep global instructions compact and route agents to deeper context only when a task needs it. Optimize for discoverability, low context cost, and clear precedence between root, nested, and referenced guidance.

## Workflow

1. Inventory the repository shape, agent audiences, recurring task types, and domains that need special handling.
2. Separate always-needed rules from conditional guidance. Keep root `AGENTS.md` for universal behavior, setup, safety, and routing.
3. Choose layers deliberately:
   - Use root `AGENTS.md` for repo-wide principles, common commands, definitions of done, and context routing.
   - Use nested `AGENTS.md` when instructions apply to every file under a directory and should override or refine root guidance.
   - Use `agent_docs/` or similar references for long domain guides that should be read only for matching task types.
   - Use skills when the workflow is reusable across repositories or needs bundled references/scripts/assets.
4. Write explicit routing conditions. Prefer "If touching data loading, read `agent_docs/data_pipeline.md`" over vague instructions like "read relevant docs."
5. Validate that no required context is hidden in optional docs, no layer conflicts silently with another, and the root file stays short enough to scan.

## Design Rules

- Keep the first screen of root `AGENTS.md` useful without additional reads.
- Put precedence rules near the top: nested files refine the nearest parent unless they explicitly override it.
- Route by task intent, directory, file type, or risk area. Avoid routing by broad labels the agent cannot reliably infer.
- Make every routed document answer: when to read it, what it governs, and what decisions it should not change.
- Avoid duplicating the same rule across layers. Put shared rules higher; put exceptions lower.
- Preserve public APIs, schemas, defaults, and behavior unless the user explicitly asks for changes.

## Output Shape

When creating or revising an instruction system, produce:

- A proposed root `AGENTS.md` structure.
- Any nested `AGENTS.md` locations and their exact scope.
- Any reference docs to add, with read conditions.
- A short conflict and context-bloat review.
- Validation steps, including realistic task prompts that should load only the intended layers.

## Reference

Read `references/agents-md-patterns.md` when you need concrete templates, anti-patterns, or a review checklist.
