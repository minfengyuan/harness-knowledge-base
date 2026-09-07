---
name: tdd
description: Use when the user requests test-driven development, red-green-refactor, integration tests, or a test-first bug fix.
---

# Test-Driven Development

Use a test-first loop when it is part of the user's requested method or is the clearest way to specify a behavior. Tests should exercise public behavior and avoid coupling to implementation details.

## Loop

1. Identify the next observable behavior and write the smallest meaningful failing test.
2. Implement only enough to make that test pass.
3. Refactor after the behavior is green, keeping the test suite green.
4. Repeat for the important behaviors, prioritizing critical paths and meaningful failure modes rather than trying to test every edge case.

Prefer vertical slices over writing a complete test suite before understanding the implementation. Use unit, integration, or end-to-end tests according to the boundary being specified.

## Planning and completion

Use the project's vocabulary and conventions, inspect existing interfaces and tests, and preserve public behavior unless the request changes it. Confirm a product decision only when the interface or behavior is genuinely ambiguous; do not require a separate approval round for a clear task.

Before claiming completion, run the relevant tests and report what behavior they cover. If the user did not request TDD and a low-risk change is adequately verified by a focused check, do not impose a full red-green workflow.
