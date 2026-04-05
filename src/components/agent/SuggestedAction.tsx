import {
  forwardRef,
  type ButtonHTMLAttributes,
  type HTMLAttributes,
} from "react";

import { cls } from "./primitives/cls";
import "./styles/kite-fu-agent-ui.css";

type Orientation = "horizontal" | "vertical";

export interface SuggestedActionRootProps extends HTMLAttributes<HTMLDivElement> {
  orientation?: Orientation;
}

const SuggestedActionRoot = forwardRef<
  HTMLDivElement,
  SuggestedActionRootProps
>(({ className, orientation = "horizontal", ...props }, ref) => (
  <div
    ref={ref}
    className={cls("kite-fu-agent-suggested-action-root", className)}
    data-orientation={orientation}
    {...props}
  />
));

SuggestedActionRoot.displayName = "SuggestedAction.Root";

export interface SuggestedActionItemProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  value: string;
  label?: string;
  icon?: string;
  onAction?: (value: string) => void;
}

const SuggestedActionItem = forwardRef<
  HTMLButtonElement,
  SuggestedActionItemProps
>(({ className, value, label, icon, onAction, onClick, ...props }, ref) => (
  <button
    ref={ref}
    type="button"
    className={cls("kite-fu-agent-suggested-action-item", className)}
    onClick={(event) => {
      onClick?.(event);
      if (!event.defaultPrevented) {
        onAction?.(value);
      }
    }}
    {...props}
  >
    {icon ? (
      <span className="kite-fu-agent-suggested-action-icon">{icon}</span>
    ) : null}
    <span className="kite-fu-agent-suggested-action-label">
      {label ?? value}
    </span>
  </button>
));

SuggestedActionItem.displayName = "SuggestedAction.Item";

export const SuggestedAction = Object.assign(SuggestedActionRoot, {
  Root: SuggestedActionRoot,
  Item: SuggestedActionItem,
});
