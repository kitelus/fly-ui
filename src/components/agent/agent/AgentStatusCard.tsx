import { forwardRef, type CSSProperties, type ComponentPropsWithoutRef } from "react";
import { buildKiteThemeStyle, mergeKiteTheme, type KiteTheme } from "../../kite/theme";
import { useFlyUITheme } from "../../kite/theme";
import "../agent.css";

export type AgentStatus = "idle" | "running" | "thinking" | "acting" | "completed" | "error";

export interface AgentStatusCardProps extends ComponentPropsWithoutRef<"div"> {
  name: string;
  status: AgentStatus;
  model?: string;
  description?: string;
  inputTokens?: number;
  outputTokens?: number;
  errorMessage?: string;
  onStop?: () => void;
  onRetry?: () => void;
  onReset?: () => void;
  theme?: KiteTheme;
}

export const AgentStatusCard = forwardRef<HTMLDivElement, AgentStatusCardProps>(
  function AgentStatusCard(
    {
      name,
      status,
      model,
      description,
      inputTokens,
      outputTokens,
      errorMessage,
      onStop,
      onRetry,
      onReset,
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
        className="kite-flyui-host kite-flyui-agentCard kite-flyui-agentStatusCard"
        style={{ ...themeStyle, ...style } as CSSProperties}
        aria-label={`Agent ${name}, status: ${status}`}
        {...rest}
      >
        <div className="kite-flyui-agentStatusCard__header">
          <div>
            <p className="kite-flyui-agentStatusCard__name">{name}</p>
            {model && <p className="kite-flyui-agentStatusCard__model">{model}</p>}
          </div>
          <span className={`kite-flyui-agentBadge kite-flyui-agentBadge--${status}`}>
            <span className={`kite-flyui-agentDot kite-flyui-agentDot--${status}`} aria-hidden="true" />
            {status}
          </span>
        </div>
        {description && <p className="kite-flyui-agentValue" style={{ marginTop: 8 }}>{description}</p>}
        {(inputTokens !== undefined || outputTokens !== undefined) && (
          <div className="kite-flyui-agentStatusCard__tokens">
            {inputTokens !== undefined && <span>In: {inputTokens.toLocaleString()} tokens</span>}
            {outputTokens !== undefined && <span>Out: {outputTokens.toLocaleString()} tokens</span>}
          </div>
        )}
        {errorMessage && (
          <div className="kite-flyui-agentStatusCard__error" role="alert">{errorMessage}</div>
        )}
        {(onStop || onRetry || onReset) && (
          <div className="kite-flyui-agentActions">
            {onStop && status === "running" && (
              <button className="kite-flyui-agentBtn kite-flyui-agentBtn--danger" onClick={onStop} type="button">
                Stop
              </button>
            )}
            {onRetry && status === "error" && (
              <button className="kite-flyui-agentBtn kite-flyui-agentBtn--primary" onClick={onRetry} type="button">
                Retry
              </button>
            )}
            {onReset && (
              <button className="kite-flyui-agentBtn" onClick={onReset} type="button">
                Reset
              </button>
            )}
          </div>
        )}
      </div>
    );
  },
);
