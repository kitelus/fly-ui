import { forwardRef, type CSSProperties, type ComponentPropsWithoutRef } from "react";
import { buildKiteThemeStyle, mergeKiteTheme, type KiteTheme } from "../../kite/theme";
import { useFlyUITheme } from "../../kite/theme";
import "../agent.css";

export type TaskStatus = "queued" | "running" | "completed" | "failed" | "cancelled";
export type TaskPriority = "low" | "normal" | "high" | "urgent";

export interface TaskStatusCardProps extends ComponentPropsWithoutRef<"div"> {
  taskId?: string;
  name: string;
  status: TaskStatus;
  priority?: TaskPriority;
  progress?: number;
  eta?: string;
  startedAt?: string;
  completedAt?: string;
  errorMessage?: string;
  onCancel?: () => void;
  onRetry?: () => void;
  theme?: KiteTheme;
}

const STATUS_BADGE: Record<TaskStatus, string> = {
  queued: "idle",
  running: "running",
  completed: "completed",
  failed: "error",
  cancelled: "idle",
};

export const TaskStatusCard = forwardRef<HTMLDivElement, TaskStatusCardProps>(
  function TaskStatusCard(
    {
      taskId,
      name,
      status,
      priority,
      progress,
      eta,
      startedAt,
      errorMessage,
      onCancel,
      onRetry,
      theme,
      style,
      ...rest
    },
    ref,
  ) {
    const contextTheme = useFlyUITheme();
    const themeStyle = buildKiteThemeStyle(mergeKiteTheme(contextTheme, theme));
    const badgeStatus = STATUS_BADGE[status];

    return (
      <div
        ref={ref}
        className="kite-flyui-host kite-flyui-agentCard kite-flyui-taskCard"
        style={{ ...themeStyle, ...style } as CSSProperties}
        {...rest}
      >
        <div className="kite-flyui-taskCard__header">
          <div>
            <p className="kite-flyui-taskCard__name">{name}</p>
            {taskId && <span className="kite-flyui-taskCard__id">{taskId}</span>}
          </div>
          <div style={{ display: "flex", gap: 6, alignItems: "center" }}>
            {priority && (
              <span className={`kite-flyui-taskCard__priority--${priority}`} style={{ fontSize: 11, fontWeight: 700 }}>
                {priority.toUpperCase()}
              </span>
            )}
            <span className={`kite-flyui-agentBadge kite-flyui-agentBadge--${badgeStatus}`}>
              <span className={`kite-flyui-agentDot kite-flyui-agentDot--${badgeStatus}`} aria-hidden="true" />
              {status}
            </span>
          </div>
        </div>
        {progress !== undefined && (
          <>
            <div className="kite-flyui-taskCard__progressRow">
              <span className="kite-flyui-taskCard__progressLabel">Progress</span>
              <span className="kite-flyui-taskCard__progressPct">{progress}%</span>
            </div>
            <div
              className="kite-flyui-progressBar"
              role="progressbar"
              aria-valuenow={progress}
              aria-valuemin={0}
              aria-valuemax={100}
              aria-label="Task progress"
            >
              <div
                className={`kite-flyui-progressBar__fill${status === "failed" ? " kite-flyui-progressBar__fill--danger" : status === "completed" ? " kite-flyui-progressBar__fill--success" : ""}`}
                style={{ width: `${progress}%` }}
              />
            </div>
          </>
        )}
        {(startedAt || eta) && (
          <div className="kite-flyui-taskCard__eta">
            {startedAt && <span>Started: {startedAt}</span>}
            {eta && <span>{startedAt ? " · " : ""}ETA: {eta}</span>}
          </div>
        )}
        {errorMessage && (
          <div className="kite-flyui-agentStatusCard__error" role="alert">{errorMessage}</div>
        )}
        {(onCancel || onRetry) && (
          <div className="kite-flyui-agentActions">
            {onCancel && status === "running" && (
              <button className="kite-flyui-agentBtn" onClick={onCancel} type="button">
                Cancel
              </button>
            )}
            {onRetry && status === "failed" && (
              <button className="kite-flyui-agentBtn kite-flyui-agentBtn--primary" onClick={onRetry} type="button">
                Retry
              </button>
            )}
          </div>
        )}
      </div>
    );
  },
);
