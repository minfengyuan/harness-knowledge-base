# DNS (11 operations)

### GET `/tailnet/{tailnet}/dns/configuration`
**Get DNS configuration**  · operationId: `getDnsConfiguration`

Retrieves the full DNS configuration for a tailnet: global nameservers, split DNS routes, search paths, and MagicDNS configuration.

**Params:**
- path* `tailnet` (string) — The tailnet ID. Legacy IDs still work for tailnets created before Oct 2025; the Tailnet ID is preferred.

**Responses:**
- `200`: Successful operation. → { `nameservers`: [] of { `address`: string; `useWithExitNode`: boolean }; `splitDNS`: object; `searchPaths`: [] of string; `preferences`: { `overrideLocalDNS`: boolean; `magicDNS`: boolean } }
- `404`: Tailnet not found.
- `500`:

---

### POST `/tailnet/{tailnet}/dns/configuration`
**Set DNS configuration**  · operationId: `setDnsConfiguration`

Replaces the full DNS configuration: `nameservers` (global resolvers used when `preferences.overrideLocalDNS` is true), `splitDNS` (domain suffix → resolver lists), `searchPaths`, `preferences.overrideLocalDNS` (default false), `preferences.magicDNS` (default false).

**Params:**
- path* `tailnet` (string) — The tailnet ID. Legacy IDs still work for tailnets created before Oct 2025; the Tailnet ID is preferred.

**Request body:** `application/json` { `nameservers`: [] of { `address`: string; `useWithExitNode`: boolean }; `splitDNS`: object; `searchPaths`: [] of string; `preferences`: { `overrideLocalDNS`: boolean; `magicDNS`: boolean } }

**Responses:**
- `200`: Successful operation. → Full DnsConfiguration object.
- `404`: Tailnet not found.
- `500`:

---

### GET `/tailnet/{tailnet}/dns/nameservers`
**List DNS nameservers**  · operationId: `listDnsNameservers`

Lists the global DNS nameservers for a tailnet.

**Params:**
- path* `tailnet` (string) — The tailnet ID. Legacy IDs still work for tailnets created before Oct 2025; the Tailnet ID is preferred.

**Responses:**
- `200`: Successful operation. → { `dns`: [] of string }
- `404`: Tailnet not found.
- `500`:

---

### POST `/tailnet/{tailnet}/dns/nameservers`
**Set DNS nameservers**  · operationId: `setDnsNameservers`

**Replaces** the global nameservers list. Changing nameservers can affect MagicDNS; **removing all nameservers automatically disables MagicDNS** (until explicitly re-enabled).

**Params:**
- path* `tailnet` (string) — The tailnet ID. Legacy IDs still work for tailnets created before Oct 2025; the Tailnet ID is preferred.

**Request body:** `application/json` { `dns`: [] of string }

**Responses:**
- `200`: Successful operation. → { `dns`: [] of string; `magicDNS`: boolean }
- `404`: Tailnet not found.
- `500`:

---

### GET `/tailnet/{tailnet}/dns/preferences`
**Get DNS preferences**  · operationId: `getDnsPreferences`

Retrieves the DNS preferences currently set for the tailnet.

**Params:**
- path* `tailnet` (string) — The tailnet ID. Legacy IDs still work for tailnets created before Oct 2025; the Tailnet ID is preferred.

**Responses:**
- `200`: Successful operation. → { `magicDNS`*: boolean }
- `404`: Tailnet not found.
- `500`:

---

### POST `/tailnet/{tailnet}/dns/preferences`
**Set DNS preferences**  · operationId: `setDnsPreferences`

Set the MagicDNS setting. MagicDNS requires at least one DNS server to be configured; otherwise an error is returned.

**Params:**
- path* `tailnet` (string) — The tailnet ID. Legacy IDs still work for tailnets created before Oct 2025; the Tailnet ID is preferred.

**Request body:** `application/json` { `magicDNS`*: boolean }

**Responses:**
- `200`: Successful operation. → { `magicDNS`*: boolean }
- `404`: Tailnet not found.
- `500`:

---

### GET `/tailnet/{tailnet}/dns/searchpaths`
**List DNS search paths**  · operationId: `listDnsSearchPaths`

Retrieves the list of search paths (search domains) currently set for the tailnet.

**Params:**
- path* `tailnet` (string) — The tailnet ID. Legacy IDs still work for tailnets created before Oct 2025; the Tailnet ID is preferred.

**Responses:**
- `200`: Successful operation. → { `searchPaths`*: [] of string }
- `404`: Tailnet not found.
- `500`:

---

### POST `/tailnet/{tailnet}/dns/searchpaths`
**Set DNS search paths**  · operationId: `setDnsSearchPaths`

**Replaces** the list of search paths for the tailnet.

**Params:**
- path* `tailnet` (string) — The tailnet ID. Legacy IDs still work for tailnets created before Oct 2025; the Tailnet ID is preferred.

