import {
  useMemo,
  useState,
  type CSSProperties,
  type ComponentType,
  type ReactNode,
} from "react";

import { AgentStatus } from "./AgentStatus";
import { AgentTracePanel, type AgentStep } from "./AgentTracePanel";
import { ChatWindow, type ChatMessage } from "./ChatWindow";
import { ErrorMessage } from "./ErrorMessage";
import { FeedbackBar } from "./FeedbackBar";
import { SourceCard, SourceList } from "./SourceCard";
import { SuggestedAction } from "./SuggestedAction";
import { TokenUsage } from "./TokenUsage";
import { cls } from "./primitives/cls";
import "./styles/kite-fu-agent-ui.css";

export interface AgentChatMessage extends ChatMessage {
  reasoning?: { content: string; isStreaming?: boolean; duration?: number };
  toolCalls?: Array<{
    id: string;
    name: string;
    args?: Record<string, unknown>;
    result?: unknown;
    status: "pending" | "running" | "success" | "error";
  }>;
  sources?: Array<{
    title: string;
    url: string;
    excerpt?: string;
    index: number;
  }>;
}

export type AgentChatAppSlotKey =
  | "header"
  | "message"
  | "reasoning"
  | "toolCall"
  | "sourceList"
  | "feedbackBar"
  | "tracePanel"
  | "suggestedActions"
  | "input"
  | "tokenUsage"
  | "typingIndicator"
  | "errorState"
  | "emptyState";

