import { forwardRef, useState, type CSSProperties, type ComponentPropsWithoutRef } from "react";
import { buildKiteThemeStyle, mergeKiteTheme, type KiteTheme } from "../../kite/theme";
import { useFlyUITheme } from "../../kite/theme";
import "../agent.css";

export type ToolCallStatus = "idle" | "running" | "completed" | "error";

export interface ToolCallInspectorProps extends ComponentPropsWithoutRef<"div"> {
  toolName: string;
  description?: string;
  status: ToolCallStatus;
  input?: unknown;
  output?: unknown;
  errorMessage?: string;
  latencyMs?: number;
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
      theme,
      style,
      ...rest
    },
    ref,
  ) {
    const contextTheme = useFlyUITheme();
    const themeStyle = buildKiteThemeStyle(mergeKiteTheme(contextTheme, theme));
    const [open, setOpen] = useState(false);

    return (
      <div
        ref={ref}
        className="kite-flyui-host kite-flyui-toolCall"
        style={{ ...themeStyle, ...style } as CSSProperties}
        {...rest}
      >
        <div
          className="kite-flyui-toolCall__header"
          onClick={() => setOpen((v) => !v)}
          role="button"
          tabIndex={0}
          onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === " ") {
              e.preventDefault();
              setOpen((v) => !v);
            }
          }}
          aria-expanded={open}
        >
          <span className={`kite-flyui-agentBadge kite-flyui-agentBadge--${status}`}>
            <span className={`kite-flyui-agentDot kite-flyui-agentDot--${status}`} aria-hidden="true" />
            {status}
          </span>
          <span className="kite-flyui-toolCall__name">{toolName}</span>
          {description && <span className="kite-flyui-toolCall__desc">{description}</span>}
          {latencyMs !== undefined && (
            <span className="kite-flyui-toolCall__latency">{latencyMs}ms</span>
          )}
          <span className={`kite-flyui-toolCall__chevron${open ? " kite-flyui-toolCall__chevron--open" : ""}`} aria-hidden="true">▼</span>
        </div>
        {open && (
          <div className="kite-flyui-toolCall__body">
            {input !== undefined && (
              <div>
                <p className="kite-flyui-toolCall__sectionLabel">Input</p>
                <pre className="kite-flyui-toolCall__code">
                  {typeof input === "string" ? input : JSON.stringify(input, null, 2)}
                </pre>
              </div>
            )}
            {output !== undefined && (
              <div>
                <p className="kite-flyui-toolCall__sectionLabel">Output</p>
                <pre className="kite-flyui-toolCall__code">
                  {typeof output === "string" ? output : JSON.stringify(output, null, 2)}
                </pre>
              </div>
            )}
            {errorMessage && (
              <div className="kite-flyui-toolCall__error" role="alert">{errorMessage}</div>
            )}
          </div>
        )}
      </div>
    );
  },
);
