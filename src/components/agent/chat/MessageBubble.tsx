import { forwardRef, type CSSProperties, type ComponentPropsWithoutRef } from "react";
import { buildKiteThemeStyle, mergeKiteTheme, type KiteTheme } from "../../kite/theme";
import { useFlyUITheme } from "../../kite/theme";
import { Loading } from "../../loading/Loading";
import "../agent.css";

export type MessageRole = "user" | "assistant" | "system";

export interface MessageAction {
  label: string;
  onClick: () => void;
}

export interface MessageBubbleProps extends ComponentPropsWithoutRef<"div"> {
  role: MessageRole;
  content?: string;
  authorName?: string;
  avatarText?: string;
  timestamp?: string;
  isLoading?: boolean;
  actions?: MessageAction[];
  theme?: KiteTheme;
}

export const MessageBubble = forwardRef<HTMLDivElement, MessageBubbleProps>(
  function MessageBubble(
    {
      role,
      content,
      authorName,
      avatarText,
      timestamp,
      isLoading = false,
      actions,
      theme,
      style,
      children,
      ...rest
    },
    ref,
  ) {
    const contextTheme = useFlyUITheme();
    const themeStyle = buildKiteThemeStyle(mergeKiteTheme(contextTheme, theme));

    return (
      <div
        ref={ref}
        className={`kite-flyui-host kite-flyui-messageBubble kite-flyui-messageBubble--${role}`}
        style={{ ...themeStyle, ...style } as CSSProperties}
        {...rest}
      >
        {role !== "system" && (
          <div className="kite-flyui-messageBubble__avatar" aria-hidden="true">
            {avatarText ?? (authorName ? authorName[0].toUpperCase() : role === "user" ? "U" : "A")}
          </div>
        )}
        <div className="kite-flyui-messageBubble__body">
          {(authorName || timestamp) && role !== "system" && (
            <div className="kite-flyui-messageBubble__header">
              {authorName && (
                <span className="kite-flyui-messageBubble__author">{authorName}</span>
              )}
              {timestamp && (
                <span className="kite-flyui-messageBubble__time">{timestamp}</span>
              )}
            </div>
          )}
          {isLoading ? (
            <Loading label="Loading response" style={{ padding: "10px 14px" }} />
          ) : (
            <div className="kite-flyui-messageBubble__bubble">
              {children ?? content}
            </div>
          )}
          {actions && actions.length > 0 && (
            <div className="kite-flyui-messageBubble__actions">
              {actions.map((action) => (
                <button
                  key={action.label}
                  className="kite-flyui-messageBubble__actionBtn"
                  onClick={action.onClick}
                  type="button"
                >
                  {action.label}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    );
  },
);
