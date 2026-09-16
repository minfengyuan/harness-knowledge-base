# Sessions, branches, and compaction

## When to read

Read this guide when continuing work, selecting or deleting sessions, branching alternatives, inspecting JSONL, managing context size, or explaining what Pi preserves after compaction.

## Session operations

```bash
pi -c
pi -r
pi --session <path-or-id>
pi --fork <path-or-id>
pi --no-session
pi --session-dir <dir>
```

Interactive commands:

- `/resume` selects a previous session.
- `/new` starts fresh.
- `/name <name>` makes a session easier to find.
- `/tree` moves within the current session tree.
- `/fork` creates a new session from a prior user message.
- `/clone` duplicates the active branch into a new session file.
- `/session` shows file, id, messages, tokens, and cost.
- `/export` writes HTML; `/share` uploads a private GitHub gist.

Sessions normally live under `~/.pi/agent/sessions/` and are JSONL trees linked by `id`/`parentId`. Prefer Pi commands or `SessionManager` over hand-editing session files.

## Choosing a branch operation

| Need | Use |
|---|---|
| Explore another path in the same file | `/tree` |
| Start a separate conversation from an earlier user prompt | `/fork` |
| Duplicate the current active path before experimenting | `/clone` |

When moving between branches, Pi can attach a branch summary so important context from the abandoned path is not lost.

## Compaction

Auto-compaction runs when context approaches the model window. Manual compaction is `/compact [instructions]`. Defaults are controlled by:

```json
{
  "compaction": {
    "enabled": true,
    "reserveTokens": 16384,
    "keepRecentTokens": 20000
  }
}
```

Compaction summarizes older messages, keeps recent messages, records a `CompactionEntry`, and reloads context from the kept boundary. It tracks read and modified files in summary details. A failed request caused by a recognized context overflow can trigger compaction and one retry.

Do not confuse compaction with deletion: old entries remain in the session file, while the active LLM context uses the summary and kept path. Use a focused custom instruction when a particular decision or file change must survive.

## Programmatic use

For one session, use `SessionManager` and `AgentSession`. For replacing the active session (`new`, `resume`, `fork`, `clone`, import), use `AgentSessionRuntime` and rebind subscriptions after replacement. Read `references/integration/sdk.md` and the pinned `session-format.md` for APIs and entry types.
