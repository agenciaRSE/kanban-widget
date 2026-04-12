import { createClient } from "@supabase/supabase-js";

const url = (import.meta.env.VITE_SUPABASE_URL ?? "") as string;
const key = (import.meta.env.VITE_SUPABASE_ANON_KEY ?? "") as string;

/** True only when both env vars are present and the URL looks valid */
export const SUPABASE_ENABLED = Boolean(
  url && key && url.startsWith("https://")
);

export const supabase = SUPABASE_ENABLED ? createClient(url, key) : null;
