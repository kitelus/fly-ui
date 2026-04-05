import { type CSSProperties, type ComponentType, type ReactNode } from "react";

import { ChatWindow, type ChatMessage } from "./ChatWindow";
import { SourceCard, SourceList } from "./SourceCard";
import { cls } from "./primitives/cls";
import "./styles/kite-fu-agent-ui.css";

type SearchMode = "web" | "local" | "hybrid" | "auto";

export interface SearchChatMessage extends ChatMessage {
  sources?: Array<{
    title: string;
    url: string;
    excerpt?: string;
    favicon?: string;
    index: number;
  }>;
  searchQuery?: string;
}

export type SearchChatAppSlotKey =
  | "sourceList"
  | "sourceCard"
  | "searchModeToggle"
  | "message";

export interface SearchChatAppProps {
  messages: SearchChatMessage[];
  onSend: (text: string, mode?: SearchMode) => void;
  isLoading?: boolean;
  isStreaming?: boolean;
  searchMode?: SearchMode;
  onSearchModeChange?: (mode: SearchMode) => void;
  showSourcesBeforeText?: boolean;
  maxSourcesVisible?: number;
  slots?: Partial<
    Record<SearchChatAppSlotKey, ComponentType<Record<string, unknown>> | null>
  >;
  slotProps?: Partial<Record<SearchChatAppSlotKey, Record<string, unknown>>>;
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

export function SearchChatApp({
  messages,
  onSend,
  isLoading = false,
  isStreaming = false,
  searchMode = "auto",
  onSearchModeChange,
  showSourcesBeforeText = true,
  maxSourcesVisible = 3,
  slots,
  slotProps,
  className,
  style,
}: SearchChatAppProps) {
  const modeOptions: SearchMode[] = ["auto", "web", "local", "hybrid"];

  return (
    <div
      className={cls("kite-fu-agent-search-chat-app-root", className)}
      style={style}
    >
      {renderSlot(
        slots?.searchModeToggle,
        { ...(slotProps?.searchModeToggle ?? {}), searchMode },
        <div className="kite-fu-agent-search-chat-app-modes">
          {modeOptions.map((mode) => (
            <button
              key={mode}
              type="button"
              data-active={mode === searchMode ? "true" : "false"}
              onClick={() => onSearchModeChange?.(mode)}
            >
              {mode}
            </button>
          ))}
        </div>,
      )}

      <ChatWindow
        messages={messages}
        onSend={(text) => onSend(text, searchMode)}
        isLoading={isLoading}
        isStreaming={isStreaming}
        renderMessage={(msg, fallback) => {
          const searchMessage = msg as SearchChatMessage;
          const sources =
            searchMessage.sources?.slice(0, maxSourcesVisible) ?? [];
          if (sources.length === 0) {
            return fallback;
          }

          const listNode = renderSlot(
            slots?.sourceList,
            {
              ...(slotProps?.sourceList ?? {}),
              sources,
              message: searchMessage,
            },
            <SourceList.Root className="kite-fu-agent-search-chat-app-sources">
              {sources.map((source) => (
                <SourceList.Item key={`${source.url}-${source.index}`}>
                  {renderSlot(
                    slots?.sourceCard,
                    {
                      ...(slotProps?.sourceCard ?? {}),
                      source,
                    },
                    <SourceCard
                      title={source.title}
                      url={source.url}
                      excerpt={source.excerpt}
                      icon={source.favicon}
                    />,
                  )}
                </SourceList.Item>
              ))}
            </SourceList.Root>,
          );

          return (
            <div className="kite-fu-agent-search-chat-app-message">
              {showSourcesBeforeText ? listNode : null}
              {renderSlot(
                slots?.message,
                {
                  ...(slotProps?.message ?? {}),
                  message: searchMessage,
                },
                fallback,
              )}
              {!showSourcesBeforeText ? listNode : null}
            </div>
          );
        }}
      />
    </div>
  );
}
