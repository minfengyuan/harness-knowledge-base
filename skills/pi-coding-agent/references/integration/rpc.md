# RPC mode

## When to read

Use RPC for a subprocess/client integration, another language, a custom UI, or a long-lived process that must send prompts and control Pi.

## Start and framing

```bash
pi --mode rpc --no-session
```

Send one JSON command per line to stdin and read JSON responses/events from stdout. RPC uses strict JSONL with LF (`\n`) as the record delimiter; accept optional trailing `\r`, but do not split on Unicode line separators inside JSON strings. Include an `id` on commands when response correlation matters.

## Core commands

- `prompt`: send a prompt; while streaming, specify `streamingBehavior` as `steer` or `followUp`.
- `steer`: deliver after the current assistant turn's tool calls.
- `follow_up`: deliver after the agent fully finishes.
- `abort`: stop the current operation.
- `get_state`, `get_messages`, `get_session_stats`: inspect state.
- `set_model`, `cycle_model`, `set_thinking_level`: control model behavior.
- `compact`, `set_auto_compaction`, `set_auto_retry`: control resilience/context.
- `bash`, `abort_bash`: run or stop a user-level bash command.
- `new_session`, `switch_session`, `fork`, `clone`: replace/branch sessions.
- `get_entries`, `get_tree`, `get_commands`: inspect durable state/resources.

A successful response means the command was accepted/queued; later failures arrive through the event stream. Handle `agent_settled` when the client needs to know that retries, compaction retries, and queued continuations are finished.

## Client rules

- Correlate responses by `id`; events do not carry request ids.
- Consume `message_update` for streaming text and `tool_execution_*` for tool progress.
- Handle `extension_ui_request` if Extensions may open dialogs in RPC mode.
- Do not send interactive-only TUI slash commands as RPC protocol commands.
- Choose `--no-session` for ephemeral workers; otherwise set `--session-dir`/`--name` deliberately.

For exact command schemas, event fields, extension UI protocol, and Python/Node examples, read `references/upstream/rpc.md`.
