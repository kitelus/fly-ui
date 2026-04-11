import { forwardRef, type CSSProperties, type ComponentPropsWithoutRef, type ReactNode } from "react";
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
  /** Override the priority badge label. Useful for i18n. */
  priorityLabel?: string;
  progress?: number;
  /** Override the "Progress" label. @default "Progress" */
  progressLabel?: string;
  eta?: string;
  startedAt?: string;
  completedAt?: string;
  errorMessage?: string;
  onCancel?: () => void;
  onRetry?: () => void;
  onPause?: () => void;
  onResume?: () => void;
  /** Show pause/resume even outside running/cancelled states. @default false */
  alwaysShowPauseResume?: boolean;
  /** Override button labels. */
  cancelLabel?: ReactNode;
  retryLabel?: ReactNode;
  pauseLabel?: ReactNode;
  resumeLabel?: ReactNode;
  /** Extra action buttons rendered alongside built-in ones. */
  extraActions?: Array<{ label: ReactNode; onClick: () => void; variant?: "primary" | "danger" | "default"; ariaLabel?: string }>;
  /** Slot rendered below the progress bar and above actions. */
  children?: ReactNode;
  /** Slot rendered in the card header alongside name/priority. */
  headerSlot?: ReactNode;
  theme?: KiteTheme;
}

const STATUS_BADGE: Record<TaskStatus, string> = {
  queued:    "idle",
  running:   "running",
  completed: "completed",
  failed:    "error",
  cancelled: "idle",
};

export const TaskStatusCard = forwardRef<HTMLDivElement, TaskStatusCardProps>(
  function TaskStatusCard(
    {
      taskId,
      name,
      status,
      priority,
      priorityLabel,
      progress,
      progressLabel = "Progress",
      eta,
      startedAt,
      completedAt,
      errorMessage,
      onCancel,
      onRetry,
      onPause,
      onResume,
      alwaysShowPauseResume = false,
      cancelLabel = "Cancel",
      retryLabel = "Retry",
      pauseLabel = "Pause",
      resumeLabel = "Resume",
      extraActions,
      children,
      headerSlot,
      theme,
      style,
      ...rest
    },
    ref,
  ) {
    const contextTheme = useFlyUITheme();
    const themeStyle = buildKiteThemeStyle(mergeKiteTheme(contextTheme, theme));
    const badgeStatus = STATUS_BADGE[status];

    const showPause  = onPause  && (alwaysShowPauseResume || status === "running");
    const showResume = onResume && (alwaysShowPauseResume || status === "cancelled");
    const showCancel = onCancel && status === "running";
    const showRetry  = onRetry  && status === "failed";

    const hasActions = showPause || showResume || showCancel || showRetry || (extraActions && extraActions.length > 0);

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
          <div className="kite-flyui-taskCard__headerRight">
            {priority && (
              <span className={`kite-flyui-taskCard__priority--${priority}`}>
                {priorityLabel ?? priority.toUpperCase()}
              </span>
            )}
            <span className={`kite-flyui-agentBadge kite-flyui-agentBadge--${badgeStatus}`}>
              <span className={`kite-flyui-agentDot kite-flyui-agentDot--${badgeStatus}`} aria-hidden="true" />
              {status}
            </span>
            {headerSlot}
          </div>
        </div>

        {progress !== undefined && (
          <>
            <div className="kite-flyui-taskCard__progressRow">
              <span className="kite-flyui-taskCard__progressLabel">{progressLabel}</span>
              <span className="kite-flyui-taskCard__progressPct">{progress}%</span>
            </div>
            <div
              className="kite-flyui-progressBar"
              role="progressbar"
              aria-valuenow={progress}
              aria-valuemin={0}
              aria-valuemax={100}
              aria-label={`${progressLabel}: ${progress}%`}
            >
              <div
                className={`kite-flyui-progressBar__fill${
                  status === "failed"    ? " kite-flyui-progressBar__fill--danger"
                  : status === "completed" ? " kite-flyui-progressBar__fill--success"
                  : status === "running"   ? " kite-flyui-progressBar__fill--running"
                  : ""
                }`}
                style={{ width: `${progress}%` }}
              />
            </div>
          </>
        )}

        {(startedAt || completedAt || eta) && (
          <div className="kite-flyui-taskCard__eta">
            {startedAt   && <span>Started: {startedAt}</span>}
            {completedAt && <span>{startedAt ? " · " : ""}Completed: {completedAt}</span>}
            {eta         && <span>{(startedAt || completedAt) ? " · " : ""}ETA: {eta}</span>}
          </div>
        )}

        {errorMessage && (
          <div className="kite-flyui-agentStatusCard__error" role="alert">{errorMessage}</div>
        )}

        {children}

        {hasActions && (
          <div className="kite-flyui-agentActions">
            {showPause && (
              <button className="kite-flyui-agentBtn" onClick={onPause} type="button">{pauseLabel}</button>
            )}
            {showResume && (
              <button className="kite-flyui-agentBtn kite-flyui-agentBtn--primary" onClick={onResume} type="button">{resumeLabel}</button>
            )}
            {showCancel && (
              <button className="kite-flyui-agentBtn kite-flyui-agentBtn--danger" onClick={onCancel} type="button">{cancelLabel}</button>
            )}
            {showRetry && (
              <button className="kite-flyui-agentBtn kite-flyui-agentBtn--primary" onClick={onRetry} type="button">{retryLabel}</button>
            )}
            {extraActions?.map((action, i) => (
              <button
                key={i}
                className={`kite-flyui-agentBtn${action.variant === "primary" ? " kite-flyui-agentBtn--primary" : action.variant === "danger" ? " kite-flyui-agentBtn--danger" : ""}`}
                onClick={action.onClick}
                type="button"
                aria-label={action.ariaLabel}
              >
                {action.label}
              </button>
            ))}
          </div>
        )}
      </div>
    );
  },
);
