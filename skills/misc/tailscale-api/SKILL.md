---
name: tailscale-api
description: "Tailscale REST API v2 (api.tailscale.com/api/v2) — devices, keys, ACL, DNS, webhooks, OAuth scopes. Use for managing tailnet objects over HTTP."
license: MIT
metadata:
  version: 1.0.0
  author: Hermes Agent
  platforms: [linux, macos, windows]
  hermes:
    tags: [tailscale, api, rest, tailnet, devices, acl, dns, webhooks, oauth]
    category: devops
    related_skills: [tailscale-cli]
  prerequisites:
    commands: [curl, jq]
---

# Tailscale REST API Reference

> Control-plane HTTP API for managing tailnets, devices, keys, DNS, ACL policy, users, webhooks. Mostly RESTful, JSON in/out, no pagination.
> Base URL: `https://api.tailscale.com/api/v2`

## When to use this skill

| Task | Use |
|---|---|
| Manage tailnet objects over HTTP (devices, keys, ACL, DNS, users, invites, webhooks…) | **This skill** |
| Control the local tailscaled daemon (`up`/`down`/`status`/`serve`/`cert`…) | `tailscale-cli` skill |
| Provision a node | CLI `tailscale up --auth-key=<key from this API's POST /tailnet/{tailnet}/keys>` |

## Ground truth & keeping current

- Interactive docs (Scalar UI): <https://tailscale.com/api-docs> · static reference: <https://tailscale.com/docs/reference/tailscale-api>
- **Official OpenAPI 3.1.0 spec (YAML)**: `curl -s "https://api.tailscale.com/api/v2?outputOpenapiSchema=true" > tailscale-openapi.yaml`
- API endpoints are stable unless noted in the spec; the **spec file itself is unstable** and may change without notice. When in doubt, re-download and diff.
- The `references/` files were generated from this spec (Aug 2026) and include per-endpoint params, schemas, and OAuth scopes.

## Conventions

