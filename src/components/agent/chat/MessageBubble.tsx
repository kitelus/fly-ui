import { forwardRef, type CSSProperties, type ComponentPropsWithoutRef, type ReactNode } from "react";
import { buildKiteThemeStyle, mergeKiteTheme, type KiteTheme } from "../../kite/theme";
import { useFlyUITheme } from "../../kite/theme";
import { Loading } from "../../loading/Loading";
import "../agent.css";

export type MessageRole = "user" | "assistant" | "system";

export interface MessageAction {
  label: string;
  onClick: () => void;
  /** Optional icon shown before the label. */
  icon?: ReactNode;
  /** Aria-label override for accessibility. */
  ariaLabel?: string;
  /** Show action as destructive (danger color). */
  danger?: boolean;
  /** Disable this action. */
  disabled?: boolean;
}

export interface MessageBubbleProps extends ComponentPropsWithoutRef<"div"> {
  role: MessageRole;
  content?: string;
  authorName?: string;
  avatarText?: string;
  avatarUrl?: string;
  /** Override the default timestamp display. */
  timestamp?: string;
  /** Show/hide the timestamp. @default true */
  showTimestamp?: boolean;
  isLoading?: boolean;
  /** Label read by screen readers when loading. @default "Loading response" */
  loadingLabel?: string;
  /** Show an error state with this message. */
  errorMessage?: string;
  /** Called when the user clicks retry on a failed message. */
  onRetry?: () => void;
  /** Label for the retry button. @default "Retry" */
  retryLabel?: ReactNode;
  /** Mark the message as failed (shows error styling). */
  isFailed?: boolean;
  actions?: MessageAction[];
  /** Aria-label for the actions group. @default "Message actions" */
  actionsAriaLabel?: string;
  /** Fully replace the avatar — accepts any ReactNode. */
  renderAvatar?: (role: MessageRole) => ReactNode;
  /** Render the bubble content with custom formatting (e.g. markdown). */
  renderContent?: (content: string, role: MessageRole) => ReactNode;
  /** Render a custom header row alongside authorName/timestamp. */
  headerSlot?: ReactNode;
  /** Render content below the bubble (e.g. reactions, thread counts). */
  footerSlot?: ReactNode;
  theme?: KiteTheme;
}

export const MessageBubble = forwardRef<HTMLDivElement, MessageBubbleProps>(
  function MessageBubble(
    {
      role,
      content,
      authorName,
      avatarText,
      avatarUrl,
      timestamp,
      showTimestamp = true,
      isLoading = false,
      loadingLabel = "Loading response",
      errorMessage,
      onRetry,
      retryLabel = "Retry",
      isFailed = false,
      actions,
      actionsAriaLabel = "Message actions",
      renderAvatar,
      renderContent,
      headerSlot,
      footerSlot,
      theme,
      style,
      children,
      ...rest
    },
    ref,
  ) {
    const contextTheme = useFlyUITheme();
    const themeStyle = buildKiteThemeStyle(mergeKiteTheme(contextTheme, theme));

    const avatarNode = renderAvatar
      ? renderAvatar(role)
      : avatarUrl
        ? <img src={avatarUrl} alt={authorName ?? role} className="kite-flyui-messageBubble__avatarImg" />
        : (avatarText ?? (authorName ? authorName[0].toUpperCase() : role === "user" ? "U" : "A"));

    const bodyContent = children ?? (
      renderContent && content != null
        ? renderContent(content, role)
        : content
    );

    return (
      <div
        ref={ref}
        className={[
          "kite-flyui-host",
          "kite-flyui-messageBubble",
          `kite-flyui-messageBubble--${role}`,
          isFailed ? "kite-flyui-messageBubble--failed" : "",
          isLoading ? "kite-flyui-messageBubble--loading" : "",
        ].filter(Boolean).join(" ")}
        style={{ ...themeStyle, ...style } as CSSProperties}
        {...rest}
      >
        {role !== "system" && (
          <div className="kite-flyui-messageBubble__avatar" aria-hidden="true">
            {avatarNode}
          </div>
        )}
        <div className="kite-flyui-messageBubble__body">
          {(authorName || (timestamp && showTimestamp) || headerSlot) && role !== "system" && (
            <div className="kite-flyui-messageBubble__header">
              {authorName && (
                <span className="kite-flyui-messageBubble__author">{authorName}</span>
              )}
              {showTimestamp && timestamp && (
                <span className="kite-flyui-messageBubble__time">{timestamp}</span>
              )}
              {headerSlot}
            </div>
          )}
          <div className={[
            "kite-flyui-messageBubble__bubble",
            isLoading ? "kite-flyui-messageBubble__bubble--loading" : "",
            isFailed ? "kite-flyui-messageBubble__bubble--failed" : "",
          ].filter(Boolean).join(" ")}>
            {isLoading ? (
              <Loading label={loadingLabel} className="kite-flyui-messageBubble__loadingInline" />
            ) : (
              bodyContent
            )}
          </div>
          {(isFailed || errorMessage) && (
            <div className="kite-flyui-messageBubble__error" role="alert">
              {errorMessage && <span>{errorMessage}</span>}
              {errorMessage && onRetry && <span aria-hidden="true">·</span>}
              {onRetry && (
                <button
                  type="button"
                  className="kite-flyui-messageBubble__retryBtn"
                  onClick={onRetry}
                  aria-label="Retry sending message"
                >
                  {retryLabel}
                </button>
              )}
            </div>
          )}
          {actions && actions.length > 0 && (
            <div className="kite-flyui-messageBubble__actions" role="group" aria-label={actionsAriaLabel}>
              {actions.map((action) => (
                <button
                  key={action.label}
                  className={[
                    "kite-flyui-messageBubble__actionBtn",
                    action.danger ? "kite-flyui-messageBubble__actionBtn--danger" : "",
                  ].filter(Boolean).join(" ")}
                  onClick={action.onClick}
                  type="button"
                  disabled={action.disabled}
                  aria-label={action.ariaLabel}
                >
                  {action.icon && <span aria-hidden="true">{action.icon}</span>}
                  {action.label}
                </button>
              ))}
            </div>
          )}
          {footerSlot}
        </div>
      </div>
    );
  },
);