export interface AgentChatAppProps {
  messages: AgentChatMessage[];
  steps?: AgentStep[];
  onSend: (text: string, files?: File[]) => void;
  onFeedback?: (
    msgId: string,
    value: "positive" | "negative",
    comment?: string,
  ) => void;
  onRetry?: (msgId: string) => void;
  suggestions?: string[];
  onSuggestionSelect?: (value: string) => void;
  isLoading?: boolean;
  isStreaming?: boolean;
  streamingMessageId?: string;
  agentStatus?: "idle" | "thinking" | "running" | "paused" | "error" | "done";
  tokenUsage?: { used: number; max: number };
  error?: Error | string;
  showTrace?: boolean | "auto";
  tracePosition?: "right" | "bottom" | "drawer";
  showReasoning?: boolean;
  showToolCalls?: boolean;
  showSources?: boolean;
  showFeedback?: boolean;
  showTokenUsage?: boolean;
  agentName?: string;
  agentAvatarSrc?: string;
  allowAttachments?: boolean;
  slots?: Partial<
    Record<AgentChatAppSlotKey, ComponentType<Record<string, unknown>> | null>
  >;
  slotProps?: Partial<Record<AgentChatAppSlotKey, Record<string, unknown>>>;
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

export function AgentChatApp({
  messages,
  steps = [],
  onSend,
  onFeedback,
  onRetry,
  suggestions,
  onSuggestionSelect,
  isLoading = false,
  isStreaming = false,
  streamingMessageId,
  agentStatus = "idle",
  tokenUsage,
  error,
  showTrace = "auto",
  tracePosition = "right",
  showSources = true,
  showFeedback = true,
  showTokenUsage = false,
  agentName = "AI Assistant",
  allowAttachments = false,
  slots,
  slotProps,
  className,
  style,
}: AgentChatAppProps) {
  const [feedbackMap, setFeedbackMap] = useState<
    Record<string, "positive" | "negative" | null>
  >({});

  const lastAssistantId = useMemo(() => {
    const reversed = [...messages].reverse();
    return reversed.find((m) => m.role === "assistant")?.id;
  }, [messages]);

  const resolvedShowTrace = showTrace === "auto" ? steps.length > 0 : showTrace;

  const chatPane = (
    <div className="kite-fu-agent-chat-app-main">
      {renderSlot(
        slots?.header,
        { ...(slotProps?.header ?? {}), agentName, agentStatus },
        <div className="kite-fu-agent-chat-app-header">
          <div className="kite-fu-agent-chat-app-title">{agentName}</div>
          <AgentStatus status={agentStatus} />
        </div>,
      )}

      {error
        ? renderSlot(
            slots?.errorState,
            { ...(slotProps?.errorState ?? {}), error },
            <ErrorMessage.Root
              onRetry={
                lastAssistantId && onRetry
                  ? () => onRetry(lastAssistantId)
                  : undefined
              }
            >
              <ErrorMessage.Title>Something went wrong</ErrorMessage.Title>
              <ErrorMessage.Description>
                {typeof error === "string" ? error : error.message}
              </ErrorMessage.Description>
              {lastAssistantId && onRetry ? (
                <ErrorMessage.Retry>Retry</ErrorMessage.Retry>
              ) : null}
            </ErrorMessage.Root>,
          )
        : null}

      <ChatWindow
        messages={messages}
        onSend={onSend}
        isLoading={isLoading}
        isStreaming={isStreaming}
        streamingMessageId={streamingMessageId}
        allowAttachments={allowAttachments}
        slots={{
          message: slots?.message,
          input: slots?.input,
          typingIndicator: slots?.typingIndicator,
          emptyState: slots?.emptyState,
        }}
        slotProps={{
          message: slotProps?.message,
          input: slotProps?.input,
          typingIndicator: slotProps?.typingIndicator,
          emptyState: slotProps?.emptyState,
        }}
      />

      {showSources
        ? renderSlot(
            slots?.sourceList,
            { ...(slotProps?.sourceList ?? {}), messages },
            <SourceList.Root className="kite-fu-agent-chat-app-sources">
              {messages
                .flatMap((msg) => msg.sources ?? [])
                .slice(-3)
                .map((source) => (
                  <SourceList.Item key={`${source.url}-${source.index}`}>
                    <SourceCard
                      title={source.title}
                      url={source.url}
                      excerpt={source.excerpt}
                    />
                  </SourceList.Item>
                ))}
            </SourceList.Root>,
          )
        : null}

      {suggestions && suggestions.length > 0
        ? renderSlot(
            slots?.suggestedActions,
            { ...(slotProps?.suggestedActions ?? {}), suggestions },
            <SuggestedAction.Root className="kite-fu-agent-chat-app-suggestions">
              {suggestions.map((value) => (
                <SuggestedAction.Item
                  key={value}
                  value={value}
                  onAction={(next) => onSuggestionSelect?.(next)}
                />
              ))}
            </SuggestedAction.Root>,
          )
        : null}

      {showFeedback && lastAssistantId
        ? renderSlot(
            slots?.feedbackBar,
            { ...(slotProps?.feedbackBar ?? {}), messageId: lastAssistantId },
            <FeedbackBar.Root
              value={feedbackMap[lastAssistantId] ?? null}
              onValueChange={(next) => {
                const normalized = next ?? null;
                setFeedbackMap((prev) => ({
                  ...prev,
                  [lastAssistantId]: normalized,
                }));
                if (normalized) {
                  onFeedback?.(lastAssistantId, normalized);
                }
              }}
            />,
          )
        : null}

      {showTokenUsage && tokenUsage
        ? renderSlot(
            slots?.tokenUsage,
            { ...(slotProps?.tokenUsage ?? {}), tokenUsage },
            <TokenUsage.Root used={tokenUsage.used} max={tokenUsage.max} />,
          )
        : null}
    </div>
  );

  const tracePane = resolvedShowTrace
    ? renderSlot(
        slots?.tracePanel,
        { ...(slotProps?.tracePanel ?? {}), steps },
        <AgentTracePanel
          steps={steps}
          status={agentStatus}
          className="kite-fu-agent-chat-app-trace"
        />,
      )
    : null;

  return (
    <div
      className={cls("kite-fu-agent-chat-app-root", className)}
      data-trace-position={tracePosition}
      style={style}
    >
      {chatPane}
      {tracePane}
    </div>
  );
}
