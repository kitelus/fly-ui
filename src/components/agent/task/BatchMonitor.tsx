import { forwardRef, type CSSProperties, type ComponentPropsWithoutRef, type ReactNode } from "react";
import { buildKiteThemeStyle, mergeKiteTheme, type KiteTheme } from "../../kite/theme";
import { useFlyUITheme } from "../../kite/theme";
import "../agent.css";

export type BatchItemStatus = "queued" | "running" | "completed" | "failed";

export interface BatchItem {
  id: string;
  name: string;
  status: BatchItemStatus;
  progress?: number;
  errorMessage?: string;
  /** Extra metadata string shown alongside the item name. */
  meta?: string;
}

export interface BatchMonitorProps extends ComponentPropsWithoutRef<"div"> {
  batchName?: string;
  items: BatchItem[];
  onRetryFailed?: () => void;
  onRetryItem?: (id: string, item: BatchItem) => void;
  onCancelItem?: (id: string, item: BatchItem) => void;
  onCancelAll?: () => void;
  /** Override the "Retry Failed" button label. */
  retryFailedLabel?: ReactNode;
  /** Override the "Cancel All" button label. */
  cancelAllLabel?: ReactNode;
  /** Override the per-item "Cancel" button label. @default "Cancel" */
  cancelItemLabel?: ReactNode;
  /** Override the per-item "Retry" button label. @default "Retry" */
  retryItemLabel?: ReactNode;
  /** Override the stat labels. */
  statLabels?: { total?: string; done?: string; running?: string; queued?: string; failed?: string };
  /** Slot rendered below the summary stats. */
  headerSlot?: ReactNode;
  /** Slot rendered below the items list. */
  footerSlot?: ReactNode;
  /** Custom render for a single batch item row. */
  renderItem?: (item: BatchItem) => ReactNode;
  /** Render a custom empty state when items is empty. */
  renderEmpty?: () => ReactNode;
  /** Text shown when there are no items. @default "" */
  emptyText?: string;
  theme?: KiteTheme;
}

