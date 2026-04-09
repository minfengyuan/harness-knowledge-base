# markdownlint Rules Reference

This file is a condensed reference derived from the full markdownlint rules document. Use it to map diagnostics to rule intent without requiring network access.

## Formatting Rules the Script Can Safely Enforce

- `MD009`: trailing spaces
- `MD010`: hard tabs
- `MD012`: multiple consecutive blank lines
- `MD018` / `MD019`: ATX heading spacing after `#`
- `MD022`: headings surrounded by blank lines
- `MD027`: spacing after blockquote marker
- `MD030`: spaces after list markers
- `MD031`: fenced code blocks surrounded by blank lines
- `MD032`: lists surrounded by blank lines
- `MD046`: fenced code block style
- `MD047`: file ends with a single newline

## Structural Rules to Diagnose Before Editing

- `MD001`: heading levels should only increment by one level at a time
- `MD002`: first heading should be top-level
- `MD003`: consistent heading style
- `MD004`: unordered list style
- `MD005` / `MD006` / `MD007`: list indentation and positioning
- `MD011`: reversed link syntax
- `MD013`: line length
- `MD014`: shell command prefix usage
- `MD023`: headings start at the beginning of the line
- `MD024`: duplicate headings
- `MD025`: multiple top-level headings
- `MD026`: trailing punctuation in headings
- `MD028`: blank lines inside blockquotes
- `MD029`: ordered list item prefix policy
- `MD033`: inline HTML
- `MD034`: bare URLs
- `MD035`: horizontal rule style
- `MD036`: emphasis used instead of a heading
- `MD037`: spaces inside emphasis markers
- `MD038`: spaces inside code spans
- `MD039`: spaces inside link text
- `MD040`: fenced code blocks should specify a language
- `MD041`: first line should be a top-level heading

## Default Decisions for This Skill

- Prefer ATX headings.
- Prefer `-` for unordered lists.
- Preserve YAML frontmatter.
- Preserve code fence contents.
- Do not aggressively reflow paragraphs or reword content.
- If a rule requires author judgment, report it instead of forcing a rewrite.

## When To Read the Full Document

Read the full `markdownlint-rules.md` when:
- a rule parameter matters
- the user wants strict parity with markdownlint behavior
- a reported issue has edge cases involving HTML, tables, or nested block structures
