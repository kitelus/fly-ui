import { forwardRef, type CSSProperties, type ComponentPropsWithoutRef, type ReactNode } from "react";
import { buildKiteThemeStyle, mergeKiteTheme, type KiteTheme } from "../../kite/theme";
import { useFlyUITheme } from "../../kite/theme";
import "../agent.css";

export interface DataStat {
  id?: string;
  label: string;
  value: string | number;
  /** Unit shown after the value (e.g. "rows", "ms"). */
  unit?: string;
  /** Extra description shown below the label. */
  description?: string;
}

export interface DataSummaryCardProps extends ComponentPropsWithoutRef<"div"> {
  title?: string;
  stats: DataStat[];
  insights?: string[];
  source?: string;
  lastUpdated?: string;
  /** Called when a stat card is clicked. Receives the stat id (or label if id missing). */
  onStatClick?: (id: string, stat: DataStat) => void;
  /** Called when the refresh button is clicked. When provided, a Refresh button appears. */
  onRefresh?: () => void;
  /** Label for the refresh button. @default "Refresh" */
  refreshLabel?: ReactNode;
  /** Whether refresh is in progress. */
  refreshing?: boolean;
  /** Custom render for a single stat. */
  renderStat?: (stat: DataStat) => ReactNode;
  /** Slot rendered in the card header alongside title. */
  headerSlot?: ReactNode;
  /** Slot rendered below the insights. */
  footerSlot?: ReactNode;
  theme?: KiteTheme;
}

export const DataSummaryCard = forwardRef<HTMLDivElement, DataSummaryCardProps>(
  function DataSummaryCard(
    {
      title,
      stats,
      insights,
      source,
      lastUpdated,
      onStatClick,
      onRefresh,
      refreshLabel = "Refresh",
      refreshing = false,
      renderStat,
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

    return (
      <div
        ref={ref}
        className="kite-flyui-host kite-flyui-agentCard kite-flyui-dataSummary"
        style={{ ...themeStyle, ...style } as CSSProperties}
        {...rest}
      >
        {(title || source || lastUpdated || headerSlot || onRefresh) && (
          <div className="kite-flyui-dataSummary__topRow">
            <div style={{ display: "flex", alignItems: "center", gap: "8px", flex: 1, minWidth: 0 }}>
              {title && <p className="kite-flyui-tokenUsage__title">{title}</p>}
              <span className="kite-flyui-dataSummary__meta">
                {source && <span>{source}</span>}
                {lastUpdated && <span>{source ? " · " : ""}Updated {lastUpdated}</span>}
              </span>
            </div>
            {headerSlot}
            {onRefresh && (
              <button
                type="button"
                className="kite-flyui-agentBtn"
                onClick={onRefresh}
                disabled={refreshing}
                aria-label="Refresh data"
              >
                {refreshing ? "…" : refreshLabel}
              </button>
            )}
          </div>
        )}
        <div className="kite-flyui-dataSummary__grid">
          {stats.map((s) => {
            const key = s.id ?? s.label;
            if (renderStat) {
              return <div key={key}>{renderStat(s)}</div>;
            }
            return (
              <div
                key={key}
                className={`kite-flyui-dataSummary__stat${onStatClick ? " kite-flyui-dataSummary__stat--clickable" : ""}`}
                onClick={onStatClick ? () => onStatClick(s.id ?? s.label, s) : undefined}
                role={onStatClick ? "button" : undefined}
                tabIndex={onStatClick ? 0 : undefined}
                onKeyDown={onStatClick ? (e) => {
                  if (e.key === "Enter" || e.key === " ") { e.preventDefault(); onStatClick(s.id ?? s.label, s); }
                } : undefined}
                aria-label={onStatClick ? `${s.label}: ${s.value}${s.unit ? " " + s.unit : ""}` : undefined}
              >
                <span className="kite-flyui-dataSummary__statVal">
                  {s.value}{s.unit && <span className="kite-flyui-dataSummary__statUnit"> {s.unit}</span>}
                </span>
                <span className="kite-flyui-dataSummary__statLabel">{s.label}</span>
                {s.description && (
                  <span className="kite-flyui-dataSummary__statDesc">{s.description}</span>
                )}
              </div>
            );
          })}
        </div>
        {insights && insights.length > 0 && (
          <div className="kite-flyui-dataSummary__insights">
            {insights.map((insight, i) => (
              <div key={`insight-${i}-${insight.slice(0, 20)}`} className="kite-flyui-dataSummary__insight">{insight}</div>
            ))}
          </div>
        )}
        {footerSlot}
      </div>
    );
  },
);
