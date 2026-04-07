import { forwardRef, type CSSProperties, type ComponentPropsWithoutRef } from "react";
import { buildKiteThemeStyle, mergeKiteTheme, type KiteTheme } from "../../kite/theme";
import { useFlyUITheme } from "../../kite/theme";
import "../agent.css";

export type DataQualityLevel = "critical" | "high" | "medium" | "low";

export interface QualityIssue {
  level: DataQualityLevel;
  label: string;
  count?: number;
}

export interface DataQualityBadgeProps extends ComponentPropsWithoutRef<"div"> {
  issues: QualityIssue[];
  layout?: "column" | "row";
  theme?: KiteTheme;
}

export const DataQualityBadge = forwardRef<HTMLDivElement, DataQualityBadgeProps>(
  function DataQualityBadge({ issues, layout = "row", theme, style, ...rest }, ref) {
    const contextTheme = useFlyUITheme();
    const themeStyle = buildKiteThemeStyle(mergeKiteTheme(contextTheme, theme));

    return (
      <div
        ref={ref}
        className={`kite-flyui-host kite-flyui-dataQuality${layout === "column" ? "" : " kite-flyui-dataQuality--row"}`}
        style={{ ...themeStyle, ...style } as CSSProperties}
        aria-label="Data quality issues"
        {...rest}
      >
        {issues.map((issue, i) => (
          <span
            key={i}
            className={`kite-flyui-dataQuality__badge kite-flyui-dataQuality__badge--${issue.level}`}
            title={issue.count !== undefined ? `${issue.count} occurrences` : undefined}
          >
            <span aria-hidden="true">
              {issue.level === "critical" ? "✕" : issue.level === "high" ? "▲" : issue.level === "medium" ? "●" : "○"}
            </span>
            {issue.label}
            {issue.count !== undefined && <span style={{ opacity: 0.7 }}> ({issue.count})</span>}
          </span>
        ))}
      </div>
    );
  },
);
