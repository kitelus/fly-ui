import { forwardRef, type CSSProperties, type ComponentPropsWithoutRef } from "react";
import { buildKiteThemeStyle, mergeKiteTheme, type KiteTheme } from "../../kite/theme";
import { useFlyUITheme } from "../../kite/theme";
import "../agent.css";

export type TrendDirection = "up" | "down" | "stable";

export interface MetricKpi {
  label: string;
  value: string | number;
  unit?: string;
  trend?: TrendDirection;
  trendLabel?: string;
}

export interface ModelMetricsCardProps extends ComponentPropsWithoutRef<"div"> {
  title?: string;
  modelName?: string;
  metrics: MetricKpi[];
  theme?: KiteTheme;
}

export const ModelMetricsCard = forwardRef<HTMLDivElement, ModelMetricsCardProps>(
  function ModelMetricsCard({ title = "Model Metrics", modelName, metrics, theme, style, ...rest }, ref) {
    const contextTheme = useFlyUITheme();
    const themeStyle = buildKiteThemeStyle(mergeKiteTheme(contextTheme, theme));

    return (
      <div
        ref={ref}
        className="kite-flyui-host kite-flyui-agentCard kite-flyui-modelMetrics"
        style={{ ...themeStyle, ...style } as CSSProperties}
        {...rest}
      >
        <div className="kite-flyui-tokenUsage__row">
          <p className="kite-flyui-tokenUsage__title">{title}</p>
          {modelName && <span className="kite-flyui-tokenUsage__model">{modelName}</span>}
        </div>
        <div className="kite-flyui-modelMetrics__grid">
          {metrics.map((m, i) => (
            <div key={i} className="kite-flyui-modelMetrics__kpi">
              <span className="kite-flyui-modelMetrics__kpiVal">
                {m.value}{m.unit && <span className="kite-flyui-modelMetrics__kpiUnit">{m.unit}</span>}
              </span>
              <span className="kite-flyui-modelMetrics__kpiLabel">{m.label}</span>
              {m.trend && (
                <span className={`kite-flyui-modelMetrics__kpiTrend kite-flyui-modelMetrics__kpiTrend--${m.trend}`}>
                  {m.trend === "up" ? "↑" : m.trend === "down" ? "↓" : "→"}{" "}
                  {m.trendLabel}
                </span>
              )}
            </div>
          ))}
        </div>
      </div>
    );
  },
);
