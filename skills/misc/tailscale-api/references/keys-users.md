# Keys (5 operations)

### GET `/tailnet/{tailnet}/keys`
**List tailnet keys**  · operationId: `listTailnetKeys`

Returns active auth keys, API access tokens and trust credentials. Visibility depends on the calling token: user-owned token → that user's keys; OAuth-client-derived token → all OAuth clients; federated-identity-derived token → all federated identities. OAuth Scopes: `api_access_tokens:read`, `auth_keys:read`, `oauth_keys:read`, `federated_keys:read`.

**Params:**
- path* `tailnet` (string) — The tailnet ID. Legacy IDs still work for tailnets created before Oct 2025; the Tailnet ID is preferred.
- query* `all` (boolean) — If true, returns all auth keys, API access tokens and OAuth clients for the tailnet.

**Responses:**
- `200`: Successful operation. → { `keys`: [] of { `id`: string; `key`: string; `keyType`: string (enum: 'auth', 'client', 'api', 'federated'); `expirySeconds`: integer; `created`: string; `updated`: string; `expires`: string; `revoked`: string; `capabilities`: { `devices`: { `create`: { `reusable`: boolean; `ephemeral`: boolean; `preauthorized`: boolean; `tags`: [] of string } } }; `scopes`: [] of string; `tags`: [] of string; `description`: string; `invalid`: boolean; `userId`: string +4 more } }
- `404`: Tailnet not found.
- `500`:

---

### POST `/tailnet/{tailnet}/keys`
**Create an auth key or trust credential**  · operationId: `createKey`

Creates a new auth key, OAuth client, or federated identity in the tailnet. Owned by the calling token's user (or by the tailnet when called with a trust-credential-derived token). **The generated key is returned once — record it immediately.** OAuth Scopes: `auth_keys`, `oauth_keys`, `federated_keys`.

**Params:**
- path* `tailnet` (string) — The tailnet ID. Legacy IDs still work for tailnets created before Oct 2025; the Tailnet ID is preferred.

**Request body:** `application/json` { `keyType`: string (enum: 'auth', 'client', 'federated') — default `auth`; `description`: string (≤50 chars); `capabilities`: { `devices`: { `create`: { `reusable`: boolean; `ephemeral`: boolean; `preauthorized`: boolean; `tags`: [] of string } } }; `expirySeconds`: integer — default 90 days; `scopes`: [] of string — at least one required for OAuth clients; `tags`: [] of string; `issuer`: string; `subject`: string; `audience`: string; `customClaimRules`: object }

**Responses:**
- `200`: Successful operation. → Key object (includes the `key` secret).
- `404`: Tailnet not found.
- `500`:

---

### DELETE `/tailnet/{tailnet}/keys/{keyId}`
**Delete key**  · operationId: `deleteKey`

Deletes a specific API access token or auth key. OAuth Scopes: `api_access_tokens`, `auth_keys`, `oauth_keys`, `federated_keys`.

**Params:**
- path* `tailnet` (string) — The tailnet ID. Legacy IDs still work for tailnets created before Oct 2025; the Tailnet ID is preferred.
- path* `keyId` (string) — The id of the key (visible in admin console → Settings → Keys).

**Responses:**
- `200`: Successful operation.
- `403`: User does not have sufficient access to delete this key.
- `404`: Tailnet not found.
- `500`:

---

### GET `/tailnet/{tailnet}/keys/{keyId}`
**Get key**  · operationId: `getKey`

Returns info about a specific API access token, OAuth client, federated identity, or auth key (creation/expiration dates, capabilities). Revoked/expired keys have `invalid` set. OAuth Scopes: `api_access_tokens:read`, `auth_keys:read`, `oauth_keys:read`, `federated_keys:read`.

**Params:**
- path* `tailnet` (string) — The tailnet ID. Legacy IDs still work for tailnets created before Oct 2025; the Tailnet ID is preferred.
- path* `keyId` (string) — The id of the key.

**Responses:**
- `200`: Successful operation. → Key object.
- `404`: Tailnet or key not found.
- `500`:

---

### PUT `/tailnet/{tailnet}/keys/{keyId}`
**Set key**  · operationId: `setKey`

Set the configuration for an existing OAuth client or federated identity. OAuth Scopes: `oauth_keys`, `federated_keys`.

**Params:**
- path* `tailnet` (string) — The tailnet ID. Legacy IDs still work for tailnets created before Oct 2025; the Tailnet ID is preferred.
- path* `keyId` (string) — The id of the key.

