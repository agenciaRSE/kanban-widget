# Kanban Widget

A lightweight, always-on-top Kanban board for your Windows desktop. Built with Tauri v2 + React — sits quietly on your screen using ~42 MB of RAM while keeping your tasks organized.

![Kanban Widget screenshot](https://raw.githubusercontent.com/agenciaRSE/kanban-widget/master/docs/screenshot.png)

## Features

- **3 customizable columns** — double-click any column name to rename it
- **Rich task cards** — title, description with Markdown support, and color-coded glow border
- **Drag & drop** — move tasks across columns with smooth animations
- **Markdown descriptions** — `**bold**`, `*italic*`, `~~strikethrough~~`, bullet lists, numbered lists, inline code
- **Pin on top** — keep the widget above all other windows while you work
- **Persistent storage** — data saved automatically to `%APPDATA%\com.agencia-rse.kanban-widget\kanban.json`
- **Responsive layout** — columns stack vertically when the window is resized narrow
- **Frameless & transparent** — blends into your desktop with a dark shadcn theme
- **Ultra-lightweight** — ~42 MB RAM, instant startup

## Screenshots

> _Add screenshots to `docs/` and update the image link above._

## Installation

Download the latest installer from [Releases](https://github.com/agenciaRSE/kanban-widget/releases):

- **`Kanban Widget_x.x.x_x64-setup.exe`** — NSIS installer (recommended)
- **`Kanban Widget_x.x.x_x64_en-US.msi`** — MSI package

Run the installer and the widget will be ready to use immediately.

## Usage

| Action | How |
|--------|-----|
| Create task | Click **+ New task...** in any column |
| Edit task | Double-click a card, or hover → click the pencil icon |
| Delete task | Hover a card → click the × icon |
| Move task | Drag and drop between columns |
| Rename column | Double-click the column header |
| Pin on top | Click the pin icon in the title bar |
| Minimize | Click the minus icon in the title bar |

### Markdown in descriptions

Task descriptions support GitHub Flavored Markdown:

```
**bold text**
*italic text*
~~strikethrough~~
- bullet list item
1. numbered list item
`inline code`
```

## Building from source

### Prerequisites

- [Rust](https://rustup.rs/) (stable toolchain)
- [Node.js](https://nodejs.org/) 18+
- [pnpm](https://pnpm.io/)
- Windows with MSVC Build Tools ([Visual Studio 2022 Build Tools](https://visualstudio.microsoft.com/downloads/#build-tools-for-visual-studio-2022) with "Desktop development with C++" workload)

### Development

```bash
# Clone the repo
git clone https://github.com/agenciaRSE/kanban-widget.git
cd kanban-widget

# Install dependencies
pnpm install

# Start dev server (hot-reload)
pnpm tauri dev
```

### Production build

```bash
pnpm tauri build
```

Installers will be generated at:
```
src-tauri/target/release/bundle/
  nsis/   → Kanban Widget_x.x.x_x64-setup.exe
  msi/    → Kanban Widget_x.x.x_x64_en-US.msi
```

> **Note for paths with spaces:** If your project path contains spaces, see `src-tauri/.cargo/config.toml` for the MSVC linker workaround.

## Tech stack

| Layer | Technology |
|-------|-----------|
| Desktop shell | [Tauri v2](https://tauri.app/) |
| Frontend | [React 19](https://react.dev/) + [TypeScript](https://www.typescriptlang.org/) |
| Styling | [Tailwind CSS v4](https://tailwindcss.com/) + shadcn dark theme |
| Drag & drop | [@dnd-kit/react](https://dndkit.com/) |
| Markdown | [react-markdown](https://github.com/remarkjs/react-markdown) + [remark-gfm](https://github.com/remarkjs/remark-gfm) |
| Persistence | [@tauri-apps/plugin-store](https://github.com/tauri-apps/plugins-workspace/tree/v2/plugins/store) |
| Build | [Vite 7](https://vite.dev/) |

## Data storage

Task data is stored locally in:

```
%APPDATA%\com.agencia-rse.kanban-widget\kanban.json
```

No data is sent to any server. Everything stays on your machine.

## Contributing

Pull requests are welcome. For major changes, please open an issue first to discuss what you'd like to change.

1. Fork the repository
2. Create a feature branch (`git checkout -b feat/your-feature`)
3. Commit your changes (`git commit -m 'feat: add some feature'`)
4. Push to the branch (`git push origin feat/your-feature`)
5. Open a Pull Request

## License

[GNU General Public License v3.0](LICENSE) © 2025 [AGENCIA RSE](https://github.com/agenciaRSE)
