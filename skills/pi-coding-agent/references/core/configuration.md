# Configuration, providers, and models

## When to read

Read this guide when a task involves login, API keys, OAuth, model selection, custom providers, `settings.json`, `models.json`, thinking levels, retries, or keybindings.

## Credential setup

Interactive subscription or API-key setup:

```text
/login
/logout
```

API keys can also be provided through provider-specific environment variables. Pi stores credentials in `~/.pi/agent/auth.json` when `/login` is used. Resolution order is generally CLI `--api-key`, stored `auth.json`, environment, then custom provider configuration. Never display `auth.json` or secret values.

## Settings locations and precedence

| Scope | File |
|---|---|
| Global | `~/.pi/agent/settings.json` |
| Project | `.pi/settings.json` |

Project settings override global settings; nested objects are merged. Important settings include:

- `defaultProvider`, `defaultModel`, `defaultThinkingLevel`
- `compaction.enabled`, `compaction.reserveTokens`, `compaction.keepRecentTokens`
- `retry.enabled`, `retry.maxRetries`, provider timeout/retry settings
- `steeringMode`, `followUpMode`, `transport`
- `packages`, `extensions`, `skills`, `prompts`, `themes`
- `defaultProjectTrust`
- `terminal.*`, `images.*`, `externalEditor`, `shellPath`, `shellCommandPrefix`

Use `/settings` for common interactive settings. Use `/reload` after changing resources or context; restart when a setting is not hot-reloaded.

## Model selection

```bash
pi --provider anthropic --model <model-id> "..."
pi --model <provider>/<model-id>:high "..."
pi --thinking high "..."
pi --list-models
```

In interactive mode use `/model`, Ctrl+L, or Ctrl+P for scoped model cycling. Thinking levels are `off`, `minimal`, `low`, `medium`, `high`, `xhigh`, and `max`, but availability is model-specific.

## Custom models

Use `~/.pi/agent/models.json` for Ollama, LM Studio, vLLM, proxies, and other endpoints implementing a supported API. Supported API families include:

- `openai-completions`
- `openai-responses`
- `anthropic-messages`
- `google-generative-ai`

A local OpenAI-compatible model typically needs `baseUrl`, `api`, `apiKey` (possibly a placeholder), and a `models` array. Use `compat` for server differences such as developer roles, reasoning parameters, token field names, and tool result formatting.

Read the pinned `references/upstream/models.md` before editing `models.json`; small compatibility fields can change request serialization.

## Decision rule

- Use `/login` or environment/auth storage for normal built-in providers.
- Use `models.json` for declarative model/proxy configuration.
- Use an Extension with `pi.registerProvider()` for dynamic discovery, OAuth/SSO, or a non-standard streaming API.
- Use `--api-key` only for a one-run override.

For exact provider names, environment variables, cloud setup, model fields, or keybinding IDs, read `references/upstream/providers.md`, `models.md`, `settings.md`, or `keybindings.md` rather than guessing.