**Request body:** `application/json` { `keyType`: string (enum: 'client', 'federated'); `description`: string; `scopes`: [] of string; `tags`: [] of string; `issuer`: string; `subject`: string; `audience`: string; `customClaimRules`: object }

**Responses:**
- `200`: Successful operation. → Key object.
- `404`: Tailnet not found.
- `500`:

---

# Users (7 operations)

### GET `/tailnet/{tailnet}/users`
**List users**  · operationId: `listUsers`

List all users of a tailnet. OAuth Scope: `users:read`.

**Params:**
- path* `tailnet` (string) — The tailnet ID. Legacy IDs still work for tailnets created before Oct 2025; the Tailnet ID is preferred.
- query `type` (string (enum: 'member', 'shared', 'all')) — Filter by user type.
- query `role` (string (enum: 'owner', 'member', 'admin', 'it-admin', 'network-admin', 'billing-admin', 'auditor', 'all')) — Filter by user role.

**Responses:**
- `200`: Successful operation. → { `users`: [] of { `id`: string; `displayName`: string; `loginName`: string; `profilePicUrl`: string; `tailnetId`: string; `created`: string; `type`: string (enum: 'member', 'shared'); `role`: string (enum: 'owner', 'member', 'admin', 'it-admin', 'network-admin', 'billing-admin', 'auditor'); `status`: string (enum: 'active', 'idle', 'suspended', 'needs-approval', 'over-billing-limit'); `deviceCount`: integer; `lastSeen`: string; `currentlyConnected`: boolean } }
- `400` / `403` / `404` / `500`:

---

### GET `/users/{userId}`
**Get a user**  · operationId: `getUser`

Retrieve details about the specified user. OAuth Scope: `users:read`.

**Params:**
- path* `userId` (string) — ID of the user.

**Responses:**
- `200`: Successful operation. → User object.
- `400` / `403` / `404` / `500`:

---

### POST `/users/{userId}/approve`
**Approve a user**  · operationId: `approveUser`

Approve a pending user's access to the tailnet. No-op if user approval is disabled or the user is already approved. User approval is managed via tailnet settings. OAuth Scope: `users`. ⓘ User-based tokens cannot approve their own user.

**Params:**
- path* `userId` (string) — ID of the user.

**Responses:**
- `200`: Successful operation.
- `400` / `403` / `404` / `500`:

---

### POST `/users/{userId}/delete`
**Delete a user**  · operationId: `deleteUser`

Delete a user from their tailnet. OAuth Scope: `users`. ⓘ User-based tokens cannot delete their own user.

**Params:**
- path* `userId` (string) — ID of the user.

**Responses:**
- `200`: Successful operation.
- `400` / `403` / `404` / `500`:

---

### POST `/users/{userId}/restore`
**Restore a user**  · operationId: `restoreUser`

Restore a suspended user's access to their tailnet. OAuth Scope: `users`. ⓘ User-based tokens cannot restore their own user.

**Params:**
- path* `userId` (string) — ID of the user.

**Responses:**
- `200`: Successful operation.
- `400` / `403` / `404` / `500`:

---

### POST `/users/{userId}/role`
**Update user role**  · operationId: `updateUserRole`

Update the role for the specified user. OAuth Scope: `users`. ⓘ User-based tokens cannot update their own user's role.

**Params:**
- path* `userId` (string) — ID of the user.

**Request body:** `application/json` { `role`: string (enum: 'owner', 'member', 'admin', 'it-admin', 'network-admin', 'billing-admin', 'auditor') }

**Responses:**
- `200`: Successful operation.
- `400` / `403` / `404` / `500`:

---

### POST `/users/{userId}/suspend`
**Suspend a user**  · operationId: `suspendUser`

Suspends a user from their tailnet. OAuth Scope: `users`. ⓘ User-based tokens cannot suspend their own user.

**Params:**
- path* `userId` (string) — ID of the user.

**Responses:**
- `200`: Successful operation.
- `400` / `403` / `404` / `500`:

---

# UserInvites (5 operations)

### GET `/tailnet/{tailnet}/user-invites`
**List user invites**  · operationId: `listUserInvites`

List all open (not yet accepted) user invites to the tailnet.

**Params:**
- path* `tailnet` (string) — The tailnet ID. Legacy IDs still work for tailnets created before Oct 2025; the Tailnet ID is preferred.

