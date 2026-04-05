import type { CSSProperties } from "react";

import { cn } from "../../lib/cn";

import styles from "./kite-animations.module.css";
import {
  buildKiteThemeStyle,
  mergeKiteTheme,
  type KiteTheme,
  useFlyUITheme,
} from "./theme";

const SIZE = {
  xs: { icon: 16, text: 12, gap: 6, strongWeight: 600 },
  sm: { icon: 20, text: 14, gap: 8, strongWeight: 600 },
  md: { icon: 24, text: 16, gap: 10, strongWeight: 600 },
  lg: { icon: 28, text: 18, gap: 10, strongWeight: 700 },
  xl: { icon: 40, text: 24, gap: 12, strongWeight: 700 },
} as const;

type SizeKey = keyof typeof SIZE;

export interface KiteLogoProps {
  size?: SizeKey;
  showText?: boolean;
  name?: string;
  subBrand?: string;
  theme?: KiteTheme;
  className?: string;
  textClassName?: string;
  style?: CSSProperties;
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

export function KiteLogo({
  size = "md",
  showText = true,
  name = "Fly",
  subBrand = "UI",
  theme,
  className,
  textClassName,
  style,
}: KiteLogoProps) {
  const cfg = SIZE[size];
  const globalTheme = useFlyUITheme();
  const resolvedTheme = mergeKiteTheme(globalTheme, theme);
  const themeStyle = buildKiteThemeStyle(resolvedTheme);

  return (
    <div
      className={cn(
        styles["kite-fu-host"],
        styles["kite-fu-logoWrap"],
        className,
      )}
      style={{ ...themeStyle, ...style, gap: cfg.gap }}
    >
      <KiteIcon size={cfg.icon} />
      {showText ? (
        <span
          className={cn(styles["kite-fu-logoText"], textClassName)}
          style={{
            fontSize: `${cfg.text}px`,
            fontFamily: '"Inter Variable", sans-serif',
            letterSpacing: "-0.03em",
            lineHeight: 1,
          }}
        >
          <span
            className={styles["kite-fu-logoTextStrong"]}
            style={{ fontWeight: cfg.strongWeight }}
          >
            {name}
          </span>
          <span className={styles["kite-fu-logoTextLight"]}>{subBrand}</span>
        </span>
      ) : null}
    </div>
  );
}
