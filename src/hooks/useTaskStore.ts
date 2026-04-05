import { useState, useEffect, useCallback, useRef } from "react";
import type { Task, Columns, ColumnId, ColumnLabels, StoreData, TaskColor } from "../types/task";
import { DEFAULT_COLUMN_LABELS } from "../types/task";
import { loadBoard, saveBoard } from "../lib/storage";

const EMPTY_STATE: StoreData = {
  tasks: {},
  columns: { todo: [], progress: [], done: [] },
  columnLabels: { ...DEFAULT_COLUMN_LABELS },
};

export function useTaskStore() {
  const [tasks, setTasks] = useState<Record<string, Task>>(EMPTY_STATE.tasks);
  const [columns, setColumns] = useState<Columns>(EMPTY_STATE.columns);
  const [columnLabels, setColumnLabels] = useState<ColumnLabels>({ ...DEFAULT_COLUMN_LABELS });
  const [loaded, setLoaded] = useState(false);
  const saveTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Always-fresh ref for debounced persistence — avoids stale closures
  const stateRef = useRef({ tasks, columns, columnLabels });
  useEffect(() => {
    stateRef.current = { tasks, columns, columnLabels };
  });

  // Load from disk on mount; clean up pending saves on unmount
  useEffect(() => {
    loadBoard()
      .then((data) => {
        if (data) {
          setTasks(data.tasks);
          setColumns(data.columns);
          if (data.columnLabels) setColumnLabels(data.columnLabels);
        }
        setLoaded(true);
      })
      .catch((err) => {
        console.error("[kanban] Failed to load board:", err);
        setLoaded(true);
      });
    return () => {
      if (saveTimer.current) clearTimeout(saveTimer.current);
    };
  }, []);

  // Stable persist — reads from ref, no dependency cascade
  const persistState = useCallback(
    (nextTasks?: Record<string, Task>, nextColumns?: Columns, nextLabels?: ColumnLabels) => {
      if (saveTimer.current) clearTimeout(saveTimer.current);
      saveTimer.current = setTimeout(async () => {
        const t = nextTasks ?? stateRef.current.tasks;
        const c = nextColumns ?? stateRef.current.columns;
        const l = nextLabels ?? stateRef.current.columnLabels;
        try {
          await saveBoard({ tasks: t, columns: c, columnLabels: l });
        } catch (err) {
          console.error("[kanban] Failed to persist board:", err);
        }
      }, 500);
    },
    []
  );

  const addTask = useCallback(
    (columnId: ColumnId, title: string, description: string = "", color: TaskColor = "none") => {
      const id = crypto.randomUUID();
      const task: Task = { id, title: title.trim(), description: description.trim(), color, createdAt: Date.now() };
      setTasks((prev) => {
        const next = { ...prev, [id]: task };
        persistState(next);
        return next;
      });
      setColumns((prev) => {
        const next = { ...prev, [columnId]: [id, ...prev[columnId]] };
        persistState(undefined, next);
        return next;
      });
    },
    [persistState]
  );

  const editTask = useCallback(
    (id: string, updates: Partial<Pick<Task, "title" | "description" | "color">>) => {
      setTasks((prev) => {
        const existing = prev[id];
        if (!existing) return prev;
        const updated: Task = {
          ...existing,
          ...(updates.title !== undefined && { title: updates.title.trim() }),
          ...(updates.description !== undefined && { description: updates.description.trim() }),
          ...(updates.color !== undefined && { color: updates.color }),
        };
        const next = { ...prev, [id]: updated };
        persistState(next);
        return next;
      });
    },
    [persistState]
  );

  const deleteTask = useCallback(
    (id: string) => {
      setTasks((prev) => {
        const next = { ...prev };
        delete next[id];
        persistState(next);
        return next;
      });
      setColumns((prev) => {
        const next = { ...prev } as Columns;
        for (const col of Object.keys(next) as ColumnId[]) {
          next[col] = next[col].filter((tid) => tid !== id);
        }
        persistState(undefined, next);
        return next;
      });
    },
    [persistState]
  );

  const renameColumn = useCallback(
    (columnId: ColumnId, label: string) => {
      const trimmed = label.trim();
      if (!trimmed) return;
      setColumnLabels((prev) => {
        const next = { ...prev, [columnId]: trimmed };
        persistState(undefined, undefined, next);
        return next;
      });
    },
    [persistState]
  );

  const updateColumns = useCallback(
    (next: Columns | ((prev: Columns) => Columns)) => {
      setColumns(next);
    },
    []
  );

  const persist = useCallback(() => {
    persistState();
  }, [persistState]);

  return {
    tasks,
    columns,
    columnLabels,
    loaded,
    addTask,
    editTask,
    deleteTask,
    renameColumn,
    updateColumns,
    persist,
  };
}
