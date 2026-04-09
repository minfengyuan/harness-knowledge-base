---
name: markdown-formatter
description: "Format or restyle Markdown files to markdownlint-style conventions. Use when Codex needs to clean up `.md` or `.markdown` files, normalize headings, lists, spacing, fenced code blocks, or surrounding blank lines, or make Markdown more consistent without changing meaning. Triggers on: markdown formatting, markdown restyling, markdownlint style, clean up README formatting, normalize markdown."
---

# Markdown Formatter

## Overview

Use this skill to safely rewrite Markdown into a cleaner, markdownlint-style shape without making semantic edits that could change the author's intent.

Start with the helper script, then use the bundled reference for ambiguous cases or for rules that should only be diagnosed.

## Workflow

1. Inspect the requested Markdown files and confirm whether the user wants direct rewrites or a preview.
2. Run `scripts/markdown_formatter.py` first:
   ```bash
   python3 skills/markdown-formatter/scripts/markdown_formatter.py path/to/file.md
   ```
3. Use preview mode when the user wants a dry run:
   ```bash
   python3 skills/markdown-formatter/scripts/markdown_formatter.py --check path/to/file.md
   python3 skills/markdown-formatter/scripts/markdown_formatter.py --diff path/to/file.md
   ```
4. Read [references/markdownlint-rules-summary.md](references/markdownlint-rules-summary.md) first for the condensed local guide. Read [references/markdownlint-rules.md](references/markdownlint-rules.md) for the exact fetched upstream snapshot when a rule parameter or edge case matters.
5. Report unresolved diagnostics after safe rewrites instead of forcing structural or semantic changes.

## Default Style Choices

- Prefer ATX headings.
- Use a single space after heading markers.
- Use `-` for unordered list markers.
- Surround headings, lists, and fenced code blocks with blank lines when the rewrite is deterministic.
- Keep exactly one trailing newline at end of file.
- Do not aggressively wrap paragraphs or reorder content unless the user explicitly asks for that.

## Safety Rules

- Preserve YAML frontmatter.
- Preserve code fence contents verbatim.
- Preserve links, inline HTML, and embedded snippets unless the user explicitly asks to rewrite them.
- Prefer safe autofix plus diagnostics over best-effort semantic cleanup.
- Treat heading hierarchy problems, duplicate headings, and similar structural issues as diagnostics unless the user asks for those edits.

## Script Behavior

`markdown_formatter.py` is intentionally conservative.

- Safe rewrites:
  - trim trailing whitespace while preserving intentional two-space hard breaks
  - convert leading tabs used for indentation outside code fences
  - collapse repeated blank lines outside code fences
  - normalize heading marker spacing
  - normalize unordered list marker style and spacing
  - normalize simple blockquote spacing
  - ensure a single trailing newline
- Diagnostics only:
  - heading level jumps
  - duplicate headings
  - multiple H1 headings
  - any rewrite that would likely change meaning or structure

## Output Expectations

- If the script rewrites files, summarize what changed.
- If `--check` or `--diff` is used, report whether safe rewrites are pending.
- If diagnostics remain, include the rule IDs and line numbers from the script output.
- If the request is broader than safe autofix, explain which changes require manual judgment.

## Resources

- `scripts/markdown_formatter.py`: safe markdownlint-style formatter and checker
- `references/markdownlint-rules-summary.md`: condensed local rule guide
- `references/markdownlint-rules.md`: exact upstream rules snapshot fetched from markdownlint
