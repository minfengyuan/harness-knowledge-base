# Dev Mode Agent Profiles

Read this reference only when a required profile is unavailable, the user asks to install or change profiles, or the configured model, reasoning effort, or sandbox needs verification. Normal Dev Mode routing does not require rereading the Agent TOML files.

## Project Profiles

The project-scoped source of truth is `.codex/agents/*.toml`.

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

`worker` and `delegate` are the only working profiles with write access. Dev Mode still enforces a single writer for a shared working tree, artifact, or mutable system.

## Verify Profiles

1. Parse every `.codex/agents/*.toml` file with Python `tomllib` or an equivalent TOML parser.
2. Confirm the exact `name`, `model`, `model_reasoning_effort`, and `sandbox_mode` values above.
3. Confirm every profile has a non-empty `description` and `developer_instructions`.
4. Restart Codex or open a new task after configuration changes; the current task's `agent_type` choices may not refresh in place.
5. Verify actual runtime model, effort, role, and effective sandbox when permission isolation matters. Parent-task permission overrides can affect the child's effective sandbox, so TOML alone is not proof of OS-level isolation.

If a required model is unavailable, do not silently substitute another model. Ask the user to choose a replacement while preserving the role's read/write boundary.

## Missing Profiles

If the required `agent_type` is not available:

- Keep work in the main thread when that still satisfies the request safely.
- When the role is essential, report the missing profile and ask the user to restart Codex or open a new task.
- Do not use `task_name` or a generic child as a substitute for profile selection.
- Do not rewrite or replace Agent configuration unless the user authorizes that change.

Dev Mode does not install a `default` dispatch guard. Its fail-closed behavior comes from the Skill rule that every spawn explicitly names one of the eight working profiles.
