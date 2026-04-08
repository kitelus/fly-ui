import {
  forwardRef,
  useRef,
  useState,
  useEffect,
  type ReactNode,
  type CSSProperties,
  type ComponentPropsWithoutRef,
  type KeyboardEvent,
  type ChangeEvent,
} from "react";
import { buildKiteThemeStyle, mergeKiteTheme, type KiteTheme } from "../../kite/theme";
import { useFlyUITheme } from "../../kite/theme";
import "../agent.css";

export interface MessageInputAction {
  /** Icon — accepts string emoji, SVG element, or any ReactNode */
  icon?: ReactNode;
  label: string;
  onClick: () => void;
}

export interface MessageInputProps extends Omit<ComponentPropsWithoutRef<"div">, "onChange"> {
  value?: string;
  placeholder?: string;
  disabled?: boolean;
  maxLength?: number;
  hint?: string;
  /**
   * Label for the send button.
   * - Omit (default) → icon-only circular send button
   * - Pass a string (e.g. `"Send"`) → text pill send button
   * - Pass a ReactNode → fully custom send button content
   */
  sendLabel?: ReactNode;
  /** Show attach button (paperclip). Calls onAttach when clicked. */
  showAttach?: boolean;
  onAttach?: () => void;
  /** Extra action items shown in a "⋯" dropdown menu */
  actions?: MessageInputAction[];
  onChange?: (value: string) => void;
  onSend?: (value: string) => void;
  theme?: KiteTheme;
}

// ── SVG icons ─────────────────────────────────────────────────────────────────

function IconPaperclip() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M21.44 11.05l-9.19 9.19a6 6 0 01-8.49-8.49l9.19-9.19a4 4 0 015.66 5.66l-9.2 9.19a2 2 0 01-2.83-2.83l8.49-8.48"/>
    </svg>
  );
}

function IconSend() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M22 2L11 13"/>
      <path d="M22 2L15 22 11 13 2 9l20-7z"/>
    </svg>
  );
}

function IconEllipsis() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <circle cx="5" cy="12" r="1.5" fill="currentColor" stroke="none"/>
      <circle cx="12" cy="12" r="1.5" fill="currentColor" stroke="none"/>
      <circle cx="19" cy="12" r="1.5" fill="currentColor" stroke="none"/>
    </svg>
  );
}

// ── Component ─────────────────────────────────────────────────────────────────

export const MessageInput = forwardRef<HTMLDivElement, MessageInputProps>(
  function MessageInput(
    {
      value = "",
      placeholder = "Ask anything…",
      disabled = false,
      maxLength,
      hint,
      sendLabel,
      showAttach = false,
      onAttach,
      actions,
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
    const dropdownRef = useRef<HTMLDivElement>(null);
    const [dropdownOpen, setDropdownOpen] = useState(false);

    // Auto-grow textarea
    useEffect(() => {
      const el = textareaRef.current;
      if (!el) return;
      el.style.height = "auto";
      el.style.height = `${Math.min(el.scrollHeight, 200)}px`;
    }, [value]);

    // Close dropdown on outside click
    useEffect(() => {
      if (!dropdownOpen) return;
      const handler = (e: MouseEvent) => {
        if (!dropdownRef.current?.contains(e.target as Node)) setDropdownOpen(false);
      };
      document.addEventListener("mousedown", handler);
      return () => document.removeEventListener("mousedown", handler);
    }, [dropdownOpen]);

    const handleChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
      onChange?.(e.target.value);
    };

    const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
      if (e.key === "Enter" && !e.shiftKey) {
        e.preventDefault();
        if (value.trim() && !disabled) onSend?.(value);
      }
    };

    const handleSend = () => {
      if (value.trim() && !disabled) onSend?.(value);
    };

    const canSend = !!value.trim() && !disabled;
    const isOver = !!maxLength && value.length > maxLength;
    const isWarn = !!maxLength && !isOver && value.length > maxLength * 0.9;
    const hasTextLabel = sendLabel !== undefined;

    // Only render the toolbar row if there's something to show in it
    const hasToolbar = showAttach || (actions && actions.length > 0) || !!maxLength || !!hint;

    const sendBtn = (
      <button
        type="button"
        className={[
          "kite-flyui-messageInput__send",
          canSend ? "kite-flyui-messageInput__send--active" : "",
          hasTextLabel ? "kite-flyui-messageInput__send--text" : "",
        ].filter(Boolean).join(" ")}
        onClick={handleSend}
        disabled={!canSend}
        aria-label="Send message"
      >
        {sendLabel ?? <IconSend />}
      </button>
    );

    return (
      <div
        ref={ref}
        className="kite-flyui-host kite-flyui-messageInput"
        style={{ ...themeStyle, ...style } as CSSProperties}
        {...rest}
      >
        <div className={`kite-flyui-messageInput__box${disabled ? " kite-flyui-messageInput__box--disabled" : ""}`}>

          {/* Textarea row — always visible, send btn inline when no toolbar */}
          <div className="kite-flyui-messageInput__inputRow">
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
              aria-multiline="true"
            />
            {/* When no toolbar, send button sits inline to the right of textarea */}
            {!hasToolbar && (
              <div className="kite-flyui-messageInput__inlineSend">{sendBtn}</div>
            )}
          </div>

          {/* Toolbar — only rendered when there's content for it */}
          {hasToolbar && (
            <div className="kite-flyui-messageInput__toolbar">
              <div className="kite-flyui-messageInput__toolbarLeft">
                {showAttach && (
                  <button
                    type="button"
                    className="kite-flyui-messageInput__iconBtn"
                    onClick={onAttach}
                    disabled={disabled}
                    aria-label="Attach file"
                    title="Attach file"
                  >
                    <IconPaperclip />
                  </button>
                )}
                {actions && actions.length > 0 && (
                  <div className="kite-flyui-messageInput__dropdownWrap" ref={dropdownRef}>
                    <button
                      type="button"
                      className={`kite-flyui-messageInput__iconBtn${dropdownOpen ? " kite-flyui-messageInput__iconBtn--active" : ""}`}
                      onClick={() => setDropdownOpen((o) => !o)}
                      disabled={disabled}
                      aria-label="More actions"
                      aria-expanded={dropdownOpen}
                      aria-haspopup="menu"
                      title="More actions"
                    >
                      <IconEllipsis />
                    </button>
                    {dropdownOpen && (
                      <div className="kite-flyui-messageInput__dropdown" role="menu">
                        {actions.map((action) => (
                          <button
                            key={action.label}
                            type="button"
                            className="kite-flyui-messageInput__dropdownItem"
                            role="menuitem"
                            onClick={() => { action.onClick(); setDropdownOpen(false); }}
                          >
                            {action.icon != null && (
                              <span className="kite-flyui-messageInput__dropdownIcon">{action.icon}</span>
                            )}
                            {action.label}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                )}
                {maxLength && (
                  <span className={[
                    "kite-flyui-messageInput__charCount",
                    isOver ? "kite-flyui-messageInput__charCount--over" : "",
                    isWarn ? "kite-flyui-messageInput__charCount--warn" : "",
                  ].filter(Boolean).join(" ")}>
                    {value.length}/{maxLength}
                  </span>
                )}
              </div>

              <div className="kite-flyui-messageInput__toolbarRight">
                {hint && <span className="kite-flyui-messageInput__hint">{hint}</span>}
                {sendBtn}
              </div>
            </div>
          )}
        </div>
      </div>
    );
  },
);
