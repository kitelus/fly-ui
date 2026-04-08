import { forwardRef, useState, type ReactNode, type CSSProperties, type ComponentPropsWithoutRef } from "react";
import { buildKiteThemeStyle, mergeKiteTheme, type KiteTheme } from "../../kite/theme";
import { useFlyUITheme } from "../../kite/theme";
import "../agent.css";

export type StepType = "thought" | "action" | "observation" | "tool_use" | "decision";

export interface AgentStep {
  id: string;
  type: StepType;
  content: string;
  detail?: string;
  timestamp?: string;
  durationMs?: number;
  isStreaming?: boolean;
  /**
   * Custom icon for this step — overrides the default emoji.
   * Accepts a string (emoji / text) or any ReactNode (SVG, component, etc.).
   */
  icon?: ReactNode;
}

export interface AgentStepTimelineProps extends ComponentPropsWithoutRef<"div"> {
  steps: AgentStep[];
  theme?: KiteTheme;
}

const STEP_ICON: Record<StepType, string> = {
  thought:     "💭",
  action:      "⚡",
  observation: "👁",
  tool_use:    "🔧",
  decision:    "🎯",
};

export const AgentStepTimeline = forwardRef<HTMLDivElement, AgentStepTimelineProps>(
  function AgentStepTimeline({ steps, theme, style, ...rest }, ref) {
    const contextTheme = useFlyUITheme();
    const themeStyle = buildKiteThemeStyle(mergeKiteTheme(contextTheme, theme));
    const [expanded, setExpanded] = useState<Set<string>>(new Set());

    const toggle = (id: string) => {
      setExpanded((prev) => {
        const next = new Set(prev);
        if (next.has(id)) next.delete(id);
        else next.add(id);
        return next;
      });
    };

    return (
      <div
        ref={ref}
        className="kite-flyui-host kite-flyui-agentTimeline"
        style={{ ...themeStyle, ...style } as CSSProperties}
        {...rest}
      >
        {steps.map((step) => (
          <div key={step.id} className="kite-flyui-agentTimeline__item">
            <div className={`kite-flyui-agentTimeline__icon kite-flyui-agentTimeline__icon--${step.type}`} aria-hidden="true">
              {step.icon ?? STEP_ICON[step.type]}
            </div>
            <div className="kite-flyui-agentTimeline__body">
              <div className="kite-flyui-agentTimeline__stepHeader">
                <span className="kite-flyui-agentTimeline__stepType">{step.type.replace("_", " ")}</span>
                {(step.timestamp || step.durationMs !== undefined) && (
                  <span className="kite-flyui-agentTimeline__stepMeta">
                    {step.timestamp}
                    {step.durationMs !== undefined && ` · ${step.durationMs}ms`}
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
                  className={`kite-flyui-agentTimeline__content${expanded.has(step.id) ? " kite-flyui-agentTimeline__content--expanded" : ""}`}
                  onClick={() => step.detail && toggle(step.id)}
                  role={step.detail ? "button" : undefined}
                  tabIndex={step.detail ? 0 : undefined}
                  onKeyDown={(e) => {
                    if (step.detail && (e.key === "Enter" || e.key === " ")) {
                      e.preventDefault();
                      toggle(step.id);
                    }
                  }}
                  aria-expanded={step.detail ? expanded.has(step.id) : undefined}
                >
                  {step.content}
                  {step.detail && expanded.has(step.id) && (
                    <pre className="kite-flyui-agentTimeline__detail">{step.detail}</pre>
                  )}
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    );
  },
);

