import { forwardRef, type CSSProperties, type ComponentPropsWithoutRef } from "react";
import { buildKiteThemeStyle, mergeKiteTheme, type KiteTheme } from "../../kite/theme";
import { useFlyUITheme } from "../../kite/theme";
import "../agent.css";

export interface Suggestion {
  id: string;
  label: string;
  icon?: string;
}

export interface SuggestionPillsProps extends Omit<ComponentPropsWithoutRef<"div">, "onSelect"> {
  suggestions: Suggestion[];
  onSelect?: (suggestion: Suggestion) => void;
  disabled?: boolean;
  layout?: "row" | "column";
  theme?: KiteTheme;
}

export const SuggestionPills = forwardRef<HTMLDivElement, SuggestionPillsProps>(
  function SuggestionPills(
    {
      suggestions,
      onSelect,
      disabled = false,
      layout = "row",
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
        className={`kite-flyui-host kite-flyui-suggestionPills${layout === "column" ? " kite-flyui-suggestionPills--column" : ""}`}
        style={{ ...themeStyle, ...style } as CSSProperties}
        role="group"
        aria-label="Suggestions"
        {...rest}
      >
        {suggestions.map((s) => (
          <button
            key={s.id}
            className="kite-flyui-suggestionPills__pill"
            onClick={() => onSelect?.(s)}
            disabled={disabled}
            type="button"
          >
            {s.icon && <span aria-hidden="true">{s.icon}</span>}
            {s.label}
          </button>
        ))}
      </div>
    );
  },
);
