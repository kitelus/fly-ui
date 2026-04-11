import { forwardRef, useState, type CSSProperties, type ComponentPropsWithoutRef, type ReactNode } from "react";
import { buildKiteThemeStyle, mergeKiteTheme, type KiteTheme } from "../../kite/theme";
import { useFlyUITheme } from "../../kite/theme";
import "../agent.css";

export interface ContentVariant {
  id: string;
  label: string;
  content: string;
  score?: number;
  tags?: string[];
  /** Extra metadata string shown below the variant label. */
  meta?: string;
}

export interface VariantComparisonProps extends Omit<ComponentPropsWithoutRef<"div">, "onSelect" | "onCopy"> {
  variants: ContentVariant[];
  selectedId?: string;
  onSelect?: (id: string, variant: ContentVariant) => void;
  onCopy?: (content: string, id: string, variant: ContentVariant) => void;
  /** Called when the score badge is clicked for a variant. */
  onScoreClick?: (id: string, variant: ContentVariant) => void;
  /** Override the "Select" button label. @default "Select" */
  selectLabel?: ReactNode;
  /** Override the "Selected" button label. @default "Selected" */
  selectedLabel?: ReactNode;
  /** Override the "Copy" button label. @default "Copy" */
  copyLabel?: ReactNode;
  /** Label shown briefly after copying. @default "Copied!" — set null to disable */
  copyFeedbackLabel?: ReactNode | null;
  /** Duration in ms for the copy feedback. @default 1500 */
  copyFeedbackDuration?: number;
  /** Render the content of a variant with custom formatting. */
  renderContent?: (variant: ContentVariant, isSelected: boolean) => ReactNode;
  /** Slot rendered in each card footer alongside Select/Copy. */
  cardFooterSlot?: (variant: ContentVariant) => ReactNode;
  /** Text shown when there are no variants. */
  emptyText?: string;
  /** Render a custom empty state. */
  renderEmpty?: () => ReactNode;
  theme?: KiteTheme;
}

export const VariantComparison = forwardRef<HTMLDivElement, VariantComparisonProps>(
  function VariantComparison(
    {
      variants,
      selectedId,
      onSelect,
      onCopy,
      onScoreClick,
      selectLabel = "Select",
      selectedLabel = "Selected",
      copyLabel = "Copy",
      copyFeedbackLabel = "Copied!",
      copyFeedbackDuration = 1500,
      renderContent,
      cardFooterSlot,
      emptyText,
      renderEmpty,
      theme,
      style,
      ...rest
    },
    ref,
  ) {
    const contextTheme = useFlyUITheme();
    const themeStyle = buildKiteThemeStyle(mergeKiteTheme(contextTheme, theme));
    const [copiedId, setCopiedId] = useState<string | null>(null);

    const handleCopy = (variant: ContentVariant) => {
      onCopy?.(variant.content, variant.id, variant);
      if (copyFeedbackLabel !== null) {
        setCopiedId(variant.id);
        setTimeout(() => setCopiedId((prev) => (prev === variant.id ? null : prev)), copyFeedbackDuration);
      }
    };

    return (
      <div
        ref={ref}
        className="kite-flyui-host kite-flyui-variantComparison"
        style={{ ...themeStyle, ...style } as CSSProperties}
        {...rest}
      >
        {variants.length === 0 ? (
          renderEmpty
            ? renderEmpty()
            : emptyText
              ? <div className="kite-flyui-agentMemory__empty">{emptyText}</div>
              : null
        ) : (
          <div className="kite-flyui-variantComparison__grid">
            {variants.map((variant) => {
              const isSelected = selectedId === variant.id;
              return (
                <div
                  key={variant.id}
                  className={`kite-flyui-variantComparison__item${isSelected ? " kite-flyui-variantComparison__item--selected" : ""}`}
                >
                  <div className="kite-flyui-variantComparison__itemHeader">
                    <span className="kite-flyui-variantComparison__varLabel">{variant.label}</span>
                    {variant.score !== undefined && (
                      <span
                        className={`kite-flyui-variantComparison__score${onScoreClick ? " kite-flyui-variantComparison__score--clickable" : ""}`}
                        onClick={onScoreClick ? () => onScoreClick(variant.id, variant) : undefined}
                        role={onScoreClick ? "button" : undefined}
                        tabIndex={onScoreClick ? 0 : undefined}
                        onKeyDown={onScoreClick ? (e) => {
                          if (e.key === "Enter" || e.key === " ") { e.preventDefault(); onScoreClick(variant.id, variant); }
                        } : undefined}
                      >
                        {variant.score}/100
                      </span>
                    )}
                  </div>
                  {variant.meta && (
                    <div className="kite-flyui-variantComparison__meta">{variant.meta}</div>
                  )}
                  {variant.tags && variant.tags.length > 0 && (
                    <div className="kite-flyui-variantComparison__tags">
                      {variant.tags.map((tag) => (
                        <span key={tag} className="kite-flyui-workflowTemplate__tag">{tag}</span>
                      ))}
                    </div>
                  )}
                  <div className="kite-flyui-variantComparison__body">
                    {renderContent ? renderContent(variant, isSelected) : variant.content}
                  </div>
                  <div className="kite-flyui-variantComparison__footer">
                    {cardFooterSlot?.(variant)}
                    {onSelect && (
                      <button
                        className={`kite-flyui-agentBtn${isSelected ? " kite-flyui-agentBtn--primary" : ""}`}
                        onClick={() => onSelect(variant.id, variant)}
                        type="button"
                        aria-pressed={isSelected}
                      >
                        {isSelected ? selectedLabel : selectLabel}
                      </button>
                    )}
                    {onCopy && (
                      <button
                        className="kite-flyui-agentBtn"
                        onClick={() => handleCopy(variant)}
                        type="button"
                      >
                        {copiedId === variant.id && copyFeedbackLabel !== null ? copyFeedbackLabel : copyLabel}
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    );
  },
);
