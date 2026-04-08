import { forwardRef, useState, type CSSProperties, type ComponentPropsWithoutRef, type ReactNode } from "react";
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
  /** Any extra data to associate with this entry. */
  data?: unknown;
}

export interface ErrorLogViewerProps extends ComponentPropsWithoutRef<"div"> {
  entries: ErrorLogEntry[];
  filterValue?: string;
  onFilterChange?: (value: string) => void;
  onClear?: () => void;
  onExport?: () => void;
  /** Called when a log entry row is clicked. */
  onEntryClick?: (id: string, entry: ErrorLogEntry) => void;
  /** Active severity filter. When provided, only entries with matching severity are shown. */
  severityFilter?: ErrorSeverity | "all";
  onSeverityFilterChange?: (severity: ErrorSeverity | "all") => void;
  /** Placeholder text for the filter input. @default "Filter logs…" */
  filterPlaceholder?: string;
  /** Override button labels. */
  exportLabel?: ReactNode;
  clearLabel?: ReactNode;
  /** Override severity filter button labels. */
  severityLabels?: { all?: string; error?: string; warning?: string; info?: string };
  /** Text shown when there are no matching entries. @default "" */
  emptyText?: string;
  /** Render a custom empty state. */
  renderEmpty?: () => ReactNode;
  /** Custom render for a single log entry. */
  renderEntry?: (entry: ErrorLogEntry, isExpanded: boolean, toggle: () => void) => ReactNode;
  /** Slot rendered above the filter toolbar. */
  headerSlot?: ReactNode;
  /** Slot rendered below the list. */
  footerSlot?: ReactNode;
  theme?: KiteTheme;
}

export const ErrorLogViewer = forwardRef<HTMLDivElement, ErrorLogViewerProps>(
  function ErrorLogViewer(
    {
      entries,
      filterValue = "",
      onFilterChange,
      onClear,
      onExport,
      onEntryClick,
      severityFilter = "all",
      onSeverityFilterChange,
      filterPlaceholder = "Filter logs…",
      exportLabel = "Export",
      clearLabel = "Clear",
      severityLabels,
      emptyText,
      renderEmpty,
      renderEntry,
      headerSlot,
      footerSlot,
      theme,
      style,
      ...rest
    },
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

    let filtered = filterValue
      ? entries.filter(
          (e) =>
            e.message.toLowerCase().includes(filterValue.toLowerCase()) ||
            e.source?.toLowerCase().includes(filterValue.toLowerCase()) ||
            e.code?.toLowerCase().includes(filterValue.toLowerCase()),
        )
      : entries;

    if (severityFilter !== "all") {
      filtered = filtered.filter((e) => e.severity === severityFilter);
    }

    const severityBadgeClass: Record<ErrorSeverity, string> = {
      error:   "kite-flyui-agentBadge--error",
      warning: "kite-flyui-agentBadge--warning",
      info:    "kite-flyui-agentBadge--idle",
    };

    const sevLabels = { all: "All", error: "Error", warning: "Warning", info: "Info", ...severityLabels };
    const severities: Array<ErrorSeverity | "all"> = ["all", "error", "warning", "info"];

    return (
      <div
        ref={ref}
        className="kite-flyui-host kite-flyui-agentCard kite-flyui-errorLog"
        style={{ ...themeStyle, ...style } as CSSProperties}
        {...rest}
      >
        {headerSlot}
        <div className="kite-flyui-errorLog__toolbar">
          <input
            type="search"
            className="kite-flyui-errorLog__filter"
            placeholder={filterPlaceholder}
            value={filterValue}
            onChange={(e) => onFilterChange?.(e.target.value)}
            aria-label="Filter error logs"
          />
          {onSeverityFilterChange && (
            <div className="kite-flyui-errorLog__severityBtns" role="group" aria-label="Filter by severity">
              {severities.map((s) => (
                <button
                  key={s}
                  type="button"
                  className={`kite-flyui-agentBtn${severityFilter === s ? " kite-flyui-agentBtn--primary" : ""}`}
                  onClick={() => onSeverityFilterChange(s)}
                  aria-pressed={severityFilter === s}
                >
                  {sevLabels[s]}
                </button>
              ))}
            </div>
          )}
          <span className="kite-flyui-errorLog__count">
            {filtered.length} {filtered.length === 1 ? "entry" : "entries"}
          </span>
          {onExport && (
            <button className="kite-flyui-agentBtn" onClick={onExport} type="button">{exportLabel}</button>
          )}
          {onClear && (
            <button className="kite-flyui-agentBtn kite-flyui-agentBtn--danger" onClick={onClear} type="button">{clearLabel}</button>
          )}
        </div>
        <div className="kite-flyui-errorLog__list" role="log" aria-live="polite" aria-label="Error log">
          {filtered.length === 0 ? (
            renderEmpty
              ? renderEmpty()
              : emptyText
                ? <div className="kite-flyui-agentMemory__empty">{emptyText}</div>
                : null
          ) : filtered.map((entry) => {
            const isExpanded = expanded.has(entry.id);
            const toggleFn = () => toggle(entry.id);

            if (renderEntry) {
              return <div key={entry.id}>{renderEntry(entry, isExpanded, toggleFn)}</div>;
            }

            return (
              <div key={entry.id} className="kite-flyui-errorLog__item">
                <div
                  className="kite-flyui-errorLog__itemHeader"
                  onClick={() => { toggleFn(); onEntryClick?.(entry.id, entry); }}
                  role="button"
                  tabIndex={0}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" || e.key === " ") {
                      e.preventDefault();
                      toggleFn();
                      onEntryClick?.(entry.id, entry);
                    }
                  }}
                  aria-expanded={isExpanded}
                >
                  <span className={`kite-flyui-agentBadge ${severityBadgeClass[entry.severity]}`}>
                    {entry.severity}
                  </span>
                  <span className="kite-flyui-errorLog__itemMsg">{entry.message}</span>
                  {entry.timestamp && (
                    <span className="kite-flyui-errorLog__itemTime">{entry.timestamp}</span>
                  )}
                </div>
                {isExpanded && (
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
            );
          })}
        </div>
        {footerSlot}
      </div>
    );
  },
);
