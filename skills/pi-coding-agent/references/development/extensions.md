# Extensions and custom tools

## When to read

Read this when the request requires a Pi lifecycle hook, custom tool, slash command, safety gate, persistent extension state, custom provider, or interactive UI. Do not reach for an Extension when a CLI flag, setting, Skill, or prompt template is sufficient.

## Minimal extension

```typescript
import type { ExtensionAPI } from "@earendil-works/pi-coding-agent";
import { Type } from "typebox";

export default function (pi: ExtensionAPI) {
  pi.registerCommand("hello", {
    description: "Say hello",
    handler: async (_args, ctx) => ctx.ui.notify("Hello", "info"),
  });

  pi.registerTool({
    name: "greet",
    label: "Greet",
    description: "Greet a person",
    parameters: Type.Object({ name: Type.String() }),
    async execute(_id, params) {
      return { content: [{ type: "text", text: `Hello, ${params.name}!` }], details: {} };
    },
  });
}
```

Test a file with:

```bash
pi -e ./my-extension.ts
```

Put reusable Extensions in `~/.pi/agent/extensions/` or trusted project `.pi/extensions/` for discovery and `/reload`.

## Choose the API

- `pi.on("tool_call")`: inspect/mutate/block tool calls; use for permission gates and protected paths.
- `pi.on("tool_result")`: modify a tool result before it reaches the session/LLM.
- `pi.on("before_agent_start")`: add per-turn context or modify the system prompt.
- `pi.on("context")`: non-destructively filter/adjust messages before an LLM call.
- `pi.registerCommand()`: user-invoked slash command.
- `pi.registerTool()`: model-invoked capability.
- `pi.appendEntry()`: persistent Extension state that is not sent to the LLM.
- `pi.sendMessage()`: custom context message; `pi.sendUserMessage()`: actual user message.
- `ctx.ui`: dialogs/status/widgets; use `ctx.mode === "tui"` for terminal-only UI.

Use `ctx.signal` for nested abort-aware work. Throw from a tool to mark execution as an error; returning a value does not set `isError`. Truncate large custom-tool output (default guidance is 50KB/2000 lines). Use `withFileMutationQueue()` for custom read-modify-write tools that can overlap built-in edits.

Extensions run with full process permissions. Keep background resources out of the factory; start them at `session_start` and clean them up at `session_shutdown`. Re-read the exact event/type section before implementing non-trivial hooks, session replacement, custom rendering, or dynamic tool loading.

Full API and examples: `references/upstream/extensions.md`; compaction hooks: `compaction.md`; TUI patterns: `references/development/tui.md`.
