import { forwardRef, type CSSProperties, type ComponentPropsWithoutRef, type ReactNode } from "react";
import { buildKiteThemeStyle, mergeKiteTheme, type KiteTheme } from "../../kite/theme";
import { useFlyUITheme } from "../../kite/theme";
import "../agent.css";

export type TrendDirection = "up" | "down" | "stable";

export interface MetricKpi {
  /** Unique key for this metric (used as React key). */
  id?: string;
  label: string;
  value: string | number;
  unit?: string;
  trend?: TrendDirection;
  trendLabel?: string;
  /** Override trend indicator icons. */
  trendIcons?: Partial<Record<TrendDirection, ReactNode>>;
  /** Called when the metric card is clicked. */
  onClick?: () => void;
  /** Extra detail shown below the label. */
  description?: string;
}

export interface ModelMetricsCardProps extends ComponentPropsWithoutRef<"div"> {
  title?: string;
  modelName?: string;
  metrics: MetricKpi[];
  /** Called when the refresh button is clicked. When provided, a Refresh button appears in the header. */
  onRefresh?: () => void;
  /** Override the "Refresh" button label. @default "Refresh" */
  refreshLabel?: ReactNode;
  /** Whether a refresh is currently in progress. */
  refreshing?: boolean;
  /** Override trend icon defaults globally. */
  trendIcons?: Partial<Record<TrendDirection, ReactNode>>;
  /** Slot rendered in the card header alongside title/model name. */
  headerSlot?: ReactNode;
  /** Slot rendered below the metrics grid. */
  footerSlot?: ReactNode;
  children?: ReactNode;
  theme?: KiteTheme;
}

const DEFAULT_TREND_ICON: Record<TrendDirection, string> = {
  up:     "↑",
  down:   "↓",
  stable: "→",
};

export const ModelMetricsCard = forwardRef<HTMLDivElement, ModelMetricsCardProps>(
  function ModelMetricsCard(
    {
      title = "Model Metrics",
      modelName,
      metrics,
      onRefresh,
      refreshLabel = "Refresh",
      refreshing = false,
      trendIcons,
      headerSlot,
      footerSlot,
      children,
      theme,
      style,
      ...rest
    },
    ref,
  ) {
    const contextTheme = useFlyUITheme();
    const themeStyle = buildKiteThemeStyle(mergeKiteTheme(contextTheme, theme));

    const resolveTrendIcon = (m: MetricKpi, dir: TrendDirection): ReactNode =>
      m.trendIcons?.[dir] ?? trendIcons?.[dir] ?? DEFAULT_TREND_ICON[dir];

    return (
      <div
        ref={ref}
        className="kite-flyui-host kite-flyui-agentCard kite-flyui-modelMetrics"
        style={{ ...themeStyle, ...style } as CSSProperties}
        {...rest}
      >
        <div className="kite-flyui-tokenUsage__row">
          <p className="kite-flyui-tokenUsage__title">{title}</p>
          <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
            {modelName && <span className="kite-flyui-tokenUsage__model">{modelName}</span>}
            {headerSlot}
            {onRefresh && (
              <button
                type="button"
                className="kite-flyui-agentBtn"
                onClick={onRefresh}
                disabled={refreshing}
                aria-label="Refresh metrics"
              >
                {refreshing ? "…" : refreshLabel}
              </button>
            )}
          </div>
        </div>
        <div className="kite-flyui-modelMetrics__grid">
          {metrics.map((m, i) => (
            <div
              key={m.id ?? String(i)}
              className={`kite-flyui-modelMetrics__kpi${m.onClick ? " kite-flyui-modelMetrics__kpi--clickable" : ""}`}
              onClick={m.onClick}
              role={m.onClick ? "button" : undefined}
              tabIndex={m.onClick ? 0 : undefined}
              onKeyDown={m.onClick ? (e) => {
                if (e.key === "Enter" || e.key === " ") { e.preventDefault(); m.onClick!(); }
              } : undefined}
              aria-label={m.onClick ? `${m.label}: ${m.value}${m.unit ?? ""}` : undefined}
            >
              <span className="kite-flyui-modelMetrics__kpiVal">
                {m.value}{m.unit && <span className="kite-flyui-modelMetrics__kpiUnit">{m.unit}</span>}
              </span>
              <span className="kite-flyui-modelMetrics__kpiLabel">{m.label}</span>
              {m.description && (
                <span className="kite-flyui-modelMetrics__kpiDesc">{m.description}</span>
              )}
              {m.trend && (
                <span className={`kite-flyui-modelMetrics__kpiTrend kite-flyui-modelMetrics__kpiTrend--${m.trend}`}>
                  {resolveTrendIcon(m, m.trend)}{" "}
                  {m.trendLabel}
                </span>
              )}
            </div>
          ))}
        </div>
        {children}
        {footerSlot}
      </div>
    );
  },
);
