import { memo, useState } from "react";
import { useSortable } from "@dnd-kit/react/sortable";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import type { Task, ColumnId, TaskColor } from "../types/task";
import { TASK_COLORS } from "../types/task";
import { TaskForm } from "./TaskForm";

interface TaskCardProps {
  task: Task;
  index: number;
  column: ColumnId;
  onEdit: (id: string, updates: Partial<Pick<Task, "title" | "description" | "color">>) => void;
  onDelete: (id: string) => void;
}

export const TaskCard = memo(function TaskCard({
  task,
  index,
  column,
  onEdit,
  onDelete,
}: TaskCardProps) {
  const [editing, setEditing] = useState(false);
  const { ref, isDragSource } = useSortable({
    id: task.id,
    index,
    type: "item",
    group: column,
  });

  const hasColor = task.color && task.color !== "none";
  const colorValue = hasColor ? TASK_COLORS[task.color] : undefined;

  if (editing) {
    return (
      <TaskForm
        initialTitle={task.title}
        initialDescription={task.description}
        initialColor={task.color}
        submitLabel="Save"
        onSubmit={(title: string, description: string, color: TaskColor) => {
          onEdit(task.id, { title, description, color });
          setEditing(false);
        }}
        onCancel={() => setEditing(false)}
      />
    );
  }

  return (
    <div
      ref={ref}
      data-dragging={isDragSource}
      onDoubleClick={() => setEditing(true)}
      className="task-card group relative rounded-lg bg-card px-4 py-3.5 text-sm text-card-foreground cursor-grab active:cursor-grabbing overflow-hidden"
      style={
        hasColor
          ? {
              borderWidth: "1px",
              borderStyle: "solid",
              borderColor: colorValue,
              boxShadow: `0 0 8px ${colorValue}40, 0 0 20px ${colorValue}20, inset 0 0 8px ${colorValue}08`,
            }
          : {
              borderWidth: "1px",
              borderStyle: "solid",
              borderColor: "var(--color-border)",
            }
      }
    >
      <div className="pointer-events-none absolute inset-x-0 top-0 h-8 rounded-t-lg bg-gradient-to-b from-white/[0.06] to-transparent" />
      <span className="relative block pr-10 break-words leading-relaxed font-medium">
        {task.title}
      </span>
      {task.description && (
        <div className="card-markdown mt-1 pr-10 text-xs leading-relaxed text-muted-foreground">
          <ReactMarkdown remarkPlugins={[remarkGfm]}>
            {task.description}
          </ReactMarkdown>
        </div>
      )}

      <div className="absolute top-2 right-2 flex items-center gap-0.5 opacity-0 group-hover:opacity-100 transition-opacity">
        <button
          onClick={(e) => {
            e.stopPropagation();
            setEditing(true);
          }}
          className="w-5 h-5 flex items-center justify-center rounded text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors"
          title="Edit"
        >
          <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z" />
          </svg>
        </button>
        <button
          onClick={(e) => {
            e.stopPropagation();
            onDelete(task.id);
          }}
          className="w-5 h-5 flex items-center justify-center rounded text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-colors"
          title="Delete"
        >
          <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
            <line x1="18" y1="6" x2="6" y2="18" />
            <line x1="6" y1="6" x2="18" y2="18" />
          </svg>
        </button>
      </div>
    </div>
  );
});
