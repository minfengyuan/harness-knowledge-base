# Platform and terminal routing

## When to read

Read this when Pi receives the wrong modified keys, behaves differently in tmux/IDE terminals, needs Windows/Termux setup, or shell aliases are missing.

## Route by symptom

- Kitty, iTerm2, Ghostty, WezTerm, Alacritty, VS Code, Windows Terminal, or IntelliJ key reporting: read `references/upstream/terminal-setup.md`.
- tmux drops Shift+Enter/Ctrl+Enter/Alt+Enter: read `references/upstream/tmux.md`; tmux 3.5+ should use `extended-keys` with `csi-u`.
- Native Windows cannot find bash: read `references/upstream/windows.md`; Pi requires Git Bash, Cygwin, MSYS2, or WSL bash.
- Termux on Android: read `references/upstream/termux.md`; image clipboard is unavailable and shared-storage permission may be required.
- Bash aliases do not expand: read `references/upstream/shell-aliases.md` and configure `shellCommandPrefix` deliberately.

Do not change terminal-wide keybindings blindly. First identify the terminal, whether tmux is in use, and whether the problem is Shift+Enter, Alt+Enter, IME cursor placement, or shell initialization.
