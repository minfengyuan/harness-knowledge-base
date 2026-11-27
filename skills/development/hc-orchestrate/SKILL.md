---
name: hc-orchestrate
description: Orchestrate multi-agent software workflows across local hc (herdr-core) templates (researcher, plan-reviewer, backend-worker, frontend-worker, verifier, code-reviewer). Use when a task benefits from parallel discovery, plan validation, bounded backend/frontend implementation, low-cost test/typecheck verification, or independent code review over persistent hc terminals. Do not use for trivial single-step edits or simple lookups.
---

# HC Orchestrate

Lead from the main terminal. Use the smallest useful set of local `hc` role templates; the workflow below is routing guidance, not a mandatory pipeline. Keep product, scope, authority, and external-action decisions in the main thread.

`npx skills add` installs only the skill itself, so copy or symlink the role templates from this skill's `templates/` directory into `~/.config/herdr-core/templates/` (and adjust model flags or make sure `codex`, `agy`, and `claude` are available on `hc`'s `PATH`).

## Preflight

1. Run `hc templates` to confirm the installed role templates.
2. Check `"$HC_TERMINAL_ID"` (when running inside `hc`) so child briefs specify the exact `hc send` target.
3. Run `hc --skill` when you need low-level `hc` flags, OSC 7501 status semantics, or recovery details.

## When to Orchestrate vs Skip

Delegate only when it provides a clear benefit:

- **Orchestrate** when you need parallel discovery across code/docs/web/media, independent plan or diff review, context isolation for a large implementation, or low-cost `verifier` runs for type checks and tests.
- **Skip** for single-file edits, quick symbol lookups, or tightly coupled changes that the main thread can finish and verify faster directly.

## Role Routing

| Template | Use for | Never use for |
| --- | --- | --- |
| `researcher` | Parallel read-only code search, doc/PDF reading, audio/video understanding, web retrieval | Editing files or running builds |
| `plan-reviewer` | Verifying plan assumptions against the codebase; reviewing architecture, scope, and risks | Editing files or implementing |
| `backend-worker` | Bounded backend implementation (APIs, services, data models, CLI/tooling), bug fixes, and targeted unit checks | Frontend UI work, unowned files, or recursive delegation |
| `frontend-worker` | Bounded frontend implementation (UI components, styling, client state, interactions), bug fixes, and UI checks | Backend/server work, unowned files, or recursive delegation |
| `verifier` | Running type checks, linters (when requested), and test scripts; reporting factual pass/fail results | Modifying source code |
| `code-reviewer` | Independent diff, caller, and test review for bugs, edge cases, lifecycle, and security | Applying fixes |

If `hc templates` lists extra role templates, route to them by their `description` using the same rules.

## Orchestration Rules

- **Flat star topology**: Only the main terminal starts and cleans up child terminals. Instruct every child not to spawn subagents.
- **Single-writer ownership**: Assign strictly disjoint file or directory ownership to concurrent `backend-worker` / `frontend-worker` terminals, or isolate each in its own git worktree (`--cwd <worktree>`). Keep the main thread read-only on worker-owned files until the worker finishes.
- **Self-contained brief**: Include the outcome, relevant files/context, exact write ownership (or read-only constraint), stop conditions, and the reporting command (`hc send $HC_TERMINAL_ID` when set). If a brief is long, write it to a scratch file and pass the path in the launch message.
- **Check launch readiness**: Launch with `hc run --bg --name <slug> --cwd <repo-path> <template> "<brief>"`. Check `first_message.sent`; if `false`, run `hc read <slug>` to resolve any startup dialog before running `hc send <slug>`.
- **Event-driven waits only**: Use `hc wait --children any`, `hc wait --children all`, or `hc wait <slug>`. Never `sleep` or poll in a loop. On `reason: timeout`, inspect with `hc get`/`hc read` or wait again.
- **Blocked or error handling**: When a child reports `blocked` or `error`, run `hc read <slug>` and ask the user before approving permissions or answering dialogs. Never bypass a prompt with `hc send --force`.
- **Reuse vs fresh judgment**: Reuse an existing `backend-worker` or `frontend-worker` via `hc send <slug>` for fix iterations so it keeps its context. Use a fresh `code-reviewer` for independent post-fix review when the change is consequential.
- **Cleanup**: Once results are accepted, kill and remove only the terminals you started (`hc kill <slug> && hc rm <slug>`). Leave the user's pre-existing terminals untouched.

