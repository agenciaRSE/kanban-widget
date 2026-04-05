export type TaskColor = "none" | "red" | "orange" | "yellow" | "green" | "blue" | "purple" | "pink";

export const TASK_COLORS: Record<TaskColor, string> = {
  none: "transparent",
  red: "#ef4444",
  orange: "#f97316",
  yellow: "#eab308",
  green: "#22c55e",
  blue: "#3b82f6",
  purple: "#a855f7",
  pink: "#ec4899",
};

export interface Task {
  id: string;
  title: string;
  description: string;
  color: TaskColor;
  createdAt: number;
}

export type ColumnId = "todo" | "progress" | "done";

export type Columns = Record<ColumnId, string[]>;

export type ColumnLabels = Record<ColumnId, string>;

export const DEFAULT_COLUMN_LABELS: ColumnLabels = {
  todo: "To Do",
  progress: "In Progress",
  done: "Done",
};

export interface StoreData {
  tasks: Record<string, Task>;
  columns: Columns;
  columnLabels?: ColumnLabels;
}

export const COLUMN_ORDER: ColumnId[] = ["todo", "progress", "done"];
