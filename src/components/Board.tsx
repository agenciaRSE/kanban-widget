import { useRef, useCallback, useMemo } from "react";
import { DragDropProvider } from "@dnd-kit/react";
import { move } from "@dnd-kit/helpers";
import type { User } from "@supabase/supabase-js";
import type { Columns, ColumnId } from "../types/task";
import { COLUMN_ORDER } from "../types/task";
import { useTaskStore } from "../hooks/useTaskStore";
import { useCloudSync, type SyncStatus } from "../hooks/useCloudSync";
import { Column } from "./Column";
import { TaskCard } from "./TaskCard";

interface BoardProps {
  user: User | null;
  onSyncStatusChange: (status: SyncStatus) => void;
}

export function Board({ user, onSyncStatusChange }: BoardProps) {
  const {
    tasks,
    columns,
    columnLabels,
    loaded,
    addTask,
    editTask,
    deleteTask,
    renameColumn,
    updateColumns,
    loadState,
    persist,
  } = useTaskStore();

  const previousColumns = useRef<Columns>(columns);

  // Memoized snapshot — only a new reference when data actually changes
  const snapshot = useMemo(
    () => ({ tasks, columns, columnLabels }),
    [tasks, columns, columnLabels]
  );

  const { status: syncStatus } = useCloudSync(snapshot, loadState, user?.id);

  // Bubble sync status up to App → TitleBar
  const prevSyncStatus = useRef<SyncStatus>("disabled");
  if (syncStatus !== prevSyncStatus.current) {
    prevSyncStatus.current = syncStatus;
    onSyncStatusChange(syncStatus);
  }

  const handleDragStart = useCallback(() => {
    previousColumns.current = columns;
  }, [columns]);

  const handleDragOver = useCallback(
    (
      event: Parameters<
        NonNullable<React.ComponentProps<typeof DragDropProvider>["onDragOver"]>
      >[0]
    ) => {
      updateColumns((prev: Columns) => move(prev, event) as Columns);
    },
    [updateColumns]
  );

  const handleDragEnd = useCallback(
    (
      event: Parameters<
        NonNullable<React.ComponentProps<typeof DragDropProvider>["onDragEnd"]>
      >[0]
    ) => {
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
