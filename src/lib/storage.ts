import { load, type Store } from "@tauri-apps/plugin-store";
import type { StoreData } from "../types/task";

let store: Store | null = null;

async function getStore(): Promise<Store> {
  if (!store) {
    store = await load("kanban.json");
  }
  return store;
}

export async function loadBoard(): Promise<StoreData | null> {
  const s = await getStore();
  return (await s.get<StoreData>("board")) ?? null;
}

export async function saveBoard(data: StoreData): Promise<void> {
  const s = await getStore();
  await s.set("board", data);
  await s.save();
}
