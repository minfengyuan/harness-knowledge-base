---
name: verification-before-completion
description: Use before claiming a change is complete, fixed, or passing; require fresh evidence appropriate to the claim.
---

# Verification Before Completion

Make claims from current evidence, not confidence or an earlier agent's report.

## Gate

1. State what must be true for the claim.
2. Run the smallest complete command or inspection that can establish it.
3. Read the result and check the exit status, failures, and relevant diff.
4. Report the actual status, including limitations or unresolved failures.

Match verification to the change:

- tests or a reproduction for behavior and bug fixes;
- a build or type check when compilation or packaging is affected;
- lint or formatting checks when those rules are part of the project contract;
- link, structure, or static checks for documentation and instruction changes;
- independent diff and state inspection after delegated work.

Do not rerun broad or identical checks without a new change, failure, or unresolved concern that justifies them. Passing one check does not prove unrelated requirements.
