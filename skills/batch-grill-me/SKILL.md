---
name: batch-grill-me
description: Batch material design decisions into focused rounds when the user explicitly wants an exhaustive planning interview.
---

Use a design tree to expose material decisions and dependencies. Ask only questions that can change the plan; do not manufacture branches for low-impact preferences.

Work in rounds. The **frontier** is the set of decisions whose prerequisites are settled. Ask that frontier together, number the questions, give recommendations, and wait for the answers before advancing.

Each round the user answers reshapes the tree — settled decisions push the frontier outward and unblock questions that depended on them. Recompute the frontier and ask the next round. A question whose answer depends on another question still open in this round belongs to a *later* round, not this one.

Find discoverable facts from the environment yourself. Ask the user only for decisions or preferences that cannot be recovered from context. Delegate fact-finding only when it is useful and authorized; otherwise inspect it directly.

Finish when the material decisions are settled and the remaining assumptions are explicit. Do not enact a plan until the user confirms shared understanding when this skill was explicitly invoked as a pre-implementation interview.
