#!/usr/bin/env bash
# tsapi.sh — thin curl wrapper for the Tailscale REST API
# Usage:   tsapi.sh METHOD PATH [JSON_BODY]
# Example: tsapi.sh GET  /tailnet/-/devices
#          tsapi.sh POST /tailnet/-/keys '{"capabilities":{"devices":{"create":{"reusable":true,"preauthorized":true,"tags":["tag:server"]}}}}'
#          tsapi.sh GET  /tailnet/example.com/dns/preferences
#
# Env: TS_API_TOKEN (required) — tskey-api-... or tskey-client-...
#      TS_BASE (optional, default https://api.tailscale.com/api/v2)
#      TS_TAILNET (optional) — shorthand: if PATH starts with '/tailnet//' it is rewritten to /tailnet/$TS_TAILNET/
set -euo pipefail

METHOD="${1:?usage: tsapi.sh METHOD PATH [JSON_BODY]}"
PATH_ARG="${2:?missing PATH}"
BODY="${3:-}"

TS_BASE="${TS_BASE:-https://api.tailscale.com/api/v2}"
if [[ -z "${TS_API_TOKEN:-}" ]]; then
  echo "error: TS_API_TOKEN is not set (tskey-api-... or tskey-client-...)" >&2
  exit 2
fi
# convenience: '/tailnet//x' → '/tailnet/$TS_TAILNET/x'
if [[ -n "${TS_TAILNET:-}" && "$PATH_ARG" == /tailnet//* ]]; then
  PATH_ARG="/tailnet/${TS_TAILNET}${PATH_ARG#/tailnet/}"
fi

ARGS=(-sS -X "$METHOD" -H "Authorization: Bearer ${TS_API_TOKEN}")
if [[ -n "$BODY" ]]; then
  if [[ "$BODY" == @* && -f "${BODY#@}" ]]; then
    ARGS+=(--data-binary "$BODY")
  else
    ARGS+=(-H "Content-Type: application/json" -d "$BODY")
  fi
fi

HTTP_CODE=$(curl "${ARGS[@]}" -o /tmp/tsapi-response.$$ -w "%{http_code}" "$TS_BASE$PATH_ARG")
echo "HTTP $HTTP_CODE" >&2
if [[ "$HTTP_CODE" != 2* ]]; then
  cat /tmp/tsapi-response.$$ >&2
  rm -f /tmp/tsapi-response.$$
  exit 1
fi
cat /tmp/tsapi-response.$$
rm -f /tmp/tsapi-response.$$
