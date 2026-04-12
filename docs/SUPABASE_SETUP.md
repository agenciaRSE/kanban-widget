# Supabase Setup — Cross-device Sync

This guide walks you through configuring Supabase so the Premium sync feature works.

---

## 1. Create a Supabase project

1. Go to [supabase.com](https://supabase.com) and create a free account
2. Click **New project**, choose a name and region
3. Wait ~2 minutes for the project to spin up

---

## 2. Create the `boards` table

Go to **SQL Editor** in your Supabase dashboard and run:

```sql
-- Create boards table
create table public.boards (
  id         uuid primary key default gen_random_uuid(),
  user_id    uuid references auth.users not null unique,
  data       jsonb not null default '{}',
  updated_at timestamptz default now()
);

-- Enable Row Level Security (users can only access their own board)
alter table public.boards enable row level security;

create policy "Users can manage their own board"
  on public.boards
  for all
  using  (auth.uid() = user_id)
  with check (auth.uid() = user_id);

-- Auto-update updated_at on every save
create or replace function public.handle_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

create trigger on_boards_updated
  before update on public.boards
  for each row execute procedure public.handle_updated_at();

-- Enable real-time for this table
alter publication supabase_realtime add table public.boards;
```

---

## 3. Get your API credentials

In your Supabase dashboard go to **Settings → API** and copy:

- **Project URL** — looks like `https://abcdefghijkl.supabase.co`
- **anon / public key** — the long `eyJ...` string

---

## 4. Configure the app

Copy the example env file and fill in your credentials:

```bash
cp .env.example .env
```

Edit `.env`:

```env
VITE_SUPABASE_URL=https://your-project-id.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

> `.env` is in `.gitignore` — your credentials will never be committed.

---

## 5. (Optional) Disable email confirmation

By default Supabase requires users to confirm their email before signing in.

For a personal/small-team tool you may want to disable this:

1. Go to **Authentication → Email** in your Supabase dashboard
2. Toggle **Confirm email** off

---

## 6. Run the app

```bash
pnpm tauri dev
```

A cloud icon will appear in the title bar. Click it to sign in or create an account. Your board will sync in real time across all devices where you're logged in.

---

## How sync works

| Event | Action |
|-------|--------|
| Sign in | Board downloads from Supabase (cloud wins on first load) |
| Local change | Debounced upload to Supabase after 800ms |
| Another device saves | Real-time subscription triggers local update |
| Sign out | Reverts to local-only mode (data stays on disk) |

---

## OAuth (Google / GitHub) — coming soon

OAuth in a Tauri desktop app requires deep link configuration so the OS can redirect back to the app after browser authentication. This is planned for a future release.

To set it up manually:
1. Install `tauri-plugin-deep-link`
2. Register a custom URL scheme (e.g. `kanban-widget://`)
3. Add the scheme as a redirect URL in Supabase → Authentication → URL Configuration
4. Handle the callback in `src-tauri/src/lib.rs`