**Request body:** `application/json` { `searchPaths`*: [] of string }

**Responses:**
- `200`: Successful operation. → { `searchPaths`*: [] of string }
- `404`: Tailnet not found.
- `500`:

---

### GET `/tailnet/{tailnet}/dns/split-dns`
**Get split DNS**  · operationId: `getSplitDns`

Retrieves the split DNS settings: a map from domain suffix to list of nameservers.

**Params:**
- path* `tailnet` (string) — The tailnet ID. Legacy IDs still work for tailnets created before Oct 2025; the Tailnet ID is preferred.

**Responses:**
- `200`: Successful operation. → object (domain → nameservers map)
- `404`: Tailnet not found.
- `500`:

---

### PATCH `/tailnet/{tailnet}/dns/split-dns`
**Update split DNS**  · operationId: `updateSplitDns`

**Partial** update of split DNS: only domains present in the request map are modified. Setting a mapping's value to `null` clears the nameservers for that domain.

**Params:**
- path* `tailnet` (string) — The tailnet ID. Legacy IDs still work for tailnets created before Oct 2025; the Tailnet ID is preferred.

**Request body:** `application/json` object (partial map)

**Responses:**
- `200`: Successful operation. → object
- `404`: Tailnet not found.
- `500`:

---

### PUT `/tailnet/{tailnet}/dns/split-dns`
**Set split DNS**  · operationId: `setSplitDns`

**Replaces** split DNS settings. `null` value clears nameservers for that domain; empty object clears all domains.

**Params:**
- path* `tailnet` (string) — The tailnet ID. Legacy IDs still work for tailnets created before Oct 2025; the Tailnet ID is preferred.

**Request body:** `application/json` object (full map)

**Responses:**
- `200`: Successful operation. → object
- `404`: Tailnet not found.
- `500`:

---

# Logging (8 operations)

### POST `/tailnet/{tailnet}/aws-external-id`
**Create or get AWS external id**  · operationId: `getAwsExternalId`

Get an AWS external ID for streaming tailnet logs to S3 using role-based authentication; creates one for the tailnet when necessary. OAuth Scope: `log_streaming`.

**Params:**
- path* `tailnet` (string) — The tailnet ID. Legacy IDs still work for tailnets created before Oct 2025; the Tailnet ID is preferred.

**Request body:** `application/json` { `reusable`: boolean }

**Responses:**
- `200`: Successful operation. → { `externalId`: string; `tailscaleAwsAccountId`: string }
- `403`: User does not have sufficient access to obtain an AWS external id.
- `404`: Tailnet not found.

---

### POST `/tailnet/{tailnet}/aws-external-id/{id}/validate-aws-trust-policy`
**Validate external ID integration with IAM role trust policy**  · operationId: `validateAwsExternalId`

Validate that Tailscale can assume your IAM role with (and only with) this external ID. OAuth Scope: `log_streaming`.

**Params:**
- path* `tailnet` (string) — The tailnet ID. Legacy IDs still work for tailnets created before Oct 2025; the Tailnet ID is preferred.
- path* `id` (string) — The AWS external ID to validate.

**Request body:** `application/json` { `roleArn`: string }

**Responses:**
- `200`: Validation succeeded for this external ID and IAM role.
- `403`: User does not have sufficient access for this tailnet.
- `404`: Tailnet or external ID not found.
- `422`: Validation failed. → { `message`: string }

---

### GET `/tailnet/{tailnet}/logging/configuration`
**List configuration audit logs**  · operationId: `listConfigurationAuditLogs`

List configuration audit logs for a tailnet. OAuth Scope: `logs:configuration:read`.

**Params:**
- path* `tailnet` (string) — The tailnet ID. Legacy IDs still work for tailnets created before Oct 2025; the Tailnet ID is preferred.
- query* `start` (string) — Start of the time window, RFC 3339.
- query* `end` (string) — End of the time window, RFC 3339.
- query `actor` ([] of string) — Filters on actors (exact IDs or `~search` wildcard on login/display name).
- query `target` ([] of string) — Filters on target elements (partial match).
- query `event` ([] of string) — Filters on event types; large enum of `DOMAIN.ACTION` values (e.g. `NODE.CREATE`, `NODE.DELETE`, `API_KEY.REVOKE`, `TAILNET.ENABLE.MAGIC_DNS`, `USER.*`, `INVITE.*` …).

**Responses:**
- `200`: Successful operation. → { `version`: string; `tailnet`: string; `logs`: [] of ConfigurationAuditLog }
- `400`: Request has missing or invalid parameter(s).
- `403`: User does not have sufficient access to view configuration audit logs.
- `404`: Logging is not supported on this deployment of Tailscale.

---

### GET `/tailnet/{tailnet}/logging/network`
**List network flow logs**  · operationId: `listNetworkFlowLogs`

