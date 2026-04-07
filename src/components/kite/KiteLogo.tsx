import { forwardRef, type CSSProperties, type ComponentPropsWithoutRef } from "react";

import { cn } from "../../lib/cn";

import "./kite-animations.css";
import {
  buildKiteThemeStyle,
  mergeKiteTheme,
  type KiteTheme,
  useFlyUITheme,
} from "./theme";

export type KiteLogoSize = "xs" | "sm" | "md" | "lg" | "xl";

const SIZE: Record<KiteLogoSize, { icon: number; text: number; gap: number; strongWeight: number }> = {
  xs: { icon: 16, text: 12, gap: 4, strongWeight: 600 },
  sm: { icon: 20, text: 14, gap: 6, strongWeight: 600 },
  md: { icon: 24, text: 16, gap: 7, strongWeight: 600 },
  lg: { icon: 28, text: 18, gap: 8, strongWeight: 700 },
  xl: { icon: 40, text: 24, gap: 9, strongWeight: 700 },
};

export interface KiteLogoProps
  extends Omit<ComponentPropsWithoutRef<"div">, "children"> {
  size?: KiteLogoSize;
  showText?: boolean;
  name?: string;
  subBrand?: string;
  iconTextGap?: number;
  theme?: KiteTheme;
  textClassName?: string;
}

function KiteIcon({ size }: { size: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
      focusable="false"
    >
      <path d="M12 0 L0 9 L12 24 Z" fill="var(--kite-primary, #0ea5e9)" />
      <path
        d="M12 0 L24 9 L12 24 Z"
        fill="var(--kite-primary, #0ea5e9)"
        opacity="0.48"
      />
    </svg>
  );
}

export const KiteLogo = forwardRef<HTMLDivElement, KiteLogoProps>(
  function KiteLogo(
    {
      size = "md",
      showText = true,
      name = "Fly",
      subBrand = "UI",
      iconTextGap,
      theme,
      className,
      textClassName,
      style,
      ...rest
    },
    ref,
  ) {
    const cfg = SIZE[size];
    const globalTheme = useFlyUITheme();
    const resolvedTheme = mergeKiteTheme(globalTheme, theme);
    const themeStyle = buildKiteThemeStyle(resolvedTheme);

    return (
      <div
        ref={ref}
        className={cn("kite-flyui-host", "kite-flyui-logoWrap", className)}
        style={
          {
            ...themeStyle,
            ...style,
            gap: iconTextGap ?? cfg.gap,
          } as CSSProperties
        }
        {...rest}
      >
        <KiteIcon size={cfg.icon} />
        {showText ? (
          <span
            className={cn("kite-flyui-logoText", textClassName)}
            style={{
              fontSize: `${cfg.text}px`,
              lineHeight: 1,
            }}
          >
            <span
              className="kite-flyui-logoTextStrong"
              style={{ fontWeight: cfg.strongWeight }}
            >
              {name}
            </span>
            <span className="kite-flyui-logoTextLight">{subBrand}</span>
          </span>
        ) : null}
      </div>
    );
  },
);
