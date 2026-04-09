#!/usr/bin/env python3
"""Format Markdown files with safe markdownlint-style rewrites."""

from __future__ import annotations

import argparse
import difflib
import re
import sys
from dataclasses import dataclass
from pathlib import Path


MARKDOWN_SUFFIXES = {".md", ".markdown"}
FENCE_PATTERN = re.compile(r"^[ ]{0,3}(```+|~~~+)")
HEADING_PATTERN = re.compile(r"^[ ]{0,3}(#{1,6})(.*)$")
LIST_PATTERN = re.compile(r"^([ ]*)([-+*])([ \t]+)(.*)$")
BLOCKQUOTE_PATTERN = re.compile(r"^([ ]*)>([ \t]*)(.*)$")


@dataclass(frozen=True)
class Issue:
    rule: str
    line: int
    message: str


@dataclass(frozen=True)
class FormatResult:
    text: str
    issues: list[Issue]


def collect_markdown_paths(raw_paths: list[str]) -> list[Path]:
    """Expand file and directory arguments into a sorted list of Markdown files."""
    paths: set[Path] = set()
    for raw_path in raw_paths:
        path = Path(raw_path)
        if path.is_dir():
            for child in sorted(path.rglob("*")):
                if child.is_file() and child.suffix.lower() in MARKDOWN_SUFFIXES:
                    paths.add(child)
        elif path.is_file() and path.suffix.lower() in MARKDOWN_SUFFIXES:
            paths.add(path)
    return sorted(paths)


def line_has_hard_break_spaces(line: str) -> bool:
    stripped = line.rstrip(" \t")
    trailing = line[len(stripped) :]
    return bool(stripped) and trailing.endswith("  ") and "\t" not in trailing


def trim_trailing_whitespace(line: str) -> str:
    if line_has_hard_break_spaces(line):
        return line
    return line.rstrip(" \t")


def normalize_heading(line: str) -> str:
    match = HEADING_PATTERN.match(line)
    if not match:
        return line
    hashes, remainder = match.groups()
    content = remainder.strip()
    return hashes if not content else f"{hashes} {content}"


def normalize_list_item(line: str) -> str:
    match = LIST_PATTERN.match(line)
    if not match:
        return line
    indent, _marker, _spacing, content = match.groups()
    return f"{indent}- {content.lstrip()}"


def normalize_blockquote(line: str) -> str:
    match = BLOCKQUOTE_PATTERN.match(line)
    if not match:
        return line
    indent, spacing, content = match.groups()
    if not content and not spacing:
        return f"{indent}>"
    return f"{indent}> {content.lstrip()}"


def is_frontmatter_boundary(line: str) -> bool:
    return line == "---"


def is_blank(line: str) -> bool:
    return line.strip() == ""


def is_heading(line: str) -> bool:
    return bool(HEADING_PATTERN.match(line))


def is_list_item(line: str) -> bool:
    return bool(LIST_PATTERN.match(line))


def is_fence(line: str) -> bool:
    return bool(FENCE_PATTERN.match(line))


def is_blockquote(line: str) -> bool:
    return bool(BLOCKQUOTE_PATTERN.match(line))


def safe_normalize_line(line: str) -> str:
    line = re.sub(r"^\t+", lambda match: "    " * len(match.group(0)), line)
    line = trim_trailing_whitespace(line)
    line = normalize_heading(line)
    line = normalize_list_item(line)
    line = normalize_blockquote(line)
    return line


def normalize_lines(lines: list[str]) -> list[str]:
    result: list[str] = []
    in_frontmatter = False
    in_fence = False

    for index, raw_line in enumerate(lines):
        line = raw_line

        if index == 0 and is_frontmatter_boundary(line):
            in_frontmatter = True
            result.append(line)
            continue

        if in_frontmatter:
            result.append(line)
            if is_frontmatter_boundary(line):
                in_frontmatter = False
            continue

        if is_fence(line):
            line = trim_trailing_whitespace(line)
            in_fence = not in_fence
            result.append(line)
            continue

        if in_fence:
            result.append(line)
            continue

        result.append(safe_normalize_line(line))

    return collapse_blank_lines(result)


def collapse_blank_lines(lines: list[str]) -> list[str]:
    result: list[str] = []
    in_frontmatter = False
    in_fence = False
    previous_blank = False

    for index, line in enumerate(lines):
        if index == 0 and is_frontmatter_boundary(line):
            in_frontmatter = True
            result.append(line)
            previous_blank = False
            continue

        if in_frontmatter:
            result.append(line)
            if is_frontmatter_boundary(line):
                in_frontmatter = False
            previous_blank = False
            continue

        if is_fence(line):
            in_fence = not in_fence
            result.append(line)
            previous_blank = False
            continue

        if in_fence:
            result.append(line)
            previous_blank = False
            continue

        if is_blank(line):
            if previous_blank:
                continue
            result.append("")
            previous_blank = True
            continue

        result.append(line)
        previous_blank = False

    return result


