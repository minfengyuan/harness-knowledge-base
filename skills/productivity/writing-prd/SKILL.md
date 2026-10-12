---
name: writing-prd
description: Create or revise PRD.md product requirements documents from discussions, notes, or existing requirements using the VibeVibe PRD template. Use when the user wants a PRD draft, review-ready requirements, or updates to an existing PRD.
---

# Writing PRD

Produce a Markdown PRD grounded in the user's requirements. Use [assets/prd-template.md](assets/prd-template.md), which adapts the structure of the [VibeVibe PRD template](https://www.vibevibe.cn/Advanced/03-prd-doc-driven/00-prd-template.html) without its example product. Read the template before creating a document. Match the user's language; translate the template labels when needed.

## Establish inputs and destination

Read the relevant discussion, requirements, designs, and existing PRD before writing. Use the requested path; otherwise update an existing project PRD or follow the repository's documentation convention. If neither exists, create `PRD.md` at the project root. Avoid parallel copies of the same document. Ask about the destination only when multiple plausible targets would materially change the work.

Distinguish confirmed requirements, proposed choices, and unresolved information. Do not invent stakeholders, research findings, links, metrics, deadlines, technical commitments, or approval history. Existing implementation is evidence of current behavior, not automatic confirmation of intended requirements.

If uncertainty changes the product goal or scope, clarify it before presenting a settled specification. Use `clarifying-requirements` when available and sustained discussion is needed; otherwise ask focused questions directly. If the user requests a draft from incomplete input, write what is known and identify the gaps rather than blocking the entire document.

## Write for the current stage

Use the stage requested or supported by the available information. Do not require three separate review cycles or claim a review occurred merely because a document was generated.

- **Requirements draft:** establish purpose, audience, problem, value, scope, and the requirements list. Later sections may remain brief or pending.
- **Solution review draft:** add business and functional flows, information architecture, and interaction notes sufficient to evaluate the proposed behavior.
- **Development handoff:** resolve consequential behavior and data questions, link available design decisions, and specify relevant exceptional states, quality requirements, measurement, and delivery conditions.

For new documents, retain the template's numbered structure: document information, background and goals, solution overview, detailed solution, launch and operations, and appendix. Repeat module details only for actual requirements and adjust subsection numbering accordingly. Small projects may use short entries. Mark optional sections as not applicable with a reason when established; do not add experiments, analytics, or staged rollout just to fill the template.

For an existing PRD, preserve its valid content, IDs, terminology, and history. Map the requested changes to the template's concerns without imposing a disruptive rewrite or renumbering unrelated requirements.

## Make the requirements usable

- State the included and excluded scope explicitly. Connect user stories, requirement IDs, module details, and acceptance behavior; keep IDs stable across revisions.
- Describe observable behavior, not just feature names. For each relevant interaction, explain its starting state, trigger, result, and meaningful loading, failure, or empty states. Add acceptance examples in the module details when useful.
- Specify necessary data inputs, outputs, ownership, and persistence expectations. Link a technical design for implementation detail rather than selecting an unrequested architecture.
- Use fenced Mermaid diagrams for sufficiently known business and functional flows. Keep diagrams consistent with the prose and distinguish proposed branches from confirmed ones. Unknown flows stay pending; do not fill them with generic happy paths.
- Turn important quality goals into measurable conditions when agreed. Leave unknown targets or limits pending rather than supplying arbitrary numbers.
- Preserve uncertainty explicitly: `TBD` for unresolved content, a labeled proposal for a suggested decision, and “not applicable” for a known exclusion. Explain consequential TBDs and what decision or evidence would resolve them in the appendix. Replace template placeholders with actual content or explicit status.

Update document status and change history to reflect this revision, preserving the project's versioning convention. Record only actual changes and known authors; do not copy the template's illustrative history into the result.

## Check and deliver

Inspect the completed document for scope consistency, requirement coverage, conflicting states, invented facts, unsupported links, stale placeholders, and agreement between diagrams and text. Check Markdown tables, heading hierarchy, and Mermaid syntax; render diagrams when a suitable local renderer is available, and do not claim rendered validation when only source was inspected.

Distinguish a useful draft from a handoff-ready document. Consequential TBDs must remain visible and prevent a false claim of readiness. Report the saved path, meaningful changes, and the remaining decisions that affect the next step. Writing a PRD does not itself authorize implementation, deployment, or changes to unrelated project files.

## Sources

- [VibeVibe: PRD 编写实战](https://www.vibevibe.cn/Advanced/03-prd-doc-driven/03-prd-template-guide.html): guidance for staged writing and explicit uncertainty.
- [VibeVibe: PRD 模板](https://www.vibevibe.cn/Advanced/03-prd-doc-driven/00-prd-template.html): section and field structure used by the bundled template.
