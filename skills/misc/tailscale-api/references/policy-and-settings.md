# PolicyFile (4 operations)

### GET `/tailnet/{tailnet}/acl`
**Get policy file**  · operationId: `getPolicyFile`

Retrieves the current policy file: ACL plus rules and tests. Returns JSON or HuJSON depending on the `Accept` header; includes an `ETag` header usable for optimistic concurrency when setting. OAuth Scope: `policy_file:read`.

**Params:**
- path* `tailnet` (string) — The tailnet ID. Legacy IDs still work for tailnets created before Oct 2025; the Tailnet ID is preferred.
- header `Accept` (string) — `application/json` → JSON; otherwise HuJSON.
- query `details` (boolean) — `details=true` returns a detailed description of the policy file.

**Responses:**
- `200`: Successful operation. → object
- `400` / `403` / `404` / `500`:

---

### POST `/tailnet/{tailnet}/acl`
**Set policy file**  · operationId: `setPolicyFile`

Sets the ACL for the tailnet. Accepts HuJSON (raw string) or JSON (object). `If-Match` header enables optimistic concurrency (mismatch → 412). Failing ACL tests → 400. Returns the updated ACL per `Accept`. OAuth Scope: `policy_file`.

**Params:**
- path* `tailnet` (string) — The tailnet ID. Legacy IDs still work for tailnets created before Oct 2025; the Tailnet ID is preferred.
- header `Accept` (string) — Response encoding: `application/json` or HuJSON.
- header `If-Match` (string) — ETag value from a prior GET; avoids overwriting others' updates.

**Request body:** `application/hujson` (string) or `application/json` (object)

**Responses:**
- `200`: Successful operation. → object
- `400`: ACL validation or test error.
- `403`:
- `404`: Tailnet not found.
- `412`: If-Match hash mismatch. → { `message`*: string }
- `500`:

---

### POST `/tailnet/{tailnet}/acl/preview`
**Preview rule matches**  · operationId: `previewRuleMatches`

Given a user or IP:port, returns the tailnet policy rules that apply to that resource — without saving the policy file.

**Params:**
- path* `tailnet` (string) — The tailnet ID. Legacy IDs still work for tailnets created before Oct 2025; the Tailnet ID is preferred.
- query* `type` (string (enum: 'user', 'ipport')) — Resource type to match against.
- query* `previewFor` (string) — For `user`: the email of a valid user with registered machines. For `ipport`: an IP:port.

**Request body:** `application/json` object (hypothetical policy file)

**Responses:**
- `200`: The list of rules that apply. → { `matches`*: [] of { `users`*: [] of string; `ports`*: [] of string; `lineNumber`*: integer }; `type`*: string; `previewFor`*: string }
- `400` / `403` / `404` / `500`:

---

### POST `/tailnet/{tailnet}/acl/validate`
**Validate and test policy file**  · operationId: `validateAndTestPolicyFile`

Two modes, neither modifies the current policy file: (1) body = JSON array of ACL tests → runs them against the current policy file; (2) body = JSON object → validates a hypothetical new policy file (parsability + runs its tests). OAuth Scope: `policy_file`.

**Params:**
- path* `tailnet` (string) — The tailnet ID. Legacy IDs still work for tailnets created before Oct 2025; the Tailnet ID is preferred.

**Request body:** `application/json` oneOf: [] of { `src`*: string; `srcPostureAttrs`: object; `proto`: string; `accept`: [] of string; `deny`: [] of string }, string

**Responses:**
- `200`: Validation/tests ran; empty body = pass. → { `message`: string; `data`: [] of object }
- `400` / `403` / `404` / `500`:

---

# TailnetSettings (2 operations)

### GET `/tailnet/{tailnet}/settings`
**Get tailnet settings**  · operationId: `getTailnetSettings`

Retrieve the settings for a specific tailnet. Scopes: `feature_settings:read` (most fields); `logs:network:read` for `networkFlowLoggingOn`; `networking_settings:read` for `httpsCertificates`; `policy_file:read` for `aclsExternallyManagedOn` & `aclsExternalLink`.

