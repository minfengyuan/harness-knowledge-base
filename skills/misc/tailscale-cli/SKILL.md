---
name: tailscale-cli
description: Complete tailscale CLI usage — all subcommands, flags, and common workflows (v1.96+)
metadata:
  title: Tailscale CLI Reference
  category: devops
---

# Tailscale CLI Reference

> `tailscale` — WireGuard-based zero-config VPN.
> Bin: `/usr/local/bin/tailscale` | Sock: `/var/run/tailscaled.socket`

## Global Flags

```
--socket value   path to tailscaled socket (default /var/run/tailscaled.socket)
```

Most commands also accept `--json` for machine-readable output.

---

## 1. Connection Management

### `tailscale up`
Connect to Tailscale, logging in if needed. **With flags, must specify the complete set** of desired settings (use `--reset` to override).

| Flag | Description |
|------|-------------|
| `--accept-dns` | Accept DNS config from admin panel (default true) |
| `--accept-routes` | Accept routes advertised by other nodes (default false) |
| `--advertise-routes` | Routes to advertise (e.g. `10.0.0.0/8,192.168.0.0/24`) |
| `--advertise-exit-node` | Offer as exit node (default false) |
| `--advertise-connector` | Advertise as app connector (default false) |
| `--advertise-tags` | ACL tags to request (e.g. `tag:eng,tag:ssh`) |
| `--auth-key` | Node authorization key (or `file:/path` to read from file) |
| `--exit-node` | Exit node to use (IP, base name, or `auto:any`) |
| `--exit-node-allow-lan-access` | Allow local LAN when using exit node |
| `--hostname` | Override hostname |
| `--login-server` | Base URL of control server |
| `--operator` | Unix user allowed to operate tailscaled without sudo |
| `--shields-up` | Block incoming connections |
| `--ssh` | Run SSH server per tailnet policy |
| `--force-reauth` | Force reauthentication |
| `--reset` | Reset unspecified settings to defaults |
| `--timeout` | Max time to wait for Running state (0=forever) |
| `--json` | JSON output |
| `--accept-risk` | Skip confirmation for: `lose-ssh`, `mac-app-connector`, `all` |
| `--client-id` / `--client-secret` / `--audience` / `--id-token` | Workload identity federation |
| `--qr` / `--qr-format` | Show QR code for login URLs |

### `tailscale down`
Disconnect from Tailscale.

```
tailscale down [--accept-risk <type>] [--reason <string>]
```

### `tailscale login`
Log in to a Tailscale account (alpha). Supports same flags as `up` for connection options.

### `tailscale logout`
Disconnect and expire current node key (forces reauth on next use).

```
tailscale logout [--reason <string>]
```

### `tailscale switch`
Switch between logged-in accounts (alpha).

```
tailscale switch <id>                  # switch to account
tailscale switch --list [--json]       # list available accounts
```

**Subcommands:**
- `tailscale switch remove <id>` — Remove a stored account

### `tailscale set`
Change specific preferences **without** requiring the full set (unlike `up`).

```
tailscale set --ssh --accept-routes --hostname=foo
```

Additional flags unique to `set`:
- `--auto-update` — Auto-update to latest version
- `--nickname` — Nickname for current account
- `--update-check` — Notify about available updates
- `--webclient` — Expose web UI at port 5252 over tailnet
- `--relay-server-port` — UDP port for relay (empty = disable)
- `--relay-server-static-endpoints` — Static IP:port endpoints for relay
- `--report-posture` — Allow device posture reporting

---

## 2. Status & Diagnostics

### `tailscale status`
Show state of tailscaled and connections.

```
tailscale status [--active] [--web] [--json] [--browser] [--header]
                 [--listen <addr>] [--peers] [--self]
```

- `--web` — Run web server with HTML status (default `127.0.0.1:8384`)
- `--active` — Only peers with active sessions
- `--peers` / `--self` — Show peers / local machine (default true)

### `tailscale netcheck`
Analyze local network conditions (NAT type, DERP latency, etc.).

```
tailscale netcheck [--bind-address <ip>] [--bind-port <port>]
                   [--every <duration>] [--format <json|json-line>]
                   [--verbose]
```

### `tailscale ping`
Ping a peer at the Tailscale layer (shows DERP vs direct path).

