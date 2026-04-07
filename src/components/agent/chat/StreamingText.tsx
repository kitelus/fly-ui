import { forwardRef, type CSSProperties, type ComponentPropsWithoutRef } from "react";
import { buildKiteThemeStyle, mergeKiteTheme, type KiteTheme } from "../../kite/theme";
import { useFlyUITheme } from "../../kite/theme";
import "../agent.css";

export interface StreamingTextProps extends Omit<ComponentPropsWithoutRef<"div">, "children"> {
  content: string;
  isStreaming?: boolean;
  cursorVisible?: boolean;
  onStopStream?: () => void;
  onCopyText?: (text: string) => void;
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
      theme,
      style,
      ...rest
    },
    ref,
  ) {
    const contextTheme = useFlyUITheme();
    const themeStyle = buildKiteThemeStyle(mergeKiteTheme(contextTheme, theme));

    return (
      <div
        ref={ref}
        className="kite-flyui-host kite-flyui-streamingText"
        style={{ ...themeStyle, ...style } as CSSProperties}
        {...rest}
      >
        <span>{content}</span>
        {isStreaming && cursorVisible && (
          <span className="kite-flyui-streamingText__cursor" aria-hidden="true" />
        )}
        {(onStopStream || onCopyText) && (
          <div className="kite-flyui-streamingText__actions">
            {onStopStream && (
              <button
                className="kite-flyui-agentBtn"
                onClick={onStopStream}
                type="button"
              >
                Stop
              </button>
            )}
            {onCopyText && (
              <button
                className="kite-flyui-agentBtn"
                onClick={() => onCopyText(content)}
                type="button"
              >
                Copy
              </button>
            )}
          </div>
        )}
      </div>
    );
  },
);
