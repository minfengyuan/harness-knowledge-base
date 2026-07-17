---
name: pi-coding-agent
description: "Guides agents using Pi coding-agent: install, authenticate, run, configure, automate, and extend the pi CLI. Use for interactive, print, JSON, RPC, or SDK workflows; providers, models, settings, resources, sessions, compaction, extensions, packages, and Pi security."
compatibility: Requires the Pi coding-agent CLI or the @earendil-works/pi-coding-agent package. Follow the pinned reference snapshot for version-specific behavior.
metadata:
  source: "https://github.com/earendil-works/pi/tree/main/packages/coding-agent/docs/"
  source_commit: "dcfe36c79702ec240b146c45f167ab75ecddd205"
  reference_index: "references/INDEX.md"
---

# Pi coding-agent

## Purpose

Use this skill as a routing layer for Pi coding-agent tasks. Do not load every reference at once. Start with the smallest matching guide in `references/INDEX.md`, then read an upstream snapshot only when an exact option, event, type, or protocol detail is required.

## Operating workflow

1. **Classify the request**: daily CLI use, configuration, resources, sessions, automation, extension development, UI development, security, or platform setup.
2. **Read one focused reference** from `references/` before making version-sensitive claims.
3. **Inspect the environment** when acting rather than explaining: run `pwd`, `pi --version`, and `pi --help` as needed; check the project `AGENTS.md` before changing files.
4. **Choose the smallest interface**: use the CLI for normal work, JSON for an event stream, RPC for a process/client boundary, and the SDK for in-process Node.js integration.
5. **Act with explicit scope**: state the cwd, selected model/provider, session behavior, and whether project-local resources are trusted when those affect the result.
6. **Verify**: run the requested checks, confirm the relevant Pi command/configuration, and report failures without exposing credentials.

## Fast task router

| User intent | Read first |
|---|---|
| Install, authenticate, start Pi, use files, shell commands, slash commands, or CLI flags | `references/core/usage.md` |
| Configure API keys, providers, models, settings, thinking, retries, or keybindings | `references/core/configuration.md` |
| Create or use Skills, prompt templates, or Pi packages | `references/core/resources.md` |
| Resume, fork, clone, navigate, inspect, or compact sessions | `references/core/sessions.md` |
| Consume structured events from a one-shot run | `references/integration/json.md` |
| Build a language-agnostic or subprocess client | `references/integration/rpc.md` |
| Embed Pi in a Node.js application | `references/integration/sdk.md` |
| Add tools, commands, hooks, or lifecycle behavior | `references/development/extensions.md` |
| Add a model/provider, proxy, OAuth, or custom stream | `references/development/providers.md` |
| Build custom TUI, themes, or keybindings | `references/development/tui.md` |
| Run untrusted or unattended work | `references/safety/security.md`, then `containerization.md` |
| Fix terminal, tmux, Windows, Termux, or shell behavior | `references/platform/README.md` |

## Essential facts

- The normal built-in tools are `read`, `bash`, `edit`, and `write`; `grep`, `find`, and `ls` are also available through tool options.
- Interactive mode is `pi`; one-shot mode is `pi -p`; JSON events use `pi --mode json`; JSONL client integration uses `pi --mode rpc`.
- `@path` includes a file in the prompt. In interactive mode, `!command` runs bash and sends its output to the model; `!!command` runs it without adding the output to model context.
- Context files include global `~/.pi/agent/AGENTS.md` and project/ancestor `AGENTS.md` or `CLAUDE.md`. `/reload` reloads resources and context files.
- Sessions persist under `~/.pi/agent/sessions/` by default. Use `/resume`, `/new`, `/tree`, `/fork`, `/clone`, and `/compact`, or their CLI equivalents.
- Project Trust controls loading of project-local Pi resources; it is **not** a sandbox. Pi runs with the permissions of the launching user and has no built-in sandbox.
- Skills, extensions, packages, model configuration, and project-local resources can execute or instruct arbitrary actions. Review them before enabling them.

## Safety rules

- Never print, paste, or commit API keys, OAuth tokens, `auth.json`, or secret environment values.
- Do not treat a trusted project, a skill, or a package as safe merely because Pi loaded it.
- For untrusted repositories, generated code that will run unattended, or destructive automation, recommend a container, VM, micro-VM, or policy-controlled sandbox and mount only required paths/credentials.
- Do not invent a Pi API or configuration field. Read the focused reference or the matching file in `references/upstream/`.
- Do not use RPC built-in TUI commands as if they were protocol commands; RPC clients must consume JSONL responses/events and handle `streamingBehavior` while a run is active.
- Do not load `references/upstream/` wholesale. It is a version-pinned fallback reference, not default context.

## Completion checklist

Before claiming a Pi task is complete, verify the requested mode starts, the selected provider/model is available, resource paths are correct, project trust behavior is intentional, and session/automation output matches the chosen interface. For extension or SDK work, run the relevant TypeScript/tests and read the exact upstream reference for the API being used.
