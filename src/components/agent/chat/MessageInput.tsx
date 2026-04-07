import {
  forwardRef,
  useRef,
  type CSSProperties,
  type ComponentPropsWithoutRef,
  type KeyboardEvent,
  type ChangeEvent,
} from "react";
import { buildKiteThemeStyle, mergeKiteTheme, type KiteTheme } from "../../kite/theme";
import { useFlyUITheme } from "../../kite/theme";
import "../agent.css";

export interface MessageInputProps extends Omit<ComponentPropsWithoutRef<"div">, "onChange"> {
  value?: string;
  placeholder?: string;
  disabled?: boolean;
  maxLength?: number;
  sendLabel?: string;
  hint?: string;
  onChange?: (value: string) => void;
  onSend?: (value: string) => void;
  theme?: KiteTheme;
}

export const MessageInput = forwardRef<HTMLDivElement, MessageInputProps>(
  function MessageInput(
    {
      value = "",
      placeholder = "Type a message…",
      disabled = false,
      maxLength,
      sendLabel = "Send",
      hint,
      onChange,
      onSend,
      theme,
      style,
      ...rest
    },
    ref,
  ) {
    const contextTheme = useFlyUITheme();
    const themeStyle = buildKiteThemeStyle(mergeKiteTheme(contextTheme, theme));
    const textareaRef = useRef<HTMLTextAreaElement>(null);

    const handleChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
      onChange?.(e.target.value);
    };

    const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
      if (e.key === "Enter" && !e.shiftKey) {
        e.preventDefault();
        if (value.trim()) onSend?.(value);
      }
    };

    const handleSend = () => {
      if (value.trim()) onSend?.(value);
    };

    const charCountClass =
      maxLength && value.length > maxLength
        ? "kite-flyui-messageInput__charCount--over"
        : maxLength && value.length > maxLength * 0.9
          ? "kite-flyui-messageInput__charCount--warn"
          : "";

    return (
      <div
        ref={ref}
        className="kite-flyui-host kite-flyui-messageInput"
        style={{ ...themeStyle, ...style } as CSSProperties}
        {...rest}
      >
        <div className="kite-flyui-messageInput__row">
          <textarea
            ref={textareaRef}
            className="kite-flyui-messageInput__textarea"
            value={value}
            placeholder={placeholder}
            disabled={disabled}
            rows={1}
            onChange={handleChange}
            onKeyDown={handleKeyDown}
            aria-label={placeholder}
          />
          <button
            className="kite-flyui-messageInput__send"
            onClick={handleSend}
            disabled={disabled || !value.trim()}
            type="button"
          >
            {sendLabel}
          </button>
        </div>
        {(maxLength || hint) && (
          <div className="kite-flyui-messageInput__footer">
            <span>{hint}</span>
            {maxLength && (
              <span className={charCountClass}>
                {value.length}/{maxLength}
              </span>
            )}
          </div>
        )}
      </div>
    );
  },
);
