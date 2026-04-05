import { useRef, useCallback } from "react";
import { DragDropProvider } from "@dnd-kit/react";
import { move } from "@dnd-kit/helpers";
import type { Columns, ColumnId } from "../types/task";
import { COLUMN_ORDER } from "../types/task";
import { useTaskStore } from "../hooks/useTaskStore";
import { Column } from "./Column";
import { TaskCard } from "./TaskCard";

export function Board() {
  const { tasks, columns, columnLabels, loaded, addTask, editTask, deleteTask, renameColumn, updateColumns, persist } =
    useTaskStore();
  const previousColumns = useRef<Columns>(columns);

  const handleDragStart = useCallback(() => {
    previousColumns.current = columns;
  }, [columns]);

  const handleDragOver = useCallback(
    (event: Parameters<NonNullable<React.ComponentProps<typeof DragDropProvider>["onDragOver"]>>[0]) => {
      updateColumns((prev: Columns) => move(prev, event) as Columns);
    },
    [updateColumns]
  );

  const handleDragEnd = useCallback(
    (event: Parameters<NonNullable<React.ComponentProps<typeof DragDropProvider>["onDragEnd"]>>[0]) => {
      if (event.canceled) {
        updateColumns(previousColumns.current);
      } else {
        persist();
      }
    },
    [updateColumns, persist]
  );

  if (!loaded) {
    return (
      <div className="flex-1 flex items-center justify-center text-muted-foreground text-xs">
        Loading...
      </div>
    );
  }

  return (
    <DragDropProvider
      onDragStart={handleDragStart}
      onDragOver={handleDragOver}
      onDragEnd={handleDragEnd}
    >
      <div className="board-grid flex-1 flex gap-2 p-2 pt-0 min-h-0">
        {COLUMN_ORDER.map((colId: ColumnId) => (
          <Column
            key={colId}
            id={colId}
            label={columnLabels[colId]}
            count={columns[colId].length}
            onAdd={addTask}
            onRename={renameColumn}
          >
            {columns[colId].map((taskId: string, idx: number) => {
              const task = tasks[taskId];
              if (!task) return null;
              return (
                <TaskCard
                  key={taskId}
                  task={task}
                  index={idx}
                  column={colId}
                  onEdit={editTask}
                  onDelete={deleteTask}
                />
              );
            })}
          </Column>
        ))}
      </div>
    </DragDropProvider>
  );
}
