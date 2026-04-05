import { useState } from "react";
import { getCurrentWindow } from "@tauri-apps/api/window";

const appWindow = getCurrentWindow();

export function TitleBar() {
  const [pinned, setPinned] = useState(false);

  const togglePin = async () => {
    const next = !pinned;
    setPinned(next);
    await appWindow.setAlwaysOnTop(next);
  };

  return (
    <div
      data-tauri-drag-region
      className="flex items-center justify-between px-3 py-2 shrink-0"
    >
      <div data-tauri-drag-region className="flex items-center gap-2">
        <svg width="18" height="18" viewBox="0 0 32 32" fill="none" className="kanban-logo">
          <rect className="logo-col logo-col-1" x="3" y="6" width="7" height="20" rx="2" fill="url(#g1)" />
          <rect className="logo-col logo-col-2" x="12.5" y="6" width="7" height="14" rx="2" fill="url(#g2)" />
          <rect className="logo-col logo-col-3" x="22" y="6" width="7" height="8" rx="2" fill="url(#g3)" />
          <defs>
            <linearGradient id="g1" x1="6.5" y1="6" x2="6.5" y2="26" gradientUnits="userSpaceOnUse">
              <stop stopColor="#a855f7" />
              <stop offset="1" stopColor="#6366f1" />
            </linearGradient>
            <linearGradient id="g2" x1="16" y1="6" x2="16" y2="20" gradientUnits="userSpaceOnUse">
              <stop stopColor="#3b82f6" />
              <stop offset="1" stopColor="#06b6d4" />
            </linearGradient>
            <linearGradient id="g3" x1="25.5" y1="6" x2="25.5" y2="14" gradientUnits="userSpaceOnUse">
              <stop stopColor="#22c55e" />
              <stop offset="1" stopColor="#10b981" />
            </linearGradient>
          </defs>
        </svg>
        <span
          data-tauri-drag-region
          className="text-xs font-semibold text-muted-foreground tracking-wide uppercase"
        >
          Kanban
        </span>
      </div>

      <div className="flex items-center gap-1">
        <button
          onClick={togglePin}
          className={`w-7 h-7 flex items-center justify-center rounded-md transition-colors
            ${pinned ? "text-foreground bg-secondary" : "text-muted-foreground hover:text-foreground hover:bg-secondary"}`}
          title={pinned ? "Unpin" : "Pin on top"}
        >
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            {pinned ? (
              <>
                <line x1="12" y1="17" x2="12" y2="22" />
                <path d="M5 17h14v-1.76a2 2 0 0 0-1.11-1.79l-1.78-.9A2 2 0 0 1 15 10.76V6h1a2 2 0 0 0 0-4H8a2 2 0 0 0 0 4h1v4.76a2 2 0 0 1-1.11 1.79l-1.78.9A2 2 0 0 0 5 15.24Z" />
              </>
            ) : (
              <>
                <line x1="12" y1="17" x2="12" y2="22" />
                <path d="M5 17h14v-1.76a2 2 0 0 0-1.11-1.79l-1.78-.9A2 2 0 0 1 15 10.76V6h1a2 2 0 0 0 0-4H8a2 2 0 0 0 0 4h1v4.76a2 2 0 0 1-1.11 1.79l-1.78.9A2 2 0 0 0 5 15.24Z" />
                <line x1="2" y1="2" x2="22" y2="22" opacity="0.4" />
              </>
            )}
          </svg>
        </button>

        <button
          onClick={() => appWindow.minimize()}
          className="w-7 h-7 flex items-center justify-center rounded-md text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors"
          title="Minimize"
        >
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
            <line x1="5" y1="12" x2="19" y2="12" />
          </svg>
        </button>

        <button
          onClick={() => appWindow.close()}
          className="w-7 h-7 flex items-center justify-center rounded-md text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-colors"
          title="Close"
        >
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
            <line x1="18" y1="6" x2="6" y2="18" />
            <line x1="6" y1="6" x2="18" y2="18" />
          </svg>
        </button>
      </div>
    </div>
  );
}
