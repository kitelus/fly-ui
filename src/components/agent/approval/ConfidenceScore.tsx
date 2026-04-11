import { forwardRef, type CSSProperties, type ComponentPropsWithoutRef, type ReactNode } from "react";
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
  /**
   * Override the verification button label.
   * @default "Request Human Verification"
   */
  verifyLabel?: ReactNode;
  /**
   * Show the verify button for all levels, not just non-high.
   * @default false
   */
  alwaysShowVerify?: boolean;
  /**
   * Override level thresholds. high >= highMin, medium >= mediumMin, else low.
   * @default { highMin: 80, mediumMin: threshold * 0.7 }
   */
  levelThresholds?: { highMin?: number; mediumMin?: number };
  /** Slot rendered below the reason. */
  children?: ReactNode;
  theme?: KiteTheme;
}

function getLevel(
  score: number,
  threshold = 70,
  levelThresholds?: { highMin?: number; mediumMin?: number },
): ConfidenceLevel {
  const highMin   = levelThresholds?.highMin   ?? Math.max(threshold, 80);
  const mediumMin = levelThresholds?.mediumMin ?? threshold * 0.7;
  if (score >= highMin)   return "high";
  if (score >= mediumMin) return "medium";
  return "low";
}

export const ConfidenceScore = forwardRef<HTMLDivElement, ConfidenceScoreProps>(
  function ConfidenceScore(
    {
      score,
      label = "Confidence",
      reason,
      threshold = 70,
      onRequestVerification,
      verifyLabel = "Request Human Verification",
      alwaysShowVerify = false,
      levelThresholds,
      children,
      theme,
      style,
      ...rest
    },
    ref,
  ) {
    const contextTheme = useFlyUITheme();
    const themeStyle = buildKiteThemeStyle(mergeKiteTheme(contextTheme, theme));
    const level = getLevel(score, threshold, levelThresholds);
    const clampedScore = Math.max(0, Math.min(100, score));

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
          aria-valuenow={clampedScore}
          aria-valuemin={0}
          aria-valuemax={100}
          aria-label={label}
        >
          <div
            className={`kite-flyui-progressBar__fill${
              level === "low"    ? " kite-flyui-progressBar__fill--danger"
              : level === "medium" ? " kite-flyui-progressBar__fill--warning"
              : " kite-flyui-progressBar__fill--success"
            }`}
            style={{ width: `${clampedScore}%` }}
          />
        </div>
        {reason && <p className="kite-flyui-confidence__reason">{reason}</p>}
        {children}
        {onRequestVerification && (alwaysShowVerify || level !== "high") && (
          <button
            className="kite-flyui-confidence__verifyBtn"
            onClick={onRequestVerification}
            type="button"
          >
            {verifyLabel}
          </button>
        )}
      </div>
    );
  },
);
