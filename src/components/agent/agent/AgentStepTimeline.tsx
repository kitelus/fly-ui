import { forwardRef, useState, type ReactNode, type CSSProperties, type ComponentPropsWithoutRef } from "react";
import { buildKiteThemeStyle, mergeKiteTheme, type KiteTheme } from "../../kite/theme";
import { useFlyUITheme } from "../../kite/theme";
import "../agent.css";

export type StepType = "thought" | "action" | "observation" | "tool_use" | "decision" | string;

export interface AgentStep {
  id: string;
  type: StepType;
  content: string;
  detail?: string;
  timestamp?: string;
  durationMs?: number;
  isStreaming?: boolean;
  /**
   * Custom icon for this step — overrides the default type abbreviation.
   * Accepts a string or any ReactNode (SVG, component, etc.).
   */
  icon?: ReactNode;
  /** Extra metadata shown alongside timestamp/duration. */
  meta?: string;
}

export interface AgentStepTimelineProps extends ComponentPropsWithoutRef<"div"> {
  steps: AgentStep[];
  /** Called when a step is clicked (regardless of whether it has detail). */
  onStepClick?: (step: AgentStep) => void;
  /**
   * Override which step ids start expanded.
   * When provided the component becomes controlled for expansion.
   */
  expandedIds?: Set<string>;
  onExpandChange?: (id: string, expanded: boolean) => void;
  /** Whether steps with detail are expanded by default (uncontrolled). @default false */
  defaultAllExpanded?: boolean;
  /** Custom render for the entire step row. */
  renderStep?: (step: AgentStep, expanded: boolean, toggle: () => void) => ReactNode;
  /** Map step types to custom icons, merged with the defaults. */
  stepIcons?: Partial<Record<string, ReactNode>>;
  /** Custom label for each step type (used in the header). */
  stepTypeLabels?: Partial<Record<string, string>>;
  /** Render a custom empty state when steps is empty. */
  renderEmpty?: () => ReactNode;
  /** Text shown when there are no steps. @default "" (renders nothing) */
  emptyText?: string;
  theme?: KiteTheme;
}

const DEFAULT_STEP_ICON: Record<string, string> = {
  thought:     "T",
  action:      "A",
  observation: "O",
  tool_use:    "U",
  decision:    "D",
};

export const AgentStepTimeline = forwardRef<HTMLDivElement, AgentStepTimelineProps>(
  function AgentStepTimeline(
    {
      steps,
      onStepClick,
      expandedIds: controlledExpandedIds,
      onExpandChange,
      defaultAllExpanded = false,
      renderStep,
      stepIcons,
      stepTypeLabels,
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
    const [internalExpanded, setInternalExpanded] = useState<Set<string>>(() => {
      if (defaultAllExpanded) return new Set(steps.filter((s) => s.detail).map((s) => s.id));
      return new Set();
    });

    const expandedIds = controlledExpandedIds ?? internalExpanded;

    const toggle = (id: string) => {
      const next = !expandedIds.has(id);
      if (!controlledExpandedIds) {
        setInternalExpanded((prev) => {
          const s = new Set(prev);
          if (s.has(id)) s.delete(id);
          else s.add(id);
          return s;
        });
      }
      onExpandChange?.(id, next);
    };

    const resolvedIcon = (step: AgentStep): ReactNode =>
      step.icon ?? stepIcons?.[step.type] ?? DEFAULT_STEP_ICON[step.type] ?? "●";

    const resolvedTypeLabel = (step: AgentStep): string =>
      stepTypeLabels?.[step.type] ?? step.type.replace("_", " ");

    if (steps.length === 0) {
      if (renderEmpty) return <div ref={ref} className="kite-flyui-host kite-flyui-agentTimeline" style={{ ...themeStyle, ...style } as CSSProperties} {...rest}>{renderEmpty()}</div>;
      if (emptyText) return <div ref={ref} className="kite-flyui-host kite-flyui-agentTimeline" style={{ ...themeStyle, ...style } as CSSProperties} {...rest}><div className="kite-flyui-agentMemory__empty">{emptyText}</div></div>;
    }

    return (
      <div
        ref={ref}
        className="kite-flyui-host kite-flyui-agentTimeline"
        style={{ ...themeStyle, ...style } as CSSProperties}
        {...rest}
      >
        {steps.map((step) => {
          const isExpanded = expandedIds.has(step.id);
          const toggleFn = () => toggle(step.id);

          if (renderStep) {
            return <div key={step.id}>{renderStep(step, isExpanded, toggleFn)}</div>;
          }

          return (
            <div key={step.id} className="kite-flyui-agentTimeline__item">
              <div
                className={`kite-flyui-agentTimeline__icon kite-flyui-agentTimeline__icon--${step.type}`}
                aria-hidden="true"
              >
                {resolvedIcon(step)}
              </div>
              <div className="kite-flyui-agentTimeline__body">
                <div className="kite-flyui-agentTimeline__stepHeader">
                  <span className="kite-flyui-agentTimeline__stepType">{resolvedTypeLabel(step)}</span>
                  {(step.timestamp || step.durationMs !== undefined || step.meta) && (
                    <span className="kite-flyui-agentTimeline__stepMeta">
                      {step.timestamp}
                      {step.durationMs !== undefined && ` · ${step.durationMs}ms`}
                      {step.meta && ` · ${step.meta}`}
                    </span>
                  )}
                </div>
                {step.isStreaming ? (
                  <div className="kite-flyui-agentTimeline__streaming" aria-live="polite">
                    <span>{step.content}</span>
                    <span className="kite-flyui-streamingText__cursor" aria-hidden="true" />
                  </div>
                ) : (
                  <div
                    className={`kite-flyui-agentTimeline__content${isExpanded ? " kite-flyui-agentTimeline__content--expanded" : ""}`}
                    onClick={() => {
                      if (step.detail) toggleFn();
                      onStepClick?.(step);
                    }}
                    role={step.detail || onStepClick ? "button" : undefined}
                    tabIndex={step.detail || onStepClick ? 0 : undefined}
                    onKeyDown={(e) => {
                      if ((step.detail || onStepClick) && (e.key === "Enter" || e.key === " ")) {
                        e.preventDefault();
                        if (step.detail) toggleFn();
                        onStepClick?.(step);
                      }
                    }}
                    aria-expanded={step.detail ? isExpanded : undefined}
                  >
                    {step.content}
                    {step.detail && isExpanded && (
                      <pre className="kite-flyui-agentTimeline__detail">{step.detail}</pre>
                    )}
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    );
  },
);
