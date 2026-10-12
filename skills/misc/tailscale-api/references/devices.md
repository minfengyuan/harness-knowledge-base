# Devices (15 operations)

### DELETE `/device/{deviceId}`
**Delete a device**  · operationId: `deleteDevice`

Deletes the device from its tailnet. The device must belong to the requesting user's tailnet. Deleting devices shared with the tailnet is not supported. OAuth Scope: `devices:core`.

**Params:**
- path* `deviceId` (string) — ID of the device. Using the device's `nodeId` is preferred, but its numeric `id` value can also be used.

**Responses:**
- `200`: Successful operation.
- `400`: Invalid device value.
- `500`:
- `501`: Device not owned by tailnet.
- `504`:

---

### GET `/device/{deviceId}`
**Get a device**  · operationId: `getDevice`

Retrieve the details for the specified device. OAuth Scope: `devices:core:read`.

**Params:**
- path* `deviceId` (string) — ID of the device. Using the device's `nodeId` is preferred, but its numeric `id` value can also be used.
- query `fields` (string (enum: 'all', 'default')) — Optionally controls whether the response returns **all** fields or only a predefined subset of fields.

**Responses:**
- `200`: Successful operation. → { `addresses`: [] of string; `id`: string; `nodeId`: string; `user`: string; `name`: string; `hostname`: string; `clientVersion`: string; `updateAvailable`: boolean; `os`: string; `created`: string; `connectedToControl`: boolean; `lastSeen`: string; `keyExpiryDisabled`: boolean; `expires`: string +16 more }
- `400`: Invalid ID supplied.
- `404`: Device not found.
- `500`:
- `504`:

---

### GET `/device/{deviceId}/attributes`
**Get device posture attributes**  · operationId: `getDevicePostureAttributes`

Retrieve all posture attributes for the specified device. This returns a JSON object of all the key-value pairs of posture attributes for the device. OAuth Scope: `devices:posture_attributes:read`.

**Params:**
- path* `deviceId` (string) — ID of the device. Using the device's `nodeId` is preferred, but its numeric `id` value can also be used.

**Responses:**
- `200`: Successful operation. → { `attributes`: object; `expiries`: object }
- `404`: Device not found.
- `500`:
- `504`:

---

### DELETE `/device/{deviceId}/attributes/{attributeKey}`
**Delete custom device posture attributes**  · operationId: `deleteCustomDevicePostureAttributes`

Delete a posture attribute from the specified device. This is only applicable to user-managed posture attributes in the custom namespace, which is indicated by prefixing the attribute key with `custom:`. OAuth Scope: `devices:posture_attributes`.

**Params:**
- path* `deviceId` (string) — ID of the device. Using the device's `nodeId` is preferred, but its numeric `id` value can also be used.
- path* `attributeKey` (string) — The name of the posture attribute. Must be prefixed with `custom:`; max length 128 chars.

**Responses:**
- `200`: Successful operation.
- `404`: Device not found.
- `429`:
- `500`:
- `504`:

---

### POST `/device/{deviceId}/attributes/{attributeKey}`
**Set custom device posture attributes**  · operationId: `setCustomDevicePostureAttributes`

Create or update a custom posture attribute on the specified device. User-managed attributes must be in the custom namespace, which is indicated by prefixing the attribute key with `custom:`. OAuth Scope: `devices:posture_attributes`.

**Params:**
- path* `deviceId` (string) — ID of the device. Using the device's `nodeId` is preferred, but its numeric `id` value can also be used.
- path* `attributeKey` (string) — The name of the posture attribute. Must be prefixed with `custom:`; max length 128 chars.

**Request body (required):** `application/json` { `value`: anyOf: string, number, boolean; `expiry`: string; `comment`: string }

**Responses:**
- `200`: Successful operation. → { `attributes`: object; `expiries`: object }
- `404`: Device not found.
- `429`:
- `500`:
- `504`:

---

### POST `/device/{deviceId}/authorized`
**Authorize device**  · operationId: `authorizeDevice`

Marks a device as authorized or revokes its authorization for tailnets where device authorization is required, according to the `authorized` field in the payload. OAuth Scope: `devices:core`.

