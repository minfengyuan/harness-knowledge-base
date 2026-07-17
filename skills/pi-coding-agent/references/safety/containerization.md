# Containerization and isolation

## When to read

Read this when Pi must operate on an untrusted repository, run unattended, limit filesystem/network access, or keep host credentials outside the agent boundary.

## Choose a boundary

| Pattern | Boundary | Use when |
|---|---|---|
| Gondolin Extension | Built-in tools and `!` commands routed to a local micro-VM | Pi UI/auth should remain on host while tool execution is isolated |
| Docker | Whole Pi process | A simple local container boundary is sufficient |
| OpenShell | Whole Pi process with policy-controlled filesystem/process/network/credential access | Stronger or remote policy enforcement is needed |

Extensions themselves run wherever Pi runs. A host Pi tool-routing Extension does not automatically isolate unrelated custom Extensions.

## Credential and mount rules

- Mount only the workspace paths Pi needs.
- A read/write bind mount still lets the sandbox modify host files; use read-only mounts or copy data for stronger protection.
- Do not mount host `~/.pi/agent` unless host sessions/settings/credentials are intentionally required.
- Prefer short-lived or gateway-managed credentials.
- Restrict network access when the task does not need it.
- Review the resulting diff and outputs before importing them back into trusted systems.

For exact setup commands and runtime requirements, read the pinned `references/upstream/containerization.md`. For a full threat model, read `references/upstream/security.md`.
