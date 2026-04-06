# Contributing to Kanban Widget

Thank you for considering contributing! Here's everything you need to know.

---

## Getting started

1. **Fork** the repository on GitHub
2. **Clone** your fork locally:
   ```bash
   git clone https://github.com/YOUR_USERNAME/kanban-widget.git
   cd kanban-widget
   ```
3. **Install dependencies:**
   ```bash
   pnpm install
   ```
4. **Start the dev server:**
   ```bash
   pnpm tauri dev
   ```

Frontend changes appear instantly via Vite HMR. Rust backend changes trigger an automatic recompile.

---

## Project structure

```
src/                  React + TypeScript frontend
src-tauri/            Rust backend (Tauri)
src-tauri/src/        Rust source files
src-tauri/icons/      App icons (all sizes)
src-tauri/capabilities/  Tauri permission scopes
```

---

## Commit conventions

This project follows [Conventional Commits](https://www.conventionalcommits.org/):

| Prefix | When to use |
|--------|-------------|
| `feat:` | New feature |
| `fix:` | Bug fix |
| `style:` | CSS / visual changes only |
| `refactor:` | Code refactor, no behavior change |
| `perf:` | Performance improvement |
| `docs:` | Documentation only |
| `chore:` | Build, config, dependencies |
| `test:` | Tests |

Example: `feat: add due dates to task cards`

---

## Code style

- **TypeScript**: strict mode is on. No `any` unless absolutely necessary.
- **Components**: use `React.memo` for components that render in lists.
- **Callbacks**: use `useCallback` for handlers passed as props.
- **State mutations**: always create new objects/arrays, never mutate in place.
- **CSS**: use Tailwind utility classes first. Add to `styles.css` only for things that can't be done inline (animations, scrollbars, markdown scoped styles).

---

## Pull request checklist

Before opening a PR, please verify:

- [ ] `npx tsc --noEmit` passes with no errors
- [ ] The feature works in `pnpm tauri dev`
- [ ] No new `console.log` left in the code
- [ ] CHANGELOG.md updated under `[Unreleased]`
- [ ] Commit messages follow Conventional Commits

---

## Reporting issues

Use the [issue templates](https://github.com/agenciaRSE/kanban-widget/issues/new/choose):

- 🐛 **Bug report** — something isn't working
- 💡 **Feature request** — an idea for improvement

Please include your Windows version and whether you're using the installed app or `pnpm tauri dev`.

---

## License

By contributing, you agree that your contributions will be licensed under the [GPL v3](../LICENSE).
