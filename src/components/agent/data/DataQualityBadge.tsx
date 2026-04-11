import { forwardRef, type CSSProperties, type ComponentPropsWithoutRef, type ReactNode } from "react";
import { buildKiteThemeStyle, mergeKiteTheme, type KiteTheme } from "../../kite/theme";
import { useFlyUITheme } from "../../kite/theme";
import "../agent.css";

export type DataQualityLevel = "critical" | "high" | "medium" | "low";

export interface QualityIssue {
  id?: string;
  level: DataQualityLevel;
  label: string;
  count?: number;
  description?: string;
}

export interface DataQualityBadgeProps extends ComponentPropsWithoutRef<"div"> {
  issues: QualityIssue[];
  layout?: "column" | "row";
  /** Called when an issue badge is clicked. */
  onIssueClick?: (id: string, issue: QualityIssue) => void;
  /** Custom render for a single issue badge. */
  renderIssue?: (issue: QualityIssue) => ReactNode;
  /** Override the accessible label for the container. @default "Data quality issues" */
  ariaLabel?: string;
  /** Text shown when there are no issues. */
  emptyText?: string;
  /** Override issue level icons. */
  levelIcons?: Partial<Record<DataQualityLevel, ReactNode>>;
  theme?: KiteTheme;
}

const DEFAULT_LEVEL_ICON: Record<DataQualityLevel, string> = {
  critical: "",
  high:     "",
  medium:   "",
  low:      "",
};

export const DataQualityBadge = forwardRef<HTMLDivElement, DataQualityBadgeProps>(
  function DataQualityBadge(
    {
      issues,
      layout = "row",
      onIssueClick,
      renderIssue,
      ariaLabel = "Data quality issues",
      emptyText,
      levelIcons,
      theme,
      style,
      ...rest
    },
    ref,
  ) {
    const contextTheme = useFlyUITheme();
    const themeStyle = buildKiteThemeStyle(mergeKiteTheme(contextTheme, theme));

    const resolveIcon = (issue: QualityIssue): ReactNode =>
      levelIcons?.[issue.level] ?? DEFAULT_LEVEL_ICON[issue.level];

    return (
      <div
        ref={ref}
        className={`kite-flyui-host kite-flyui-dataQuality${layout === "column" ? "" : " kite-flyui-dataQuality--row"}`}
        style={{ ...themeStyle, ...style } as CSSProperties}
        aria-label={ariaLabel}
        {...rest}
      >
        {issues.length === 0 && emptyText ? (
          <span className="kite-flyui-dataSummary__meta">{emptyText}</span>
        ) : issues.map((issue, i) => {
          const key = issue.id ?? `${issue.level}-${i}`;
          if (renderIssue) {
            return <span key={key}>{renderIssue(issue)}</span>;
          }
          const clickProps = onIssueClick
            ? {
                role: "button" as const,
                tabIndex: 0,
                onClick: () => onIssueClick(issue.id ?? issue.label, issue),
                onKeyDown: (e: React.KeyboardEvent) => {
                  if (e.key === "Enter" || e.key === " ") { e.preventDefault(); onIssueClick(issue.id ?? issue.label, issue); }
                },
                style: { cursor: "pointer" } as React.CSSProperties,
              }
            : {};
          return (
            <span
              key={key}
              className={`kite-flyui-dataQuality__badge kite-flyui-dataQuality__badge--${issue.level}`}
              title={issue.description ?? (issue.count !== undefined ? `${issue.count} occurrences` : undefined)}
              {...clickProps}
            >
              {resolveIcon(issue) && <span aria-hidden="true">{resolveIcon(issue)}</span>}
              {issue.label}
              {issue.count !== undefined && <span className="kite-flyui-dataQuality__issueCount"> ({issue.count})</span>}
            </span>
          );
        })}
      </div>
    );
  },
);
