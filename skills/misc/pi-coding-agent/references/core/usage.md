# Core usage

## When to read

Read this guide for normal CLI operation: installing Pi, authenticating, starting a session, sending prompts, using files/shell commands, selecting a model, and choosing a run mode.

## First-run flow

```bash
npm install -g --ignore-scripts @earendil-works/pi-coding-agent
cd /path/to/project
pi
```

Authenticate interactively with `/login`, or provide a provider key through its environment variable before starting Pi. Do not put real credentials in prompts, project files, skills, or shell history.

The default agent tools are:

- `read` — inspect files
- `write` — create or overwrite files
- `edit` — exact text replacement
- `bash` — run shell commands

`grep`, `find`, and `ls` can be enabled through tool options. Pi works in the current working directory and has the permissions of the launching user.

## Choose a mode

| Need | Command |
|---|---|
| Human-guided interactive work | `pi` |
| One prompt and plain output | `pi -p "..."` |
| JSON event stream for scripts | `pi --mode json "..."` |
| Long-lived JSONL client process | `pi --mode rpc` |
| In-process Node.js integration | Use the SDK; read `references/integration/sdk.md` |

Useful examples:

```bash
pi "Summarize this repository and tell me how to run its checks."
pi @README.md "Summarize this file"
pi @src/app.ts @src/app.test.ts "Review these together"
cat README.md | pi -p "Summarize this text"
pi --provider openai --model gpt-4o "Help me refactor"
pi --tools read,grep,find,ls -p "Review the code without modifying it"
```

Use `@path` to attach files. In interactive mode, `!command` executes bash and adds the result to model context; `!!command` executes it without adding the result to context. Prefer Pi's `read` tool for inspecting files rather than `cat`/`sed` when the model is operating inside Pi.

## Sessions and prompts

Sessions save automatically unless `--no-session` is used:

```bash
pi -c                         # continue the most recent session
pi -r                         # browse previous sessions
pi --name "release audit"    # name a session
pi --session <path-or-id>     # open a specific session
```

Interactive commands include `/model`, `/settings`, `/resume`, `/new`, `/tree`, `/fork`, `/clone`, `/compact`, `/reload`, `/session`, `/export`, and `/quit`. See `references/core/sessions.md` for branch and compaction behavior.

While the agent is working:

- Enter queues a steering message.
- Alt+Enter queues a follow-up after the agent settles.
- Escape aborts and restores queued messages.

Use `steeringMode` and `followUpMode` in settings when a client needs `all` or `one-at-a-time` delivery.

## Project context and trust

Pi loads `~/.pi/agent/AGENTS.md` and `AGENTS.md`/`CLAUDE.md` from parent directories and the current directory. It can also load `.pi/SYSTEM.md` or `APPEND_SYSTEM.md` and project resources after trust is resolved. Run `/reload` after changing context files.

Project Trust decides whether project-local settings, packages, extensions, skills, prompts, themes, and system prompt files load. Trust is an input-loading guard, not a sandbox. For untrusted work, read `references/safety/security.md` before proceeding.

## CLI controls

- `--provider`, `--model`, `--thinking` select model behavior.
- `--tools`, `--exclude-tools`, `--no-builtin-tools`, and `--no-tools` control tool access.
- `--skill`, `--no-skills`, `--extension`, and `--no-extensions` control resources.
- `--approve`/`--no-approve` override project trust for one run.
- `--no-session` avoids persistence; `--session-dir` changes storage.
- `--print`, `--mode json`, and `--mode rpc` are non-interactive modes.

For the complete flag list, read the pinned `references/upstream/usage.md` and `quickstart.md`.
