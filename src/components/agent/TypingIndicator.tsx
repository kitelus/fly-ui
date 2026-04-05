import { forwardRef, type HTMLAttributes } from "react";

import { cls } from "./primitives/cls";
import "./styles/kite-fu-agent-ui.css";

export interface TypingIndicatorRootProps extends HTMLAttributes<HTMLDivElement> {
  count?: number;
  visible?: boolean;
}

const TypingIndicatorRoot = forwardRef<
  HTMLDivElement,
  TypingIndicatorRootProps
>(({ className, count = 3, visible = true, ...props }, ref) => {
  if (!visible) {
    return null;
  }

  const safeCount = Math.max(1, Math.min(6, Math.floor(count)));

  return (
    <div
      ref={ref}
      className={cls("kite-fu-agent-typing-indicator-root", className)}
      {...props}
    >
      {Array.from({ length: safeCount }).map((_, index) => (
        <span
          key={index}
          className="kite-fu-agent-typing-indicator-dot"
          data-index={index}
          aria-hidden="true"
        />
      ))}
    </div>
  );
});

TypingIndicatorRoot.displayName = "TypingIndicator.Root";

export type TypingIndicatorDotProps = HTMLAttributes<HTMLSpanElement>;

const TypingIndicatorDot = forwardRef<HTMLSpanElement, TypingIndicatorDotProps>(
  ({ className, ...props }, ref) => (
    <span
      ref={ref}
      className={cls("kite-fu-agent-typing-indicator-dot", className)}
      {...props}
    />
  ),
);

TypingIndicatorDot.displayName = "TypingIndicator.Dot";

export const TypingIndicator = Object.assign(TypingIndicatorRoot, {
  Root: TypingIndicatorRoot,
  Dot: TypingIndicatorDot,
});
