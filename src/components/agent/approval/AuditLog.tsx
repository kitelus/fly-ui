import { forwardRef, useState, type CSSProperties, type ComponentPropsWithoutRef } from "react";
import { buildKiteThemeStyle, mergeKiteTheme, type KiteTheme } from "../../kite/theme";
import { useFlyUITheme } from "../../kite/theme";
import "../agent.css";

export type AuditAction = "created" | "approved" | "rejected" | "modified" | "commented";

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
  theme?: KiteTheme;
}

export const AuditLog = forwardRef<HTMLDivElement, AuditLogProps>(
  function AuditLog({ entries, searchValue = "", onSearchChange, onExport, theme, style, ...rest }, ref) {
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

    const filtered = searchValue
      ? entries.filter(
          (e) =>
            e.actor.toLowerCase().includes(searchValue.toLowerCase()) ||
            e.details?.toLowerCase().includes(searchValue.toLowerCase()) ||
            e.action.toLowerCase().includes(searchValue.toLowerCase()),
        )
      : entries;

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
            placeholder="Search audit log…"
            value={searchValue}
            onChange={(e) => onSearchChange?.(e.target.value)}
            aria-label="Search audit log"
          />
          {onExport && (
            <button className="kite-flyui-agentBtn" onClick={onExport} type="button">Export</button>
          )}
          <span style={{ fontSize: 11, color: "var(--kite-muted)" }}>
            {filtered.length} {filtered.length === 1 ? "entry" : "entries"}
          </span>
        </div>
        <div className="kite-flyui-auditLog__list" role="log" aria-label="Audit log">
          {filtered.map((entry) => (
            <div
              key={entry.id}
              className="kite-flyui-auditLog__item"
              onClick={() => entry.metadata && toggle(entry.id)}
              role={entry.metadata ? "button" : undefined}
              tabIndex={entry.metadata ? 0 : undefined}
              onKeyDown={(e) => {
                if (entry.metadata && (e.key === "Enter" || e.key === " ")) {
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
                {entry.metadata && expanded.has(entry.id) && (
                  <div style={{ marginTop: 6 }}>
                    {Object.entries(entry.metadata).map(([k, v]) => (
                      <div key={k} className="kite-flyui-errorLog__detailRow">
                        <span className="kite-flyui-errorLog__detailLabel">{k}</span>
                        <span className="kite-flyui-errorLog__detailVal">{v}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  },
);
