# Security and project trust

## When to read

Read this before running Pi on an untrusted repository, enabling project-local resources, installing a package, or automating work without continuous review.

## Trust is not isolation

Project Trust controls whether Pi loads project-local settings, skills, prompts, themes, packages, extensions, and system prompt files. It does not restrict what already-running Pi can read, write, execute, or send to a provider.

Pi has no built-in sandbox. Built-in tools, Extensions, Skills, package installs, shell commands, tests, and language servers run with the permissions of the Pi process.

Repository files, comments, docs, context files, build output, Skills, and model output can contain prompt injection. Treat loaded instructions as untrusted input until reviewed.

## Safe operating rules

- Inspect project-local `.pi/` and `.agents/skills/` resources before trusting them.
- Never expose `~/.pi/agent/auth.json`, OAuth tokens, API keys, or secret environment values.
- Pass only the minimum credentials needed for a task.
- Use `--no-approve` when project-local resources should be ignored for one run; use `--approve` only when intentionally trusting them.
- Review diffs and command output before copying results to trusted systems.
- Do not run destructive or unattended work on the host merely because a project was trusted.

For actual isolation, continue to `references/safety/containerization.md`.
For exact trust resolution and non-interactive behavior, read the pinned `references/upstream/security.md` and `usage.md`.