```
tailscale ping <hostname-or-IP>
  --c <n>            max pings (0=infinity, default 10)
  --icmp             ICMP-level ping (through WireGuard)
  --tsmp             TSMP-level ping (through both stacks)
  --peerapi          hit peer's peerapi HTTP
  --size <n>         ping message size
  --timeout <dur>    per-ping timeout (default 5s)
  --until-direct     stop once direct path established (default true)
  --verbose
```

### `tailscale whois`
Look up machine and user for a Tailscale IP.

```
tailscale whois [--json] <ip[:port]> [--proto tcp|udp]
```

### `tailscale dns`
Diagnose the internal DNS forwarder (100.100.100.100).

**Subcommands:**
- `tailscale dns status [--all] [--json]` — Show DNS config, MagicDNS status, resolvers, split DNS routes, cert domains, extra records
- `tailscale dns query [--json] <name> [type]` — Query DNS (default A record; types: AAAA, CNAME, MX, NS, PTR, SRV, TXT)

### `tailscale ip`
Show Tailscale IP addresses.

```
tailscale ip [-1] [-4] [-6] [peer hostname or IP]
  --assert <ip>    assert node's IP matches
```

### `tailscale metrics`
Show user-facing metrics (Prometheus format).

**Subcommands:**
- `tailscale metrics print` — Print current values
- `tailscale metrics write <path>` — Write to file (for node_exporter textfile collector)

### `tailscale bugreport`
Generate shareable bug report identifier.

```
tailscale bugreport [note] [--diagnose] [--record]
```

### `tailscale syspolicy`
Diagnose MDM and system policy configuration.

**Subcommands:**
- `tailscale syspolicy list [--json]` — Print effective policy settings
- `tailscale syspolicy reload [--json]` — Force reload policies

---

## 3. Serve & Funnel

### `tailscale serve`
Share local services **within your tailnet**.

```
tailscale serve <target>                          # foreground
tailscale serve --bg 3000                         # background
tailscale serve status [--json]                   # view config
tailscale serve reset                             # reset all config
tailscale serve drain <service>                   # graceful drain (no new connections)
tailscale serve clear <service>                   # remove all handlers for a service
tailscale serve advertise <service>               # re-advertise after drain
tailscale serve get-config <file> [--service=]    # export config
tailscale serve set-config <file> [--service=]    # import config
```

**Target formats:** `3000`, `localhost:3000`, `http://localhost:3000/foo`, `https+insecure://localhost:8443`, `unix:/tmp/myservice.sock`

**Key flags:**
- `--bg` — Run as background process
- `--http <port>` / `--https <port>` — HTTP/HTTPS mode
- `--tcp <port>` / `--tls-terminated-tcp <port>` — TCP forwarding
- `--set-path <path>` — Append path to base URL
- `--proxy-protocol <1|2>` — PROXY protocol for TCP
- `--service <name>` — Serve on a service with distinct virtual IP
- `--tun` — Forward all traffic to local machine (services only)
- `--accept-app-caps` — App capabilities to forward
- `--yes` — Non-interactive

### `tailscale funnel`
Share local services **on the internet** (requires Funnel enabled).

```
tailscale funnel <target>              # foreground
tailscale funnel --bg <target>         # background
tailscale funnel status [--json]       # view config
tailscale funnel reset                 # reset config
```

Same flags as `serve` (subset: `--bg`, `--https`, `--tcp`, `--tls-terminated-tcp`, `--set-path`, `--proxy-protocol`, `--yes`).

---

## 4. Network Tools

### `tailscale ssh`
SSH to a Tailscale machine (wrapper that resolves via MagicDNS, works in userspace mode, auto-checks host keys).

```
tailscale ssh [user@]<host> [args...]
```

### `tailscale nc`
Connect to a port on a host (stdin/stdout).

```
tailscale nc <hostname-or-IP> <port>
```

---

## 5. File Transfer (Taildrop)

### `tailscale file cp`
Send files to another node.

```
tailscale file cp <files...> <target>:
  --name <alt>        alternate filename (useful with stdin)
  --targets           list possible targets
  --verbose
```

### `tailscale file get`
Receive files from inbox.

```
tailscale file get [--wait] [--verbose] [--conflict=skip|overwrite|rename] <target-directory>
  --conflict skip       skip conflicting files (default)
  --conflict overwrite  overwrite existing
  --conflict rename     write to number-suffixed filename
  --loop                run in loop, receive as they come
  --wait                wait if inbox is empty
```

---

## 6. Security & Auth

### `tailscale cert`
Get TLS certificates for a domain in your tailnet.