**Params:**
- path* `tailnet` (string) — The tailnet ID. Legacy IDs still work for tailnets created before Oct 2025; the Tailnet ID is preferred.

**Responses:**
- `200`: Successful operation. → { `aclsExternallyManagedOn`: boolean|null; `aclsExternalLink`: string; `devicesApprovalOn`: boolean|null; `devicesAutoUpdatesOn`: boolean|null; `devicesKeyDurationDays`: integer; `usersApprovalOn`: boolean|null; `usersRoleAllowedToJoinExternalTailnets`: enum('none','admin','member'); `networkFlowLoggingOn`: boolean|null; `regionalRoutingOn`: boolean|null; `postureIdentityCollectionOn`: boolean|null; `httpsEnabled`: boolean|null }
- `400` / `404` / `500`:

---

### PATCH `/tailnet/{tailnet}/settings`
**Update tailnet settings**  · operationId: `updateTailnetSettings`

Partial update of tailnet settings. Scopes: `feature_settings` (most fields); `logs:network` for `networkFlowLoggingOn`; `networking_settings` for `httpsCertificates`; `policy_file` for `aclsExternallyManagedOn` & `aclsExternalLink`.

**Params:**
- path* `tailnet` (string) — The tailnet ID. Legacy IDs still work for tailnets created before Oct 2025; the Tailnet ID is preferred.

**Request body:** `application/json` TailnetSettings (partial — see GET schema above).

**Responses:**
- `200`: Successful operation. → TailnetSettings object.
- `400` / `404` / `500`:

---

# Organizations (3 operations)

### GET `/organizations/{organization}/tailnets`
**List tailnets**  · operationId: `listOrganizationTailnets`

List all tailnets in the organization, including the original tailnet and any API-only tailnets. OAuth Scope: `tailnets:read`.

**Params:**
- path* `organization` (string) — Organization identifier; `-` references the org of the calling token.

**Responses:**
- `200`: Successful operation. → { `tailnets`: [] of { `id`: string; `displayName`: string; `orgId`: string; `createdAt`: string } }
- `403`: User does not have sufficient access to list tailnets for this organization.
- `404`: Organization not found.
- `500`:

---

### POST `/organizations/{organization}/tailnets`
**Create a tailnet**  · operationId: `createOrganizationTailnet`

Create an **API-only tailnet** (no human users, not shown in admin console) for app/infra managed entirely via API. Max 10 tailnets per plan (including the original). Response includes an OAuth client for the new tailnet — **the client secret is returned only in this response**. OAuth Scope: `tailnets`.

**Params:**
- path* `organization` (string) — Organization identifier; `-` references the org of the calling token.

**Request body (required):** `application/json` { `displayName`*: string }

**Responses:**
- `200`: Successful operation. → { `id`: string; `displayName`: string; `orgId`: string; `dnsName`: string; `createdAt`: string; `oauthClient`: { `id`: string; `secret`: string }; `alreadyExists`: boolean }
- `400`: Display name is missing, invalid, or already in use.
- `403`: User does not have sufficient access to create a tailnet for this organization.
- `404`: Organization not found.
- `500`:

---

### DELETE `/tailnet/{tailnet}`
**Delete a tailnet**  · operationId: `deleteTailnet`

Delete the tailnet and all of its users, devices, and configuration. API-only tailnets can be deleted with an access token for that tailnet (exchange the creation OAuth client credentials, or use an OAuth client from the creating tailnet with `all` scope). OAuth Scope: `all`.

**Params:**
- path* `tailnet` (string) — The tailnet ID. Legacy IDs still work for tailnets created before Oct 2025; the Tailnet ID is preferred.

**Responses:**
- `200`: Successful operation.
- `400`: Tailnet deletion could not be completed.
- `403`: Tailnet deletion is not permitted.
- `404`: Tailnet not found.
- `500`:
