import {
  useMemo,
  useState,
  type CSSProperties,
  type ComponentType,
  type ReactNode,
} from "react";

import { AgentChatApp, type AgentChatMessage } from "./AgentChatApp";
import { ConversationLayout } from "./ConversationLayout";
import { cls } from "./primitives/cls";
import "./styles/kite-fu-agent-ui.css";

export interface ConversationItem {
  id: string;
  title: string;
  preview?: string;
  updatedAt: Date;
  isPinned?: boolean;
  tags?: string[];
}

export interface ConversationListProps {
  items: ConversationItem[];
  activeId?: string;
  onSelect?: (id: string) => void;
  onDelete?: (id: string) => void;
  onPin?: (id: string) => void;
  groupByDate?: boolean;
  searchable?: boolean;
  className?: string;
  style?: CSSProperties;
}

export function ConversationList({
  items,
  activeId,
  onSelect,
  onDelete,
  onPin,
  className,
  style,
}: ConversationListProps) {
  return (
    <div
      className={cls("kite-fu-agent-conversation-list-root", className)}
      style={style}
    >
      {items.map((item) => (
        <div
          key={item.id}
          className="kite-fu-agent-conversation-list-item"
          data-active={activeId === item.id ? "true" : "false"}
          onClick={() => onSelect?.(item.id)}
        >
          <div className="kite-fu-agent-conversation-list-item-title">
            {item.title}
          </div>
          {item.preview ? (
            <div className="kite-fu-agent-conversation-list-item-preview">
              {item.preview}
            </div>
          ) : null}
          <div className="kite-fu-agent-conversation-list-item-actions">
            <button
              type="button"
              onClick={(event) => {
                event.stopPropagation();
                onPin?.(item.id);
              }}
            >
              {item.isPinned ? "Unpin" : "Pin"}
            </button>
            <button
              type="button"
              onClick={(event) => {
                event.stopPropagation();
                onDelete?.(item.id);
              }}
            >
              Delete
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}

export type ConversationPageSlotKey =
  | "topBar"
  | "sidebar"
  | "sidebarHeader"
  | "sidebarFooter"
  | "conversationList"
  | "conversationItem"
  | "chatContent"
  | "emptyConversation";

export interface ConversationPageProps {
  conversations?: ConversationItem[];
  activeConversationId?: string;
  onConversationSelect?: (id: string) => void;
  onNewConversation?: () => void;
  onDeleteConversation?: (id: string) => void;
  onPinConversation?: (id: string) => void;
  sidebarOpen?: boolean;
  defaultSidebarOpen?: boolean;
  onSidebarChange?: (open: boolean) => void;
  sidebarCollapsible?: boolean;
  userProfile?: { name: string; avatarSrc?: string };
  messages?: AgentChatMessage[];
  onSend?: (text: string, files?: File[]) => void;
  slots?: Partial<
    Record<
      ConversationPageSlotKey,
      ComponentType<Record<string, unknown>> | null
    >
  >;
  slotProps?: Partial<Record<ConversationPageSlotKey, Record<string, unknown>>>;
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

export function ConversationPage({
  conversations = [],
  activeConversationId,
  onConversationSelect,
  onNewConversation,
  onDeleteConversation,
  onPinConversation,
  sidebarOpen,
  defaultSidebarOpen = true,
  onSidebarChange,
  userProfile,
  messages = [],
  onSend,
  slots,
  slotProps,
  className,
  style,
}: ConversationPageProps) {
  const [internalSidebarOpen, setInternalSidebarOpen] =
    useState(defaultSidebarOpen);

  const resolvedSidebarOpen = sidebarOpen ?? internalSidebarOpen;
  const resolvedActiveId = activeConversationId ?? conversations[0]?.id;

  const activeConversation = useMemo(
    () => conversations.find((item) => item.id === resolvedActiveId),
    [conversations, resolvedActiveId],
  );

  const toggleSidebar = () => {
    const next = !resolvedSidebarOpen;
    if (sidebarOpen === undefined) {
      setInternalSidebarOpen(next);
    }
    onSidebarChange?.(next);
  };

  return (
    <ConversationLayout.Root
      className={cls("kite-fu-agent-conversation-page-root", className)}
      style={style}
      sidebarOpen={resolvedSidebarOpen}
    >
      {renderSlot(
        slots?.topBar,
        { ...(slotProps?.topBar ?? {}), userProfile },
        <ConversationLayout.Header className="kite-fu-agent-conversation-page-topbar">
          <button type="button" onClick={toggleSidebar}>
            ☰
          </button>
          <div className="kite-fu-agent-conversation-page-topbar-title">
            {activeConversation?.title ?? "Conversation"}
          </div>
          {userProfile ? <div>{userProfile.name}</div> : null}
        </ConversationLayout.Header>,
      )}

      {renderSlot(
        slots?.sidebar,
        { ...(slotProps?.sidebar ?? {}), conversations },
        <ConversationLayout.Sidebar>
          {renderSlot(
            slots?.sidebarHeader,
            { ...(slotProps?.sidebarHeader ?? {}) },
            <div className="kite-fu-agent-conversation-page-sidebar-header">
              <button type="button" onClick={() => onNewConversation?.()}>
                New Conversation
              </button>
            </div>,
          )}

          {renderSlot(
            slots?.conversationList,
            { ...(slotProps?.conversationList ?? {}), conversations },
            <ConversationList
              items={conversations}
              activeId={resolvedActiveId}
              onSelect={onConversationSelect}
              onDelete={onDeleteConversation}
              onPin={onPinConversation}
            />,
          )}

          {renderSlot(
            slots?.sidebarFooter,
            { ...(slotProps?.sidebarFooter ?? {}) },
            <div className="kite-fu-agent-conversation-page-sidebar-footer">
              {conversations.length} conversations
            </div>,
          )}
        </ConversationLayout.Sidebar>,
      )}

      <ConversationLayout.Main>
        {renderSlot(
          slots?.chatContent,
          { ...(slotProps?.chatContent ?? {}), messages },
          resolvedActiveId ? (
            <AgentChatApp
              messages={messages}
              onSend={onSend ?? (() => undefined)}
            />
          ) : (
            renderSlot(
              slots?.emptyConversation,
              { ...(slotProps?.emptyConversation ?? {}) },
              <div className="kite-fu-agent-conversation-page-empty">
                Start a new conversation.
              </div>,
            )
          ),
        )}
      </ConversationLayout.Main>
    </ConversationLayout.Root>
  );
}
