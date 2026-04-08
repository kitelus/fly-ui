import { forwardRef, type CSSProperties, type ComponentPropsWithoutRef, type ReactNode } from "react";
import { buildKiteThemeStyle, mergeKiteTheme, type KiteTheme } from "../../kite/theme";
import { useFlyUITheme } from "../../kite/theme";
import "../agent.css";

export type ColumnDataType = "string" | "number" | "boolean" | "date" | "mixed";

export interface ColumnBin {
  label: string;
  count: number;
}

export interface ColumnStatsCardProps extends Omit<ComponentPropsWithoutRef<"div">, "onSelect"> {
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
  /** Called when the card is selected/clicked. */
  onSelect?: (columnName: string) => void;
  /** Whether this card is currently selected. */
  selected?: boolean;
  /** Custom render for a histogram bin row. */
  renderBin?: (bin: ColumnBin, pct: number) => ReactNode;
  /** Slot rendered below the histogram. */
  footerSlot?: ReactNode;
  /** Override stat labels. */
  statLabels?: {
    total?: string;
    unique?: string;
    min?: string;
    max?: string;
    mean?: string;
    median?: string;
    missing?: string;
  };
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
      onSelect,
      selected = false,
      renderBin,
      footerSlot,
      statLabels,
      theme,
      style,
      ...rest
    },
    ref,
  ) {
    const contextTheme = useFlyUITheme();
    const themeStyle = buildKiteThemeStyle(mergeKiteTheme(contextTheme, theme));

    const missingPct = missingCount !== undefined ? ((missingCount / totalCount) * 100).toFixed(1) : undefined;
    const maxBinCount = topBins && topBins.length > 0 ? Math.max(...topBins.map((b) => b.count)) : 0;

    const labels = {
      total: "Total", unique: "Unique", min: "Min", max: "Max",
      mean: "Mean", median: "Median", missing: "Missing",
      ...statLabels,
    };

    return (
      <div
        ref={ref}
        className={`kite-flyui-host kite-flyui-agentCard kite-flyui-columnStats${selected ? " kite-flyui-columnStats--selected" : ""}`}
        style={{ ...themeStyle, ...style } as CSSProperties}
        onClick={onSelect ? () => onSelect(columnName) : undefined}
        role={onSelect ? "button" : undefined}
        tabIndex={onSelect ? 0 : undefined}
        onKeyDown={onSelect ? (e) => {
          if (e.key === "Enter" || e.key === " ") { e.preventDefault(); onSelect(columnName); }
        } : undefined}
        aria-pressed={onSelect ? selected : undefined}
        {...rest}
      >
        <div className="kite-flyui-columnStats__header">
          <span className="kite-flyui-columnStats__name">{columnName}</span>
          <span className="kite-flyui-columnStats__type">{dataType}</span>
          {missingPct !== undefined && parseFloat(missingPct) > 0 && (
            <span className="kite-flyui-columnStats__missing">{missingPct}% {labels.missing.toLowerCase()}</span>
          )}
        </div>
        <div className="kite-flyui-columnStats__statsRow">
          <div className="kite-flyui-columnStats__stat">
            <span className="kite-flyui-columnStats__statVal">{totalCount.toLocaleString()}</span>
            <span className="kite-flyui-columnStats__statLabel">{labels.total}</span>
          </div>
          {uniqueCount !== undefined && (
            <div className="kite-flyui-columnStats__stat">
              <span className="kite-flyui-columnStats__statVal">{uniqueCount.toLocaleString()}</span>
              <span className="kite-flyui-columnStats__statLabel">{labels.unique}</span>
            </div>
          )}
          {min !== undefined && (
            <div className="kite-flyui-columnStats__stat">
              <span className="kite-flyui-columnStats__statVal">{min}</span>
              <span className="kite-flyui-columnStats__statLabel">{labels.min}</span>
            </div>
          )}
          {max !== undefined && (
            <div className="kite-flyui-columnStats__stat">
              <span className="kite-flyui-columnStats__statVal">{max}</span>
              <span className="kite-flyui-columnStats__statLabel">{labels.max}</span>
            </div>
          )}
          {mean !== undefined && (
            <div className="kite-flyui-columnStats__stat">
              <span className="kite-flyui-columnStats__statVal">{mean.toFixed(2)}</span>
              <span className="kite-flyui-columnStats__statLabel">{labels.mean}</span>
            </div>
          )}
          {median !== undefined && (
            <div className="kite-flyui-columnStats__stat">
              <span className="kite-flyui-columnStats__statVal">{median}</span>
              <span className="kite-flyui-columnStats__statLabel">{labels.median}</span>
            </div>
          )}
        </div>
        {topBins && topBins.length > 0 && (
          <div className="kite-flyui-columnStats__barChart" aria-label="Value distribution">
            {topBins.map((bin, i) => {
              const pct = maxBinCount > 0 ? (bin.count / maxBinCount) * 100 : 0;
              if (renderBin) {
                return <div key={`${bin.label}-${i}`}>{renderBin(bin, pct)}</div>;
              }
              return (
                <div key={`${bin.label}-${i}`} className="kite-flyui-columnStats__barRow">
                  <span className="kite-flyui-columnStats__barLabel" title={bin.label}>{bin.label}</span>
                  <div className="kite-flyui-columnStats__bar">
                    <div
                      className="kite-flyui-columnStats__barFill"
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                  <span className="kite-flyui-columnStats__barCount">{bin.count.toLocaleString()}</span>
                </div>
              );
            })}
          </div>
        )}
        {footerSlot}
      </div>
    );
  },
);
