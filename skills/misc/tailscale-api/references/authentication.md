# Authentication & API Conventions

> Curated from the official OpenAPI spec (`https://api.tailscale.com/api/v2?outputOpenapiSchema=true`), the docs reference page, and kb articles. Verified Aug 2026.

## 1. Credential types at a glance

| | Access token (API key) | OAuth client (trust credential) | Federated identity (trust credential) |
|---|---|---|---|
| Prefix | `tskey-api-` | `tskey-client-` | n/a (OIDC) |
| Owner | Individual user | Tailnet (no single user) | Tailnet (no single user) |
| Permissions | Identical to owning user | Scopes granted at creation | Scopes + OIDC claim rules |
| Expiry | 1–90 days (mandatory) | None | None |
| Created via | Console → Settings → Keys | Console OAuth apps, or `POST /tailnet/{tailnet}/oauth-apps` | `POST /tailnet/{tailnet}/keys` with `keyType`, `issuer`, `subject`, `audience`, `customClaimRules` |
| Produces | — | Short-lived access tokens on demand | Short-lived access tokens on demand |

## 2. Creating an access token (manual steps)

1. Sign in to the admin console (login.tailscale.com); the account must hold an **Owner, Admin, IT admin, or Network admin** role on the tailnet.
2. Go to **Settings → Keys** and generate an API access token; pick an expiry between 1 and 90 days.
3. Tokens are **case-sensitive** and expire automatically. Recently expired and revoked tokens remain visible on the Keys page.
4. Use it in every request (Bearer preferred):

```bash
curl -H "Authorization: Bearer tskey-api-xxxxx" https://api.tailscale.com/api/v2/...
# equivalent basic-auth form (username = token, password empty):
curl -u "tskey-api-xxxxx:" https://api.tailscale.com/api/v2/...
```

## 3. Trust credentials (delegated, least-privilege)

- Trust credentials **don't expire** and are **not tied to a user**; they mint short-lived access tokens with only the granted scopes. Recommended for services and CI. Details: kb/1623 (trust credentials), kb/1215 (OAuth clients), kb/1581 (federated identities).
- OAuth client CRUD is available via the API (`references/webhooks-services-oauth.md`, OAuthApps group).
- Device-provisioning OAuth apps accept `allowedNodeAttributes`: an array of custom node attributes (each prefixed `custom:`) auto-assigned to every device provisioned through the app — referenceable from device posture `srcPosture` conditions and grants.

## 4. OAuth scopes (40 total, extracted from operation descriptions)

| Domain | Scopes |
|---|---|
| Meta | `all` |
| Tailnets | `tailnets`, `tailnets:read` |
| Devices | `devices:core`, `devices:core:read`, `devices:routes`, `devices:routes:read`, `devices:posture_attributes`, `devices:posture_attributes:read` |
| Device invites | `device_invites`, `device_invites:read` |
| Keys | `auth_keys`, `auth_keys:read`, `oauth_keys`, `oauth_keys:read`, `federated_keys`, `federated_keys:read`, `api_access_tokens`, `api_access_tokens:read` |
| Users | `users`, `users:read` |
| Policy file | `policy_file`, `policy_file:read` |
| Networking/DNS | `networking_settings`, `networking_settings:read`, `feature_settings`, `feature_settings:read` |
| Account | `account_settings`, `account_settings:read` |
| Logging | `log_streaming`, `log_streaming:read`, `logs:configuration:read`, `logs:network`, `logs:network:read` |
| Services | `services`, `services:read` |
| Webhooks | `webhooks`, `webhooks:read` |
| OAuth apps | `oauth_apps`, `oauth_apps:read` |

Each operation in the reference files lists its required scope (e.g. `OAuth Scope: devices:core`). The `:read` variant covers GETs; the bare scope covers mutations.

## 5. Error & request conventions

- Status codes follow HTTP conventions; bodies may carry `{"message": "…"}`.
- `401` — missing/invalid token · `403` — token lacks required scope/role · `404` — unknown resource **or** missing `{tailnet}` segment (e.g. bare `/api/v2/tailnet` always 404s) · `429` — rate limit (back off and retry; exact limits are not documented in the spec).
- **No pagination** anywhere; lists return complete results.
- `POST` = replace ("set"); `PATCH` = partial update. Send full state on POSTs.
- Policy file accepts two content types: `application/hujson` (raw huJSON string) or `application/json` (parsed object).

## 6. `{tailnet}` and ID conventions

- `{tailnet}`: `-` (default tailnet of the calling token), the **Tailnet ID** (e.g. `T1234CNTRL`, from admin console → General Settings — preferred identifier), or a legacy tailnet name (pre-Oct-2025 tailnets).
- `{deviceId}`: prefer the device's `nodeId`; the numeric `id` is also accepted.
- `{userId}` / `{keyId}` / `{endpointId}` etc.: returned in the `id` field of each object.
