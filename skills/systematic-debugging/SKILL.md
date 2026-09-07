---
name: systematic-debugging
description: Use when a bug, test failure, or unexpected behavior needs evidence-based diagnosis before a fix.
---

# Systematic Debugging

Find enough evidence to distinguish the root cause from the symptom, then make the smallest justified fix and verify it. Scale the investigation to the failure; do not apply a fixed ceremony to every issue.

## Workflow

1. Capture the exact failure, environment, recent changes, and reliable reproduction if available.
2. Trace the affected data or control flow to the boundary where observed behavior diverges from expected behavior.
3. Form a specific hypothesis and test it with the smallest useful diagnostic or change. Keep competing hypotheses separate.
4. Add or update a regression test when the behavior is testable and the test provides durable value.
5. Apply the narrow fix, run the failing check, and run related regression checks justified by the change.
6. If the evidence disproves the hypothesis, revise it rather than stacking unrelated fixes. If repeated attempts expose a design problem, pause and report the architectural decision needed.

## Evidence standards

- Read the complete error and relevant stack trace; do not infer a cause from one symptom.
- Compare a failing path with a known-good path when one exists.
- Inspect configuration, inputs, state propagation, and boundary conditions that can explain the failure.
- Use focused instrumentation or one-off probes when they reduce uncertainty; remove temporary diagnostics unless they are intentionally part of the fix.
- Keep unrelated refactors out of the debugging change.

## Completion

Report the reproduction or diagnostic evidence, root cause, changed files, checks run, and any unresolved uncertainty. Use the tdd skill when the user requests test-first development or when a regression test is the clearest way to drive the fix.