export const BatchMonitor = forwardRef<HTMLDivElement, BatchMonitorProps>(
  function BatchMonitor(
    {
      batchName,
      items,
      onRetryFailed,
      onRetryItem,
      onCancelItem,
      onCancelAll,
      retryFailedLabel,
      cancelAllLabel,
      cancelItemLabel = "Cancel",
      retryItemLabel = "Retry",
      statLabels,
      headerSlot,
      footerSlot,
      renderItem,
      renderEmpty,
      emptyText,
      theme,
      style,
      ...rest
    },
    ref,
  ) {
    const contextTheme = useFlyUITheme();
    const themeStyle = buildKiteThemeStyle(mergeKiteTheme(contextTheme, theme));

    const total     = items.length;
    const completed = items.filter((i) => i.status === "completed").length;
    const running   = items.filter((i) => i.status === "running").length;
    const failed    = items.filter((i) => i.status === "failed").length;
    const queued    = items.filter((i) => i.status === "queued").length;
    const overallProgress = total > 0 ? Math.round((completed / total) * 100) : 0;

    const labels = { total: "Total", done: "Done", running: "Running", queued: "Queued", failed: "Failed", ...statLabels };

    const itemBadge: Record<BatchItemStatus, string> = {
      queued:    "idle",
      running:   "running",
      completed: "completed",
      failed:    "error",
    };

    return (
      <div
        ref={ref}
        className="kite-flyui-host kite-flyui-agentCard kite-flyui-batchMonitor"
        style={{ ...themeStyle, ...style } as CSSProperties}
        {...rest}
      >
        {batchName && <p className="kite-flyui-batchMonitor__title">{batchName}</p>}

        <div className="kite-flyui-batchMonitor__summary">
          <div className="kite-flyui-batchMonitor__stat">
            <span className="kite-flyui-batchMonitor__statVal kite-flyui-batchMonitor__statVal--total">{total}</span>
            <span className="kite-flyui-batchMonitor__statLabel">{labels.total}</span>
          </div>
          <div className="kite-flyui-batchMonitor__stat">
            <span className="kite-flyui-batchMonitor__statVal kite-flyui-batchMonitor__statVal--completed">{completed}</span>
            <span className="kite-flyui-batchMonitor__statLabel">{labels.done}</span>
          </div>
          <div className="kite-flyui-batchMonitor__stat">
            <span className="kite-flyui-batchMonitor__statVal kite-flyui-batchMonitor__statVal--running">{running}</span>
            <span className="kite-flyui-batchMonitor__statLabel">{labels.running}</span>
          </div>
          <div className="kite-flyui-batchMonitor__stat">
            <span className="kite-flyui-batchMonitor__statVal kite-flyui-batchMonitor__statVal--queued">{queued}</span>
            <span className="kite-flyui-batchMonitor__statLabel">{labels.queued}</span>
          </div>
          {failed > 0 && (
            <div className="kite-flyui-batchMonitor__stat">
              <span className="kite-flyui-batchMonitor__statVal kite-flyui-batchMonitor__statVal--failed">{failed}</span>
              <span className="kite-flyui-batchMonitor__statLabel">{labels.failed}</span>
            </div>
          )}
        </div>

        <div
          className="kite-flyui-progressBar"
          role="progressbar"
          aria-valuenow={overallProgress}
          aria-valuemin={0}
          aria-valuemax={100}
          aria-label="Batch progress"
        >
          <div
            className={`kite-flyui-progressBar__fill${failed > 0 ? " kite-flyui-progressBar__fill--warning" : running > 0 ? " kite-flyui-progressBar__fill--running" : completed === total && total > 0 ? " kite-flyui-progressBar__fill--success" : ""}`}
            style={{ width: `${overallProgress}%` }}
          />
        </div>

        {headerSlot}

        <div className="kite-flyui-batchMonitor__list">
          {items.length === 0 ? (
            renderEmpty
              ? renderEmpty()
              : emptyText
                ? <div className="kite-flyui-agentMemory__empty">{emptyText}</div>
                : null
          ) : items.map((item) =>
            renderItem ? (
              <div key={item.id}>{renderItem(item)}</div>
            ) : (
              <div key={item.id} className={`kite-flyui-batchMonitor__item${item.status === "completed" ? " kite-flyui-batchMonitor__item--completed" : item.status === "failed" ? " kite-flyui-batchMonitor__item--failed" : ""}`}>
                <span className={`kite-flyui-agentBadge kite-flyui-agentBadge--${itemBadge[item.status]} kite-flyui-batchMonitor__badge`}>
                  {item.status}
                </span>
                <span className="kite-flyui-batchMonitor__itemName">{item.name}</span>
                {item.meta && <span className="kite-flyui-batchMonitor__statLabel">{item.meta}</span>}
                {item.progress !== undefined && (
                  <div
                    className="kite-flyui-batchMonitor__itemProgress kite-flyui-progressBar"
                    role="progressbar"
                    aria-valuenow={item.progress}
                    aria-valuemin={0}
                    aria-valuemax={100}
                    aria-label={`${item.name} progress`}
                  >
                    <div className="kite-flyui-progressBar__fill" style={{ width: `${item.progress}%` }} />
                  </div>
                )}
                {(onRetryItem && item.status === "failed") || (onCancelItem && item.status === "running") ? (
                  <div className="kite-flyui-batchMonitor__itemActions">
                    {onCancelItem && item.status === "running" && (
                      <button
                        type="button"
                        className="kite-flyui-agentBtn kite-flyui-agentBtn--danger"
                        onClick={() => onCancelItem(item.id, item)}
                        aria-label={`Cancel ${item.name}`}
                      >
                        {cancelItemLabel}
                      </button>
                    )}
                    {onRetryItem && item.status === "failed" && (
                      <button
                        type="button"
                        className="kite-flyui-agentBtn kite-flyui-agentBtn--primary"
                        onClick={() => onRetryItem(item.id, item)}
                        aria-label={`Retry ${item.name}`}
                      >
                        {retryItemLabel}
                      </button>
                    )}
                  </div>
                ) : null}
                {item.errorMessage && (
                  <div className="kite-flyui-batchMonitor__itemError">{item.errorMessage}</div>
                )}
              </div>
            )
          )}
        </div>

        {(onRetryFailed && failed > 0) || onCancelAll ? (
          <div className="kite-flyui-agentActions">
            {onCancelAll && running > 0 && (
              <button className="kite-flyui-agentBtn kite-flyui-agentBtn--danger" onClick={onCancelAll} type="button">
                {cancelAllLabel ?? "Cancel All"}
              </button>
            )}
            {onRetryFailed && failed > 0 && (
              <button className="kite-flyui-agentBtn kite-flyui-agentBtn--primary" onClick={onRetryFailed} type="button">
                {retryFailedLabel ?? `Retry Failed (${failed})`}
              </button>
            )}
          </div>
        ) : null}

        {footerSlot}
      </div>
    );
  },
);