**Params:**
- path* `deviceId` (string) — ID of the device. Using the device's `nodeId` is preferred, but its numeric `id` value can also be used.

**Request body:** `application/json` { `authorized`*: boolean }

**Responses:**
- `200`: Successful operation.
- `404`: Device not found.
- `500`:
- `504`:

---

### POST `/device/{deviceId}/expire`
**Expire a device's key**  · operationId: `expireDeviceKey`

Mark a device's node key as expired. This will require the device to re-authenticate in order to connect to the tailnet. OAuth Scope: `devices:core`.

**Params:**
- path* `deviceId` (string) — ID of the device. Using the device's `nodeId` is preferred, but its numeric `id` value can also be used.

**Responses:**
- `200`: Successful operation.
- `404`: Device not found.
- `500`:
- `504`:

---

### POST `/device/{deviceId}/ip`
**Set device IPv4 address**  · operationId: `setDeviceIp`

Replaces the existing Tailscale IPv4 address (CGNAT range, or ip pool subset) with a specific value. **This action will break any existing connections to this machine**; reconnect using the new IP and flush DNS caches. OAuth Scope: `devices:core`.

**Params:**
- path* `deviceId` (string) — ID of the device. Using the device's `nodeId` is preferred, but its numeric `id` value can also be used.

**Request body:** `application/json` { `ipv4`*: string }

**Responses:**
- `200`: Successful operation.
- `404`: Device not found.
- `500`:
- `504`:

---

### POST `/device/{deviceId}/key`
**Update device key**  · operationId: `updateDeviceKey`

Disable or re-enable key expiry for a device (tailnet key-expiry setting applies by default). OAuth Scope: `devices:core`.

**Params:**
- path* `deviceId` (string) — ID of the device. Using the device's `nodeId` is preferred, but its numeric `id` value can also be used.

**Request body:** `application/json` { `keyExpiryDisabled`*: boolean }

**Responses:**
- `200`: Successful operation.
- `404`: Device not found.
- `500`:
- `504`:

---

### POST `/device/{deviceId}/name`
**Set device name**  · operationId: `setDeviceName`

Sets the canonical device name (defaults to OS hostname). Name changes propagate immediately — existing MagicDNS URLs using the old name will no longer work. OAuth Scope: `devices:core`.

**Params:**
- path* `deviceId` (string) — ID of the device. Using the device's `nodeId` is preferred, but its numeric `id` value can also be used.

**Request body:** `application/json` { `name`*: string }

**Responses:**
- `200`: Successful operation.
- `404`: Device not found.
- `500`:
- `504`:

---

### GET `/device/{deviceId}/routes`
**List device routes**  · operationId: `listDeviceRoutes`

Retrieve the subnet routes a device advertises and those enabled for it. Routes must be both advertised and enabled to act as a subnet router or exit node. OAuth Scope: `devices:routes:read`.

**Params:**
- path* `deviceId` (string) — ID of the device. Using the device's `nodeId` is preferred, but its numeric `id` value can also be used.

**Responses:**
- `200`: Successful operation. → { `advertisedRoutes`: [] of string; `enabledRoutes`: [] of string }
- `404`: Device not found.
- `500`:
- `504`:

---

### POST `/device/{deviceId}/routes`
**Set device routes**  · operationId: `setDeviceRoutes`

Replaces the device's enabled subnet routes. Advertised routes cannot be set via the API (they are set on the device itself). OAuth Scope: `devices:routes`.

**Params:**
- path* `deviceId` (string) — ID of the device. Using the device's `nodeId` is preferred, but its numeric `id` value can also be used.

**Request body (required):** `application/json` { `routes`: [] of string }

**Responses:**
- `200`: Successful operation. → { `advertisedRoutes`: [] of string; `enabledRoutes`: [] of string }
- `404`: Device not found.
- `500`:
- `504`:

---

### POST `/device/{deviceId}/tags`
**Set device tags**  · operationId: `setDeviceTags`

Assigns ACL tag identity to a device (tags must be defined in the tailnet policy file). Once tagged, the tag is the owner of the device; multiple tags per node allowed. OAuth Scope: `devices:core`.

**Params:**
- path* `deviceId` (string) — ID of the device. Using the device's `nodeId` is preferred, but its numeric `id` value can also be used.

