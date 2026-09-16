# SDK integration

## When to read

Use the SDK when the host is a Node.js/TypeScript application and needs typed, in-process access to Pi state, tools, resources, sessions, or events. Prefer RPC for a language-agnostic or process-isolated boundary.

## Minimal shape

```typescript
import {
  AuthStorage,
  ModelRegistry,
  SessionManager,
  createAgentSession,
} from "@earendil-works/pi-coding-agent";

const authStorage = AuthStorage.create();
const modelRegistry = ModelRegistry.create(authStorage);
const { session } = await createAgentSession({
  authStorage,
  modelRegistry,
  sessionManager: SessionManager.inMemory(),
});

session.subscribe((event) => {
  if (event.type === "message_update" && event.assistantMessageEvent.type === "text_delta") {
    process.stdout.write(event.assistantMessageEvent.delta);
  }
});
await session.prompt("Inspect the current project");
```

## Design choices

- `createAgentSession()` creates one session; configure `cwd`, model, thinking level, tools, custom tools, resource loader, settings manager, and session manager explicitly when defaults are not appropriate.
- Use `tools: ["read", "grep", "find", "ls"]` for a read-only session; include custom/Extension tool names in an allowlist when using one.
- Use `DefaultResourceLoader` for normal discovery, or override skills, prompts, context files, and Extensions for an application-owned environment.
- Use `SessionManager.inMemory()` for tests/ephemeral calls and persistent managers for resumable work.
- Subscribe to `agent_settled` or equivalent session events when retries, compaction, and queued work must be included in completion semantics.
- Use `createAgentSessionRuntime()` when replacing the active session; re-subscribe and rebind Extensions after `newSession`, `switchSession`, `fork`, `clone`, or import.

Do not copy a full runtime example into a small integration. Start with the minimal factory, then add only the required resource/tool/session option.

For exact types, runtime replacement lifecycle, custom tools, SettingsManager, ResourceLoader, run modes, and exports, read `references/upstream/sdk.md`. For durable session entry details, read `session-format.md`.
