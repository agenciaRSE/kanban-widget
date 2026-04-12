import { useState, useEffect, useRef } from "react";
import { SUPABASE_ENABLED } from "../lib/supabase";

type Tab = "login" | "register";
type FormState = "idle" | "loading" | "confirm-email";

interface AuthModalProps {
  onClose: () => void;
  userEmail?: string | null;
  onSignIn: (email: string, password: string) => Promise<void>;
  onSignUp: (email: string, password: string) => Promise<"confirm-email">;
  onSignOut: () => Promise<void>;
}

export function AuthModal({
  onClose,
  userEmail,
  onSignIn,
  onSignUp,
  onSignOut,
}: AuthModalProps) {
  const [tab, setTab] = useState<Tab>("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [formState, setFormState] = useState<FormState>("idle");
  const [error, setError] = useState("");
  const emailRef = useRef<HTMLInputElement>(null);

  // Close on Escape
  useEffect(() => {
    const handler = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [onClose]);

  useEffect(() => {
    emailRef.current?.focus();
  }, [tab]);

  const handleSubmit = async () => {
    if (!email.trim() || !password.trim()) return;
    setFormState("loading");
    setError("");
    try {
      if (tab === "login") {
        await onSignIn(email, password);
        onClose();
      } else {
        await onSignUp(email, password);
        setFormState("confirm-email");
      }
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Something went wrong.");
      setFormState("idle");
    }
  };

  const handleSignOut = async () => {
    await onSignOut();
    onClose();
  };

  // ── Logged-in view ──
  if (userEmail) {
    return (
      <div
        className="absolute inset-0 z-50 flex items-center justify-center"
        style={{ background: "oklch(0 0 0 / 60%)" }}
        onClick={onClose}
      >
        <div
          className="auth-card w-[300px] flex flex-col gap-4 p-5"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Premium badge */}
          <div className="flex items-center gap-1.5">
            <span className="premium-badge text-[9px] font-bold uppercase tracking-widest px-2 py-0.5 rounded-full">✦ Premium</span>
          </div>

          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-full flex items-center justify-center text-sm font-bold text-white"
              style={{ background: "linear-gradient(135deg, #a855f7, #3b82f6)" }}>
              {userEmail[0].toUpperCase()}
            </div>
            <div className="flex flex-col min-w-0">
              <span className="text-[12px] font-medium text-foreground truncate">{userEmail}</span>
              <span className="text-[10px] text-emerald-400/80">✓ Sync active</span>
            </div>
          </div>

          <p className="text-[11px] text-muted-foreground/60 leading-relaxed">
            Your board syncs in real time across all devices where you're signed in.
          </p>

          <button
            onClick={handleSignOut}
            className="w-full text-[12px] py-2 rounded-lg border border-border/60 text-muted-foreground hover:text-destructive hover:border-destructive/40 hover:bg-destructive/5 transition-all"
          >
            Sign out
          </button>
          <button onClick={onClose} className="text-[11px] text-muted-foreground/40 hover:text-muted-foreground transition-colors">
            Close
          </button>
        </div>
      </div>
    );
  }

  // ── Confirm email view ──
  if (formState === "confirm-email") {
    return (
      <div
        className="absolute inset-0 z-50 flex items-center justify-center"
        style={{ background: "oklch(0 0 0 / 60%)" }}
        onClick={onClose}
      >
        <div className="auth-card w-[300px] flex flex-col gap-4 p-5" onClick={(e) => e.stopPropagation()}>
          <div className="flex flex-col items-center gap-3 py-2 text-center">
            <div className="w-12 h-12 rounded-full flex items-center justify-center text-2xl"
              style={{ background: "oklch(1 0 0 / 6%)" }}>
              ✉️
            </div>
            <h2 className="text-[14px] font-semibold text-foreground">Check your inbox</h2>
            <p className="text-[11px] text-muted-foreground/70 leading-relaxed">
              We sent a confirmation link to <span className="text-foreground/90 font-medium">{email}</span>.
              <br /><br />
              Click it to activate sync and start using your account across devices.
            </p>
          </div>
          <button
            onClick={onClose}
            className="w-full bg-gradient-to-b from-primary to-primary/85 text-primary-foreground rounded-lg py-2 text-[12px] font-semibold hover:from-primary/90 hover:to-primary/75 transition-all"
          >
            Got it
          </button>
        </div>
      </div>
    );
  }

  // ── Login / Register view ──
  return (
    <div
      className="absolute inset-0 z-50 flex items-center justify-center"
      style={{ background: "oklch(0 0 0 / 60%)" }}
      onClick={onClose}
    >
      <div
        className="auth-card w-[300px] flex flex-col gap-3.5 p-5"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Premium badge + header */}
        <div className="flex flex-col gap-1">
          <span className="premium-badge text-[9px] font-bold uppercase tracking-widest px-2 py-0.5 rounded-full w-fit">✦ Premium</span>
          <h2 className="text-[15px] font-semibold text-foreground mt-1">Sync your Kanban</h2>
          <p className="text-[11px] text-muted-foreground/60 leading-relaxed">
            Access your board from any device, in real time.
          </p>
        </div>

        {/* Tabs */}
        <div className="flex gap-0 bg-secondary/40 rounded-lg p-0.5">
          {(["login", "register"] as Tab[]).map((t) => (
            <button
              key={t}
              onClick={() => { setTab(t); setError(""); }}
              className={`flex-1 text-[11px] py-1.5 rounded-md font-medium transition-all ${
                tab === t
                  ? "bg-card text-foreground shadow-sm"
                  : "text-muted-foreground/60 hover:text-muted-foreground"
              }`}
            >
              {t === "login" ? "Sign in" : "Create account"}
            </button>
          ))}
        </div>

        {/* Fields */}
        <div className="flex flex-col gap-2">
          <input
            ref={emailRef}
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            onKeyDown={(e) => { if (e.key === "Enter") handleSubmit(); }}
            placeholder="Email"
            autoComplete="email"
            className="w-full bg-secondary/60 border border-border/60 focus:border-ring rounded-lg px-3 py-2 text-[12px] text-foreground placeholder:text-muted-foreground/40 outline-none transition-all"
          />
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            onKeyDown={(e) => { if (e.key === "Enter") handleSubmit(); }}
            placeholder="Password"
            autoComplete={tab === "login" ? "current-password" : "new-password"}
            className="w-full bg-secondary/60 border border-border/60 focus:border-ring rounded-lg px-3 py-2 text-[12px] text-foreground placeholder:text-muted-foreground/40 outline-none transition-all"
          />
        </div>

        {/* Error */}
        {error && (
          <p className="text-[11px] text-destructive/90 bg-destructive/10 border border-destructive/20 rounded-lg px-3 py-2">
            {error}
          </p>
        )}

        {/* Submit */}
        <button
          onClick={handleSubmit}
          disabled={formState === "loading" || !SUPABASE_ENABLED}
          className="w-full py-2 rounded-lg text-[12px] font-semibold text-primary-foreground transition-all active:scale-[0.98] disabled:opacity-50"
          style={{ background: "linear-gradient(180deg, #a855f7, #6366f1)" }}
        >
          {formState === "loading"
            ? "Please wait…"
            : tab === "login"
            ? "Sign in"
            : "Create account"}
        </button>

        {!SUPABASE_ENABLED && (
          <p className="text-[10px] text-orange-400/80 text-center">
            Configure <code className="opacity-70">.env</code> to enable sync.
          </p>
        )}

        {/* OAuth — coming soon */}
        <div className="flex items-center gap-2">
          <span className="h-px flex-1 bg-border/40" />
          <span className="text-[10px] text-muted-foreground/30">or</span>
          <span className="h-px flex-1 bg-border/40" />
        </div>

        <div className="flex gap-2">
          {[
            { label: "Google", icon: "G" },
            { label: "GitHub", icon: "⬡" },
          ].map(({ label, icon }) => (
            <button
              key={label}
              disabled
              title="OAuth coming soon — requires deep link configuration"
              className="flex-1 flex items-center justify-center gap-1.5 py-1.5 rounded-lg border border-border/30 text-[11px] text-muted-foreground/25 cursor-not-allowed"
            >
              <span className="font-bold text-[13px]">{icon}</span>
              {label}
            </button>
          ))}
        </div>
        <p className="text-[10px] text-muted-foreground/25 text-center -mt-1">
          OAuth requires deep link setup — see docs
        </p>
      </div>
    </div>
  );
}
