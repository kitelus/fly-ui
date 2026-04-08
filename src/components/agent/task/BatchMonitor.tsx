import { forwardRef, type CSSProperties, type ComponentPropsWithoutRef } from "react";
import { buildKiteThemeStyle, mergeKiteTheme, type KiteTheme } from "../../kite/theme";
import { useFlyUITheme } from "../../kite/theme";
import "../agent.css";

export interface BatchItem {
  id: string;
  name: string;
  status: "queued" | "running" | "completed" | "failed";
  progress?: number;
}

export interface BatchMonitorProps extends ComponentPropsWithoutRef<"div"> {
  batchName?: string;
  items: BatchItem[];
  onRetryFailed?: () => void;
  theme?: KiteTheme;
}

export const BatchMonitor = forwardRef<HTMLDivElement, BatchMonitorProps>(
  function BatchMonitor({ batchName, items, onRetryFailed, theme, style, ...rest }, ref) {
    const contextTheme = useFlyUITheme();
    const themeStyle = buildKiteThemeStyle(mergeKiteTheme(contextTheme, theme));

    const total = items.length;
    const completed = items.filter((i) => i.status === "completed").length;
    const running = items.filter((i) => i.status === "running").length;
    const failed = items.filter((i) => i.status === "failed").length;
    const queued = items.filter((i) => i.status === "queued").length;
    const overallProgress = total > 0 ? Math.round((completed / total) * 100) : 0;

    const itemBadge: Record<BatchItem["status"], string> = {
      queued: "idle",
      running: "running",
      completed: "completed",
      failed: "error",
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
            <span className="kite-flyui-batchMonitor__statLabel">Total</span>
          </div>
          <div className="kite-flyui-batchMonitor__stat">
            <span className="kite-flyui-batchMonitor__statVal kite-flyui-batchMonitor__statVal--completed">{completed}</span>
            <span className="kite-flyui-batchMonitor__statLabel">Done</span>
          </div>
          <div className="kite-flyui-batchMonitor__stat">
            <span className="kite-flyui-batchMonitor__statVal kite-flyui-batchMonitor__statVal--running">{running}</span>
            <span className="kite-flyui-batchMonitor__statLabel">Running</span>
          </div>
          <div className="kite-flyui-batchMonitor__stat">
            <span className="kite-flyui-batchMonitor__statVal kite-flyui-batchMonitor__statVal--queued">{queued}</span>
            <span className="kite-flyui-batchMonitor__statLabel">Queued</span>
          </div>
          {failed > 0 && (
            <div className="kite-flyui-batchMonitor__stat">
              <span className="kite-flyui-batchMonitor__statVal kite-flyui-batchMonitor__statVal--failed">{failed}</span>
              <span className="kite-flyui-batchMonitor__statLabel">Failed</span>
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
            className={`kite-flyui-progressBar__fill${failed > 0 ? " kite-flyui-progressBar__fill--warning" : ""}`}
            style={{ width: `${overallProgress}%` }}
          />
        </div>
        <div className="kite-flyui-batchMonitor__list">
          {items.map((item) => (
            <div key={item.id} className="kite-flyui-batchMonitor__item">
              <span className={`kite-flyui-agentBadge kite-flyui-agentBadge--${itemBadge[item.status]} kite-flyui-batchMonitor__badge`}>
                {item.status}
              </span>
              <span className="kite-flyui-batchMonitor__itemName">{item.name}</span>
              {item.progress !== undefined && (
                <div className="kite-flyui-batchMonitor__itemProgress kite-flyui-progressBar" role="progressbar" aria-valuenow={item.progress} aria-valuemin={0} aria-valuemax={100}>
                  <div className="kite-flyui-progressBar__fill" style={{ width: `${item.progress}%` }} />
                </div>
              )}
            </div>
          ))}
        </div>
        {onRetryFailed && failed > 0 && (
          <div className="kite-flyui-agentActions">
            <button className="kite-flyui-agentBtn kite-flyui-agentBtn--primary" onClick={onRetryFailed} type="button">
              Retry Failed ({failed})
            </button>
          </div>
        )}
      </div>
    );
  },
);
