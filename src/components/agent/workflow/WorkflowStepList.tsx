import { forwardRef, type CSSProperties, type ComponentPropsWithoutRef } from "react";
import { buildKiteThemeStyle, mergeKiteTheme, type KiteTheme } from "../../kite/theme";
import { useFlyUITheme } from "../../kite/theme";
import "../agent.css";

export type WorkflowStepStatus = "pending" | "running" | "completed" | "failed" | "skipped";

export interface WorkflowStep {
  id: string;
  label: string;
  status: WorkflowStepStatus;
  description?: string;
  startedAt?: string;
  completedAt?: string;
  durationMs?: number;
  errorMessage?: string;
  icon?: string;
}

export interface WorkflowStepListProps extends ComponentPropsWithoutRef<"div"> {
  steps: WorkflowStep[];
  onStepClick?: (id: string) => void;
  theme?: KiteTheme;
}

const STATUS_ICON: Record<WorkflowStepStatus, string> = {
  pending: "○",
  running: "◉",
  completed: "✓",
  failed: "✗",
  skipped: "—",
};

export const WorkflowStepList = forwardRef<HTMLDivElement, WorkflowStepListProps>(
  function WorkflowStepList({ steps, onStepClick, theme, style, ...rest }, ref) {
    const contextTheme = useFlyUITheme();
    const themeStyle = buildKiteThemeStyle(mergeKiteTheme(contextTheme, theme));

    return (
      <div
        ref={ref}
        className="kite-flyui-host kite-flyui-agentCard kite-flyui-workflowSteps"
        style={{ ...themeStyle, ...style } as CSSProperties}
        {...rest}
      >
        {steps.map((step) => (
          <div
            key={step.id}
            className="kite-flyui-workflowSteps__item"
            onClick={() => onStepClick?.(step.id)}
            role={onStepClick ? "button" : undefined}
            tabIndex={onStepClick ? 0 : undefined}
            onKeyDown={(e) => {
              if (onStepClick && (e.key === "Enter" || e.key === " ")) {
                e.preventDefault();
                onStepClick(step.id);
              }
            }}
          >
            <div
              className={`kite-flyui-workflowSteps__icon kite-flyui-workflowSteps__icon--${step.status}`}
              aria-label={`Step ${step.status}`}
            >
              {step.icon ?? STATUS_ICON[step.status]}
            </div>
            <div className="kite-flyui-workflowSteps__body">
              <div className="kite-flyui-workflowSteps__label">{step.label}</div>
              {step.description && (
                <div className="kite-flyui-workflowSteps__meta">{step.description}</div>
              )}
              {(step.startedAt || step.durationMs !== undefined) && (
                <div className="kite-flyui-workflowSteps__meta">
                  {step.startedAt && <span>Started: {step.startedAt}</span>}
                  {step.durationMs !== undefined && <span> · {step.durationMs}ms</span>}
                </div>
              )}
              {step.errorMessage && (
                <div className="kite-flyui-workflowSteps__error" role="alert">{step.errorMessage}</div>
              )}
            </div>
          </div>
        ))}
      </div>
    );
  },
);