## Workflow

### 1. Orient (Parallel Read-Only)

Spawn 1..N `researcher` terminals with non-overlapping research targets when discovery spans multiple areas (for example, local code paths vs external docs or media):

```sh
hc run --bg --name res-code --cwd /path/to/repo researcher "Map callers of Foo and summarize constraints. Read-only; no subagents. Report via hc send $HC_TERMINAL_ID."
hc run --bg --name res-docs --cwd /path/to/repo researcher "Fetch and summarize API docs for Bar. Read-only; no subagents. Report via hc send $HC_TERMINAL_ID."
hc wait --children all
```

### 2. Plan Gate (When Non-Trivial)

Draft the plan in the main thread. When assumptions, architecture, or failure modes carry risk, validate the plan before writing code:

```sh
hc run --bg --name plan-rev --cwd /path/to/repo plan-reviewer "Verify the plan in /path/to/plan.md against the codebase. Read-only; no subagents. Report blockers via hc send $HC_TERMINAL_ID."
hc wait plan-rev
```

### 3. Implement (Bounded Write)

Launch `backend-worker` and/or `frontend-worker` with explicit, disjoint file ownership and expected local checks:

```sh
hc run --bg --name worker-api --cwd /path/to/repo backend-worker "Implement X in src/api/. Do not edit files outside src/api/ or spawn subagents. Run unit tests for src/api/. Report changed files and check results via hc send $HC_TERMINAL_ID."
hc run --bg --name worker-ui --cwd /path/to/repo frontend-worker "Build Y in src/ui/. Do not edit files outside src/ui/ or spawn subagents. Run frontend typecheck and tests for src/ui/. Report changed files and check results via hc send $HC_TERMINAL_ID."
hc wait --children all
```

### 4. Verify Gate (Default Before Review)

Run `verifier` first so type errors and failing tests are caught cheaply before invoking `code-reviewer`:

```sh
hc run --bg --name verify --cwd /path/to/repo verifier "Run the project's typecheck and test suite. Do not modify files or spawn subagents. Report exact commands, exit codes, and failure output via hc send $HC_TERMINAL_ID."
hc wait verify
```

If `verifier` fails, go directly to **Step 6 (Fix Loop)** instead of launching `code-reviewer`.

### 5. Independent Review

Once `verifier` passes, launch a fresh `code-reviewer` with the requirements, changed files/diff scope, and `verifier` results:

```sh
hc run --bg --name review --cwd /path/to/repo code-reviewer "Review current git diff for requirements X and verifier results (passed). Check callers, edge cases, lifecycle, and tests. Read-only; no subagents. Report findings via hc send $HC_TERMINAL_ID."
hc wait review
```

### 6. Fix Loop

If `verifier` fails or `code-reviewer` reports blockers:

1. Send the concrete failure output or blocker list to the owning `backend-worker` or `frontend-worker` via `hc send <worker-slug> "<evidence and smallest repair scope>"`.
2. Re-run `verifier` after the fix.
3. Re-run `code-reviewer` if the repair changed behavior or touched sensitive logic.

### 7. Accept and Cleanup

Inspect the final `git diff` and verification output in the main thread. Once satisfied, clean up every child terminal started during the task (`hc kill <t> && hc rm <t>`) and report the verified outcome to the user.

## Brief Template

Use this structure inside `"<brief>"` (or a scratch file for long briefs):

```text
Goal: <concrete outcome>
Context: <key file paths, diff scope, or scratch doc paths>
Ownership: <read-only | allowed files/directories only; no subagents>
Checks: <exact commands or expectations, if applicable>
Stop when: <done criteria or blocker condition>
Report: hc send <$HC_TERMINAL_ID> "<concise summary or report file path>"
```
