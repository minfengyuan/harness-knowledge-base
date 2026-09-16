# JSON event stream mode

## When to read

Use this for one-shot automation that needs structured lifecycle, message, tool, compaction, or retry events but does not need to control a long-running session.

## Start

```bash
pi --mode json "Review the changed files" > events.ndjson
```

Each output line is a JSON object. The stream begins with a session header and then emits agent/turn/message/tool lifecycle events plus queue, compaction, retry, and extension errors.

Example:

```bash
pi --mode json "List files" 2>/dev/null \
  | jq -c 'select(.type == "message_end")'
```

Treat `message_update` as streaming and inspect `assistantMessageEvent.type` for `text_delta`, `thinking_delta`, and tool-call deltas. Do not assume one `agent_end` means the whole session has settled: retries, compaction retries, or queued work can follow.

JSON mode is not the same as RPC: it is an event output stream, not a command protocol. For commands such as `set_model`, `compact`, `abort`, or `get_state`, use RPC or the SDK.

For the complete event union and message shapes, read `references/upstream/json.md`, then `session-format.md` if parsing persisted entries.