def classify_line(line: str) -> str:
    if is_blank(line):
        return "blank"
    if is_heading(line):
        return "heading"
    if is_fence(line):
        return "fence"
    if is_list_item(line):
        return "list"
    if is_blockquote(line):
        return "blockquote"
    return "other"


def add_block_spacing(lines: list[str]) -> list[str]:
    result: list[str] = []
    in_frontmatter = False
    in_fence = False

    for index, line in enumerate(lines):
        if index == 0 and is_frontmatter_boundary(line):
            in_frontmatter = True
            result.append(line)
            continue

        if in_frontmatter:
            result.append(line)
            if is_frontmatter_boundary(line):
                in_frontmatter = False
            continue

        current_type = classify_line(line)
        previous_type = classify_line(result[-1]) if result else "blank"

        if not in_fence and current_type in {"heading", "list", "fence"}:
            if result and previous_type != "blank":
                result.append("")

        result.append(line)

        if current_type == "fence":
            in_fence = not in_fence

        if in_fence or current_type == "blank":
            continue

        next_line = lines[index + 1] if index + 1 < len(lines) else None
        next_type = classify_line(next_line) if next_line is not None else "blank"

        if current_type == "heading" and next_type != "blank":
            result.append("")
        elif current_type == "fence" and next_type != "blank":
            result.append("")
        elif current_type == "list" and next_type not in {"blank", "list"}:
            result.append("")

    return collapse_blank_lines(result)


def detect_issues(lines: list[str]) -> list[Issue]:
    issues: list[Issue] = []
    seen_headings: dict[str, int] = {}
    heading_level = 0
    h1_count = 0

    for line_number, line in enumerate(lines, start=1):
        if is_fence(line) or is_blank(line):
            continue

        heading_match = HEADING_PATTERN.match(line)
        if not heading_match:
            continue

        level = len(heading_match.group(1))
        title = heading_match.group(2).strip().lower()

        if heading_level and level > heading_level + 1:
            issues.append(
                Issue("MD001", line_number, "Heading levels should only increment by one level.")
            )
        heading_level = level

        if title in seen_headings:
            issues.append(Issue("MD024", line_number, "Heading text is duplicated."))
        else:
            seen_headings[title] = line_number

        if level == 1:
            h1_count += 1
            if h1_count > 1:
                issues.append(Issue("MD025", line_number, "Document has multiple top-level headings."))

    return issues


def format_markdown(text: str) -> FormatResult:
    lines = text.splitlines()
    normalized = normalize_lines(lines)
    spaced = add_block_spacing(normalized)
    issues = detect_issues(spaced)
    formatted = "\n".join(spaced) + "\n"
    return FormatResult(text=formatted, issues=issues)


def format_file(path: Path) -> tuple[FormatResult, str]:
    original = path.read_text()
    return format_markdown(original), original


def unified_diff(path: Path, original: str, updated: str) -> str:
    return "".join(
        difflib.unified_diff(
            original.splitlines(keepends=True),
            updated.splitlines(keepends=True),
            fromfile=str(path),
            tofile=str(path),
        )
    )


def print_issues(path: Path, issues: list[Issue]) -> None:
    for issue in issues:
        print(f"{path}:{issue.line}: {issue.rule} {issue.message}")


def parse_args(argv: list[str]) -> argparse.Namespace:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("paths", nargs="+", help="Markdown files or directories to format.")
    parser.add_argument(
        "--check",
        action="store_true",
        help="Check for safe rewrites or remaining issues without writing files.",
    )
    parser.add_argument(
        "--diff",
        action="store_true",
        help="Show a unified diff of safe rewrites without editing files.",
    )
    return parser.parse_args(argv)


def main(argv: list[str] | None = None) -> int:
    args = parse_args(argv or sys.argv[1:])
    paths = collect_markdown_paths(args.paths)
    if not paths:
        print("No Markdown files found.", file=sys.stderr)
        return 1

    exit_code = 0
    preview_only = args.check or args.diff

    for path in paths:
        result, original = format_file(path)
        changed = result.text != original

        if args.diff and changed:
            sys.stdout.write(unified_diff(path, original, result.text))

        if result.issues:
            print_issues(path, result.issues)

        if preview_only:
            if changed:
                print(f"{path}: safe rewrites available")
                exit_code = 1
            if result.issues:
                exit_code = 1
            continue

        if changed:
            path.write_text(result.text)
            print(f"rewrote {path}")
        if result.issues:
            exit_code = 1

    return exit_code


if __name__ == "__main__":
    raise SystemExit(main())
