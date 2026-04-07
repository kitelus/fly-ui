import { forwardRef, type CSSProperties, type ComponentPropsWithoutRef } from "react";
import { buildKiteThemeStyle, mergeKiteTheme, type KiteTheme } from "../../kite/theme";
import { useFlyUITheme } from "../../kite/theme";
import "../agent.css";

export interface ContentVariant {
  id: string;
  label: string;
  content: string;
  score?: number;
  tags?: string[];
}

export interface VariantComparisonProps extends Omit<ComponentPropsWithoutRef<"div">, "onSelect" | "onCopy"> {
  variants: ContentVariant[];
  selectedId?: string;
  onSelect?: (id: string) => void;
  onCopy?: (content: string) => void;
  theme?: KiteTheme;
}

export const VariantComparison = forwardRef<HTMLDivElement, VariantComparisonProps>(
  function VariantComparison(
    { variants, selectedId, onSelect, onCopy, theme, style, ...rest },
    ref,
  ) {
    const contextTheme = useFlyUITheme();
    const themeStyle = buildKiteThemeStyle(mergeKiteTheme(contextTheme, theme));

    return (
      <div
        ref={ref}
        className="kite-flyui-host kite-flyui-variantComparison"
        style={{ ...themeStyle, ...style } as CSSProperties}
        {...rest}
      >
        <div className="kite-flyui-variantComparison__grid">
          {variants.map((variant) => (
            <div
              key={variant.id}
              className={`kite-flyui-variantComparison__item${selectedId === variant.id ? " kite-flyui-variantComparison__item--selected" : ""}`}
            >
              <div className="kite-flyui-variantComparison__itemHeader">
                <span className="kite-flyui-variantComparison__varLabel">{variant.label}</span>
                {variant.score !== undefined && (
                  <span className="kite-flyui-variantComparison__score">{variant.score}/100</span>
                )}
              </div>
              <div className="kite-flyui-variantComparison__body">{variant.content}</div>
              <div className="kite-flyui-variantComparison__footer">
                {onSelect && (
                  <button
                    className={`kite-flyui-agentBtn${selectedId === variant.id ? " kite-flyui-agentBtn--primary" : ""}`}
                    onClick={() => onSelect(variant.id)}
                    type="button"
                    aria-pressed={selectedId === variant.id}
                  >
                    {selectedId === variant.id ? "Selected" : "Select"}
                  </button>
                )}
                {onCopy && (
                  <button
                    className="kite-flyui-agentBtn"
                    onClick={() => onCopy(variant.content)}
                    type="button"
                  >
                    Copy
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  },
);
