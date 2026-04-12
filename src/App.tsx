import { useState, useCallback } from "react";
import { TitleBar } from "./components/TitleBar";
import { Board } from "./components/Board";
import { AuthModal } from "./components/AuthModal";
import { useAuth } from "./hooks/useAuth";
import type { SyncStatus } from "./hooks/useCloudSync";

export default function App() {
  const { user, signIn, signUp, signOut } = useAuth();
  const [showAuth, setShowAuth] = useState(false);
  const [syncStatus, setSyncStatus] = useState<SyncStatus>("disabled");

  const handleSyncStatusChange = useCallback((status: SyncStatus) => {
    setSyncStatus(status);
  }, []);

  const handleSyncClick = useCallback(() => {
    setShowAuth(true);
  }, []);

  return (
    <div className="app-shell">
      <TitleBar
        syncStatus={syncStatus}
        userEmail={user?.email}
        onSyncClick={handleSyncClick}
      />

      <Board user={user} onSyncStatusChange={handleSyncStatusChange} />

      {showAuth && (
        <AuthModal
          onClose={() => setShowAuth(false)}
          userEmail={user?.email}
          onSignIn={signIn}
          onSignUp={signUp}
          onSignOut={signOut}
        />
      )}
    </div>
  );
}
