import { useState } from "react";
import type { ColumnId, TaskColor } from "../types/task";
import { TaskForm } from "./TaskForm";

interface AddTaskInputProps {
  columnId: ColumnId;
  onAdd: (columnId: ColumnId, title: string, description: string, color: TaskColor) => void;
}

export function AddTaskInput({ columnId, onAdd }: AddTaskInputProps) {
  const [expanded, setExpanded] = useState(false);

  if (!expanded) {
    return (
      <button
        onClick={() => setExpanded(true)}
        className="w-full text-left bg-secondary/30 hover:bg-secondary/60 border border-dashed border-border/50 hover:border-border rounded-lg px-3 py-2 text-xs text-muted-foreground/50 hover:text-muted-foreground transition-all"
      >
        + New task...
      </button>
    );
  }

  return (
    <TaskForm
      submitLabel="Create"
      onSubmit={(title, description, color) => {
        onAdd(columnId, title, description, color);
        setExpanded(false);
      }}
      onCancel={() => setExpanded(false)}
    />
  );
}
