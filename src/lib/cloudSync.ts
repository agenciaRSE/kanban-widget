import { supabase, SUPABASE_ENABLED } from "./supabase";
import type { StoreData } from "../types/task";

/** Fetch the board for the given user. Returns null if not found. */
export async function fetchBoard(userId: string): Promise<StoreData | null> {
  if (!SUPABASE_ENABLED || !supabase) return null;
  const { data, error } = await supabase
    .from("boards")
    .select("data")
    .eq("user_id", userId)
    .maybeSingle();
  if (error) throw error;
  return (data?.data as StoreData) ?? null;
}

/** Upsert the board for the given user. */
export async function upsertBoard(
  userId: string,
  board: StoreData
): Promise<void> {
  if (!SUPABASE_ENABLED || !supabase) return;
  const { error } = await supabase
    .from("boards")
    .upsert({ user_id: userId, data: board }, { onConflict: "user_id" });
  if (error) throw error;
}

/**
 * Subscribe to real-time updates for the user's board.
 * Returns an unsubscribe function.
 */
export function subscribeToBoard(
  userId: string,
  onChange: (data: StoreData) => void
): () => void {
  if (!SUPABASE_ENABLED || !supabase) return () => {};

  const channel = supabase
    .channel(`board:${userId}`)
    .on(
      "postgres_changes",
      {
        event: "UPDATE",
        schema: "public",
        table: "boards",
        filter: `user_id=eq.${userId}`,
      },
      (payload) => {
        const incoming = (payload.new as { data?: StoreData }).data;
        if (incoming) onChange(incoming);
      }
    )
    .subscribe();

  return () => void supabase!.removeChannel(channel);
}
