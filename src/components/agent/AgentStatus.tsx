import { forwardRef, type HTMLAttributes } from "react";

import { cls } from "./primitives/cls";
import "./styles/kite-fu-agent-ui.css";

export type AgentStatusValue =
  | "idle"
  | "thinking"
  | "running"
  | "paused"
  | "error"
  | "done";

const DEFAULT_LABELS: Record<AgentStatusValue, string> = {
  idle: "Ready",
  thinking: "Thinking...",
  running: "Running",
  paused: "Paused",
  error: "Error",
  done: "Done",
};

export interface AgentStatusRootProps extends HTMLAttributes<HTMLDivElement> {
  status?: AgentStatusValue;
  label?: string;
}

const AgentStatusRoot = forwardRef<HTMLDivElement, AgentStatusRootProps>(
  ({ className, status = "idle", label, ...props }, ref) => (
    <div
      ref={ref}
      className={cls("kite-fu-agent-agent-status-root", className)}
      data-status={status}
      {...props}
    >
      <span
        className="kite-fu-agent-agent-status-indicator"
        aria-hidden="true"
      />
      <span className="kite-fu-agent-agent-status-label">
        {label ?? DEFAULT_LABELS[status]}
      </span>
    </div>
  ),
);

AgentStatusRoot.displayName = "AgentStatus.Root";

export type AgentStatusIndicatorProps = HTMLAttributes<HTMLSpanElement>;

const AgentStatusIndicator = forwardRef<
  HTMLSpanElement,
  AgentStatusIndicatorProps
>(({ className, ...props }, ref) => (
  <span
    ref={ref}
    className={cls("kite-fu-agent-agent-status-indicator", className)}
    {...props}
  />
));

AgentStatusIndicator.displayName = "AgentStatus.Indicator";

export type AgentStatusLabelProps = HTMLAttributes<HTMLSpanElement>;

const AgentStatusLabel = forwardRef<HTMLSpanElement, AgentStatusLabelProps>(
  ({ className, ...props }, ref) => (
    <span
      ref={ref}
      className={cls("kite-fu-agent-agent-status-label", className)}
      {...props}
    />
  ),
);

AgentStatusLabel.displayName = "AgentStatus.Label";

export const AgentStatus = Object.assign(AgentStatusRoot, {
  Root: AgentStatusRoot,
  Indicator: AgentStatusIndicator,
  Label: AgentStatusLabel,
});
