import {
  useMemo,
  type CSSProperties,
  type ComponentType,
  type ReactNode,
} from "react";

import { AgentStatus } from "./AgentStatus";
import { AgentTracePanel, type AgentStep } from "./AgentTracePanel";
import { cls } from "./primitives/cls";
import "./styles/kite-fu-agent-ui.css";

export interface AgentCardData {
  id: string;
  name: string;
  description?: string;
  avatarSrc?: string;
  status: "idle" | "thinking" | "running" | "paused" | "error" | "done";
  steps?: AgentStep[];
  lastMessage?: string;
  progress?: number;
  metadata?: Record<string, unknown>;
}

export interface AgentCardProps {
  agent: AgentCardData;
  expanded?: boolean;
  onAction?: (action: string) => void;
  className?: string;
  style?: CSSProperties;
}

export function AgentCard({
  agent,
  expanded = false,
  onAction,
  className,
  style,
}: AgentCardProps) {
  return (
    <article
      className={cls("kite-fu-agent-multi-board-card", className)}
      style={style}
    >
      <header className="kite-fu-agent-multi-board-card-header">
        {agent.avatarSrc ? (
          <img src={agent.avatarSrc} alt={agent.name} />
        ) : null}
        <div>
          <div className="kite-fu-agent-multi-board-card-title">
            {agent.name}
          </div>
          {agent.description ? (
            <div className="kite-fu-agent-multi-board-card-description">
              {agent.description}
            </div>
          ) : null}
        </div>
        <AgentStatus status={agent.status} />
      </header>

      {agent.lastMessage ? (
        <div className="kite-fu-agent-multi-board-card-last-message">
          {agent.lastMessage}
        </div>
      ) : null}

      {expanded && agent.steps && agent.steps.length > 0 ? (
        <AgentTracePanel
          steps={agent.steps}
          status={agent.status}
          className="kite-fu-agent-multi-board-card-trace"
        />
      ) : null}

      <div className="kite-fu-agent-multi-board-card-actions">
        <button type="button" onClick={() => onAction?.("pause")}>
          Pause
        </button>
        <button type="button" onClick={() => onAction?.("retry")}>
          Retry
        </button>
        <button type="button" onClick={() => onAction?.("stop")}>
          Stop
        </button>
      </div>
    </article>
  );
}

export type MultiAgentBoardSlotKey =
  | "agentCard"
  | "agentHeader"
  | "agentTrace"
  | "boardHeader"
  | "boardFooter";

export interface MultiAgentBoardProps {
  agents: AgentCardData[];
  layout?: "grid" | "columns" | "rows";
  columns?: number | "auto";
  onAgentAction?: (agentId: string, action: "pause" | "stop" | "retry") => void;
  onBroadcast?: (message: string) => void;
  selectable?: boolean;
  selectedAgentId?: string;
  onAgentSelect?: (agentId: string) => void;
  slots?: Partial<
    Record<
      MultiAgentBoardSlotKey,
      ComponentType<Record<string, unknown>> | null
    >
  >;
  slotProps?: Partial<Record<MultiAgentBoardSlotKey, Record<string, unknown>>>;
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

export function MultiAgentBoard({
  agents,
  layout = "grid",
  columns = "auto",
  onAgentAction,
  onBroadcast,
  selectable = false,
  selectedAgentId,
  onAgentSelect,
  slots,
  slotProps,
  className,
  style,
}: MultiAgentBoardProps) {
  const computedColumns = useMemo(() => {
    if (layout !== "grid") {
      return undefined;
    }
    if (columns === "auto") {
      return "repeat(auto-fill, minmax(280px, 1fr))";
    }
    return `repeat(${Math.max(1, columns)}, minmax(0, 1fr))`;
  }, [columns, layout]);

  return (
    <section
      className={cls("kite-fu-agent-multi-board-root", className)}
      data-layout={layout}
      style={{ ...style, gridTemplateColumns: computedColumns }}
    >
      {renderSlot(
        slots?.boardHeader,
        { ...(slotProps?.boardHeader ?? {}) },
        <header className="kite-fu-agent-multi-board-header">
          <strong>Multi Agent Board</strong>
          {onBroadcast ? (
            <button
              type="button"
              onClick={() => onBroadcast("Please summarize progress")}
            >
              Broadcast
            </button>
          ) : null}
        </header>,
      )}

      <div className="kite-fu-agent-multi-board-grid">
        {agents.map((agent) => (
          <div
            key={agent.id}
            data-selected={selectedAgentId === agent.id ? "true" : "false"}
            onClick={() => {
              if (selectable) {
                onAgentSelect?.(agent.id);
              }
            }}
          >
            {renderSlot(
              slots?.agentCard,
              {
                ...(slotProps?.agentCard ?? {}),
                agent,
              },
              <AgentCard
                agent={agent}
                expanded={selectedAgentId === agent.id}
                onAction={(action) => {
                  if (
                    action === "pause" ||
                    action === "stop" ||
                    action === "retry"
                  ) {
                    onAgentAction?.(agent.id, action);
                  }
                }}
              />,
            )}
          </div>
        ))}
      </div>

      {renderSlot(
        slots?.boardFooter,
        { ...(slotProps?.boardFooter ?? {}) },
        <footer className="kite-fu-agent-multi-board-footer">
          {agents.length} agents
        </footer>,
      )}
    </section>
  );
}
