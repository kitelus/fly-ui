import { forwardRef, type CSSProperties, type ComponentPropsWithoutRef } from "react";

import { cn } from "../../lib/cn";

import "./kite-animations.css";
import {
  buildKiteThemeStyle,
  mergeKiteTheme,
  type KiteTheme,
  useFlyUITheme,
} from "./theme";

export type KiteLoaderSize = "sm" | "md" | "lg";

const LOADER_SIZES: Record<KiteLoaderSize, number> = {
  sm: 32,
  md: 48,
  lg: 64,
};

export interface KiteLoaderProps
  extends Omit<ComponentPropsWithoutRef<"div">, "children"> {
  size?: KiteLoaderSize;
  label?: string;
  showBrand?: boolean;
  name?: string;
  subBrand?: string;
  theme?: KiteTheme;
}

export const KiteLoader = forwardRef<HTMLDivElement, KiteLoaderProps>(
  function KiteLoader(
    {
      size = "md",
      label,
      showBrand = false,
      name = "Fly",
      subBrand = "UI",
      theme,
      className,
      style,
      ...rest
    },
    ref,
  ) {
    const px = LOADER_SIZES[size];
    const svgH = Math.round(px * 1.2);
    const globalTheme = useFlyUITheme();
    const resolvedTheme = mergeKiteTheme(globalTheme, theme);
    const themeStyle = buildKiteThemeStyle(resolvedTheme);

    return (
      <div
        ref={ref}
        className={cn("kite-flyui-host", className)}
        role="status"
        aria-label={label ?? "Loading"}
        aria-live="polite"
        aria-busy={true}
        style={{ ...themeStyle, ...style } as CSSProperties}
        {...rest}
      >
        <div className="kite-flyui-loaderInner">
          <svg
            width={px}
            height={svgH}
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
                    d="M15.4 3.8c0-0.8 0.6-1.5 1.5-1.5 0.2-1 1.1-1.8 2.1-1.8 0.7 0 1.4 0.4 1.9 1 0.2-0.1 0.5-0.1 0.7-0.1 1 0 1.9 0.9 1.9 1.9s-0.9 1.9-1.9 1.9h-4.5c-0.9 0-1.7-0.7-1.7-1.6z"
                    fill="var(--kite-muted, #64748b)"
                    opacity="0.28"
                  />
                </g>
              </g>
              <g className="kite-flyui-cloudSizeLg">
                <g className="kite-flyui-cloudDriftFar">
                  <path
                    d="M2.4 5.7c0-1 0.8-1.8 1.8-1.8 0.2-1.2 1.3-2.1 2.5-2.1 1 0 1.8 0.5 2.3 1.3 0.3-0.1 0.5-0.1 0.8-0.1 1.3 0 2.3 1 2.3 2.3s-1 2.3-2.3 2.3H4.4c-1.1 0-2-0.9-2-2z"
                    fill="var(--kite-muted, #64748b)"
                    opacity="0.32"
                  />
                </g>
              </g>
            </g>
            <g className="kite-flyui-float">
              <g transform="rotate(90 12 12)">
                <path
                  d="M12 0 L0 9 L12 24 Z"
                  fill="var(--kite-primary, #0ea5e9)"
                />
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
          {showBrand ? (
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
          ) : null}
          {label ? <p className="kite-flyui-label">{label}</p> : null}
        </div>
      </div>
    );
  },
);
