import { forwardRef, type CSSProperties, type ComponentPropsWithoutRef } from "react";

import { cn } from "../../lib/cn";

import "./kite-animations.css";
import {
  buildKiteThemeStyle,
  mergeKiteTheme,
  type KiteTheme,
  useFlyUITheme,
} from "./theme";

export interface KitePageLoaderProps
  extends Omit<ComponentPropsWithoutRef<"div">, "children"> {
  message?: string;
  overlay?: boolean;
  name?: string;
  subBrand?: string;
  theme?: KiteTheme;
}

export const KitePageLoader = forwardRef<HTMLDivElement, KitePageLoaderProps>(
  function KitePageLoader(
    {
      message,
      overlay = false,
      name = "Fly",
      subBrand = "UI",
      theme,
      className,
      style,
      ...rest
    },
    ref,
  ) {
    const globalTheme = useFlyUITheme();
    const resolvedTheme = mergeKiteTheme(globalTheme, theme);
    const themeStyle = buildKiteThemeStyle(resolvedTheme);

    return (
      <div
        ref={ref}
        role="status"
        aria-live="polite"
        aria-busy={true}
        aria-label={message ?? "Loading"}
        className={cn(
          "kite-flyui-host",
          "kite-flyui-pageWrap",
          overlay ? "kite-flyui-pageWrapOverlay" : "kite-flyui-pageWrapFullscreen",
          className,
        )}
        style={{ ...themeStyle, ...style } as CSSProperties}
        {...rest}
      >
        <svg
          width={56}
          height={58}
          viewBox="0 0 24 31"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          aria-hidden="true"
          focusable="false"
          overflow="visible"
        >
          <g className="kite-flyui-skyLayer">
            <g className="kite-flyui-cloudSizeSm">
              <g className="kite-flyui-cloudDriftHigh">
                <path
                  d="M14.8 3.3c0-0.8 0.6-1.5 1.5-1.5 0.2-1 1.1-1.8 2.2-1.8 0.8 0 1.4 0.4 1.9 1 0.2-0.1 0.5-0.1 0.8-0.1 1 0 1.8 0.8 1.8 1.8s-0.8 1.8-1.8 1.8h-4.7c-0.9 0-1.7-0.6-1.7-1.2z"
                  fill="var(--kite-muted, #64748b)"
                  opacity="0.28"
                />
              </g>
            </g>
            <g className="kite-flyui-cloudSizeLg">
              <g className="kite-flyui-cloudDriftFar">
                <path
                  d="M1.5 5.5c0-1.1 0.9-2 2-2 0.2-1.4 1.4-2.4 2.9-2.4 1.1 0 2 0.5 2.6 1.4 0.3-0.1 0.6-0.2 1-0.2 1.4 0 2.6 1.1 2.6 2.6s-1.2 2.6-2.6 2.6h-6.3c-1.3 0-2.3-0.9-2.3-2z"
                  fill="var(--kite-muted, #64748b)"
                  opacity="0.32"
                />
              </g>
            </g>
          </g>
          <g className="kite-flyui-float">
            <g transform="rotate(90 12 12)">
              <path d="M12 0 L0 9 L12 24 Z" fill="var(--kite-primary, #0ea5e9)" />
              <path
                d="M12 0 L24 9 L12 24 Z"
                fill="var(--kite-primary, #0ea5e9)"
                className="kite-flyui-shadowBreathe"
              />
              <path
                d="M12 24 Q13 28.5 12 31"
                stroke="var(--kite-muted, #64748b)"
                strokeWidth="1.5"
                strokeLinecap="round"
                fill="none"
                className="kite-flyui-stringSway"
              />
            </g>
          </g>
        </svg>

        <span
          className={cn("kite-flyui-logoText", "kite-flyui-loadingTextPulse")}
          style={{
            marginTop: -2,
            fontSize: 20,
            lineHeight: 1,
          }}
        >
          <span className="kite-flyui-logoTextStrong">{name}</span>
          <span className="kite-flyui-logoTextLight">{subBrand}</span>
        </span>

        <div
          className={cn("kite-flyui-loadingDots", "kite-flyui-loadingDotsBelowBrand")}
          aria-hidden="true"
        >
          <span className="kite-flyui-loadingDot" />
          <span className={cn("kite-flyui-loadingDot", "kite-flyui-loadingDot1")} />
          <span className={cn("kite-flyui-loadingDot", "kite-flyui-loadingDot2")} />
        </div>

        {message ? <p className="kite-flyui-label">{message}</p> : null}
      </div>
    );
  },
);