**Responses:**
- `200`: Successful operation. → [] of { `id`*: string; `role`*: string (enum: 'member', 'admin', 'it-admin', 'network-admin', 'billing-admin', 'auditor'); `tailnetId`*: integer; `inviterId`*: integer; `email`: string; `lastEmailSentAt`: string; `inviteUrl`: string }
- `404`: Tailnet not found.
- `500`:

---

### POST `/tailnet/{tailnet}/user-invites`
**Create user invites**  · operationId: `createUserInvites`

Create, and optionally email out, new user invites to join the tailnet. ⓘ Only permitted for user-owned keys (invites require an inviting user).

**Params:**
- path* `tailnet` (string) — The tailnet ID. Legacy IDs still work for tailnets created before Oct 2025; the Tailnet ID is preferred.

**Request body:** `application/json` [] of { `role`: string (enum: 'member', 'admin', 'it-admin', 'network-admin', 'billing-admin', 'auditor'); `email`: string }

**Responses:**
- `200`: Successful operation. → [] of UserInvite objects.
- `404`: Tailnet not found.
- `500`:

---

### DELETE `/user-invites/{userInviteId}`
**Delete a user invite**  · operationId: `deleteUserInvite`

Deletes a specific user invite. ⓘ Only permitted for user-owned keys.

**Params:**
- path* `userInviteId` (string) — ID of the user invite.

**Responses:**
- `200`: Successful operation.
- `404`: User invite not found.
- `500`:

---

### GET `/user-invites/{userInviteId}`
**Get a user invite**  · operationId: `getUserInvite`

Retrieve a specific user invite.

**Params:**
- path* `userInviteId` (string) — ID of the user invite.

**Responses:**
- `200`: Successful operation. → UserInvite object.
- `404`: User invite not found.
- `500`:

---

### POST `/user-invites/{userInviteId}/resend`
**Resend a user invite**  · operationId: `resendUserInvite`

Resend a user invite by email (only if originally created with an email). Rate limited to one resend per minute. ⓘ Only permitted for user-owned keys.

**Params:**
- path* `userInviteId` (string) — ID of the user invite.

**Responses:**
- `200`: Successful operation.
- `404`: User invite not found.
- `500`:

---

# Contacts (3 operations)

### GET `/tailnet/{tailnet}/contacts`
**Get contacts**  · operationId: `getContacts`

Retrieve the tailnet's current contacts. OAuth Scope: `account_settings:read`.

**Params:**
- path* `tailnet` (string) — The tailnet ID. Legacy IDs still work for tailnets created before Oct 2025; the Tailnet ID is preferred.

**Responses:**
- `200`: Successful operation. → { `account`: { `email`: string; `fallbackEmail`: string; `needsVerification`: boolean }; `support`: { `email`: string; `fallbackEmail`: string; `needsVerification`: boolean }; `security`: { `email`: string; `fallbackEmail`: string; `needsVerification`: boolean } }
- `403`: User does not have sufficient access to view contacts on this tailnet.
- `404`: Tailnet not found.
- `500`:

---

### PATCH `/tailnet/{tailnet}/contacts/{contactType}`
**Update contact**  · operationId: `updateContact`

Update the preferences for this type of contact. Email changes trigger a verification email. OAuth Scope: `account_settings`.

**Params:**
- path* `tailnet` (string) — The tailnet ID. Legacy IDs still work for tailnets created before Oct 2025; the Tailnet ID is preferred.
- path* `contactType` (string (enum: 'account', 'support', 'security')) — Type of contact.

**Request body:** `application/json` { `email`*: string }

**Responses:**
- `200`: Successful operation.
- `403`: User does not have sufficient access to update contacts for this tailnet.
- `404`: Tailnet not found.
- `500`:

---

### POST `/tailnet/{tailnet}/contacts/{contactType}/resend-verification-email`
**Resend verification email**  · operationId: `resendContactVerificationEmail`

Resends the verification email for this contact, only if verification is still pending. OAuth Scope: `account_settings`.

**Params:**
- path* `tailnet` (string) — The tailnet ID. Legacy IDs still work for tailnets created before Oct 2025; the Tailnet ID is preferred.
- path* `contactType` (string (enum: 'account', 'support', 'security')) — Type of contact.

**Responses:**
- `200`: Successful operation.
- `400`: Verification is not required, can't resend email.
- `403`: User does not have sufficient access to update contacts for this tailnet.
- `404`: Tailnet not found.
- `500`:
