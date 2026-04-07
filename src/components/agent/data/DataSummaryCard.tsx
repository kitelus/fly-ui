import { forwardRef, type CSSProperties, type ComponentPropsWithoutRef } from "react";
import { buildKiteThemeStyle, mergeKiteTheme, type KiteTheme } from "../../kite/theme";
import { useFlyUITheme } from "../../kite/theme";
import "../agent.css";

export interface DataStat {
  label: string;
  value: string | number;
}

export interface DataSummaryCardProps extends ComponentPropsWithoutRef<"div"> {
  title?: string;
  stats: DataStat[];
  insights?: string[];
  source?: string;
  lastUpdated?: string;
  theme?: KiteTheme;
}

export const DataSummaryCard = forwardRef<HTMLDivElement, DataSummaryCardProps>(
  function DataSummaryCard(
    { title, stats, insights, source, lastUpdated, theme, style, ...rest },
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
        {(title || source || lastUpdated) && (
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: 6 }}>
            {title && <p className="kite-flyui-tokenUsage__title">{title}</p>}
            <span style={{ fontSize: 11, color: "var(--kite-muted)" }}>
              {source && <span>{source}</span>}
              {lastUpdated && <span>{source ? " · " : ""}Updated {lastUpdated}</span>}
            </span>
          </div>
        )}
        <div className="kite-flyui-dataSummary__grid">
          {stats.map((s, i) => (
            <div key={i} className="kite-flyui-dataSummary__stat">
              <span className="kite-flyui-dataSummary__statVal">{s.value}</span>
              <span className="kite-flyui-dataSummary__statLabel">{s.label}</span>
            </div>
          ))}
        </div>
        {insights && insights.length > 0 && (
          <div className="kite-flyui-dataSummary__insights">
            {insights.map((insight, i) => (
              <div key={i} className="kite-flyui-dataSummary__insight">{insight}</div>
            ))}
          </div>
        )}
      </div>
    );
  },
);
