---
name: no-comments
description: "Spawn Comment Sicko, fix accepted findings, and offer encodings for claimed constraints."
disable-model-invocation: true
license: MIT
---

# No comments

Spawn Comment Sicko. Act on accepted findings.

Defer to Comment Sicko's fresh perspective.

## Scope

Use the caller's files or diff. Otherwise use the current diff against the base branch, default `main`, including the working tree.

## Steps

1. Spawn a `comment-sicko` subagent if registered (e.g. `Task` with `subagent_type: "comment-sicko"` in Cursor with the pstack plugin). Otherwise spawn a general subagent (`Agent` in Claude Code with `subagent_type: "general-purpose"`, `task` in OpenCode with `subagent_type: "general"`, `spawn_agent` in Codex, or your harness's subagent tool) with [`references/comment-sicko.md`](references/comment-sicko.md) verbatim as its prompt, followed by the scope. If your harness has no subagent tool, run that prompt yourself in a fresh pass over the scope. Pick the subagent's reasoning level for the job if supported. Do not restate its rules.
2. Inspect its report and diff. Reject application-code edits, scope escapes, exception-protected deletions, misstated `MUST KILL` reasons, and flags that treat kept intentional code as guilty. Reshape flags on our-code surprises stay actionable. Do not restore those comments. A keep survives only with proof it is about something we cannot change. Audit missed scoped lint and TypeScript suppressions. Correctness or safety suppressions stay actionable `MUST KILL`s. Restore deletions only with exact exceptions and scoped proof. Before accepting thin `IMPORTANT` or `do not remove` kills or keeps, trace their symbol or git history (or run `/why` if available) on it. If a kill is ambiguous, do not restore. If a keep is refuted or still ambiguous, delete it, except a `REVIEW` keep about an outside rule, which stays until someone checks that rule. Report it open. Revert and rerun one rejected report with the failure named. If you reject the rerun too, revert only its rejected findings, report them open, and go on with the accepted ones.
3. Fix trivial accepted flags directly by deleting a dead path, dropping a parameter, or using the real API. If any fix needs a shape, sketch the design (or run `/architect` if available) once for the accepted set and surrounding code. Stop at the sketch. Step 4 implements.
4. Implement the smallest root-cause fix in scope. Remove every named workaround. If the root cause is out of scope, land the smallest in-scope fix and report the rest open. Fix root causes from first principles within scope; do not widen the fence or fix instances outside it. Never bolt on symptom guards.
5. Constraint comments say `do not remove`, `do not change wording`, or `talk to X before changing`. Leave keeps about things we cannot change. Offer the cheapest in-scope type, runtime, test, or CI lint. Wait for interactive approval. Unattended and eval require caller pre-approval. If approved, encode then delete. Otherwise delete, report the constraint open, and sketch out-of-scope work.
6. Report the deletion count, restored comments, `REVIEW` keeps, reruns, architect sketch, fixes, encoding offers, encodings, unenforced constraints, and other open work.

## Source

Adapted from [pstack: no-comments](https://github.com/cursor/plugins/tree/main/pstack/skills/no-comments) by Lauren Tan (MIT).
