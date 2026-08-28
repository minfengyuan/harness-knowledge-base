---
name: storm-research
description: Conduct source-backed topic research with a STORM-inspired workflow using parallel, adaptive multi-perspective scanning, cross-view evidence comparison, structured briefing, and confidence self-evaluation. Use for deep research, multi-angle investigations, literature or topic scans, evidence synthesis, research briefs, hidden connections, actionable recommendations, and frontier questions. Do not use for simple factual lookups.
---

# Storm Research

Investigate one research question through five independent perspectives, then synthesize their evidence into a decision-useful brief. Treat this as a STORM-inspired multi-agent research workflow, not as a reproduction of Stanford OVAL's STORM implementation.

## Prepare the scan

- State the research question, scope, time boundary, user constraints, and source standard in one shared brief.
- Infer these fields from context when safe. Ask the user only when ambiguity would materially change the research.
- Match the final response language to the user's language.
- Select exactly five topic-relevant perspectives before dispatching research.
- Ensure the five perspectives collectively cover:
  1. applied or operational reality;
  2. scholarly theory and evidence;
  3. adversarial critique and failure modes;
  4. economic incentives or system effects;
  5. historical context and path dependence.
- Use practitioner, scholar, skeptic, economist, and historian as the default roles. Rename or specialize them when topic-specific roles would produce better research, while preserving all five coverage areas.

## Phase 1: Run a parallel multi-perspective scan

This phase MUST use independent research agents running in parallel. Do not replace them with one agent role-playing every perspective.

1. Determine how many research agents the current runtime can execute concurrently.
2. Prefer one research agent per perspective when capacity permits.
3. When capacity is lower than five, start the maximum available number of research agents concurrently, with a minimum of two, and distribute the five perspectives among them without overlap.
4. Start all concurrent research agents before waiting for any result.
5. If the runtime cannot execute at least two research agents concurrently, stop and explain that the required parallel scan is unavailable. Ask whether the user permits a sequential fallback; never degrade silently.
6. Give every research agent the same shared brief and output schema. Add only its assigned perspective or perspectives. Do not reveal other agents' findings before independent scanning is complete.
7. Instruct every research agent to return:
   - core position;
   - key claims;
   - evidence for each claim with accessible source links;
   - counterevidence, limitations, and failure conditions;
   - information unique to its perspective;
   - unresolved questions;
   - explicit labels for fact, source-reported view, and inference.

Research the open web by default. Prefer primary, authoritative, and peer-reviewed sources. Verify time-sensitive claims against current sources and record relevant dates. Never invent a citation. If browsing is unavailable, say so and clearly separate user-provided evidence, model knowledge, and unsupported hypotheses.

## Phase 2: Compare the evidence

Wait for every perspective report before synthesizing.

- Build a cross-view comparison of agreements, contradictions, and complementary findings.
- Judge evidence strength by source authority, directness to the claim, recency where relevant, and independent corroboration.
- Identify consensus only where the evidence supports it.
- Preserve unresolved disagreements instead of forcing a unified conclusion.
- Identify research gaps, missing stakeholders, untested assumptions, and claims that require stronger evidence.

## Phase 3: Produce the structured brief

Order the final response as follows:

1. **Concise summary** — answer the research question directly.
2. **Ranked key findings** — order findings by importance and decision impact.
3. **Contradictions and evidence strength** — show material disagreements and why evidence differs.
4. **Consensus conclusions** — include only conclusions supported across perspectives or by strong evidence.
5. **Hidden connections** — surface non-obvious relationships derived from multiple perspectives and label them as inferences.
6. **Research gaps** — identify what remains unknown and why it matters.
7. **Actionable recommendations** — tie each recommendation to findings and note important constraints.
8. **Frontier questions** — list the highest-value next questions.
9. **Self-evaluation** — assess the brief using the rules below.

Cite sources next to the claims they support. Keep source claims distinct from synthesis and inference.

## Phase 4: Self-evaluate

- Assign high, medium, or low confidence to each major conclusion; avoid false numerical precision.
- Explain the evidence supporting each confidence rating.
- Identify weak evidence, blind spots, source limitations, and conclusions most likely to change.
- Recommend concrete next research steps that would improve confidence or resolve conflicts.
- Check that every material factual claim is traceable to a source and that no research perspective was omitted.
