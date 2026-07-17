# Pi source development

## When to read

Read this only when modifying or testing the Pi source repository itself, not when merely configuring an installed Pi.

The source repository is a monorepo with `packages/ai`, `packages/agent`, `packages/tui`, and `packages/coding-agent`. The documented setup is:

```bash
git clone https://github.com/earendil-works/pi.git
cd pi
npm install
npm run build
```

Use the repository's source configuration helpers for package assets rather than hardcoding module-relative paths. Run the documented non-LLM tests or package tests before claiming a source change is complete.

For exact source layout, test commands, and rebranding/configuration details, read `references/upstream/development.md`.
