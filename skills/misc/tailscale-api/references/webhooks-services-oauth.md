# Webhooks (7 operations)

Webhook `providerType` enum: `slack` | `mattermost` | `googlechat` | `discord`.
`subscriptions` topic enum: `nodeCreated`, `nodeNeedsApproval`, `nodeApproved`, `nodeKeyExpiringInOneDay`, `nodeKeyExpired`, `nodeDeleted`, `nodeSigned`, `nodeNeedsSignature`, `policyUpdate`, `userCreated`, `userNeedsApproval`, `userSuspended`, `userRestored`, `userDeleted`, `userApproved`, `userRoleUpdated`, `subnetIPForwardingNotEnabled`, `exitNodeIPForwardingNotEnabled`.

### GET `/tailnet/{tailnet}/webhooks`
**List webhooks**  · operationId: `listWebhooks`

List all webhooks for a tailnet. OAuth Scope: `webhooks:read`.

**Params:**
- path* `tailnet` (string) — The tailnet ID. Legacy IDs still work for tailnets created before Oct 2025; the Tailnet ID is preferred.

**Responses:**
- `200`: Successful operation. → { `webhooks`: [] of Webhook } where Webhook = { `endpointId`: string; `endpointUrl`: string; `providerType`: enum; `creatorLoginName`: string; `created`: string; `lastModified`: string; `subscriptions`: [] of enum; `secret`: string }
- `400` / `403` / `404` / `500`:

---

### POST `/tailnet/{tailnet}/webhooks`
**Create a webhook**  · operationId: `createWebhook`

Create a webhook within a tailnet. OAuth Scope: `webhooks`.

**Params:**
- path* `tailnet` (string) — The tailnet ID. Legacy IDs still work for tailnets created before Oct 2025; the Tailnet ID is preferred.

**Request body:** `application/json` { `endpointUrl`*: string; `providerType`: enum; `subscriptions`*: [] of enum }

**Responses:**
- `200`: Successful operation. → Webhook object.
- `400` / `403` / `404` / `500`:

---

### DELETE `/webhooks/{endpointId}`
**Delete webhook**  · operationId: `deleteWebhook`

Delete a specific webhook. OAuth Scope: `webhooks`.

**Params:**
- path* `endpointId` (string) — ID for the webhook endpoint.

**Responses:**
- `200`: Successful operation.
- `400` / `403` / `404` (Webhook not found) / `500`:

---

### GET `/webhooks/{endpointId}`
**Get webhook**  · operationId: `getWebhook`

Retrieve a specific webhook. OAuth Scope: `webhooks:read`.

**Params:**
- path* `endpointId` (string) — ID for the webhook endpoint.

**Responses:**
- `200`: Successful operation. → Webhook object.
- `400` / `403` / `404` / `500`:

---

### PATCH `/webhooks/{endpointId}`
**Update webhook**  · operationId: `updateWebhook`

Update a specific webhook (subscriptions). OAuth Scope: `webhooks`.

**Params:**
- path* `endpointId` (string) — ID for the webhook endpoint.

**Request body:** `application/json` { `subscriptions`: [] of enum }

**Responses:**
- `200`: Successful operation. → Webhook object.
- `400` / `403` / `404` / `500`:

---

### POST `/webhooks/{endpointId}/rotate`
**Rotate webhook secret**  · operationId: `rotateWebhookSecret`

Rotate and generate a new secret for a specific webhook. The secret signs the `Tailscale-Webhook-Signature` header on event deliveries. OAuth Scope: `webhooks`.

**Params:**
- path* `endpointId` (string) — ID for the webhook endpoint.

**Responses:**
- `200`: Successful operation. → Webhook object (new `secret`).
- `400` / `403` / `404` / `500`:

---

### POST `/webhooks/{endpointId}/test`
**Test a webhook**  · operationId: `testWebhook`

Queues a test event sent asynchronously to the endpoint URL; within a few seconds the endpoint should receive an event with type `"test"`. OAuth Scope: `webhooks`.

**Params:**
- path* `endpointId` (string) — ID for the webhook endpoint.

**Responses:**
- `202`: Successfully queued test event.
- `400` / `403` / `404` / `500`:

---

# Services (7 operations)

Tailscale Services are VIP-style service entries. `serviceName` must be prefixed with `svc:` and unique across the tailnet.

