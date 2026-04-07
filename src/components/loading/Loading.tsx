import { forwardRef, type CSSProperties, type ComponentPropsWithoutRef } from "react";

import { cn } from "../../lib/cn";

import "../kite/kite-animations.css";
import {
  buildKiteThemeStyle,
  mergeKiteTheme,
  type KiteTheme,
  useFlyUITheme,
} from "../kite/theme";

export interface LoadingProps
  extends Omit<ComponentPropsWithoutRef<"div">, "children"> {
  label?: string;
  theme?: KiteTheme;
}

export const Loading = forwardRef<HTMLDivElement, LoadingProps>(
  function Loading({ className, label, theme, style, ...rest }, ref) {
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
        aria-busy="true"
        style={{ ...themeStyle, ...style } as CSSProperties}
        {...rest}
      >
        <div className="kite-flyui-loadingDots" aria-hidden="true">
          <span className="kite-flyui-loadingDot" />
          <span className={cn("kite-flyui-loadingDot", "kite-flyui-loadingDot1")} />
          <span className={cn("kite-flyui-loadingDot", "kite-flyui-loadingDot2")} />
        </div>
      </div>
    );
  },
);
