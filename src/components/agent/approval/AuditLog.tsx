import { forwardRef, useState, type CSSProperties, type ComponentPropsWithoutRef, type ReactNode } from "react";
import { buildKiteThemeStyle, mergeKiteTheme, type KiteTheme } from "../../kite/theme";
import { useFlyUITheme } from "../../kite/theme";
import "../agent.css";

export type AuditAction = "created" | "approved" | "rejected" | "modified" | "commented" | string;

export interface AuditLogEntry {
  id: string;
  actor: string;
  action: AuditAction;
  details?: string;
  timestamp?: string;
  ipAddress?: string;
  metadata?: Record<string, string>;
}

export interface AuditLogProps extends ComponentPropsWithoutRef<"div"> {
  entries: AuditLogEntry[];
  searchValue?: string;
  onSearchChange?: (value: string) => void;
  onExport?: () => void;
  onClear?: () => void;
  /** Filter by a specific action. Controlled — pair with onActionFilterChange. */
  actionFilter?: string;
  onActionFilterChange?: (action: string | undefined) => void;
  /** Placeholder for the search input. @default "Search audit log…" */
  searchPlaceholder?: string;
  /** Custom render for a single entry row. */
  renderEntry?: (
    entry: AuditLogEntry,
    isExpanded: boolean,
    toggle: (id: string) => void,
  ) => ReactNode;
  theme?: KiteTheme;
}

export const AuditLog = forwardRef<HTMLDivElement, AuditLogProps>(
  function AuditLog(
    {
      entries,
      searchValue = "",
      onSearchChange,
      onExport,
      onClear,
      actionFilter,
      onActionFilterChange,
      searchPlaceholder = "Search audit log…",
      renderEntry,
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

    // Unique actions for filter chips
    const uniqueActions = Array.from(new Set(entries.map((e) => e.action)));

    const filtered = entries.filter((e) => {
      const matchesSearch =
        !searchValue ||
        e.actor.toLowerCase().includes(searchValue.toLowerCase()) ||
        e.details?.toLowerCase().includes(searchValue.toLowerCase()) ||
        e.action.toLowerCase().includes(searchValue.toLowerCase()) ||
        e.ipAddress?.toLowerCase().includes(searchValue.toLowerCase());
      const matchesAction = !actionFilter || e.action === actionFilter;
      return matchesSearch && matchesAction;
    });

    return (
      <div
        ref={ref}
        className="kite-flyui-host kite-flyui-agentCard kite-flyui-auditLog"
        style={{ ...themeStyle, ...style } as CSSProperties}
        {...rest}
      >
        <div className="kite-flyui-auditLog__toolbar">
          <input
            type="search"
            className="kite-flyui-auditLog__search"
            placeholder={searchPlaceholder}
            value={searchValue}
            onChange={(e) => onSearchChange?.(e.target.value)}
            aria-label="Search audit log"
          />
          {onExport && (
            <button className="kite-flyui-agentBtn" onClick={onExport} type="button">Export</button>
          )}
          {onClear && (
            <button
              className="kite-flyui-agentBtn kite-flyui-agentBtn--danger"
              onClick={onClear}
              type="button"
            >
              Clear
            </button>
          )}
          <span className="kite-flyui-auditLog__count">
            {filtered.length} {filtered.length === 1 ? "entry" : "entries"}
          </span>
        </div>

        {onActionFilterChange && uniqueActions.length > 0 && (
          <div className="kite-flyui-auditLog__filters">
            <button
              className={`kite-flyui-auditLog__filterBtn${!actionFilter ? " kite-flyui-auditLog__filterBtn--active" : ""}`}
              type="button"
              onClick={() => onActionFilterChange(undefined)}
            >
              All
            </button>
            {uniqueActions.map((action) => (
              <button
                key={action}
                className={`kite-flyui-auditLog__filterBtn kite-flyui-auditLog__filterBtn--${action}${actionFilter === action ? " kite-flyui-auditLog__filterBtn--active" : ""}`}
                type="button"
                onClick={() => onActionFilterChange(actionFilter === action ? undefined : action)}
              >
                {action}
              </button>
            ))}
          </div>
        )}

        <div className="kite-flyui-auditLog__list" role="log" aria-label="Audit log">
          {filtered.map((entry) => {
            const isExpanded = expanded.has(entry.id);
            const hasDetail = !!(entry.metadata || entry.ipAddress);

            if (renderEntry) {
              return <div key={entry.id}>{renderEntry(entry, isExpanded, toggle)}</div>;
            }

            return (
              <div
                key={entry.id}
                className="kite-flyui-auditLog__item"
                onClick={() => hasDetail && toggle(entry.id)}
                role={hasDetail ? "button" : undefined}
                tabIndex={hasDetail ? 0 : undefined}
                aria-expanded={hasDetail ? isExpanded : undefined}
                onKeyDown={(e) => {
                  if (hasDetail && (e.key === "Enter" || e.key === " ")) {
                    e.preventDefault();
                    toggle(entry.id);
                  }
                }}
              >
                {entry.timestamp && (
                  <span className="kite-flyui-auditLog__time">{entry.timestamp}</span>
                )}
                <span className="kite-flyui-auditLog__actor">{entry.actor}</span>
                <span className={`kite-flyui-auditLog__action kite-flyui-auditLog__action--${entry.action}`}>
                  {entry.action}
                </span>
                <div className="kite-flyui-auditLog__details">
                  {entry.details}
                  {hasDetail && isExpanded && (
                    <div className="kite-flyui-auditLog__metaExpanded">
                      {entry.ipAddress && (
                        <div className="kite-flyui-errorLog__detailRow">
                          <span className="kite-flyui-errorLog__detailLabel">IP Address</span>
                          <span className="kite-flyui-errorLog__detailVal">{entry.ipAddress}</span>
                        </div>
                      )}
                      {entry.metadata && Object.entries(entry.metadata).map(([k, v]) => (
                        <div key={k} className="kite-flyui-errorLog__detailRow">
                          <span className="kite-flyui-errorLog__detailLabel">{k}</span>
                          <span className="kite-flyui-errorLog__detailVal">{v}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  },
);
