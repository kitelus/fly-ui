import type { CSSProperties } from "react";

import { cn } from "../../lib/cn";

import styles from "../kite/kite-animations.module.css";
import {
  buildKiteThemeStyle,
  mergeKiteTheme,
  type KiteTheme,
  useFlyUITheme,
} from "../kite/theme";

export interface LoadingProps {
  className?: string;
  label?: string;
  theme?: KiteTheme;
  style?: CSSProperties;
}

export function Loading({ className, label, theme, style }: LoadingProps) {
  const globalTheme = useFlyUITheme();
  const resolvedTheme = mergeKiteTheme(globalTheme, theme);
  const themeStyle = buildKiteThemeStyle(resolvedTheme);

  return (
    <div
      className={cn(styles["kite-fu-host"], className)}
      role="status"
      aria-label={label ?? "Loading"}
      style={{ ...themeStyle, ...style }}
    >
      <div className={styles["kite-fu-loadingDots"]}>
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
    </div>
  );
}
