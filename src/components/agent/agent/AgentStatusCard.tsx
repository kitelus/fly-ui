import { forwardRef, type ReactNode, type CSSProperties, type ComponentPropsWithoutRef } from "react";
import { buildKiteThemeStyle, mergeKiteTheme, type KiteTheme } from "../../kite/theme";
import { useFlyUITheme } from "../../kite/theme";
import "../agent.css";

export type AgentStatus = "idle" | "running" | "thinking" | "acting" | "completed" | "error";

/**
 * Visual style of the card.
 *
 * - `"tinted"`  — subtle background tint derived from `color` (default)
 * - `"flat"`    — plain white/background card, no tint
 * - `"outline"` — transparent background, coloured border only
 */
export type AgentStatusCardVariant = "tinted" | "flat" | "outline";

export interface AgentStatusCardProps extends ComponentPropsWithoutRef<"div"> {
  name: string;
  status: AgentStatus;
  model?: string;
  description?: string;
  inputTokens?: number;
  outputTokens?: number;
  /** Show/hide the token usage display. @default true */
  showTokens?: boolean;
  errorMessage?: string;
  onStop?: () => void;
  onRetry?: () => void;
  onReset?: () => void;
  /** Label overrides for action buttons. */
  actionLabels?: {
    stop?: ReactNode;
    retry?: ReactNode;
    reset?: ReactNode;
  };
  /** Extra action buttons rendered alongside the built-in ones. */
  extraActions?: Array<{ label: ReactNode; onClick: () => void; variant?: "primary" | "danger" | "default"; ariaLabel?: string }>;
  /**
   * Accent colour for the card — overrides the automatic status colour.
   * Accepts any CSS colour string: `"#f97316"`, `"oklch(70% 0.2 30)"`, etc.
   * When omitted the card uses the matching status colour from the theme.
   */
  color?: string;
  /**
   * Visual weight of the card background.
   * - `"tinted"`  — subtle tint of `color` (default)
   * - `"flat"`    — solid background, no tint
   * - `"outline"` — no background, coloured border
   */
  variant?: AgentStatusCardVariant;
  /** Custom icon/badge shown next to the agent name. */
  icon?: ReactNode;
  /** Custom aria-label override for the card. */
  cardAriaLabel?: string;
  /** Render anything below the header — progress bars, step timelines, custom metrics, etc. */
  children?: ReactNode;
  /** Slot rendered between description/tokens and error message. */
  metaSlot?: ReactNode;
  theme?: KiteTheme;
}

function IconAlert() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/>
      <line x1="12" y1="9" x2="12" y2="13"/>
      <line x1="12" y1="17" x2="12.01" y2="17"/>
    </svg>
  );
}

/** Map status → the CSS var that holds its colour */
const STATUS_COLOR_VAR: Record<AgentStatus, string> = {
  idle:      "var(--kite-border)",
  running:   "var(--kite-primary)",
  thinking:  "var(--kite-primary)",
  acting:    "var(--kite-primary-active)",
  completed: "var(--kite-success)",
  error:     "var(--kite-danger)",
};

