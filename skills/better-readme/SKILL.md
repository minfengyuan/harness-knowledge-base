---
name: better-readme
description: "Use when the user wants to create a README from scratch, rewrite a weak README, improve a GitHub repo landing page, or generate a tailored open-source README based on repo contents. Triggers on: README, readme, project documentation, GitHub README, repo overview, write a README, improve README."
---

# Better README

Create a strong README for an open-source repository by grounding the draft in repo evidence, asking only for missing product facts, and selecting sections that fit the project type.

## When to Use

Use this skill when:
- the user wants a README created from scratch
- the existing README is weak, generic, outdated, or template-heavy
- the repo needs a sharper GitHub landing page

Do not use this skill when:
- the user only wants a tiny edit to one known README section
- the request is for non-README docs such as API reference, ADRs, or internal runbooks

## Default Output

- Produce one complete README draft in Markdown
- Keep a short list of unresolved factual gaps only when the repo does not contain enough evidence
- Do not write files unless the user explicitly asks for it

## Workflow

1. Inspect the repository before drafting.
2. Infer the project archetype: library, CLI, app, service, or developer tooling.
3. Extract verifiable facts from source files, manifests, examples, CI configs, license files, and docs.
4. Ask only for facts that cannot be discovered locally:
   - one-line value proposition
   - target user
   - current maturity or support status
   - key differentiators
5. Draft the README around the fastest path for a new visitor to understand and try the project.
6. Remove sections that are unsupported, repetitive, or low-value.

## Authoring Rules

- Start with a sharp explanation of what the project is and why it matters.
- Prefer proof over polish. Do not invent badges, adoption claims, roadmap items, benchmarks, compatibility matrices, or community links.
- Use the repo as the source of truth for install, run, test, and contribution steps.
- Prefer real examples over feature lists when examples exist.
- Omit empty sections entirely.
- Avoid template artifacts such as table-of-contents spam, "back to top" links, stock acknowledgments, and decorative shields with no signal.
- Keep the reading order practical:
  1. project promise
  2. quick start
  3. usage
  4. project-specific details
  5. contributing and license

## Repository Signals to Check

- Package manifests such as `package.json`, `pyproject.toml`, `Cargo.toml`, `go.mod`
- Lockfiles and tool configs
- `LICENSE`, `CONTRIBUTING`, `CODE_OF_CONDUCT`, issue templates
- `.github/workflows/` and release configs
- `Dockerfile`, `docker-compose*`, `.env.example`, deployment files
- `examples/`, `demo/`, screenshots, CLI help text, tests, and existing docs

Read [references/readme-playbook.md](references/readme-playbook.md) when you need the section matrix, repo-signal mapping, or rewrite anti-patterns.
