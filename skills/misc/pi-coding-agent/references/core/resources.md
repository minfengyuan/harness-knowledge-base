# Skills, prompts, packages, and resources

## When to read

Read this guide when installing or authoring a Pi Skill, prompt template, Extension package, theme, or other reusable resource.

## Resource locations

Pi discovers resources from global, project, package, settings, and explicit CLI locations. The most relevant global paths are:

```text
~/.pi/agent/skills/
~/.pi/agent/prompts/
~/.pi/agent/extensions/
~/.pi/agent/themes/
```

Project resources live under `.pi/` and are loaded only after project trust. Project and ancestor `.agents/skills/` directories are also discoverable. `--skill <path>` and `--extension <source>` explicitly load resources for a run.

## Pi Skills

A Skill is a directory containing `SKILL.md` with required `name` and `description` frontmatter. Pi exposes only names/descriptions at startup; the agent reads the full Skill on demand. `/skill:name` forces loading it. Keep the entrypoint short and put detailed material in relative `references/` files.

Security review is mandatory: Skills can instruct the model to run commands and can include executable helpers.

Use:

```bash
pi --no-skills --skill /path/to/skill
```

to test an explicitly selected Skill without normal discovery. `enableSkillCommands` controls `/skill:name` registration.

## Prompt templates

Prompt templates are Markdown files, normally under `prompts/`. The filename becomes the slash command. Frontmatter can define `description` and `argument-hint`; templates support `$1`, `$2`, `$@`, defaults, and argument slicing. Templates are prompts, not Skills: use a Skill for durable procedures and a template for reusable prompt text.

## Packages

Packages can be installed from npm, git, URLs, or local paths:

```bash
pi install <source>
pi install <source> -l       # project-local
pi list
pi update --all
pi remove <source>
pi -e <source>               # temporary extension/resource load
```

A package can expose `extensions`, `skills`, `prompts`, and `themes` through a `pi` manifest or convention directories. Review package source before installation: extensions execute arbitrary code and Skills can direct arbitrary actions.

## Reload and filtering

Use `/reload` after changing auto-discovered resources. Use `settings.json` arrays and package filters to include/exclude specific resources. Project package installation and project resources require trust.

For exact frontmatter, discovery precedence, package manifests, filtering syntax, or SDK resource-loader APIs, read the pinned `references/upstream/skills.md`, `prompt-templates.md`, `packages.md`, or `sdk.md`.
