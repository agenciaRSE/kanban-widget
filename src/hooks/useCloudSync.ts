import { useState, useEffect, useRef } from "react";
import { SUPABASE_ENABLED } from "../lib/supabase";
import { fetchBoard, upsertBoard, subscribeToBoard } from "../lib/cloudSync";
import type { StoreData, Task, Columns, ColumnLabels } from "../types/task";

export type SyncStatus = "disabled" | "syncing" | "synced" | "error";

interface BoardSnapshot {
  tasks: Record<string, Task>;
  columns: Columns;
  columnLabels: ColumnLabels;
}

/**
 * Manages real-time cloud sync between local state and Supabase.
 *
 * @param snapshot   Memoized board data — only changes when data actually changes
 * @param loadState  Callback to overwrite local state with cloud data
 * @param userId     Current user's ID (null = not logged in)
 */
export function useCloudSync(
  snapshot: BoardSnapshot,
  loadState: (data: StoreData) => void,
  userId: string | null | undefined
): { status: SyncStatus } {
  const [status, setStatus] = useState<SyncStatus>("disabled");

  // Refs to avoid stale closures and prevent circular sync
  const snapshotRef = useRef(snapshot);
  const isApplyingRemote = useRef(false); // true while loading cloud data into local state
  const isReady = useRef(false); // false until initial cloud load completes
  const uploadTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Keep snapshot ref fresh on every render
  useEffect(() => {
    snapshotRef.current = snapshot;
  });

  // ── On login / logout: fetch board + subscribe to realtime ──
  useEffect(() => {
    if (!SUPABASE_ENABLED || !userId) {
      setStatus("disabled");
      isReady.current = false;
      return;
    }

    setStatus("syncing");
    isReady.current = false;

    fetchBoard(userId)
      .then((data) => {
        if (data) {
          isApplyingRemote.current = true;
          loadState(data);
          // Give React time to flush state updates before re-enabling uploads
          setTimeout(() => {
            isApplyingRemote.current = false;
          }, 300);
        }
        setStatus("synced");
        isReady.current = true;
      })
      .catch((err) => {
        console.error("[sync] Initial fetch failed:", err);
        setStatus("error");
        isReady.current = true;
      });

    // Real-time subscription — another device saved → update this one
    const unsubscribe = subscribeToBoard(userId, (data) => {
      isApplyingRemote.current = true;
      loadState(data);
      setStatus("synced");
      setTimeout(() => {
        isApplyingRemote.current = false;
      }, 300);
    });

    return () => {
      unsubscribe();
      if (uploadTimer.current) clearTimeout(uploadTimer.current);
    };
  }, [userId, loadState]);

  // ── Upload local changes to cloud (debounced, 800ms) ──
  useEffect(() => {
    // Skip: no user, not yet initialized, or change came from remote
    if (!userId || !isReady.current || isApplyingRemote.current) return;

    setStatus("syncing");
    if (uploadTimer.current) clearTimeout(uploadTimer.current);

    uploadTimer.current = setTimeout(async () => {
      try {
        await upsertBoard(userId, snapshotRef.current);
        setStatus("synced");
      } catch (err) {
        console.error("[sync] Upload failed:", err);
        setStatus("error");
      }
    }, 800);
  }, [snapshot, userId]);

  return { status };
}
