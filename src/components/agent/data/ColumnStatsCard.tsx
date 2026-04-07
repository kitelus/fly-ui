import { forwardRef, type CSSProperties, type ComponentPropsWithoutRef } from "react";
import { buildKiteThemeStyle, mergeKiteTheme, type KiteTheme } from "../../kite/theme";
import { useFlyUITheme } from "../../kite/theme";
import "../agent.css";

export type ColumnDataType = "string" | "number" | "boolean" | "date" | "mixed";

export interface ColumnBin {
  label: string;
  count: number;
}

export interface ColumnStatsCardProps extends ComponentPropsWithoutRef<"div"> {
  columnName: string;
  dataType: ColumnDataType;
  totalCount: number;
  missingCount?: number;
  uniqueCount?: number;
  min?: string | number;
  max?: string | number;
  mean?: number;
  median?: number;
  topBins?: ColumnBin[];
  theme?: KiteTheme;
}

export const ColumnStatsCard = forwardRef<HTMLDivElement, ColumnStatsCardProps>(
  function ColumnStatsCard(
    {
      columnName,
      dataType,
      totalCount,
      missingCount,
      uniqueCount,
      min,
      max,
      mean,
      median,
      topBins,
      theme,
      style,
      ...rest
    },
    ref,
  ) {
    const contextTheme = useFlyUITheme();
    const themeStyle = buildKiteThemeStyle(mergeKiteTheme(contextTheme, theme));

    const missingPct = missingCount !== undefined ? ((missingCount / totalCount) * 100).toFixed(1) : undefined;
    const maxBinCount = topBins ? Math.max(...topBins.map((b) => b.count)) : 0;

    return (
      <div
        ref={ref}
        className="kite-flyui-host kite-flyui-agentCard kite-flyui-columnStats"
        style={{ ...themeStyle, ...style } as CSSProperties}
        {...rest}
      >
        <div className="kite-flyui-columnStats__header">
          <span className="kite-flyui-columnStats__name">{columnName}</span>
          <span className="kite-flyui-columnStats__type">{dataType}</span>
          {missingPct !== undefined && parseFloat(missingPct) > 0 && (
            <span className="kite-flyui-columnStats__missing">{missingPct}% missing</span>
          )}
        </div>
        <div className="kite-flyui-columnStats__statsRow">
          <div className="kite-flyui-columnStats__stat">
            <span className="kite-flyui-columnStats__statVal">{totalCount.toLocaleString()}</span>
            <span className="kite-flyui-columnStats__statLabel">Total</span>
          </div>
          {uniqueCount !== undefined && (
            <div className="kite-flyui-columnStats__stat">
              <span className="kite-flyui-columnStats__statVal">{uniqueCount.toLocaleString()}</span>
              <span className="kite-flyui-columnStats__statLabel">Unique</span>
            </div>
          )}
          {min !== undefined && (
            <div className="kite-flyui-columnStats__stat">
              <span className="kite-flyui-columnStats__statVal">{min}</span>
              <span className="kite-flyui-columnStats__statLabel">Min</span>
            </div>
          )}
          {max !== undefined && (
            <div className="kite-flyui-columnStats__stat">
              <span className="kite-flyui-columnStats__statVal">{max}</span>
              <span className="kite-flyui-columnStats__statLabel">Max</span>
            </div>
          )}
          {mean !== undefined && (
            <div className="kite-flyui-columnStats__stat">
              <span className="kite-flyui-columnStats__statVal">{mean.toFixed(2)}</span>
              <span className="kite-flyui-columnStats__statLabel">Mean</span>
            </div>
          )}
          {median !== undefined && (
            <div className="kite-flyui-columnStats__stat">
              <span className="kite-flyui-columnStats__statVal">{median}</span>
              <span className="kite-flyui-columnStats__statLabel">Median</span>
            </div>
          )}
        </div>
        {topBins && topBins.length > 0 && (
          <div className="kite-flyui-columnStats__barChart" aria-label="Value distribution">
            {topBins.map((bin, i) => (
              <div key={i} className="kite-flyui-columnStats__barRow">
                <span className="kite-flyui-columnStats__barLabel" title={bin.label}>{bin.label}</span>
                <div className="kite-flyui-columnStats__bar">
                  <div
                    className="kite-flyui-columnStats__barFill"
                    style={{ width: `${maxBinCount > 0 ? (bin.count / maxBinCount) * 100 : 0}%` }}
                  />
                </div>
                <span className="kite-flyui-columnStats__barCount">{bin.count.toLocaleString()}</span>
              </div>
            ))}
          </div>
        )}
      </div>
    );
  },
);
