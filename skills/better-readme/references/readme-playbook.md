# README Playbook

Use this reference when deciding what sections to include, what evidence supports each section, and what template habits to remove.

## Quality Bar

A strong README should answer these questions fast:
- What is this project?
- Who is it for?
- Why is it better than the status quo?
- How do I run or try it right now?
- How do I contribute or evaluate project maturity?

If the README does not improve those answers, cut it.

## Archetype Matrix

### Library

Prioritize:
- what the library does
- install instructions
- minimal usage example
- API entrypoints or links to examples
- compatibility notes only if verified

Avoid:
- operations or deployment sections unless the repo actually ships a service

### CLI

Prioritize:
- install method
- first useful command
- command examples with flags
- config or auth setup if required
- platform notes only if verified

Avoid:
- generic architecture sections unless they help users extend the CLI

### App or Service

Prioritize:
- problem solved
- local setup
- run commands
- environment variables and dependencies
- screenshots or UX proof when available
- deployment or architecture notes only if the repo supports them

Avoid:
- API-style usage sections when the primary experience is interactive

### Developer Tooling

Prioritize:
- where the tool fits in a developer workflow
- installation or bootstrap
- input/output expectations
- examples on real tasks
- integration steps for common environments

Avoid:
- generic product-marketing copy with no concrete workflow fit

## Repo Signal Mapping

- Manifest files: package name, scripts, install surface, runtime versions
- `README` fragments or docs: reusable examples, terminology, constraints
- `examples/` and tests: realistic usage snippets
- CLI help output: command structure and defaults
- `LICENSE`: license section
- `CONTRIBUTING`: contribution workflow
- `.github/workflows/`: evidence of CI, release, or supported checks
- Docker and env files: setup prerequisites and run flow
- screenshots/assets: visual proof for apps and UI tools

Use these files to support claims. If the evidence is missing, ask or omit.

## Recommended Section Order

Start with the shortest useful sequence for a first-time visitor:

1. Title and one-line value proposition
2. Quick start
3. Usage or examples
4. Project-specific details
5. Contributing
6. License

Optional sections only when supported:
- status or maturity
- configuration
- architecture overview
- FAQ
- troubleshooting

## Rewrite Anti-Patterns

Remove or avoid:
- placeholder badges
- empty roadmap sections
- stock acknowledgments
- template comments or fill-in markers
- repeated content across overview, features, and usage
- oversized tables of contents for short READMEs
- decorative navigation such as "back to top"
- vague claims like "easy to use" without evidence

## Rewrite Heuristics

- Replace feature lists with one concrete example when possible.
- Convert setup prose into copy-pasteable commands.
- Move secondary detail below the quick-start path.
- Keep contributor guidance short unless the repo has a defined process.
- If the project is early or unstable, say so plainly rather than implying maturity.