**Request body:** `application/json` { `tags`: [] of string }

**Responses:**
- `200`: Successful operation.
- `400`:
- `500`:
- `504`:

---

### PATCH `/tailnet/{tailnet}/device-attributes`
**Batch update custom device posture attributes**  · operationId: `batchUpdateCustomDevicePostureAttributes`

Batch updates posture attributes across devices using **JSON Merge Patch (RFC 7396)** semantics; `null` deletes an attribute. Attributes must be in the `custom:` namespace. OAuth Scope: `devices:posture_attributes`.

**Params:**
- path* `tailnet` (string) — The tailnet ID. Legacy IDs still work for tailnets created before Oct 2025; the Tailnet ID is preferred.

**Request body (required):** `application/json` { `nodes`: object; `comment`: string }

**Responses:**
- `200`: Successful operation.
- `400`: An invalid request payload was sent
- `404`: Tailnet not found.
- `500`:

---

### GET `/tailnet/{tailnet}/devices`
**List tailnet devices**  · operationId: `listTailnetDevices`

Lists the devices in a tailnet. OAuth Scope: `devices:core:read`.

**Params:**
- path* `tailnet` (string) — The tailnet ID. Legacy IDs still work for tailnets created before Oct 2025; the Tailnet ID is preferred.
- query `fields` (string (enum: 'all', 'default')) — Controls whether the response returns all fields or a predefined subset.
- query `<field>=<value>` filters (string) — Server-side filtering: one or more filters in the form `<field>=<value>`.

**Responses:**
- `200`: Successful operation. → { `devices`: [] of { `addresses`: [] of string; `id`: string; `nodeId`: string; `user`: string; `name`: string; `hostname`: string; `clientVersion`: string; `updateAvailable`: boolean; `os`: string; `created`: string; `connectedToControl`: boolean; `lastSeen`: string; `keyExpiryDisabled`: boolean; `expires`: string +16 more } }
- `404`: Tailnet not found.
- `500`:
- `504`: Request took too long to process, please try again later.

---

# DeviceInvites (6 operations)

### POST `/device-invites/-/accept`
**Accept a device invite**  · operationId: `acceptDeviceInvite`

Accepts the invitation to share a device into the requesting user's tailnet. Cannot be accepted using a token derived from an OAuth client (shared device is scoped to a user).

**Request body:** `application/json` { `invite`*: string }

**Responses:**
- `200`: Successful operation. → { `device`: { `id`: string; `os`: string; `name`: string; `fqdn`: string; `ipv4`: string; `ipv6`: string; `includeExitNode`: boolean }; `sharer`: { `id`: string; `displayName`: string; `loginName`: string; `profilePicURL`: string }; `acceptedBy`: { `id`: string; `displayName`: string; `loginName`: string; `profilePicURL`: string } }
- `400`:
- `500`:

---

### DELETE `/device-invites/{deviceInviteId}`
**Delete a device invite**  · operationId: `deleteDeviceInvite`

Delete a specific device invite. OAuth Scope: `device_invites`.

**Params:**
- path* `deviceInviteId` (string) — ID of the device invite.

**Responses:**
- `200`: Successful operation.
- `404`: Device invite not found.
- `500`:

---

### GET `/device-invites/{deviceInviteId}`
**Get a device invite**  · operationId: `getDeviceInvite`

Retrieve a specific device invite. OAuth Scope: `device_invites:read`.

**Params:**
- path* `deviceInviteId` (string) — ID of the device invite.

**Responses:**
- `200`: Successful operation. → { `id`: string; `created`: string; `tailnetId`: integer; `deviceId`: integer; `sharerId`: integer; `multiUse`: boolean; `allowExitNode`: boolean; `email`: string; `lastEmailSentAt`: string; `inviteUrl`: string; `accepted`: boolean; `acceptedBy`: { `id`: integer; `loginName`: string; `profilePicUrl`: string } }
- `404`: Device invite not found.
- `500`:

---

### POST `/device-invites/{deviceInviteId}/resend`
**Resend a device invite**  · operationId: `resendDeviceInvite`

Resend a device invite by email (only if created with an email). Rate limited to one resend per minute. Cannot be resent with an OAuth-client-derived token.

