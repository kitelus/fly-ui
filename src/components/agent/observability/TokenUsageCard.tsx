import { forwardRef, type CSSProperties, type ComponentPropsWithoutRef } from "react";
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

    return (
      <div
        ref={ref}
        className="kite-flyui-host kite-flyui-agentCard kite-flyui-tokenUsage"
        style={{ ...themeStyle, ...style } as CSSProperties}
        {...rest}
      >
        <div className="kite-flyui-tokenUsage__row">
          <p className="kite-flyui-tokenUsage__title">Token Usage</p>
          {modelName && <span className="kite-flyui-tokenUsage__model">{modelName}</span>}
        </div>
        <div className="kite-flyui-tokenUsage__stats">
          <div className="kite-flyui-tokenUsage__stat">
            <span className="kite-flyui-tokenUsage__statVal kite-flyui-tokenUsage__statVal--input">
              {inputTokens.toLocaleString()}
            </span>
            <span className="kite-flyui-tokenUsage__statLabel">Input</span>
          </div>
          <div className="kite-flyui-tokenUsage__stat">
            <span className="kite-flyui-tokenUsage__statVal kite-flyui-tokenUsage__statVal--output">
              {outputTokens.toLocaleString()}
            </span>
            <span className="kite-flyui-tokenUsage__statLabel">Output</span>
          </div>
          <div className="kite-flyui-tokenUsage__stat">
            <span className="kite-flyui-tokenUsage__statVal">{total.toLocaleString()}</span>
            <span className="kite-flyui-tokenUsage__statLabel">Total</span>
          </div>
          {costUsd !== undefined && (
            <div className="kite-flyui-tokenUsage__stat">
              <span className="kite-flyui-tokenUsage__statVal kite-flyui-tokenUsage__statVal--cost">
                ${costUsd.toFixed(4)}
              </span>
              <span className="kite-flyui-tokenUsage__statLabel">Cost</span>
            </div>
          )}
        </div>
        {maxTokens && (
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
                className={`kite-flyui-progressBar__fill${pct && pct > 90 ? " kite-flyui-progressBar__fill--danger" : pct && pct > 70 ? " kite-flyui-progressBar__fill--warning" : ""}`}
                style={{ width: `${Math.min(pct ?? 0, 100)}%` }}
              />
            </div>
            {pct && pct > 80 && (
              <p className="kite-flyui-tokenUsage__limitWarn">
                ⚠ Approaching context limit ({Math.round(pct)}% used)
              </p>
            )}
          </>
        )}
      </div>
    );
  },
);
