import { forwardRef, type CSSProperties, type ComponentPropsWithoutRef } from "react";
import { buildKiteThemeStyle, mergeKiteTheme, type KiteTheme } from "../../kite/theme";
import { useFlyUITheme } from "../../kite/theme";
import "../agent.css";

export type ConfidenceLevel = "high" | "medium" | "low";

export interface ConfidenceScoreProps extends ComponentPropsWithoutRef<"div"> {
  score: number;
  label?: string;
  reason?: string;
  threshold?: number;
  onRequestVerification?: () => void;
  theme?: KiteTheme;
}

function getLevel(score: number, threshold = 70): ConfidenceLevel {
  if (score >= Math.max(threshold, 80)) return "high";
  if (score >= threshold * 0.7) return "medium";
  return "low";
}

export const ConfidenceScore = forwardRef<HTMLDivElement, ConfidenceScoreProps>(
  function ConfidenceScore(
    { score, label = "Confidence", reason, threshold = 70, onRequestVerification, theme, style, ...rest },
    ref,
  ) {
    const contextTheme = useFlyUITheme();
    const themeStyle = buildKiteThemeStyle(mergeKiteTheme(contextTheme, theme));
    const level = getLevel(score, threshold);

    return (
      <div
        ref={ref}
        className="kite-flyui-host kite-flyui-agentCard kite-flyui-confidence"
        style={{ ...themeStyle, ...style } as CSSProperties}
        {...rest}
      >
        <div className="kite-flyui-confidence__row">
          <span className="kite-flyui-confidence__label">{label}</span>
          <span
            className={`kite-flyui-confidence__value kite-flyui-confidence__value--${level}`}
            aria-label={`${label}: ${score}%`}
          >
            {score}%
          </span>
        </div>
        <div
          className="kite-flyui-progressBar"
          role="progressbar"
          aria-valuenow={score}
          aria-valuemin={0}
          aria-valuemax={100}
          aria-label={label}
        >
          <div
            className={`kite-flyui-progressBar__fill${level === "low" ? " kite-flyui-progressBar__fill--danger" : level === "medium" ? " kite-flyui-progressBar__fill--warning" : " kite-flyui-progressBar__fill--success"}`}
            style={{ width: `${score}%` }}
          />
        </div>
        {reason && <p className="kite-flyui-confidence__reason">{reason}</p>}
        {onRequestVerification && level !== "high" && (
          <button
            className="kite-flyui-confidence__verifyBtn"
            onClick={onRequestVerification}
            type="button"
          >
            Request Human Verification
          </button>
        )}
      </div>
    );
  },
);
