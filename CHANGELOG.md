# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

---

## [1.0.0] — 2025-04-07

### Added

- Initial release of Kanban Widget
- Three-column Kanban board (To Do, In Progress, Done)
- Drag-and-drop task movement via @dnd-kit/react
- Task cards with title, description, and 8 color options with glow border effect
- Inline task creation and editing via shared TaskForm component
- **Editable column names** — double-click any column header to rename it
- **Markdown descriptions** — bold, italic, strikethrough, lists, inline code via react-markdown + remark-gfm
- Custom frameless transparent window with dark shadcn theme (oklch tokens)
- White gradient overlay on cards for depth effect
- Animated SVG logo in the title bar (3 gradient columns)
- Custom app icons (ICO, PNG, ICNS) matching the SVG logo design
- Pin-on-top toggle to float the widget above all windows
- Debounced auto-save (500ms) to `%APPDATA%\com.agencia-rse.kanban-widget\kanban.json`
- **Responsive layout** — columns stack vertically when the window is resized narrow
- React.memo optimization on TaskCard and Column components
- CSS-only animations for drag feedback, form entrance, and logo pulse/bounce

### Security

- Enabled Content Security Policy (restrictive — `default-src 'self'`)
- Removed unused `tauri-plugin-opener` dependency
- Input length validation: title ≤ 200 chars, description ≤ 2000 chars
- Error handling on all storage I/O operations
- Timer cleanup on component unmount

### Technical

- Tauri v2 + React 19 + TypeScript 5.8 + Vite 7
- Tailwind CSS v4 via `@tailwindcss/vite` plugin
- MSVC linker workaround for project paths containing spaces
- Custom `.cargo/config.toml` with explicit target directory

---

[1.0.0]: https://github.com/agenciaRSE/kanban-widget/releases/tag/v1.0.0
