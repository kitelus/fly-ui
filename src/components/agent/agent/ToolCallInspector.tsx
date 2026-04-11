import { forwardRef, useState, type ReactNode, type CSSProperties, type ComponentPropsWithoutRef } from "react";
import { buildKiteThemeStyle, mergeKiteTheme, type KiteTheme } from "../../kite/theme";
import { useFlyUITheme } from "../../kite/theme";
import "../agent.css";

export type ToolCallStatus = "idle" | "running" | "completed" | "error";

export interface ToolCallInspectorProps extends Omit<ComponentPropsWithoutRef<"div">, "onCopy"> {
  toolName: string;
  description?: string;
  status: ToolCallStatus;
  input?: unknown;
  output?: unknown;
  errorMessage?: string;
  latencyMs?: number;
  /** Timestamp to display alongside latency. */
  timestamp?: string;
  /** Controlled open state. When provided, the component is controlled. */
  open?: boolean;
  /** Called when the user toggles the inspector open/closed. */
  onOpenChange?: (open: boolean) => void;
  /** Whether to start open (uncontrolled). @default false */
  defaultOpen?: boolean;
  /** Override the section label for input. @default "Input" */
  inputLabel?: string;
  /** Override the section label for output. @default "Output" */
  outputLabel?: string;
  /** Label for copy buttons. @default "Copy" */
  copyLabel?: ReactNode;
  /**
   * Label shown briefly after copy.
   * Set null to disable feedback.
   * @default "Copied!"
   */
  copyFeedbackLabel?: ReactNode | null;
  /** Callback when the user copies input or output. */
  onCopy?: (section: "input" | "output", content: string) => void;
  /** Called when the user clicks retry on an error. */
  onRetry?: () => void;
  /** Label for the retry button. @default "Retry" */
  retryLabel?: ReactNode;
  /** Custom icon shown to the left of the tool name. */
  toolIcon?: ReactNode;
  /** Slot rendered in the header alongside the tool name. */
  headerSlot?: ReactNode;
  /** Render custom content inside the body (replaces default input/output blocks). */
  children?: ReactNode;
  theme?: KiteTheme;
}

export const ToolCallInspector = forwardRef<HTMLDivElement, ToolCallInspectorProps>(
  function ToolCallInspector(
    {
      toolName,
      description,
      status,
      input,
      output,
      errorMessage,
      latencyMs,
      timestamp,
      open: controlledOpen,
      onOpenChange,
      defaultOpen = false,
      inputLabel = "Input",
      outputLabel = "Output",
      copyLabel = "Copy",
      copyFeedbackLabel = "Copied!",
      onCopy,
      onRetry,
      retryLabel = "Retry",
      toolIcon,
      headerSlot,
      children,
      theme,
      style,
      ...rest
    },
    ref,
  ) {
    const contextTheme = useFlyUITheme();
    const themeStyle = buildKiteThemeStyle(mergeKiteTheme(contextTheme, theme));
    const [internalOpen, setInternalOpen] = useState(defaultOpen);
    const [copiedSection, setCopiedSection] = useState<"input" | "output" | null>(null);

    const open = controlledOpen ?? internalOpen;

    const handleToggle = () => {
      const next = !open;
      if (controlledOpen === undefined) setInternalOpen(next);
      onOpenChange?.(next);
    };

    const handleCopy = (section: "input" | "output", content: string) => {
      onCopy?.(section, content);
      if (copyFeedbackLabel !== null) {
        setCopiedSection(section);
        setTimeout(() => setCopiedSection(null), 1500);
      }
    };

    const serialize = (v: unknown) =>
      typeof v === "string" ? v : JSON.stringify(v, null, 2);

    const inputStr  = input  !== undefined ? serialize(input)  : undefined;
    const outputStr = output !== undefined ? serialize(output) : undefined;

    return (
      <div
        ref={ref}
        className="kite-flyui-host kite-flyui-toolCall"
        style={{ ...themeStyle, ...style } as CSSProperties}
        {...rest}
      >
        <div
          className="kite-flyui-toolCall__header"
          onClick={handleToggle}
          role="button"
          tabIndex={0}
          onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === " ") {
              e.preventDefault();
              handleToggle();
            }
          }}
          aria-expanded={open}
          aria-label={`${toolName} tool call, status: ${status}`}
        >
          <span className={`kite-flyui-agentBadge kite-flyui-agentBadge--${status}`}>
            <span className={`kite-flyui-agentDot kite-flyui-agentDot--${status}`} aria-hidden="true" />
            {status}
          </span>
          {toolIcon && <span className="kite-flyui-toolCall__toolIcon" aria-hidden="true">{toolIcon}</span>}
          <span className="kite-flyui-toolCall__name">{toolName}</span>
          {description && <span className="kite-flyui-toolCall__desc">{description}</span>}
          {(latencyMs !== undefined || timestamp) && (
            <span className="kite-flyui-toolCall__latency">
              {latencyMs !== undefined && `${latencyMs}ms`}
              {latencyMs !== undefined && timestamp && " · "}
              {timestamp}
            </span>
          )}
          {headerSlot}
          <span className={`kite-flyui-toolCall__chevron${open ? " kite-flyui-toolCall__chevron--open" : ""}`} aria-hidden="true" />
        </div>
        {open && (
          <div className="kite-flyui-toolCall__body">
            {children ?? (
              <>
                {inputStr !== undefined && (
                  <div>
                    <div className="kite-flyui-toolCall__sectionRow">
                      <p className="kite-flyui-toolCall__sectionLabel">{inputLabel}</p>
                      {onCopy && (
                        <button
                          type="button"
                          className="kite-flyui-agentBtn"
                          onClick={() => handleCopy("input", inputStr)}
                          aria-label={copiedSection === "input" ? "Copied" : "Copy input"}
                        >
                          {copiedSection === "input" && copyFeedbackLabel !== null ? copyFeedbackLabel : copyLabel}
                        </button>
                      )}
                    </div>
                    <pre className="kite-flyui-toolCall__code">{inputStr}</pre>
                  </div>
                )}
                {outputStr !== undefined && (
                  <div>
                    <div className="kite-flyui-toolCall__sectionRow">
                      <p className="kite-flyui-toolCall__sectionLabel">{outputLabel}</p>
                      {onCopy && (
                        <button
                          type="button"
                          className="kite-flyui-agentBtn"
                          onClick={() => handleCopy("output", outputStr)}
                          aria-label={copiedSection === "output" ? "Copied" : "Copy output"}
                        >
                          {copiedSection === "output" && copyFeedbackLabel !== null ? copyFeedbackLabel : copyLabel}
                        </button>
                      )}
                    </div>
                    <pre className="kite-flyui-toolCall__code">{outputStr}</pre>
                  </div>
                )}
              </>
            )}
            {errorMessage && (
              <div className="kite-flyui-toolCall__error" role="alert">
                <span>{errorMessage}</span>
                {onRetry && (
                  <button
                    type="button"
                    className="kite-flyui-agentBtn kite-flyui-agentBtn--primary"
                    onClick={onRetry}
                    aria-label="Retry tool call"
                  >
                    {retryLabel}
                  </button>
                )}
              </div>
            )}
          </div>
        )}
      </div>
    );
  },
);
