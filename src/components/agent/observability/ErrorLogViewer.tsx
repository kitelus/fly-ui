import { forwardRef, useState, type CSSProperties, type ComponentPropsWithoutRef } from "react";
import { buildKiteThemeStyle, mergeKiteTheme, type KiteTheme } from "../../kite/theme";
import { useFlyUITheme } from "../../kite/theme";
import "../agent.css";

export type ErrorSeverity = "error" | "warning" | "info";

export interface ErrorLogEntry {
  id: string;
  severity: ErrorSeverity;
  message: string;
  timestamp?: string;
  source?: string;
  stack?: string;
  code?: string;
}

export interface ErrorLogViewerProps extends ComponentPropsWithoutRef<"div"> {
  entries: ErrorLogEntry[];
  filterValue?: string;
  onFilterChange?: (value: string) => void;
  theme?: KiteTheme;
}

export const ErrorLogViewer = forwardRef<HTMLDivElement, ErrorLogViewerProps>(
  function ErrorLogViewer(
    { entries, filterValue = "", onFilterChange, theme, style, ...rest },
    ref,
  ) {
    const contextTheme = useFlyUITheme();
    const themeStyle = buildKiteThemeStyle(mergeKiteTheme(contextTheme, theme));
    const [expanded, setExpanded] = useState<Set<string>>(new Set());

    const toggle = (id: string) =>
      setExpanded((prev) => {
        const next = new Set(prev);
        if (next.has(id)) next.delete(id);
        else next.add(id);
        return next;
      });

    const filtered = filterValue
      ? entries.filter(
          (e) =>
            e.message.toLowerCase().includes(filterValue.toLowerCase()) ||
            e.source?.toLowerCase().includes(filterValue.toLowerCase()),
        )
      : entries;

    const severityBadgeClass: Record<ErrorSeverity, string> = {
      error: "kite-flyui-agentBadge--error",
      warning: "kite-flyui-agentBadge--warning",
      info: "kite-flyui-agentBadge--idle",
    };

    return (
      <div
        ref={ref}
        className="kite-flyui-host kite-flyui-agentCard kite-flyui-errorLog"
        style={{ ...themeStyle, ...style } as CSSProperties}
        {...rest}
      >
        <div className="kite-flyui-errorLog__toolbar">
          <input
            type="search"
            className="kite-flyui-errorLog__filter"
            placeholder="Filter logs…"
            value={filterValue}
            onChange={(e) => onFilterChange?.(e.target.value)}
            aria-label="Filter error logs"
          />
          <span className="kite-flyui-errorLog__count">
            {filtered.length} {filtered.length === 1 ? "entry" : "entries"}
          </span>
        </div>
        <div className="kite-flyui-errorLog__list" role="log" aria-live="polite" aria-label="Error log">
          {filtered.map((entry) => (
            <div key={entry.id} className="kite-flyui-errorLog__item">
              <div
                className="kite-flyui-errorLog__itemHeader"
                onClick={() => toggle(entry.id)}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    e.preventDefault();
                    toggle(entry.id);
                  }
                }}
                aria-expanded={expanded.has(entry.id)}
              >
                <span className={`kite-flyui-agentBadge ${severityBadgeClass[entry.severity]}`}>
                  {entry.severity}
                </span>
                <span className="kite-flyui-errorLog__itemMsg">{entry.message}</span>
                {entry.timestamp && (
                  <span className="kite-flyui-errorLog__itemTime">{entry.timestamp}</span>
                )}
              </div>
              {expanded.has(entry.id) && (
                <div className="kite-flyui-errorLog__itemDetail">
                  {entry.source && (
                    <div className="kite-flyui-errorLog__detailRow">
                      <span className="kite-flyui-errorLog__detailLabel">Source</span>
                      <span className="kite-flyui-errorLog__detailVal">{entry.source}</span>
                    </div>
                  )}
                  {entry.code && (
                    <div className="kite-flyui-errorLog__detailRow">
                      <span className="kite-flyui-errorLog__detailLabel">Code</span>
                      <span className="kite-flyui-errorLog__detailVal">{entry.code}</span>
                    </div>
                  )}
                  {entry.stack && (
                    <pre className="kite-flyui-errorLog__stack">{entry.stack}</pre>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    );
  },
);