**Params:**
- path* `deviceInviteId` (string) — ID of the device invite.

**Responses:**
- `200`: Successful operation.
- `404`: Device invite not found.
- `500`:

---

### GET `/device/{deviceId}/device-invites`
**List device invites**  · operationId: `listDeviceInvites`

List all share invites for a device. OAuth Scope: `device_invites:read`.

**Params:**
- path* `deviceId` (string) — ID of the device. Using the device's `nodeId` is preferred, but its numeric `id` value can also be used.

**Responses:**
- `200`: Successful operation. → [] of DeviceInvite
- `404`: Device not found.
- `500`:
- `504`:

---

### POST `/device/{deviceId}/device-invites`
**Create device invites**  · operationId: `createDeviceInvites`

Create new share invites for a device. Cannot be created with an OAuth-client-derived token.

**Params:**
- path* `deviceId` (string) — ID of the device. Using the device's `nodeId` is preferred, but its numeric `id` value can also be used.

**Request body:** `application/json` [] of { `multiUse`: boolean; `allowExitNode`: boolean; `email`: string }

**Responses:**
- `200`: Successful operation. → [] of DeviceInvite
- `404`: Device not found.
- `500`:
- `504`:

---

# DevicePosture (5 operations)

### DELETE `/posture/integrations/{id}`
**Delete a posture integration**  · operationId: `deletePostureIntegration`

Delete a specific posture integration. OAuth Scope: `feature_settings`.

**Params:**
- path* `id` (string) — Unique identifier for a posture integration.

**Responses:**
- `200`: Successful operation.
- `403`: User does not have sufficient access to delete this posture integration.
- `404`: Posture integration not found.

---

### GET `/posture/integrations/{id}`
**Get a posture integration**  · operationId: `getPostureIntegration`

Gets the posture integration identified by `{id}`. OAuth Scope: `feature_settings:read`.

**Params:**
- path* `id` (string) — Unique identifier for a posture integration.

**Responses:**
- `200`: Successful operation. → { `provider`: string (enum: 'falcon', 'intune', 'jamfpro', 'kandji', 'kolide', 'sentinelone'); `cloudId`: string; `clientId`: string; `tenantId`: string; `clientSecret`: string; `id`: string; `configUpdated`: string; `status`: { `lastSync`: string; `error`: string; `providerHostCount`: integer; `matchedCount`: integer; `possibleMatchedCount`: integer } }
- `404`: Posture integration not found, or user is not authorized to read it.

---

### PATCH `/posture/integrations/{id}`
**Update a posture integration**  · operationId: `updatePostureIntegration`

Updates the posture integration identified by `{id}`. Omit `clientSecret` from the request to retain the previously configured one. OAuth Scope: `feature_settings`.

**Params:**
- path* `id` (string) — Unique identifier for a posture integration.

**Request body:** `application/json` PostureIntegration object

**Responses:**
- `200`: Successful operation. → PostureIntegration object.
- `403`: User does not have sufficient access to update this posture integration.
- `404`: Posture integration not found.

---

### GET `/tailnet/{tailnet}/posture/integrations`
**List all posture integrations**  · operationId: `getPostureIntegrations`

List all posture integrations for a tailnet. OAuth Scope: `feature_settings:read`.

**Params:**
- path* `tailnet` (string) — The tailnet ID. Legacy IDs still work for tailnets created before Oct 2025; the Tailnet ID is preferred.

**Responses:**
- `200`: Successful operation. → { `integrations`: [] of PostureIntegration }
- `403`: User does not have sufficient access to list posture integrations.

---

### POST `/tailnet/{tailnet}/posture/integrations`
**Create a posture integration**  · operationId: `createPostureIntegration`

Create a posture integration (must include `provider` and `clientSecret`). Only one integration per provider is supported. OAuth Scope: `feature_settings`.

**Params:**
- path* `tailnet` (string) — The tailnet ID. Legacy IDs still work for tailnets created before Oct 2025; the Tailnet ID is preferred.

**Request body:** `application/json` PostureIntegration object

**Responses:**
- `200`: Successful operation. → PostureIntegration object.
- `403`: User does not have sufficient access to create posture integrations.
- `409`: A posture integration for the same provider already exists.

---
