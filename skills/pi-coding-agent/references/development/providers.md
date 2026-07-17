# Custom models and providers

## When to read

Read this when a built-in provider is insufficient: local models, gateways/proxies, dynamic model discovery, OAuth/SSO, or non-standard streaming APIs.

## Select the simplest mechanism

1. **Built-in provider + `/login`/environment/auth file** for ordinary use.
2. **`models.json`** for declarative local models, proxies, and supported OpenAI/Anthropic/Google-compatible APIs.
3. **Extension `pi.registerProvider()`** for dynamic registration, OAuth, headers, runtime setup, or custom behavior.
4. **Custom `streamSimple`** only for an API not covered by the supported streaming implementations.

Supported API families include `openai-completions`, `openai-responses`, `anthropic-messages`, and `google-generative-ai`; the exact extension API list is version-sensitive.

## Compatibility cautions

For compatible-but-not-identical servers, inspect `compat` fields before testing: developer-role support, reasoning controls, token field names, usage streaming, tool result names, cache-control, thinking formats, and session affinity can all affect requests. Model-level `thinkingLevelMap` describes which Pi thinking levels are supported.

Provider credentials support literals, `$ENV_VAR`/`${ENV_VAR}` interpolation, and leading `!command` resolution. Avoid logging resolved values.

## Extension provider rule

Register a provider in an async Extension factory when it must be available during startup or `pi --list-models`. Registering models replaces the provider's model list; overriding only `baseUrl`/headers preserves existing built-in models. OAuth registration integrates with `/login`.

For custom streams, emit the expected start/content/done-or-error event sequence, honor `AbortSignal`, update usage/cost, and normalize recognizable context-overflow errors so Pi can compact and retry. Test streaming, abort, empty responses, token accounting, images, tool calls, Unicode, and overflow behavior.

Read `references/upstream/models.md` for `models.json`, `references/upstream/custom-provider.md` for registration/streaming/OAuth, and `references/upstream/providers.md` for supported built-in credentials and cloud providers.
