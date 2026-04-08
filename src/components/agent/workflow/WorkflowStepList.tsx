import { forwardRef, type CSSProperties, type ComponentPropsWithoutRef, type ReactNode } from "react";
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
  /** Custom icon that overrides the built-in status icon. */
  icon?: ReactNode;
}

export interface WorkflowStepListProps extends ComponentPropsWithoutRef<"div"> {
  steps: WorkflowStep[];
  onStepClick?: (id: string, step: WorkflowStep) => void;
  onStepRetry?: (id: string, step: WorkflowStep) => void;
  onStepSkip?: (id: string, step: WorkflowStep) => void;
  /** Map of status → custom icon, merged with defaults. */
  statusIcons?: Partial<Record<WorkflowStepStatus, ReactNode>>;
  /** Override button labels. */
  retryLabel?: ReactNode;
  skipLabel?: ReactNode;
  /** Custom render for a single step row. */
  renderStep?: (step: WorkflowStep) => ReactNode;
  /** Render a custom empty state when steps is empty. */
  renderEmpty?: () => ReactNode;
  /** Text shown when there are no steps. @default "" */
  emptyText?: string;
  theme?: KiteTheme;
}

const DEFAULT_STATUS_ICON: Record<WorkflowStepStatus, string> = {
  pending:   "",
  running:   "",
  completed: "",
  failed:    "",
  skipped:   "",
};

export const WorkflowStepList = forwardRef<HTMLDivElement, WorkflowStepListProps>(
  function WorkflowStepList(
    {
      steps,
      onStepClick,
      onStepRetry,
      onStepSkip,
      statusIcons,
      retryLabel = "Retry",
      skipLabel = "Skip",
      renderStep,
      renderEmpty,
      emptyText,
      theme,
      style,
      ...rest
    },
    ref,
  ) {
    const contextTheme = useFlyUITheme();
    const themeStyle = buildKiteThemeStyle(mergeKiteTheme(contextTheme, theme));

    const resolveIcon = (step: WorkflowStep): ReactNode =>
      step.icon ?? statusIcons?.[step.status] ?? DEFAULT_STATUS_ICON[step.status];

    return (
      <div
        ref={ref}
        className="kite-flyui-host kite-flyui-agentCard kite-flyui-workflowSteps"
        style={{ ...themeStyle, ...style } as CSSProperties}
        {...rest}
      >
        {steps.length === 0 ? (
          renderEmpty
            ? renderEmpty()
            : emptyText
              ? <div className="kite-flyui-agentMemory__empty">{emptyText}</div>
              : null
        ) : steps.map((step) =>
          renderStep ? (
            <div key={step.id}>{renderStep(step)}</div>
          ) : (
            <div
              key={step.id}
              className="kite-flyui-workflowSteps__item"
              onClick={() => onStepClick?.(step.id, step)}
              role={onStepClick ? "button" : undefined}
              tabIndex={onStepClick ? 0 : undefined}
              onKeyDown={(e) => {
                if (onStepClick && (e.key === "Enter" || e.key === " ")) {
                  e.preventDefault();
                  onStepClick(step.id, step);
                }
              }}
              aria-label={onStepClick ? `${step.label}, ${step.status}` : undefined}
            >
              <div
                className={`kite-flyui-workflowSteps__icon kite-flyui-workflowSteps__icon--${step.status}${resolveIcon(step) ? " kite-flyui-workflowSteps__icon--custom" : ""}`}
                aria-label={`Step ${step.status}`}
              >
                {resolveIcon(step) || null}
              </div>
              <div className="kite-flyui-workflowSteps__body">
                <div className="kite-flyui-workflowSteps__label">{step.label}</div>
                {step.description && (
                  <div className="kite-flyui-workflowSteps__meta">{step.description}</div>
                )}
                {(step.startedAt || step.completedAt || step.durationMs !== undefined) && (
                  <div className="kite-flyui-workflowSteps__meta">
                    {step.startedAt   && <span>Started: {step.startedAt}</span>}
                    {step.completedAt && <span>{step.startedAt ? " · " : ""}Done: {step.completedAt}</span>}
                    {step.durationMs  !== undefined && <span> · {step.durationMs}ms</span>}
                  </div>
                )}
                {step.errorMessage && (
                  <div className="kite-flyui-workflowSteps__error" role="alert">{step.errorMessage}</div>
                )}
                {((onStepRetry && step.status === "failed") || (onStepSkip && step.status === "pending")) && (
                  <div className="kite-flyui-workflowSteps__actions">
                    {onStepSkip && step.status === "pending" && (
                      <button
                        type="button"
                        className="kite-flyui-agentBtn"
                        onClick={(e) => { e.stopPropagation(); onStepSkip(step.id, step); }}
                        aria-label={`Skip step: ${step.label}`}
                      >
                        {skipLabel}
                      </button>
                    )}
                    {onStepRetry && step.status === "failed" && (
                      <button
                        type="button"
                        className="kite-flyui-agentBtn kite-flyui-agentBtn--primary"
                        onClick={(e) => { e.stopPropagation(); onStepRetry(step.id, step); }}
                        aria-label={`Retry step: ${step.label}`}
                      >
                        {retryLabel}
                      </button>
                    )}
                  </div>
                )}
              </div>
            </div>
          )
        )}
      </div>
    );
  },
);