List network flow logs for a tailnet. OAuth Scope: `logs:network:read`.

**Params:**
- path* `tailnet` (string) — The tailnet ID. Legacy IDs still work for tailnets created before Oct 2025; the Tailnet ID is preferred.
- query* `start` (string) — Start of the time window, RFC 3339.
- query* `end` (string) — End of the time window, RFC 3339.

**Responses:**
- `200`: Successful operation. → { `logs`: [] of { `logged`: string; `nodeId`: string; `start`: string; `end`: string; `virtualTraffic` / `subnetTraffic` / `exitTraffic` / `physicalTraffic`: [] of { `proto`: enum('ah','dccp','egp','esp','gre','icmp','igmp','igp','ipv4','ipv6-icmp','sctp','tcp','udp'); `src`: string; `dst`: string; `txPkts`: integer; `txBytes`: integer; `rxPkts`: integer; `rxBytes`: integer } } }
- `400`: Request has missing or invalid parameter(s).
- `403`: User does not have sufficient access to view network flow logs.
- `404`: Logging is not supported on this deployment of Tailscale.
- `502`: The system was unable to communicate with logging server.

---

### DELETE `/tailnet/{tailnet}/logging/{logType}/stream`
**Disable log streaming**  · operationId: `disableLogStreaming`

Delete the log streaming configuration for the provided log type. OAuth Scope: `log_streaming`.

**Params:**
- path* `tailnet` (string) — The tailnet ID. Legacy IDs still work for tailnets created before Oct 2025; the Tailnet ID is preferred.
- path* `logType` (string (enum: 'configuration', 'network')) — The type of log.

**Responses:**
- `200`: Successful operation.
- `403`: User does not have sufficient access to update log streaming configuration.
- `404`: Log streaming not configured / unsupported `logType` / insufficient access.

---

### GET `/tailnet/{tailnet}/logging/{logType}/stream`
**Get log streaming configuration**  · operationId: `getLogStreamingConfiguration`

Retrieve the log streaming configuration for the provided log type. OAuth Scope: `log_streaming:read`.

**Params:**
- path* `tailnet` (string) — The tailnet ID. Legacy IDs still work for tailnets created before Oct 2025; the Tailnet ID is preferred.
- path* `logType` (string (enum: 'configuration', 'network')) — The type of log.

**Responses:**
- `200`: Successful operation. → { `logType`: enum('configuration','network'); `destinationType`: enum('splunk','elastic','panther','cribl','datadog','axiom','s3'); `url`: string; `user`: string; `uploadPeriodMinutes`: integer; `compressionFormat`: enum('zstd','gzip','none'); `token`: string; `s3Bucket`: string; `s3Region`: string; `s3KeyPrefix`: string; `s3AuthenticationType`: enum('accesskey','rolearn'); `s3AccessKeyId`: string; `s3SecretAccessKey`: string; `s3RoleArn`: string }
- `404`: Log streaming not configured / unsupported / insufficient access.

---

### PUT `/tailnet/{tailnet}/logging/{logType}/stream`
**Set log streaming configuration**  · operationId: `setLogStreamingConfiguration`

Set the log streaming configuration for the provided log type. OAuth Scope: `log_streaming` (+ `device_invites` and `policy_file` if streaming to a private endpoint).

**Params:**
- path* `tailnet` (string) — The tailnet ID. Legacy IDs still work for tailnets created before Oct 2025; the Tailnet ID is preferred.
- path* `logType` (string (enum: 'configuration', 'network')) — The type of log.

**Request body:** `application/json` LogstreamEndpointConfiguration (see GET schema above).

**Responses:**
- `200`: Successful operation.
- `400`: Request has missing or invalid parameter(s).
- `403`: User does not have sufficient access to update log streaming configuration.
- `404`: Tailnet not found / unsupported `logType` / insufficient access.

---

### GET `/tailnet/{tailnet}/logging/{logType}/stream/status`
**Get log streaming status**  · operationId: `getLogStreamingStatus`

Retrieve the log streaming status for the provided log type. OAuth Scope: `log_streaming:read`.

**Params:**
- path* `tailnet` (string) — The tailnet ID. Legacy IDs still work for tailnets created before Oct 2025; the Tailnet ID is preferred.
- path* `logType` (string (enum: 'configuration', 'network')) — The type of log.

**Responses:**
- `200`: Successful operation. → { `lastActivity`*, `lastError`*, `maxBodySize`*, `numBytesSent`*, `numEntriesSent`*, `numSpoofedEntries`*, `numTotalRequests`*, `numFailedRequests`*, `rateBytesSent`*, `rateEntriesSent`*, `rateTotalRequests`*, `rateFailedRequests`* }
- `404`: Log streaming not configured / unsupported / insufficient access.
- `502`: The system was unable to communicate with logging server.