### GET `/tailnet/{tailnet}/services`
**List all Services**  · operationId: `listServices`

List all Services configured for the tailnet. OAuth Scope: `services:read`.

**Params:**
- path* `tailnet` (string) — The tailnet ID. Legacy IDs still work for tailnets created before Oct 2025; the Tailnet ID is preferred.

**Responses:**
- `200`: Successful operation. → { `vipServices`: [] of { `name`: string; `displayName`: string; `addrs`: [] of string; `comment`: string; `ports`: [] of string; `tags`: [] of string } }
- `400` / `403` / `404` / `500`:

---

### DELETE `/tailnet/{tailnet}/services/{serviceName}`
**Delete a Service**  · operationId: `deleteService`

Delete the specified Service from the tailnet. OAuth Scope: `services`.

**Params:**
- path* `tailnet` (string) — The tailnet ID. Legacy IDs still work for tailnets created before Oct 2025; the Tailnet ID is preferred.
- path* `serviceName` (string) — Unique name, prefixed `svc:`.

**Responses:**
- `200`: Successful operation.
- `400` / `403` / `404` (Service not found) / `500` / `504`:

---

### GET `/tailnet/{tailnet}/services/{serviceName}`
**Get a Service**  · operationId: `getService`

Retrieve the details for the specified Service. OAuth Scope: `services:read`.

**Params:**
- path* `tailnet` (string) — The tailnet ID. Legacy IDs still work for tailnets created before Oct 2025; the Tailnet ID is preferred.
- path* `serviceName` (string) — Unique name, prefixed `svc:`.

**Responses:**
- `200`: Successful operation. → { `name`: string; `displayName`: string; `addrs`: [] of string; `comment`: string; `ports`: [] of string; `tags`: [] of string }
- `400` / `403` / `404` / `500` / `504`:

---

### PUT `/tailnet/{tailnet}/services/{serviceName}`
**Update a Service**  · operationId: `updateService`

Update or create the specified Service. Creating: body `name` must equal the `serviceName` path param. Updating: path param is the current name; body `name` renames it. OAuth Scope: `services`.

**Params:**
- path* `tailnet` (string) — The tailnet ID. Legacy IDs still work for tailnets created before Oct 2025; the Tailnet ID is preferred.
- path* `serviceName` (string) — Unique name, prefixed `svc:`.

**Request body (required):** `application/json` { `name`: string; `displayName`: string; `addrs`: [] of string; `comment`: string; `ports`: [] of string; `tags`: [] of string }

**Responses:**
- `200`: Successful operation. → Service object.
- `400` / `403` / `404` / `500` / `504`:

---

### GET `/tailnet/{tailnet}/services/{serviceName}/device/{deviceId}/approved`
**Get approval status of Service on a device**  · operationId: `getServiceDeviceApproval`

Retrieve the approval status of the specified Service on a specific device. OAuth Scopes: `services`, `devices:core`.

**Params:**
- path* `tailnet` (string) — The tailnet ID. Legacy IDs still work for tailnets created before Oct 2025; the Tailnet ID is preferred.
- path* `serviceName` (string) — Unique name, prefixed `svc:`.
- path* `deviceId` (string) — Prefer `nodeId`; numeric `id` also works.

**Responses:**
- `200`: Successful operation. → { `approved`: boolean; `autoApproved`: boolean }
- `400` / `403` / `404` / `500` / `504`:

---

### POST `/tailnet/{tailnet}/services/{serviceName}/device/{deviceId}/approved`
**Update approval status of Service on a device**  · operationId: `updateServiceDeviceApproval`

Update the approval status of the specified Service on a specific device. OAuth Scopes: `services`, `devices:core`.

**Params:**
- path* `tailnet` (string) — The tailnet ID. Legacy IDs still work for tailnets created before Oct 2025; the Tailnet ID is preferred.
- path* `serviceName` (string) — Unique name, prefixed `svc:`.
- path* `deviceId` (string) — Prefer `nodeId`; numeric `id` also works.

**Request body (required):** `application/json` { `approved`: boolean }

**Responses:**
- `200`: Successful operation. → { `approved`: boolean; `autoApproved`: boolean }
- `400` / `403` / `404` / `500` / `504`:

---

