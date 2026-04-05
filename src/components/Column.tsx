import { memo, useState, useEffect, useRef, type ReactNode } from "react";
import { useDroppable } from "@dnd-kit/react";
import type { ColumnId, TaskColor } from "../types/task";
import { AddTaskInput } from "./AddTaskInput";

interface ColumnProps {
  id: ColumnId;
  label: string;
  count: number;
  onAdd: (columnId: ColumnId, title: string, description: string, color: TaskColor) => void;
  onRename: (columnId: ColumnId, label: string) => void;
  children: ReactNode;
}

export const Column = memo(function Column({
  id,
  label,
  count,
  onAdd,
  onRename,
  children,
}: ColumnProps) {
  const { ref } = useDroppable({ id, type: "column" });
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState(label);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!editing) setDraft(label);
  }, [label, editing]);

  const commitRename = () => {
    const trimmed = draft.trim();
    if (trimmed && trimmed !== label) {
      onRename(id, trimmed);
    } else {
      setDraft(label);
    }
    setEditing(false);
  };

  return (
    <div className="flex-1 flex flex-col min-w-0 gap-1.5">
      <div className="flex items-center justify-between px-1 py-1">
        {editing ? (
          <input
            ref={inputRef}
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            onBlur={commitRename}
            onKeyDown={(e) => {
              if (e.key === "Enter") commitRename();
              if (e.key === "Escape") {
                setDraft(label);
                setEditing(false);
              }
            }}
            className="text-[11px] font-semibold uppercase tracking-wider text-foreground bg-secondary/80 border border-border rounded px-1.5 py-0.5 outline-none w-full max-w-[100px]"
            autoFocus
          />
        ) : (
          <span
            onDoubleClick={() => {
              setDraft(label);
              setEditing(true);
            }}
            className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground cursor-text hover:text-muted-foreground/80 transition-colors"
            title="Double-click to rename"
          >
            {label}
          </span>
        )}
        <span className="text-[10px] tabular-nums text-muted-foreground/60 bg-secondary rounded-full px-1.5 py-0.5 min-w-[20px] text-center">
          {count}
        </span>
      </div>

      <AddTaskInput columnId={id} onAdd={onAdd} />

      <div ref={ref} className="column-scroll flex flex-col gap-1.5 px-0.5 pb-1">
        {children}
      </div>
    </div>
  );
});
