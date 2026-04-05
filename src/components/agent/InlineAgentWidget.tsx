import {
  useMemo,
  useState,
  type CSSProperties,
  type ComponentType,
  type ReactNode,
} from "react";

import { ChatWindow, type ChatMessage } from "./ChatWindow";
import { cls } from "./primitives/cls";
import "./styles/kite-fu-agent-ui.css";

type WidgetPosition = "bottom-right" | "bottom-left" | "top-right" | "top-left";

export type InlineAgentWidgetSlotKey =
  | "trigger"
  | "header"
  | "chat"
  | "closeButton";

export interface InlineAgentWidgetProps {
  messages: ChatMessage[];
  onSend: (text: string) => void;
  isLoading?: boolean;
  isStreaming?: boolean;
  open?: boolean;
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
  position?: WidgetPosition;
  offset?: { x?: number; y?: number };
  width?: number | string;
  height?: number | string;
  agentName?: string;
  triggerLabel?: string;
  unreadCount?: number;
  slots?: Partial<
    Record<
      InlineAgentWidgetSlotKey,
      ComponentType<Record<string, unknown>> | null
    >
  >;
  slotProps?: Partial<
    Record<InlineAgentWidgetSlotKey, Record<string, unknown>>
  >;
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

export function InlineAgentWidget({
  messages,
  onSend,
  isLoading = false,
  isStreaming = false,
  open,
  defaultOpen = false,
  onOpenChange,
  position = "bottom-right",
  offset,
  width = 380,
  height = 520,
  agentName = "Assistant",
  triggerLabel = "Chat",
  unreadCount = 0,
  slots,
  slotProps,
  className,
  style,
}: InlineAgentWidgetProps) {
  const [internalOpen, setInternalOpen] = useState(defaultOpen);
  const resolvedOpen = open ?? internalOpen;

  const positionStyle = useMemo(() => {
    const x = offset?.x ?? 24;
    const y = offset?.y ?? 24;

    const result: CSSProperties = {
      position: "fixed",
      zIndex: 1000,
    };

    if (position.includes("bottom")) {
      result.bottom = y;
    }
    if (position.includes("top")) {
      result.top = y;
    }
    if (position.includes("right")) {
      result.right = x;
    }
    if (position.includes("left")) {
      result.left = x;
    }

    return result;
  }, [offset?.x, offset?.y, position]);

  const setOpen = (next: boolean) => {
    if (open === undefined) {
      setInternalOpen(next);
    }
    onOpenChange?.(next);
  };

  return (
    <div
      className={cls("kite-fu-agent-inline-widget-root", className)}
      data-position={position}
      style={{ ...positionStyle, ...style }}
    >
      {renderSlot(
        slots?.trigger,
        {
          ...(slotProps?.trigger ?? {}),
          open: resolvedOpen,
          unreadCount,
        },
        <button
          type="button"
          className="kite-fu-agent-inline-widget-trigger"
          onClick={() => setOpen(!resolvedOpen)}
        >
          {triggerLabel}
          {unreadCount > 0 ? (
            <span className="kite-fu-agent-inline-widget-badge">
              {unreadCount}
            </span>
          ) : null}
        </button>,
      )}

      {resolvedOpen ? (
        <div
          className="kite-fu-agent-inline-widget-panel"
          style={{ width, height }}
        >
          {renderSlot(
            slots?.header,
            { ...(slotProps?.header ?? {}), agentName },
            <div className="kite-fu-agent-inline-widget-header">
              <strong>{agentName}</strong>
              {renderSlot(
                slots?.closeButton,
                { ...(slotProps?.closeButton ?? {}) },
                <button type="button" onClick={() => setOpen(false)}>
                  ×
                </button>,
              )}
            </div>,
          )}

          {renderSlot(
            slots?.chat,
            { ...(slotProps?.chat ?? {}), messages },
            <ChatWindow
              messages={messages}
              onSend={(text) => onSend(text)}
              isLoading={isLoading}
              isStreaming={isStreaming}
            />,
          )}
        </div>
      ) : null}
    </div>
  );
}
