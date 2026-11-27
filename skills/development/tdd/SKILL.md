---
name: tdd
description: Use when the user requests test-driven development, red-green-refactor, integration tests, or a test-first bug fix where an executable regression test is practical.
---

# Test-Driven Development

Use a test-first loop when requested by the user or when a focused failing test is the clearest, lowest-cost way to drive a bug fix or behavior change. Tests should verify observable behavior at public boundaries (seams) so they survive internal refactors.

## Loop

Work in **vertical slices** (one behavior, one failing test, one minimal implementation, repeat), not horizontal slices (writing all tests before any implementation):

1. **Red:** Write the smallest test for the next observable behavior at a real public interface.
2. **Verify failure:** Run the test before editing production code and confirm it fails for the intended reason. If it passes or fails for an unrelated reason, fix the test first.
3. **Green:** Implement only enough code to pass the test, preserving nearby contracts.
4. **Refactor:** Clean up duplication or structure after tests pass, keeping the suite green (see [refactor candidates](refactoring.md)).
5. **Repeat** for the remaining critical paths and meaningful failure modes rather than chasing speculative edge cases.

## When a Test Is Impractical

Prefer no new test over a bad test. If a regression test would require heavy mocks, slow end-to-end infrastructure, broad unrelated fixture churn, or production-only state for a small change, skip adding a brittle test and use the closest executable verification instead (a targeted script, CLI reproduction, browser check, or focused integration run). If the user did not request TDD and a low-risk change is adequately verified by an existing focused check, do not impose a full red-green cycle.

## Guardrails

- **No implementation-coupled tests:** Do not mock internal collaborators, test private methods, or assert on internal call counts or side channels when a public seam exists.
- **No tautological assertions:** Never compute expected values using the same formula or logic as the implementation under test; derive expectations from an independent literal, worked example, or specification.
- **Protect existing contracts:** Do not weaken or rewrite tests just to match a broken implementation.
- **Keep project vocabulary:** Follow existing test layout, naming conventions, and domain terms.

## Completion

Report the evidence, not just the outcome:

- Name the failing-before test or executable check and the failure it produced (or explain why failing-before could not be demonstrated and what check was used instead).
- Name the passing-after test run and any regression checks performed.

## Further resources

- [Good and bad tests](tests.md)
- [Interface design for testability](interface-design.md)
- [When to mock](mocking.md)
- [Refactor candidates](refactoring.md)
- [Deep modules](deep-modules.md)
