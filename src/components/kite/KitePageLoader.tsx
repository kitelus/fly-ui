import { cn } from "../../lib/cn";

import styles from "./kite-animations.module.css";

export interface KitePageLoaderProps {
  message?: string;
  overlay?: boolean;
  name?: string;
  subBrand?: string;
  className?: string;
}

export function KitePageLoader({
  message,
  overlay = false,
  name = "Fly",
  subBrand = "UI",
  className,
}: KitePageLoaderProps) {
  return (
    <div
      role="status"
      aria-live="polite"
      aria-label={message ?? "Loading"}
      className={cn(
        styles["kite-fu-host"],
        styles["kite-fu-pageWrap"],
        overlay
          ? styles["kite-fu-pageWrapOverlay"]
          : styles["kite-fu-pageWrapFullscreen"],
        className,
      )}
    >
      <svg
        width={56}
        height={58}
        viewBox="0 0 24 31"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden="true"
        overflow="visible"
      >
        <g className={styles["kite-fu-skyLayer"]} aria-hidden="true">
          <g className={styles["kite-fu-cloudSizeSm"]}>
            <g className={styles["kite-fu-cloudDriftHigh"]}>
              <path
                d="M14.8 3.3c0-0.8 0.6-1.5 1.5-1.5 0.2-1 1.1-1.8 2.2-1.8 0.8 0 1.4 0.4 1.9 1 0.2-0.1 0.5-0.1 0.8-0.1 1 0 1.8 0.8 1.8 1.8s-0.8 1.8-1.8 1.8h-4.7c-0.9 0-1.7-0.6-1.7-1.2z"
                fill="var(--kite-muted, #64748b)"
                opacity="0.28"
              />
            </g>
          </g>
          <g className={styles["kite-fu-cloudSizeLg"]}>
            <g className={styles["kite-fu-cloudDriftFar"]}>
              <path
                d="M1.5 5.5c0-1.1 0.9-2 2-2 0.2-1.4 1.4-2.4 2.9-2.4 1.1 0 2 0.5 2.6 1.4 0.3-0.1 0.6-0.2 1-0.2 1.4 0 2.6 1.1 2.6 2.6s-1.2 2.6-2.6 2.6h-6.3c-1.3 0-2.3-0.9-2.3-2z"
                fill="var(--kite-muted, #64748b)"
                opacity="0.32"
              />
            </g>
          </g>
        </g>
        <g
          className={cn(styles["kite-fu-float"], styles["kite-fu-kiteBreath"])}
        >
          <g transform="rotate(90 12 12)">
            <path d="M12 0 L0 9 L12 24 Z" fill="var(--kite-primary, #0ea5e9)" />
            <path
              d="M12 0 L24 9 L12 24 Z"
              fill="var(--kite-primary, #0ea5e9)"
              className={styles["kite-fu-shadowBreathe"]}
            />
            <path
              d="M12 24 Q13 28.5 12 31"
              stroke="var(--kite-muted, #64748b)"
              strokeWidth="1.5"
              strokeLinecap="round"
              fill="none"
              className={styles["kite-fu-stringSway"]}
            />
          </g>
        </g>
      </svg>

      <span
        className={cn(
          styles["kite-fu-logoText"],
          styles["kite-fu-loadingTextPulse"],
        )}
        style={{
          marginTop: -2,
          fontSize: 20,
          fontFamily: '"Inter Variable", sans-serif',
          letterSpacing: "-0.03em",
          lineHeight: 1,
        }}
      >
        <span className={styles["kite-fu-logoTextStrong"]}>{name}</span>
        <span className={styles["kite-fu-logoTextLight"]}>{subBrand}</span>
      </span>

      <div
        className={cn(
          styles["kite-fu-loadingDots"],
          styles["kite-fu-loadingDotsBelowBrand"],
        )}
        aria-hidden="true"
      >
        <span className={styles["kite-fu-loadingDot"]} />
        <span
          className={cn(
            styles["kite-fu-loadingDot"],
            styles["kite-fu-loadingDot1"],
          )}
        />
        <span
          className={cn(
            styles["kite-fu-loadingDot"],
            styles["kite-fu-loadingDot2"],
          )}
        />
      </div>

      {message ? <p className={styles["kite-fu-label"]}>{message}</p> : null}
    </div>
  );
}
