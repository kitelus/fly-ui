import { forwardRef, useState, type CSSProperties, type ComponentPropsWithoutRef, type ReactNode } from "react";
import { buildKiteThemeStyle, mergeKiteTheme, type KiteTheme } from "../../kite/theme";
import { useFlyUITheme } from "../../kite/theme";
import "../agent.css";

export interface StreamingTextProps extends Omit<ComponentPropsWithoutRef<"div">, "children"> {
  content: string;
  isStreaming?: boolean;
  cursorVisible?: boolean;
  onStopStream?: () => void;
  onCopyText?: (text: string) => void;
  /** Label for the Stop button. @default "Stop" */
  stopLabel?: ReactNode;
  /** Label for the Copy button. @default "Copy" */
  copyLabel?: ReactNode;
  /**
   * Label shown briefly after copy succeeds.
   * Set to null to disable the feedback.
   * @default "Copied!"
   */
  copyFeedbackLabel?: ReactNode | null;
  /** How long (ms) the copy feedback is shown. @default 1500 */
  copyFeedbackDuration?: number;
  /** Extra action buttons rendered alongside Stop/Copy. */
  extraActions?: Array<{ label: ReactNode; onClick: () => void; ariaLabel?: string }>;
  /** Render the text content with custom formatting (e.g. markdown). */
  renderContent?: (text: string) => ReactNode;
  /** Render a fully custom actions bar. */
  renderActions?: (content: string, isStreaming: boolean) => ReactNode;
  theme?: KiteTheme;
}

export const StreamingText = forwardRef<HTMLDivElement, StreamingTextProps>(
  function StreamingText(
    {
      content,
      isStreaming = false,
      cursorVisible = true,
      onStopStream,
      onCopyText,
      stopLabel = "Stop",
      copyLabel = "Copy",
      copyFeedbackLabel = "Copied!",
      copyFeedbackDuration = 1500,
      extraActions,
      renderContent,
      renderActions,
      theme,
      style,
      ...rest
    },
    ref,
  ) {
    const contextTheme = useFlyUITheme();
    const themeStyle = buildKiteThemeStyle(mergeKiteTheme(contextTheme, theme));
    const [copied, setCopied] = useState(false);

    const handleCopy = () => {
      onCopyText?.(content);
      if (copyFeedbackLabel !== null) {
        setCopied(true);
        setTimeout(() => setCopied(false), copyFeedbackDuration);
      }
    };

    const hasActions = onStopStream || onCopyText || (extraActions && extraActions.length > 0);

    return (
      <div
        ref={ref}
        className="kite-flyui-host kite-flyui-streamingText"
        style={{ ...themeStyle, ...style } as CSSProperties}
        {...rest}
      >
        <span aria-live={isStreaming ? "polite" : undefined} aria-atomic={isStreaming ? "false" : undefined}>
          {renderContent ? renderContent(content) : content}
        </span>
        {isStreaming && cursorVisible && (
          <span className="kite-flyui-streamingText__cursor" aria-hidden="true" />
        )}
        {renderActions ? (
          renderActions(content, isStreaming)
        ) : hasActions && (
          <div className="kite-flyui-streamingText__actions">
            {onStopStream && (
              <button
                className="kite-flyui-agentBtn"
                onClick={onStopStream}
                type="button"
                aria-label="Stop streaming"
              >
                {stopLabel}
              </button>
            )}
            {onCopyText && (
              <button
                className="kite-flyui-agentBtn"
                onClick={handleCopy}
                type="button"
                aria-label={copied ? "Copied" : "Copy text"}
              >
                {copied && copyFeedbackLabel !== null ? copyFeedbackLabel : copyLabel}
              </button>
            )}
            {extraActions?.map((action, i) => (
              <button
                key={action.ariaLabel ?? String(i)}
                className="kite-flyui-agentBtn"
                onClick={action.onClick}
                type="button"
                aria-label={action.ariaLabel}
              >
                {action.label}
              </button>
            ))}
          </div>
        )}
      </div>
    );
  },
);
