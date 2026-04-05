import { useState, useRef, useEffect } from "react";
import type { TaskColor } from "../types/task";
import { TASK_COLORS } from "../types/task";

const COLOR_KEYS = Object.keys(TASK_COLORS).filter((c) => c !== "none") as TaskColor[];

interface TaskFormProps {
  initialTitle?: string;
  initialDescription?: string;
  initialColor?: TaskColor;
  submitLabel: string;
  onSubmit: (title: string, description: string, color: TaskColor) => void;
  onCancel: () => void;
}

export function TaskForm({
  initialTitle = "",
  initialDescription = "",
  initialColor = "none",
  submitLabel,
  onSubmit,
  onCancel,
}: TaskFormProps) {
  const [title, setTitle] = useState(initialTitle);
  const [description, setDescription] = useState(initialDescription);
  const [color, setColor] = useState<TaskColor>(initialColor);
  const titleRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    titleRef.current?.focus();
  }, []);

  const handleSubmit = () => {
    if (!title.trim()) return;
    onSubmit(title, description, color);
  };

  return (
    <div className="task-form flex flex-col gap-2.5 rounded-xl border border-border bg-gradient-to-b from-card to-card/70 p-3 shadow-lg shadow-black/20">
      <input
        ref={titleRef}
        type="text"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === "Enter") handleSubmit();
          if (e.key === "Escape") onCancel();
        }}
        placeholder="Task title..."
        maxLength={200}
        className="w-full bg-secondary/60 border border-border/60 focus:border-ring rounded-lg px-3 py-2 text-[13px] text-foreground placeholder:text-muted-foreground/50 outline-none transition-all focus:shadow-[0_0_0_2px_var(--color-ring)/20]"
      />
      <textarea
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === "Escape") onCancel();
        }}
        placeholder="Description (optional)..."
        maxLength={2000}
        rows={3}
        className="w-full bg-secondary/60 border border-border/60 focus:border-ring rounded-lg px-3 py-2 text-[12px] leading-relaxed text-foreground placeholder:text-muted-foreground/50 outline-none transition-all resize-none focus:shadow-[0_0_0_2px_var(--color-ring)/20]"
      />

      <div className="flex items-center gap-1.5 px-0.5">
        <span className="text-[10px] text-muted-foreground/50 mr-1 uppercase tracking-wider">Color</span>
        {COLOR_KEYS.map((c) => (
          <button
            key={c}
            onClick={() => setColor(color === c ? "none" : c)}
            className="w-5 h-5 rounded-full border-2 transition-all hover:scale-110"
            style={{
              backgroundColor: TASK_COLORS[c],
              borderColor: color === c ? "#fff" : "transparent",
              boxShadow: color === c ? `0 0 8px ${TASK_COLORS[c]}80` : "none",
              transform: color === c ? "scale(1.15)" : undefined,
            }}
            title={c}
          />
        ))}
      </div>

      <div className="flex gap-2 pt-0.5">
        <button
          onClick={handleSubmit}
          className="flex-1 bg-gradient-to-b from-primary to-primary/85 text-primary-foreground rounded-lg px-3 py-2 text-[12px] font-semibold hover:from-primary/90 hover:to-primary/75 transition-all shadow-sm active:scale-[0.98]"
        >
          {submitLabel}
        </button>
        <button
          onClick={onCancel}
          className="px-3 py-2 text-[12px] text-muted-foreground hover:text-foreground rounded-lg border border-border/60 hover:bg-secondary hover:border-border transition-all"
        >
          Cancel
        </button>
      </div>
    </div>
  );
}