- `{tailnet}` path segment: `-` = default tailnet of the calling token (best for most callers); otherwise the **Tailnet ID** (e.g. `T1234CNTRL`, from admin console → General Settings) is the preferred identifier. Legacy IDs (tailnet names) still work for tailnets created before Oct 2025. Org-scoped ops use `/organizations/{organization}/tailnets` (`-` = token's org).
- Auth header: `Authorization: Bearer <token>`. Tokens also work as HTTP Basic **username** with empty password (`curl -u "tskey-api-xxx:"`).
- **No pagination** — every list endpoint returns all results at once.
- Errors: standard HTTP status codes + JSON body `{"message": "…"}`. Common: `400` bad input, `401` bad/missing token, `403` insufficient scope, `404` not found / wrong `{tailnet}`, `429` rate-limited, `500`/`504` server side.
- Most `POST` endpoints have **full-replace semantics** ("set"); `PATCH` endpoints do partial updates. Send the complete desired state on POSTs.
- OAuth-scoped tokens must hold the scope each endpoint lists (e.g. `devices:core`); owner-role access tokens skip scope checks.

## Authentication — pick the right credential

| | Access token (API key) | Trust credential |
|---|---|---|
| Prefix | `tskey-api-` | `tskey-client-` (OAuth client secret) |
| Created via | Admin console → Settings → Keys | Admin console OAuth apps, or `POST /tailnet/{tailnet}/oauth-apps` |
| Permissions | Same as owning user (Owner/Admin/IT admin/Network admin) | Scoped: grant only the scopes needed |
| Expiry | 1–90 days, then rotate | Non-expiring; mints short-lived access tokens on demand |
| Best for | Quick scripts, personal automation | Services/CI, least-privilege long-running automation |
| API-visible | — | `POST /tailnet/{tailnet}/keys` with `keyType` + `scopes` |

Deep dive (creation steps, full 40-scope list, federated identities, trust-credential token flow): `references/authentication.md`.

## Endpoint map (93 operations)

| Reference file | Resource groups (op count) | Typical use |
|---|---|---|
| `references/devices.md` | Devices (15) · Device invites (6) · Device posture (5) | list/rename/tag devices, set routes & IP, authorize, posture attributes |
| `references/keys-users.md` | Keys (5) · Users (7) · User invites (5) · Contacts (3) | create/revoke auth keys, approve/suspend/delete users |
| `references/dns-logging.md` | DNS (11) · Logging (8) | nameservers, MagicDNS, split DNS, search paths, log streaming |
| `references/policy-and-settings.md` | Policy file (4) · Tailnet settings (2) · Organizations (3) | ACL get/set/validate/preview, device approval, tailnet lifecycle |
| `references/webhooks-services-oauth.md` | Webhooks (7) · Services (7) · OAuth apps (5) | Slack/Discord notifications, service catalog, OAuth app CRUD |

Each entry lists method, path, purpose, params, request/response schemas, required OAuth scope, and notable behavior. Use `references/` for anything beyond the recipes below.

## Quick recipes

```bash
TS_API_TOKEN=tskey-api-xxxxx
TS_BASE=https://api.tailscale.com/api/v2
AUTH="Authorization: Bearer $TS_API_TOKEN"
TAILNET="-"          # or tailnet-name

# List devices (fields=all|default)
curl -s -H "$AUTH" "$TS_BASE/tailnet/$TAILNET/devices?fields=all" | jq '.devices[] | {name, hostname, addresses}'

# Create auth key: reusable, preauthorized, tagged, 1h expiry (key returned ONCE — save it)
curl -s -X POST -H "$AUTH" \
  -d '{"keyType":"auth","capabilities":{"devices":{"create":{"reusable":true,"ephemeral":false,"preauthorized":true,"tags":["tag:server"]}}},"expirySeconds":3600,"description":"ci"}' \
  "$TS_BASE/tailnet/$TAILNET/keys" | jq -r '.key'

# Set device tags / rename device
curl -s -X POST -H "$AUTH" -d '{"tags":["tag:ssh","tag:server"]}' "$TS_BASE/device/$DEVICE_ID/tags"
curl -s -X POST -H "$AUTH" -d '{"name":"db-1"}' "$TS_BASE/device/$DEVICE_ID/name"

# Set policy file (raw huJSON) — POST replaces the whole file
curl -s -X POST -H "$AUTH" -H "Content-Type: application/hujson" \
  --data-binary @policy.hujson "$TS_BASE/tailnet/$TAILNET/acl"
# (application/json with a parsed object is also accepted)

# Enable MagicDNS
curl -s -X POST -H "$AUTH" -d '{"magicDNS":true}' "$TS_BASE/tailnet/$TAILNET/dns/preferences"

# Suspend a user
curl -s -X POST -H "$AUTH" "$TS_BASE/users/$USER_ID/suspend"

# Create a Slack webhook
curl -s -X POST -H "$AUTH" \
  -d '{"endpointUrl":"https://hooks.slack.com/...","providerType":"slack","subscriptions":["nodeCreated","nodeDeleted"]}' \
  "$TS_BASE/tailnet/$TAILNET/webhooks"
```

Helper script: `scripts/tsapi.sh METHOD PATH [JSON_BODY]` — wraps base URL + bearer auth via env `TS_API_TOKEN` (and `TS_TAILNET` for convenience).

## Pitfalls

- `GET /api/v2/tailnet` **without** a `{tailnet}` segment returns 404 even with valid auth; device/user list paths need the segment. Unauthenticated → 401.
- `deviceId`: prefer the device's `nodeId`; the numeric `id` also works but `nodeId` is the documented preference.
- `POST /device/{deviceId}/ip` pins a specific IPv4 (CGNAT `100.64.0.0/10` range) and **breaks all existing connections** to the node; reconnect at the new IP and flush DNS caches.
- Custom device posture attributes MUST use the `custom:` key prefix (max 128 chars); only custom-namespace attributes are user-settable.
- Auth-key capabilities nest under `capabilities.devices.create.{reusable,ephemeral,preauthorized,tags}`; `tags` only applies to auth keys. OAuth/trust credentials use `scopes` instead.
- Webhook `providerType` enum: `slack` | `mattermost` | `googlechat` | `discord`; `subscriptions` must be from the topic enum (full list in `references/webhooks-services-oauth.md`).
- DNS nameservers / search paths / split DNS / device routes: `POST` replaces the entire set — always send the full desired list (routes are `"10.0.0.0/24,10.1.0.0/24"` comma-joined strings).
- Deleting a device you only share into (node sharing) is not supported.
- The API is available on all plans; generate tokens from the console Keys page (1–90 day expiry).

## Verification

```bash
# token + base URL sanity check → expect 200, not 401
curl -s -o /dev/null -w "%{http_code}\n" -H "$AUTH" "$TS_BASE/tailnet/-/devices"

# same check via the bundled helper (requires TS_API_TOKEN; TS_TAILNET optional)
scripts/tsapi.sh GET /tailnet/-/devices | jq '.devices | length'   # → device count
```
