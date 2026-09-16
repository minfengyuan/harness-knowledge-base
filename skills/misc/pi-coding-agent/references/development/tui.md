# TUI, themes, and keybindings

## When to read

Read this only for custom interactive rendering, dialogs, overlays, editors, tool renderers, themes, or keyboard configuration.

## TUI fundamentals

Pi TUI components implement `render(width): string[]`, optional `handleInput(data)`, and `invalidate()`. Every rendered line must fit within the supplied width. Use `visibleWidth`, `truncateToWidth`, and `wrapTextWithAnsi` for ANSI-safe layout. Call `tui.requestRender()` after state changes.

Use existing components such as `SelectList`, `SettingsList`, `BorderedLoader`, `Text`, `Box`, `Container`, `Markdown`, and `Image` before writing a new component. Use `ctx.ui.custom()` for temporary UI and `{ overlay: true }` for overlays. Use the injected `theme` and `keybindings`; do not import a global theme instance.

Components with text cursors/IME input should implement or propagate `Focusable`. Rebuild cached theme-colored content in `invalidate()` when the theme can change.

## Themes and keybindings

- Custom themes are JSON files under `~/.pi/agent/themes/` or trusted project/package locations; select with `/settings` or `theme` in settings.
- Custom keybindings live in `~/.pi/agent/keybindings.json`; namespaced ids such as `app.model.select` and `tui.input.newLine` must be used.
- `/reload` applies keybinding changes; custom themes hot-reload when the active file changes.

Keep TUI-specific code behind `ctx.mode === "tui"`; RPC supports dialog UI through its protocol but not all terminal components.

Read `references/upstream/tui.md` for component/overlay APIs and patterns, `themes.md` for the full color schema, `keybindings.md` for all ids, and the relevant `extensions.md` rendering section for tool/message renderers.
