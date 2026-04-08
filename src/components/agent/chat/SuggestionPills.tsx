import { forwardRef, type CSSProperties, type ComponentPropsWithoutRef, type ReactNode } from "react";
import { buildKiteThemeStyle, mergeKiteTheme, type KiteTheme } from "../../kite/theme";
import { useFlyUITheme } from "../../kite/theme";
import "../agent.css";

export interface Suggestion {
  id: string;
  label: string;
  /** Emoji, text, or any ReactNode shown before the label. */
  icon?: ReactNode;
  /** Optional description shown as tooltip. */
  description?: string;
  /** Disable just this suggestion. */
  disabled?: boolean;
  /** Custom CSS class to apply to this pill. */
  className?: string;
}

export interface SuggestionPillsProps extends Omit<ComponentPropsWithoutRef<"div">, "onSelect"> {
  suggestions: Suggestion[];
  onSelect?: (suggestion: Suggestion) => void;
  /** Disable all pills. */
  disabled?: boolean;
  layout?: "row" | "column" | "grid";
  /** Max number of suggestions to render. Surplus are hidden silently. */
  maxVisible?: number;
  /** Accessible label for the group. @default "Suggestions" */
  ariaLabel?: string;
  /** Where the icon is placed relative to the label. @default "start" */
  iconPosition?: "start" | "end";
  /** Show a loading skeleton instead of pills. */
  loading?: boolean;
  /** Number of skeleton pills to render when loading. @default 4 */
  loadingCount?: number;
  /** Render a fully custom pill. */
  renderPill?: (suggestion: Suggestion, onClick: () => void, isDisabled: boolean) => ReactNode;
  theme?: KiteTheme;
}

export const SuggestionPills = forwardRef<HTMLDivElement, SuggestionPillsProps>(
  function SuggestionPills(
    {
      suggestions,
      onSelect,
      disabled = false,
      layout = "row",
      maxVisible,
      ariaLabel = "Suggestions",
      iconPosition = "start",
      loading = false,
      loadingCount = 4,
      renderPill,
      theme,
      style,
      ...rest
    },
    ref,
  ) {
    const contextTheme = useFlyUITheme();
    const themeStyle = buildKiteThemeStyle(mergeKiteTheme(contextTheme, theme));

    const visible = maxVisible != null ? suggestions.slice(0, maxVisible) : suggestions;

    if (loading) {
      return (
        <div
          ref={ref}
          className={[
            "kite-flyui-host",
            "kite-flyui-suggestionPills",
            layout === "column" ? "kite-flyui-suggestionPills--column" : "",
            layout === "grid"   ? "kite-flyui-suggestionPills--grid"   : "",
          ].filter(Boolean).join(" ")}
          style={{ ...themeStyle, ...style } as CSSProperties}
          role="group"
          aria-label={ariaLabel}
          aria-busy="true"
          {...rest}
        >
          {Array.from({ length: loadingCount }).map((_, i) => (
            <div key={i} className="kite-flyui-suggestionPills__pill kite-flyui-suggestionPills__pill--skeleton" aria-hidden="true" />
          ))}
        </div>
      );
    }

    return (
      <div
        ref={ref}
        className={[
          "kite-flyui-host",
          "kite-flyui-suggestionPills",
          layout === "column" ? "kite-flyui-suggestionPills--column" : "",
          layout === "grid"   ? "kite-flyui-suggestionPills--grid"   : "",
        ].filter(Boolean).join(" ")}
        style={{ ...themeStyle, ...style } as CSSProperties}
        role="group"
        aria-label={ariaLabel}
        {...rest}
      >
        {visible.map((s) => {
          const isDisabled = disabled || !!s.disabled;
          const handleClick = () => !isDisabled && onSelect?.(s);

          if (renderPill) {
            return <div key={s.id}>{renderPill(s, handleClick, isDisabled)}</div>;
          }

          const iconNode = s.icon != null && <span aria-hidden="true">{s.icon}</span>;

          return (
            <button
              key={s.id}
              className={["kite-flyui-suggestionPills__pill", s.className].filter(Boolean).join(" ")}
              onClick={handleClick}
              disabled={isDisabled}
              type="button"
              title={s.description}
              aria-label={s.description ? `${s.label}: ${s.description}` : undefined}
            >
              {iconPosition === "start" && iconNode}
              {s.label}
              {iconPosition === "end" && iconNode}
            </button>
          );
        })}
      </div>
    );
  },
);