export const AgentStatusCard = forwardRef<HTMLDivElement, AgentStatusCardProps>(
  function AgentStatusCard(
    {
      name,
      status,
      model,
      description,
      inputTokens,
      outputTokens,
      showTokens = true,
      errorMessage,
      onStop,
      onRetry,
      onReset,
      actionLabels,
      extraActions,
      color,
      variant = "tinted",
      icon,
      cardAriaLabel,
      children,
      metaSlot,
      theme,
      style,
      ...rest
    },
    ref,
  ) {
    const contextTheme = useFlyUITheme();
    const themeStyle = buildKiteThemeStyle(mergeKiteTheme(contextTheme, theme));

    const hasTokens  = showTokens && (inputTokens !== undefined || outputTokens !== undefined);
    const hasActions =
      (onStop && status === "running") ||
      (onRetry && status === "error") ||
      !!onReset ||
      (extraActions && extraActions.length > 0);

    const accent = color ?? STATUS_COLOR_VAR[status];

    const variantStyle: CSSProperties =
      variant === "flat"
        ? {
            background: "var(--kite-background)",
            borderColor: `color-mix(in srgb, ${accent} 30%, var(--kite-border))`,
          }
        : variant === "outline"
        ? {
            background: "transparent",
            borderColor: `color-mix(in srgb, ${accent} 55%, var(--kite-border))`,
            boxShadow: "none",
          }
        : /* tinted */ {
            background: `color-mix(in srgb, ${accent} 6%, var(--kite-background))`,
            borderColor: `color-mix(in srgb, ${accent} 22%, var(--kite-border))`,
          };

    return (
      <div
        ref={ref}
        className="kite-flyui-host kite-flyui-agentStatusCard"
        style={{ ...themeStyle, ...variantStyle, ...style } as CSSProperties}
        aria-label={cardAriaLabel ?? `Agent ${name}, status: ${status}`}
        {...rest}
      >
        {/* ── Header ── */}
        <div className="kite-flyui-agentStatusCard__header">
          <div className="kite-flyui-agentStatusCard__titleGroup">
            {icon && <span className="kite-flyui-agentStatusCard__icon" aria-hidden="true">{icon}</span>}
            <span className="kite-flyui-agentStatusCard__name">{name}</span>
            {model && <span className="kite-flyui-agentStatusCard__model">{model}</span>}
          </div>
          <span
            className={`kite-flyui-agentBadge kite-flyui-agentBadge--${status}`}
            style={color ? {
              background: `color-mix(in srgb, ${color} 14%, transparent)`,
              color: color,
              borderColor: `color-mix(in srgb, ${color} 40%, transparent)`,
            } : undefined}
          >
            <span className={`kite-flyui-agentDot kite-flyui-agentDot--${status}`} style={color ? { background: color } : undefined} aria-hidden="true" />
            {status}
          </span>
        </div>

        {/* ── Description + tokens inline ── */}
        {(description || hasTokens) && (
          <div className="kite-flyui-agentStatusCard__meta">
            {description && <span className="kite-flyui-agentStatusCard__desc">{description}</span>}
            {hasTokens && (
              <span className="kite-flyui-agentStatusCard__tokens">
                {inputTokens  !== undefined && <span>{inputTokens.toLocaleString()} in</span>}
                {outputTokens !== undefined && <span>{outputTokens.toLocaleString()} out</span>}
              </span>
            )}
          </div>
        )}

        {metaSlot}

        {/* ── Error banner ── */}
        {errorMessage && (
          <div className="kite-flyui-agentStatusCard__error" role="alert">
            <span className="kite-flyui-agentStatusCard__errorIcon"><IconAlert /></span>
            <span className="kite-flyui-agentStatusCard__errorMsg">{errorMessage}</span>
          </div>
        )}

        {/* ── Custom content slot ── */}
        {children}

        {/* ── Built-in + extra actions ── */}
        {hasActions && (
          <div className="kite-flyui-agentStatusCard__actions">
            {onStop  && status === "running" && (
              <button className="kite-flyui-agentBtn kite-flyui-agentBtn--danger"  onClick={onStop}  type="button">
                {actionLabels?.stop ?? "Stop"}
              </button>
            )}
            {onRetry && status === "error"   && (
              <button className="kite-flyui-agentBtn kite-flyui-agentBtn--primary" onClick={onRetry} type="button">
                {actionLabels?.retry ?? "Retry"}
              </button>
            )}
            {onReset && (
              <button className="kite-flyui-agentBtn" onClick={onReset} type="button">
                {actionLabels?.reset ?? "Reset"}
              </button>
            )}
            {extraActions?.map((action, i) => (
              <button
                key={i}
                className={`kite-flyui-agentBtn${action.variant === "primary" ? " kite-flyui-agentBtn--primary" : action.variant === "danger" ? " kite-flyui-agentBtn--danger" : ""}`}
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
