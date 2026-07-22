# Dev Mode Agent Profiles

Read this reference only when the user asks to install, change, or verify the optional Agent TOML files. Normal Dev Mode routing does not require these files.

## Project Profiles

The project stores profile configuration in `.codex/agents/*.toml` for Codex clients that support loading it.

| Agent | Model | Reasoning | Sandbox |
| --- | --- | --- | --- |
| `scout` | `gpt-5.6-luna` | `low` | `read-only` |
| `researcher` | `gpt-5.6-terra` | `medium` | `read-only` |
| `context-builder` | `gpt-5.6-terra` | `medium` | `read-only` |
| `planner` | `gpt-5.6-sol` | `high` | `read-only` |
| `worker` | `gpt-5.6-terra` | `medium` | `workspace-write` |
| `reviewer` | `gpt-5.6-sol` | `high` | `read-only` |
| `oracle` | `gpt-5.6-sol` | `xhigh` | `read-only` |
| `delegate` | `gpt-5.6-terra` | `medium` | `workspace-write` |

These are static configuration values, not evidence that the active runtime loaded a profile. The current `spawn_agent` interface accepts only `task_name`, `message`, and `fork_turns`; it cannot select one of these profiles or guarantee its model, reasoning effort, or sandbox.

In Dev Mode, the main thread therefore enforces role boundaries through the child brief. `worker` and `delegate` are the only roles that may be assigned writes, and the single-writer rule still applies to every shared working tree, artifact, or mutable system.

## Verify Profiles

1. Parse every `.codex/agents/*.toml` file with Python `tomllib` or an equivalent TOML parser.
2. Confirm the exact `name`, `model`, `model_reasoning_effort`, and `sandbox_mode` values above.
3. Confirm every profile has a non-empty `description` and `developer_instructions`.
4. If a separate client claims to support these profiles, verify its actual runtime model, effort, role, and effective sandbox independently. TOML alone is not proof of OS-level isolation.

Do not infer runtime support from a successful static parse.

## Unsupported Runtime Capabilities

If a task requires a specific model or system-enforced sandbox that the active interface cannot select:

- Keep work in the main thread when that still satisfies the request safely.
- Otherwise report the unsupported capability instead of claiming the profile is active.
- Do not use `task_name` as a substitute for profile selection; it only labels a child task.
- Do not rewrite or replace Agent configuration unless the user authorizes that change.
