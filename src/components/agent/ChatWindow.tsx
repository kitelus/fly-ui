import { type CSSProperties, type ComponentType, type ReactNode } from "react";

import { Message } from "./Message";
import { MessageInput } from "./MessageInput";
import { StreamText } from "./StreamText";
import { Thread } from "./Thread";
import { Loading } from "../loading/Loading";
import { cls } from "./primitives/cls";
import "./styles/kite-fu-agent-ui.css";

export interface ChatMessage {
  id: string;
  role: "user" | "assistant" | "system";
  content: string;
  timestamp?: Date;
  status?: "streaming" | "done" | "error";
  attachments?: Array<{
    id: string;
    name: string;
    size: number;
    type: string;
    url?: string;
  }>;
  metadata?: Record<string, unknown>;
}

export type ChatWindowSlotKey =
  | "message"
  | "userMessage"
  | "assistantMessage"
  | "input"
  | "typingIndicator"
  | "header"
  | "emptyState"
  | "scrollAnchor";

export interface CompositeProps<TSlotKey extends string> {
  slots?: Partial<
    Record<TSlotKey, ComponentType<Record<string, unknown>> | null>
  >;
  slotProps?: Partial<Record<TSlotKey, Record<string, unknown>>>;
}

export interface ChatWindowProps extends CompositeProps<ChatWindowSlotKey> {
  messages: ChatMessage[];
  onSend: (text: string, files?: File[]) => void;
  isLoading?: boolean;
  isStreaming?: boolean;
  streamingMessageId?: string;
  placeholder?: string;
  allowAttachments?: boolean;
  maxInputLength?: number;
  autoScroll?: boolean;
  showTimestamps?: boolean;
  showAvatars?: boolean;
  emptyState?: ReactNode;
  renderMessage?: (msg: ChatMessage, defaultRender: ReactNode) => ReactNode;
  renderMessageContent?: (msg: ChatMessage) => ReactNode;
  renderMessageActions?: (msg: ChatMessage) => ReactNode;
  renderInput?: () => ReactNode;
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

export function ChatWindow({
  messages,
  onSend,
  isLoading = false,
  isStreaming = false,
  streamingMessageId,
  placeholder = "Message...",
  allowAttachments = false,
  maxInputLength,
  autoScroll = true,
  showTimestamps = false,
  showAvatars = true,
  emptyState,
  renderMessage,
  renderMessageContent,
  renderMessageActions,
  renderInput,
  slots,
  slotProps,
  className,
  style,
}: ChatWindowProps) {
  const headerNode = renderSlot(
    slots?.header,
    { ...(slotProps?.header ?? {}) },
    null,
  );

  const emptyNode = renderSlot(
    slots?.emptyState,
    { ...(slotProps?.emptyState ?? {}) },
    emptyState ?? <Thread.Empty>No messages yet.</Thread.Empty>,
  );

  const scrollAnchorNode = renderSlot(
    slots?.scrollAnchor,
    { ...(slotProps?.scrollAnchor ?? {}) },
    <Thread.ScrollAnchor />,
  );

  const inputNode = renderSlot(
    slots?.input,
    {
      ...(slotProps?.input ?? {}),
      disabled: isLoading,
    },
    renderInput?.() ?? (
      <MessageInput.Root
        onSend={onSend}
        isLoading={isLoading}
        maxLength={maxInputLength}
      >
        <MessageInput.Field placeholder={placeholder} />
        <MessageInput.Toolbar>
          {allowAttachments ? <MessageInput.AttachTrigger /> : null}
          <MessageInput.Counter />
          <MessageInput.Submit />
        </MessageInput.Toolbar>
      </MessageInput.Root>
    ),
  );

  return (
    <div
      className={cls("kite-fu-agent-chat-window-root", className)}
      style={style}
    >
      {headerNode}
      <Thread.Root
        autoScroll={autoScroll}
        className="kite-fu-agent-chat-window-thread"
      >
        {messages.length === 0 ? (
          emptyNode
        ) : (
          <Thread.List>
            {messages.map((msg) => {
              const contentNode = renderMessageContent?.(msg) ?? (
                <Message.Text>
                  {isStreaming && streamingMessageId === msg.id ? (
                    <StreamText
                      value={msg.content}
                      isStreaming={msg.status === "streaming"}
                    />
                  ) : (
                    msg.content
                  )}
                </Message.Text>
              );

              const defaultMessageNode = (
                <Message.Root
                  key={msg.id}
                  role={msg.role}
                  status={msg.status ?? "done"}
                >
                  {showAvatars && msg.role !== "system" ? (
                    <Message.Avatar
                      fallback={msg.role === "user" ? "U" : "AI"}
                    />
                  ) : null}
                  <Message.Content>
                    {contentNode}
                    {showTimestamps && msg.timestamp ? (
                      <Message.Timestamp value={msg.timestamp} />
                    ) : null}
                    {renderMessageActions ? (
                      <Message.Actions>
                        {renderMessageActions(msg)}
                      </Message.Actions>
                    ) : null}
                  </Message.Content>
                </Message.Root>
              );

              const resolvedMessage = renderMessage
                ? renderMessage(msg, defaultMessageNode)
                : defaultMessageNode;

              const perRoleSlot =
                msg.role === "user"
                  ? slots?.userMessage
                  : slots?.assistantMessage;

              return (
                <li
                  key={msg.id}
                  className="kite-fu-agent-chat-window-message-item"
                >
                  {renderSlot(
                    perRoleSlot ?? slots?.message,
                    {
                      message: msg,
                      ...(slotProps?.message ?? {}),
                    },
                    resolvedMessage,
                  )}
                </li>
              );
            })}
          </Thread.List>
        )}
        {isStreaming
          ? renderSlot(
              slots?.typingIndicator,
              { ...(slotProps?.typingIndicator ?? {}) },
              <Loading
                className="kite-fu-agent-chat-window-loading"
                label="Agent is responding"
              />,
            )
          : null}
        {scrollAnchorNode}
      </Thread.Root>
      <div className="kite-fu-agent-chat-window-input">{inputNode}</div>
    </div>
  );
}
