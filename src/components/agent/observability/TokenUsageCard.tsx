import { forwardRef, type CSSProperties, type ComponentPropsWithoutRef, type ReactNode } from "react";
import { buildKiteThemeStyle, mergeKiteTheme, type KiteTheme } from "../../kite/theme";
import { useFlyUITheme } from "../../kite/theme";
import "../agent.css";

export interface TokenUsageCardProps extends ComponentPropsWithoutRef<"div"> {
  modelName?: string;
  inputTokens: number;
  outputTokens: number;
  totalTokens?: number;
  costUsd?: number;
  maxTokens?: number;
  /** Override the card title. @default "Token Usage" */
  title?: string;
  /** Warning threshold percentage (0-100). @default 80 */
  warnThreshold?: number;
  /** Danger threshold percentage (0-100). @default 90 */
  dangerThreshold?: number;
  /** Whether to show the cost stat. @default true (when costUsd is provided) */
  showCost?: boolean;
  /** Override the currency symbol. @default "$" */
  currencySymbol?: string;
  /** Custom warning message. Receives the percentage. */
  renderWarning?: (pct: number) => ReactNode;
  /** Override stat labels. */
  statLabels?: { input?: string; output?: string; total?: string; cost?: string; max?: string };
  /** Extra stats to display alongside the built-in ones. */
  extraStats?: Array<{ label: string; value: ReactNode; id?: string }>;
  /** Called when a stat is clicked. Receives the stat key. */
  onStatClick?: (stat: "input" | "output" | "total" | "cost" | string) => void;
  /** Slot rendered below the progress bar. */
  footerSlot?: ReactNode;
  /** Slot rendered in the card header alongside title/model name. */
  headerSlot?: ReactNode;
  children?: ReactNode;
  theme?: KiteTheme;
}

export const TokenUsageCard = forwardRef<HTMLDivElement, TokenUsageCardProps>(
  function TokenUsageCard(
    {
      modelName,
      inputTokens,
      outputTokens,
      totalTokens,
      costUsd,
      maxTokens,
      title = "Token Usage",
      warnThreshold = 80,
      dangerThreshold = 90,
      showCost = true,
      currencySymbol = "$",
      renderWarning,
      statLabels,
      extraStats,
      onStatClick,
      footerSlot,
      headerSlot,
      children,
      theme,
      style,
      ...rest
    },
    ref,
  ) {
    const contextTheme = useFlyUITheme();
    const themeStyle = buildKiteThemeStyle(mergeKiteTheme(contextTheme, theme));
    const total = totalTokens ?? inputTokens + outputTokens;
    const pct = maxTokens ? (total / maxTokens) * 100 : undefined;

    const labels = { input: "Input", output: "Output", total: "Total", cost: "Cost", max: "Max", ...statLabels };

    const statClickProps = (key: string) =>
      onStatClick
        ? {
            role: "button" as const,
            tabIndex: 0,
            onClick: () => onStatClick(key),
            onKeyDown: (e: React.KeyboardEvent) => {
              if (e.key === "Enter" || e.key === " ") { e.preventDefault(); onStatClick(key); }
            },
            className: "kite-flyui-tokenUsage__stat kite-flyui-tokenUsage__stat--clickable",
          }
        : { className: "kite-flyui-tokenUsage__stat" };

    return (
      <div
        ref={ref}
        className="kite-flyui-host kite-flyui-agentCard kite-flyui-tokenUsage"
        style={{ ...themeStyle, ...style } as CSSProperties}
        {...rest}
      >
        <div className="kite-flyui-tokenUsage__row">
          <p className="kite-flyui-tokenUsage__title">{title}</p>
          <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
            {modelName && <span className="kite-flyui-tokenUsage__model">{modelName}</span>}
            {headerSlot}
          </div>
        </div>
        <div className="kite-flyui-tokenUsage__stats">
          <div {...statClickProps("input")}>
            <span className="kite-flyui-tokenUsage__statVal kite-flyui-tokenUsage__statVal--input">
              {inputTokens.toLocaleString()}
            </span>
            <span className="kite-flyui-tokenUsage__statLabel">{labels.input}</span>
          </div>
          <div {...statClickProps("output")}>
            <span className="kite-flyui-tokenUsage__statVal kite-flyui-tokenUsage__statVal--output">
              {outputTokens.toLocaleString()}
            </span>
            <span className="kite-flyui-tokenUsage__statLabel">{labels.output}</span>
          </div>
          <div {...statClickProps("total")}>
            <span className="kite-flyui-tokenUsage__statVal">{total.toLocaleString()}</span>
            <span className="kite-flyui-tokenUsage__statLabel">{labels.total}</span>
          </div>
          {maxTokens !== undefined && (
            <div {...statClickProps("max")}>
              <span className="kite-flyui-tokenUsage__statVal">{maxTokens.toLocaleString()}</span>
              <span className="kite-flyui-tokenUsage__statLabel">{labels.max}</span>
            </div>
          )}
          {showCost && costUsd !== undefined && (
            <div {...statClickProps("cost")}>
              <span className="kite-flyui-tokenUsage__statVal kite-flyui-tokenUsage__statVal--cost">
                {currencySymbol}{costUsd.toFixed(4)}
              </span>
              <span className="kite-flyui-tokenUsage__statLabel">{labels.cost}</span>
            </div>
          )}
          {extraStats?.map((s) => (
            <div key={s.id ?? s.label} {...statClickProps(s.id ?? s.label)}>
              <span className="kite-flyui-tokenUsage__statVal">{s.value}</span>
              <span className="kite-flyui-tokenUsage__statLabel">{s.label}</span>
            </div>
          ))}
        </div>
        {maxTokens != null && (
          <>
            <div
              className="kite-flyui-progressBar"
              role="progressbar"
              aria-valuenow={total}
              aria-valuemin={0}
              aria-valuemax={maxTokens}
              aria-label="Token usage"
            >
              <div
                className={`kite-flyui-progressBar__fill${pct && pct > dangerThreshold ? " kite-flyui-progressBar__fill--danger" : pct && pct > warnThreshold ? " kite-flyui-progressBar__fill--warning" : ""}`}
                style={{ width: `${Math.min(pct ?? 0, 100)}%` }}
              />
            </div>
            {pct != null && pct > warnThreshold && (
              renderWarning
                ? renderWarning(Math.round(pct))
                : (
                  <p className="kite-flyui-tokenUsage__limitWarn">
                    Approaching context limit ({Math.round(pct)}% used)
                  </p>
                )
            )}
          </>
        )}
        {children}
        {footerSlot}
      </div>
    );
  },
);
