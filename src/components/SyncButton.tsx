import { SUPABASE_ENABLED } from "../lib/supabase";
import type { SyncStatus } from "../hooks/useCloudSync";

interface SyncButtonProps {
  status: SyncStatus;
  userEmail: string | null | undefined;
  onClick: () => void;
}

export function SyncButton({ status, userEmail, onClick }: SyncButtonProps) {
  if (!SUPABASE_ENABLED) return null;

  const isLoggedIn = Boolean(userEmail);

  const label = isLoggedIn
    ? status === "syncing"
      ? "Syncing…"
      : status === "error"
      ? "Sync error — click for account"
      : "Synced · click for account"
    : "Sync across devices — Premium";

  return (
    <button
      onClick={onClick}
      title={label}
      className={`w-7 h-7 flex items-center justify-center rounded-md transition-colors relative ${
        isLoggedIn
          ? "text-muted-foreground hover:text-foreground hover:bg-secondary"
          : "text-muted-foreground/40 hover:text-muted-foreground hover:bg-secondary"
      }`}
    >
      {/* Cloud SVG — changes per state */}
      <svg
        width="14"
        height="14"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
        className={status === "syncing" ? "sync-spin" : ""}
        style={
          status === "synced" && isLoggedIn
            ? { color: "oklch(0.7 0.15 145)" }
            : status === "error"
            ? { color: "oklch(0.75 0.18 50)" }
            : {}
        }
      >
        {/* Cloud base shape */}
        <path d="M17.5 19H9a7 7 0 1 1 6.71-9h1.79a4.5 4.5 0 1 1 0 9Z" />

        {/* State-specific inner icon */}
        {status === "synced" && isLoggedIn && (
          <path d="m9 12 2 2 4-4" />
        )}
        {status === "error" && (
          <>
            <line x1="12" y1="11" x2="12" y2="14" />
            <circle cx="12" cy="16" r="0.5" fill="currentColor" />
          </>
        )}
        {!isLoggedIn && (
          <>
            <line x1="12" y1="11" x2="12" y2="15" />
            <line x1="10" y1="13" x2="14" y2="13" />
          </>
        )}
      </svg>

      {/* Premium sparkle dot when not logged in */}
      {!isLoggedIn && (
        <span
          className="absolute top-1 right-1 w-1.5 h-1.5 rounded-full"
          style={{ background: "linear-gradient(135deg, #a855f7, #3b82f6)" }}
        />
      )}
    </button>
  );
}
