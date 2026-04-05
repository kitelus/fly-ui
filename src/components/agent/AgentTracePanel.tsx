import { type CSSProperties, type ComponentType, type ReactNode } from "react";

import { AgentStatus } from "./AgentStatus";
import { Reasoning } from "./Reasoning";
import { StepList } from "./StepList";
import { ToolCall } from "./ToolCall";
import { cls } from "./primitives/cls";
import "./styles/kite-fu-agent-ui.css";

export interface AgentStep {
  id: string;
  label: string;
  status: "pending" | "running" | "done" | "error" | "skipped";
  startedAt?: Date;
  completedAt?: Date;
  toolCall?: {
    name: string;
    callId: string;
    args?: Record<string, unknown>;
    result?: unknown;
    status: "pending" | "running" | "success" | "error";
    error?: string;
  };
  reasoning?: { content: string; isStreaming?: boolean; duration?: number };
  metadata?: Record<string, unknown>;
}

export type AgentTracePanelSlotKey =
  | "stepItem"
  | "toolCall"
  | "reasoning"
  | "statusBar"
  | "header";

export interface AgentTracePanelProps {
  steps: AgentStep[];
  status?: "idle" | "thinking" | "running" | "paused" | "error" | "done";
  currentStepId?: string;
  showToolArgs?: boolean;
  showToolResults?: boolean;
  collapsible?: boolean;
  defaultOpen?: boolean;
  orientation?: "vertical" | "horizontal";
  maxHeight?: string;
  renderStep?: (step: AgentStep, defaultRender: ReactNode) => ReactNode;
  renderToolCall?: (
    step: AgentStep,
    toolCall: AgentStep["toolCall"],
  ) => ReactNode;
  renderReasoning?: (
    step: AgentStep,
    reasoning: AgentStep["reasoning"],
  ) => ReactNode;
  slots?: Partial<
    Record<
      AgentTracePanelSlotKey,
      ComponentType<Record<string, unknown>> | null
    >
  >;
  slotProps?: Partial<Record<AgentTracePanelSlotKey, Record<string, unknown>>>;
  className?: string;
  style?: CSSProperties;
}

function renderSlot(
  SlotComponent: ComponentType<Record<string, unknown>> | null | undefined,
  props: Record<string, unknown>,
  fallback: ReactNode,
): ReactNode {
  if (SlotComponent === null) {
    return null;
  }
  if (!SlotComponent) {
    return fallback;
  }
  return <SlotComponent {...props} />;
}

export function AgentTracePanel({
  steps,
  status = "idle",
  currentStepId,
  showToolArgs = false,
  showToolResults = true,
  orientation = "vertical",
  maxHeight,
  renderStep,
  renderToolCall,
  renderReasoning,
  slots,
  slotProps,
  className,
  style,
}: AgentTracePanelProps) {
  return (
    <div
      className={cls("kite-fu-agent-trace-panel-root", className)}
      style={{ ...style, maxHeight }}
      data-orientation={orientation}
    >
      {renderSlot(
        slots?.header,
        { ...(slotProps?.header ?? {}) },
        <div className="kite-fu-agent-trace-panel-header">Agent Trace</div>,
      )}

      {renderSlot(
        slots?.statusBar,
        { ...(slotProps?.statusBar ?? {}), status },
        <div className="kite-fu-agent-trace-panel-status">
          <AgentStatus status={status} />
        </div>,
      )}

      <StepList.Root
        orientation={orientation}
        className="kite-fu-agent-trace-panel-steps"
      >
        {steps.map((step, index) => {
          const defaultStep = (
            <StepList.Item
              key={step.id}
              status={step.status}
              isLast={index === steps.length - 1}
              data-current={currentStepId === step.id ? "true" : "false"}
            >
              <StepList.Icon>{index + 1}</StepList.Icon>
              <div className="kite-fu-agent-trace-panel-step-body">
                <StepList.Label>{step.label}</StepList.Label>
                {step.reasoning
                  ? renderSlot(
                      slots?.reasoning,
                      {
                        ...(slotProps?.reasoning ?? {}),
                        step,
                        reasoning: step.reasoning,
                      },
                      renderReasoning?.(step, step.reasoning) ?? (
                        <Reasoning.Root
                          isStreaming={step.reasoning.isStreaming}
                        >
                          <Reasoning.Trigger>
                            <Reasoning.Summary
                              duration={step.reasoning.duration}
                            />
                          </Reasoning.Trigger>
                          <Reasoning.Content>
                            {step.reasoning.content}
                          </Reasoning.Content>
                        </Reasoning.Root>
                      ),
                    )
                  : null}

                {step.toolCall
                  ? renderSlot(
                      slots?.toolCall,
                      {
                        ...(slotProps?.toolCall ?? {}),
                        step,
                        toolCall: step.toolCall,
                      },
                      renderToolCall?.(step, step.toolCall) ?? (
                        <ToolCall.Root
                          toolName={step.toolCall.name}
                          status={step.toolCall.status}
                          callId={step.toolCall.callId}
                        >
                          <ToolCall.Header>
                            <ToolCall.Name>{step.toolCall.name}</ToolCall.Name>
                            <ToolCall.Status>
                              {step.toolCall.status}
                            </ToolCall.Status>
                          </ToolCall.Header>
                          {showToolArgs ? (
                            <ToolCall.Args value={step.toolCall.args} />
                          ) : null}
                          {showToolResults ? (
                            <ToolCall.Result
                              value={
                                step.toolCall.error ?? step.toolCall.result
                              }
                              isError={Boolean(step.toolCall.error)}
                            />
                          ) : null}
                        </ToolCall.Root>
                      ),
                    )
                  : null}
              </div>
              <StepList.Connector />
            </StepList.Item>
          );

          return (
            <li key={step.id} className="kite-fu-agent-trace-panel-step-item">
              {renderSlot(
                slots?.stepItem,
                {
                  ...(slotProps?.stepItem ?? {}),
                  step,
                },
                renderStep?.(step, defaultStep) ?? defaultStep,
              )}
            </li>
          );
        })}
      </StepList.Root>
    </div>
  );
}