```
tailscale cert [--cert-file <path>] [--key-file <path>]
               [--min-validity <dur>] [--serve-demo] <domain>
```

- Defaults: `DOMAIN.crt` / `DOMAIN.key` if both `--cert-file` and `--key-file` unset
- Pass `-` for stdout

### `tailscale lock`
Manage **tailnet lock** (key-signing based auth enforcement).

| Subcommand | Usage |
|------------|-------|
| `init` | Initialize tailnet lock (`--gen-disablements N --gen-disablement-for-support`) |
| `status [--json]` | Output lock state |
| `add <pubkey>...` | Add trusted signing keys |
| `remove <pubkey>...` | Remove trusted signing keys (with `--re-sign`) |
| `sign <node-key> [<rotation-key>]` | Sign a node key or auth key |
| `sign <auth-key>` | Sign a pre-approved auth key |
| `disable <secret>` | Consume disablement secret to disable lock |
| `disablement-kdf <hex-secret>` | Compute disablement value (advanced) |
| `log [--limit N] [--json]` | List lock changes |
| `local-disable` | Disable lock for this node only |
| `revoke-keys <key>... [--cosign] [--finish]` | Multi-step revocation of compromised keys |

---

## 7. Configuration & Management

### `tailscale configure`
Enable Tailscale features on the host.

| Subcommand | Description |
|------------|-------------|
| `kubeconfig <hostname>` | Configure kubectl via Tailscale Auth Proxy (`--http` to use HTTP) |
| `sysext activate\|deactivate\|status` | Manage macOS system extension (Standalone variant) |
| `mac-vpn install\|uninstall` | Manage macOS VPN config entry |

### `tailscale exit-node`
List or suggest exit nodes.

```
tailscale exit-node list [--filter <country>]
tailscale exit-node suggest
```

### `tailscale appc-routes`
Show App Connector route info.

```
tailscale appc-routes [--all] [--map] [-n]
  --all    learned domains + routes + extra policy routes
  --map    map of learned domains -> [routes]
  -n       total route count advertised
```

### `tailscale web`
Run web UI for controlling Tailscale (NAS-oriented).

```
tailscale web [--listen <addr>] [--readonly] [--cgi]
              [--origin <url>] [--prefix <prefix>]
```

### `tailscale update`
Update Tailscale to latest version.

```
tailscale update [--dry-run] [--yes]
```

### `tailscale version`
Print version info.

```
tailscale version [--daemon] [--json] [--track stable|release-candidate|unstable] [--upstream]
```

### `tailscale wait`
Block until Tailscale interface is ready (for service ordering).

```
tailscale wait [--timeout <dur>]
```

### `tailscale completion`
Generate shell completion scripts.

```
tailscale completion bash          # source <(tailscale completion bash)
tailscale completion zsh           # source <(tailscale completion zsh)
tailscale completion fish          # tailscale completion fish | source
tailscale completion powershell    # ... | Out-String | Invoke-Expression
```

Common flags: `--descs` (include descriptions, default true), `--flags` (suggest flag completions, default true)

---

## 8. Info

### `tailscale licenses`
Print open source license information.

---

## Common Workflows

```bash
# Quick connect
tailscale up

# Connect with exit node
tailscale up --exit-node=100.x.y.z

# Connect as exit node + SSH server
tailscale up --advertise-exit-node --ssh --accept-routes

# Advertise subnet routes
tailscale up --advertise-routes=10.0.1.0/24,10.0.2.0/24

# Use custom control server (e.g. Headscale)
tailscale up --login-server=https://my-headscale.example.com

# Change a single setting without re-specifying everything
tailscale set --ssh=false

# Share a local web app on tailnet
tailscale serve 3000

# Share on the internet via Funnel
tailscale funnel --bg 8080

# Check why routing is slow
tailscale ping 100.x.y.z
tailscale netcheck

# Send/receive files (Taildrop)
tailscale file cp ./notes.txt my-laptop:
tailscale file get ~/Downloads/

# Get TLS cert for HTTPS
tailscale cert my-service.tailnet-name.ts.net

# Debug DNS
tailscale dns query my-service.tailnet-name.ts.net AAAA
tailscale dns status --all --json

# Non-interactive auth with auth key
tailscale up --auth-key=tskey-auth-xxxxx

# Find peers
tailscale status --json | jq '.Peer[] | {name: .DNSName, addrs: .TailscaleIPs}'

# Wait for Tailscale before starting a service (systemd)
tailscale wait && /usr/bin/my-service
```
