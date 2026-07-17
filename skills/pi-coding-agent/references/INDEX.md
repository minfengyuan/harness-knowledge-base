# Pi coding-agent reference index

Use this file as the second disclosure layer. Read only the guide matching the current task. The files under `upstream/` are a verbatim snapshot of the source documentation and should be opened only for exact or advanced details.

## Core operation

| Task | Focused guide | Upstream sources |
|---|---|---|
| Install, authenticate, launch, prompt files, shell commands, slash commands, CLI flags | [`core/usage.md`](core/usage.md) | `quickstart.md`, `usage.md`, `index.md` |
| API keys, OAuth, providers, models, settings, thinking, retry, keybindings | [`core/configuration.md`](core/configuration.md) | `providers.md`, `models.md`, `settings.md`, `keybindings.md` |
| Skills, prompt templates, packages, resource discovery and reload | [`core/resources.md`](core/resources.md) | `skills.md`, `prompt-templates.md`, `packages.md`, `settings.md` |
| Resume, fork, clone, tree navigation, JSONL sessions, compaction | [`core/sessions.md`](core/sessions.md) | `sessions.md`, `compaction.md`, `session-format.md` |

## Integration and development

| Task | Focused guide | Upstream sources |
|---|---|---|
| Machine-readable one-shot event stream | [`integration/json.md`](integration/json.md) | `json.md` |
| Subprocess/client integration over JSONL | [`integration/rpc.md`](integration/rpc.md) | `rpc.md` |
| In-process Node.js integration | [`integration/sdk.md`](integration/sdk.md) | `sdk.md`, `session-format.md` |
| Extensions, tools, commands, hooks, state, custom UI entry points | [`development/extensions.md`](development/extensions.md) | `extensions.md`, `compaction.md`, `session-format.md` |
| Custom models, proxies, OAuth, provider registration, streaming APIs | [`development/providers.md`](development/providers.md) | `models.md`, `custom-provider.md`, `providers.md` |
| TUI components, themes, keybindings and custom rendering | [`development/tui.md`](development/tui.md) | `tui.md`, `themes.md`, `keybindings.md`, `extensions.md` |

## Safety and platforms

| Task | Focused guide | Upstream sources |
|---|---|---|
| Trust, prompt injection, permissions, secrets and isolation | [`safety/security.md`](safety/security.md) | `security.md` |
| Gondolin, Docker, OpenShell and mount/credential decisions | [`safety/containerization.md`](safety/containerization.md) | `containerization.md`, `security.md` |
| Terminal protocol, tmux, Windows, Termux and aliases | [`platform/README.md`](platform/README.md) | `terminal-setup.md`, `tmux.md`, `windows.md`, `termux.md`, `shell-aliases.md` |
| Pi source development, testing and package layout | [`development/development.md`](development/development.md) | `development.md` |

## Disclosure rules

1. Read one focused guide first.
2. Read its listed upstream document only when the guide defers an exact API/protocol/configuration detail.
3. Never read all upstream files for a normal user request.
4. Treat the upstream snapshot as authoritative for the commit recorded in `metadata.json`; for a newer installed Pi, confirm behavior against the installed package or regenerate the snapshot.
