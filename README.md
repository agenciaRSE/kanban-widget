<div align="center">

<img src="src-tauri/icons/128x128.png" width="80" alt="Kanban Widget logo" />

# Kanban Widget

**A lightweight, always-on-top Kanban board that lives on your Windows desktop.**

Built with Tauri v2 + React — stays out of your way and uses only ~42 MB of RAM.

[![License: GPL v3](https://img.shields.io/badge/License-GPLv3-blue.svg)](LICENSE)
[![Made with Tauri](https://img.shields.io/badge/Made%20with-Tauri%20v2-blue?logo=tauri)](https://tauri.app)
[![React](https://img.shields.io/badge/React-19-61DAFB?logo=react&logoColor=white)](https://react.dev)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.8-3178C6?logo=typescript&logoColor=white)](https://www.typescriptlang.org)

</div>

---

## What is this?

Kanban Widget is a minimal productivity tool that sits on your Windows desktop as a floating panel. You can pin it above all other windows to keep your tasks always visible while you work — without opening a browser tab or a heavy app.

It follows a simple Kanban flow across three customizable columns, supports rich Markdown descriptions in cards, and persists everything locally with no account required.

---

## Features

- 🗂 **3 customizable columns** — double-click any column header to rename it
- 🎨 **Color-coded cards** — 8 accent colors with glow border effect
- ✍️ **Markdown descriptions** — bold, italic, strikethrough, lists, inline code
- 🖱 **Drag & drop** — reorder and move tasks across columns
- 📌 **Pin on top** — float the widget above all windows
- 💾 **Auto-save** — changes persist instantly to a local JSON file
- 📐 **Responsive** — columns stack vertically when the window is narrow
- 🪶 **Ultra-lightweight** — ~42 MB RAM, no Electron, no Chromium overhead
- 🔒 **100% local** — no accounts, no telemetry, no internet required

---

## Installation

Download the latest installer from [**Releases**](https://github.com/agenciaRSE/kanban-widget/releases):

| Installer | Description |
|-----------|-------------|
| `Kanban Widget_x.x.x_x64-setup.exe` | NSIS installer — recommended for most users |
| `Kanban Widget_x.x.x_x64_en-US.msi` | MSI package — for enterprise/group policy |

Run the installer and the widget is ready. No restart needed.

---

## Usage

### Task management

| Action | How to do it |
|--------|-------------|
| Create a task | Click **+ New task...** in any column |
| Edit a task | Double-click a card, or hover → pencil icon |
| Delete a task | Hover a card → × icon |
| Move a task | Drag and drop between columns |
| Rename a column | Double-click the column header |
| Pin on top | Click the 📌 pin icon in the title bar |
| Minimize | Click **—** in the title bar |
| Resize | Drag any edge of the window |

### Markdown in descriptions

Task descriptions support **GitHub Flavored Markdown**:

```markdown
**bold text**          → bold
*italic text*          → italic
~~strikethrough~~      → strikethrough
`inline code`          → monospace code

- Bullet item
- Another item

1. First step
2. Second step
```

---

## Data storage

All data is stored locally on your machine. No cloud sync, no telemetry.

```
%APPDATA%\com.agencia-rse.kanban-widget\kanban.json
```

The file is a plain JSON object — you can back it up, edit it, or migrate it freely.

---

## Building from source

### Prerequisites

| Tool | Version | Notes |
|------|---------|-------|
| [Rust](https://rustup.rs/) | stable | Install via rustup |
| [Node.js](https://nodejs.org/) | 18+ | |
| [pnpm](https://pnpm.io/) | 8+ | `npm i -g pnpm` |
| MSVC Build Tools | VS 2022 | See note below |

> **MSVC Build Tools:** Install [Visual Studio 2022 Build Tools](https://visualstudio.microsoft.com/downloads/#build-tools-for-visual-studio-2022) and select the **"Desktop development with C++"** workload. This includes the Windows SDK required by Tauri.

> **Paths with spaces:** If your project path contains spaces, the included `src-tauri/.cargo/config.toml` already contains the MSVC linker workaround. Update the paths to match your VS installation if needed.

### Run in development

```bash
git clone https://github.com/agenciaRSE/kanban-widget.git
cd kanban-widget
pnpm install
pnpm tauri dev
```

Hot-reload is enabled — frontend changes appear instantly without restarting.

### Build for production

```bash
pnpm tauri build
```

Installers are generated at:

```
src-tauri/target/release/bundle/
├── nsis/   →  Kanban Widget_x.x.x_x64-setup.exe
└── msi/    →  Kanban Widget_x.x.x_x64_en-US.msi
```

---

## Tech stack

| Layer | Technology |
|-------|-----------|
| Desktop shell | [Tauri v2](https://tauri.app/) — Rust backend, OS webview |
| Frontend framework | [React 19](https://react.dev/) + [TypeScript 5.8](https://www.typescriptlang.org/) |
| Styling | [Tailwind CSS v4](https://tailwindcss.com/) with shadcn dark theme (oklch tokens) |
| Drag & drop | [@dnd-kit/react](https://dndkit.com/) 0.3 (new API) |
| Markdown | [react-markdown](https://github.com/remarkjs/react-markdown) + [remark-gfm](https://github.com/remarkjs/remark-gfm) |
| Persistence | [@tauri-apps/plugin-store](https://github.com/tauri-apps/plugins-workspace/tree/v2/plugins/store) |
| Build tool | [Vite 7](https://vite.dev/) |

**Why Tauri instead of Electron?**

Tauri uses the OS's native webview (WebView2 on Windows) instead of bundling a full Chromium instance. The result is a binary that is ~5× smaller and uses a fraction of the RAM compared to equivalent Electron apps.

---

## Architecture overview

```
src/
├── components/
│   ├── Board.tsx          # DragDropProvider + column layout
│   ├── Column.tsx         # Droppable column with inline rename
│   ├── TaskCard.tsx       # Sortable card with Markdown preview
│   ├── TaskForm.tsx       # Shared create/edit form
│   ├── AddTaskInput.tsx   # Expandable "new task" button
│   └── TitleBar.tsx       # Frameless title bar + window controls
├── hooks/
│   └── useTaskStore.ts    # All state + debounced persistence
├── lib/
│   └── storage.ts         # Thin tauri-plugin-store wrapper
└── types/
    └── task.ts            # Task, Column, and ColumnLabels types

src-tauri/
├── src/lib.rs             # Tauri app builder + plugins
├── tauri.conf.json        # Window config, CSP, bundle settings
└── capabilities/          # Tauri v2 permission scopes
```

---

## Contributing

Contributions are welcome. Please read [CONTRIBUTING.md](.github/CONTRIBUTING.md) before opening a pull request.

1. Fork the repository
2. Create a feature branch: `git checkout -b feat/your-feature`
3. Commit your changes following [Conventional Commits](https://www.conventionalcommits.org/)
4. Push and open a Pull Request

Found a bug? [Open an issue](https://github.com/agenciaRSE/kanban-widget/issues/new?template=bug_report.md).
Have an idea? [Request a feature](https://github.com/agenciaRSE/kanban-widget/issues/new?template=feature_request.md).

---

## Roadmap

- [ ] Multiple boards
- [ ] Import / export JSON
- [ ] Task due dates
- [ ] Keyboard shortcuts
- [ ] Custom themes / accent colors
- [ ] Windows autostart toggle in settings

---

## License

[GNU General Public License v3.0](LICENSE) © 2025 [AGENCIA RSE](https://github.com/agenciaRSE)

This program is free software: you can redistribute it and/or modify it under the terms of the GNU GPL as published by the Free Software Foundation, either version 3 of the License, or any later version.