### GET `/tailnet/{tailnet}/services/{serviceName}/devices`
**List devices hosting a Service**  · operationId: `listServiceHosts`

List all devices hosting the specified Service. OAuth Scopes: `services`, `devices:core`.

**Params:**
- path* `tailnet` (string) — The tailnet ID. Legacy IDs still work for tailnets created before Oct 2025; the Tailnet ID is preferred.
- path* `serviceName` (string) — Unique name, prefixed `svc:`.

**Responses:**
- `200`: Successful operation. → { `hosts`: [] of { `stableNodeID`: string; `approvalLevel`: string (enum: 'not-approved', 'approved:auto', 'approved:manual'); `configured`: string } }
- `400` / `403` / `404` / `500` / `504`:

---

# OAuthApps (5 operations)

### GET `/tailnet/{tailnet}/oauth-apps`
**List OAuth apps**  · operationId: `listOAuthApps`

List all OAuth apps for a tailnet. OAuth Scope: `oauth_apps:read`.

**Params:**
- path* `tailnet` (string) — The tailnet ID. Legacy IDs still work for tailnets created before Oct 2025; the Tailnet ID is preferred.

**Responses:**
- `200`: Successful operation. → { `oauthApps`: [] of { `id`: string; `name`: string; `description`: string; `redirectURIs`: [] of string; `scopes`: [] of string; `allowedNodeAttributes`: [] of string; `clientSecret`: string; `created`: string; `updated`: string } }
- `400` / `403` / `404` / `500`:

---

### POST `/tailnet/{tailnet}/oauth-apps`
**Create an OAuth app**  · operationId: `createOAuthApp`

Create an OAuth app within a tailnet. **The generated client secret is returned only in this response** — record it immediately. If `allowedNodeAttributes` is included, the caller also needs `devices:posture_attributes`. OAuth Scope: `oauth_apps`.

**Params:**
- path* `tailnet` (string) — The tailnet ID. Legacy IDs still work for tailnets created before Oct 2025; the Tailnet ID is preferred.

**Request body:** `application/json` { `name`*: string; `description`: string; `redirectURIs`*: [] of string; `scopes`*: [] of string; `allowedNodeAttributes`: [] of string }

**Responses:**
- `200`: Successful operation. → OAuthApp object (includes `clientSecret`).
- `400` / `403` / `404` / `500`:

---

### DELETE `/tailnet/{tailnet}/oauth-apps/{appId}`
**Delete OAuth app**  · operationId: `deleteOAuthApp`

Delete a specific OAuth app. OAuth Scope: `oauth_apps`.

**Params:**
- path* `tailnet` (string) — The tailnet ID. Legacy IDs still work for tailnets created before Oct 2025; the Tailnet ID is preferred.
- path* `appId` (string) — The ID of the OAuth app.

**Responses:**
- `200`: Successful operation.
- `400` / `403` / `404` (OAuth app not found) / `500`:

---

### GET `/tailnet/{tailnet}/oauth-apps/{appId}`
**Get OAuth app**  · operationId: `getOAuthApp`

Retrieve a specific OAuth app. OAuth Scope: `oauth_apps:read`.

**Params:**
- path* `tailnet` (string) — The tailnet ID. Legacy IDs still work for tailnets created before Oct 2025; the Tailnet ID is preferred.
- path* `appId` (string) — The ID of the OAuth app.

**Responses:**
- `200`: Successful operation. → OAuthApp object.
- `400` / `403` / `404` / `500`:

---

### PUT `/tailnet/{tailnet}/oauth-apps/{appId}`
**Update OAuth app**  · operationId: `updateOAuthApp`

Update a specific OAuth app. The client secret is **not** regenerated and is not returned in this response. OAuth Scope: `oauth_apps`.

**Params:**
- path* `tailnet` (string) — The tailnet ID. Legacy IDs still work for tailnets created before Oct 2025; the Tailnet ID is preferred.
- path* `appId` (string) — The ID of the OAuth app.

**Request body:** `application/json` { `name`*: string; `description`: string; `redirectURIs`*: [] of string; `scopes`*: [] of string; `allowedNodeAttributes`: [] of string }

**Responses:**
- `200`: Successful operation. → OAuthApp object (no secret).
- `400` / `403` / `404` / `500`:
