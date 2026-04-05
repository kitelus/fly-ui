import {
  createContext,
  forwardRef,
  useContext,
  type HTMLAttributes,
} from "react";

import { cls } from "./primitives/cls";
import "./styles/kite-fu-agent-ui.css";

const TokenUsageContext = createContext<{ used: number; max: number } | null>(
  null,
);

function clamp(value: number, min: number, max: number) {
  return Math.min(max, Math.max(min, value));
}

export interface TokenUsageRootProps extends HTMLAttributes<HTMLDivElement> {
  used: number;
  max: number;
  warnAt?: number;
}

const TokenUsageRoot = forwardRef<HTMLDivElement, TokenUsageRootProps>(
  ({ className, used, max, warnAt = 0.8, ...props }, ref) => {
    const safeMax = Math.max(1, max);
    const ratio = clamp(used / safeMax, 0, 1);
    const state =
      ratio >= 1 ? "danger" : ratio >= warnAt ? "warning" : "normal";

    return (
      <TokenUsageContext.Provider value={{ used, max: safeMax }}>
        <div
          ref={ref}
          className={cls("kite-fu-agent-token-usage-root", className)}
          data-state={state}
          {...props}
        />
      </TokenUsageContext.Provider>
    );
  },
);

TokenUsageRoot.displayName = "TokenUsage.Root";

export type TokenUsageBarProps = HTMLAttributes<HTMLDivElement>;

const TokenUsageBar = forwardRef<HTMLDivElement, TokenUsageBarProps>(
  ({ className, ...props }, ref) => {
    const data = useContext(TokenUsageContext);
    const ratio = data ? clamp(data.used / data.max, 0, 1) : 0;

    return (
      <div
        ref={ref}
        className={cls("kite-fu-agent-token-usage-bar", className)}
        {...props}
      >
        <div
          className="kite-fu-agent-token-usage-fill"
          style={{ width: `${ratio * 100}%` }}
        />
      </div>
    );
  },
);

TokenUsageBar.displayName = "TokenUsage.Bar";

export interface TokenUsageCountProps extends HTMLAttributes<HTMLSpanElement> {
  format?: (used: number, max: number) => string;
}

const TokenUsageCount = forwardRef<HTMLSpanElement, TokenUsageCountProps>(
  ({ className, format, ...props }, ref) => {
    const data = useContext(TokenUsageContext);
    const used = data?.used ?? 0;
    const max = data?.max ?? 0;
    const text = format ? format(used, max) : `${used} / ${max}`;

    return (
      <span
        ref={ref}
        className={cls("kite-fu-agent-token-usage-count", className)}
        {...props}
      >
        {text}
      </span>
    );
  },
);

TokenUsageCount.displayName = "TokenUsage.Count";

export type TokenUsageLabelProps = HTMLAttributes<HTMLSpanElement>;

const TokenUsageLabel = forwardRef<HTMLSpanElement, TokenUsageLabelProps>(
  ({ className, ...props }, ref) => (
    <span
      ref={ref}
      className={cls("kite-fu-agent-token-usage-label", className)}
      {...props}
    />
  ),
);

TokenUsageLabel.displayName = "TokenUsage.Label";

export const TokenUsage = Object.assign(TokenUsageRoot, {
  Root: TokenUsageRoot,
  Bar: TokenUsageBar,
  Count: TokenUsageCount,
  Label: TokenUsageLabel,
});
