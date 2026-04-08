import { forwardRef, type CSSProperties, type ComponentPropsWithoutRef, type ReactNode } from "react";
import { buildKiteThemeStyle, mergeKiteTheme, type KiteTheme } from "../../kite/theme";
import { useFlyUITheme } from "../../kite/theme";
import "../agent.css";

export type WorkflowComplexity = "simple" | "medium" | "complex";

export interface WorkflowTemplateCardProps extends ComponentPropsWithoutRef<"div"> {
  name: string;
  description?: string;
  tags?: string[];
  complexity?: WorkflowComplexity;
  /** Override the complexity label. */
  complexityLabel?: string;
  stepCount?: number;
  author?: string;
  /** Badge label (e.g., "New", "Popular"). */
  badge?: ReactNode;
  /** Estimated runtime string (e.g., "~2 min"). */
  estimatedRuntime?: string;
  onUse?: () => void;
  onPreview?: () => void;
  onFavorite?: () => void;
  isFavorited?: boolean;
  /** Override label for the "Use Template" button. @default "Use Template" */
  useLabel?: ReactNode;
  /** Override label for the "Preview" button. @default "Preview" */
  previewLabel?: ReactNode;
  /** Slot rendered inside the card footer alongside the action buttons. */
  footerSlot?: ReactNode;
  /** Slot rendered inside the card header (alongside name). */
  headerSlot?: ReactNode;
  theme?: KiteTheme;
}

export const WorkflowTemplateCard = forwardRef<HTMLDivElement, WorkflowTemplateCardProps>(
  function WorkflowTemplateCard(
    {
      name,
      description,
      tags,
      complexity,
      complexityLabel,
      stepCount,
      author,
      badge,
      estimatedRuntime,
      onUse,
      onPreview,
      onFavorite,
      isFavorited = false,
      useLabel = "Use Template",
      previewLabel = "Preview",
      footerSlot,
      headerSlot,
      theme,
      style,
      onClick,
      ...rest
    },
    ref,
  ) {
    const contextTheme = useFlyUITheme();
    const themeStyle = buildKiteThemeStyle(mergeKiteTheme(contextTheme, theme));

    return (
      <div
        ref={ref}
        className="kite-flyui-host kite-flyui-workflowTemplate"
        style={{ ...themeStyle, ...style } as CSSProperties}
        onClick={onClick}
        role={onClick ? "button" : undefined}
        tabIndex={onClick ? 0 : undefined}
        onKeyDown={onClick ? (e) => {
          if (e.key === "Enter" || e.key === " ") { e.preventDefault(); (e.currentTarget as HTMLDivElement).click(); }
        } : undefined}
        {...rest}
      >
        <div className="kite-flyui-workflowTemplate__header">
          <div style={{ display: "flex", alignItems: "center", gap: "8px", flex: 1, minWidth: 0 }}>
            <p className="kite-flyui-workflowTemplate__name">{name}</p>
            {badge && <span className="kite-flyui-agentBadge kite-flyui-agentBadge--running">{badge}</span>}
          </div>
          {headerSlot}
          {onFavorite && (
            <button
              type="button"
              className={`kite-flyui-agentBtn kite-flyui-workflowTemplate__favoriteBtn${isFavorited ? " kite-flyui-workflowTemplate__favoriteBtn--active" : ""}`}
              onClick={(e) => { e.stopPropagation(); onFavorite(); }}
              aria-label={isFavorited ? "Remove from favorites" : "Add to favorites"}
              aria-pressed={isFavorited}
            >
              {isFavorited ? "★" : "☆"}
            </button>
          )}
        </div>
        {description && <p className="kite-flyui-workflowTemplate__desc">{description}</p>}
        {tags && tags.length > 0 && (
          <div className="kite-flyui-workflowTemplate__tags">
            {tags.map((tag) => (
              <span key={tag} className="kite-flyui-workflowTemplate__tag">{tag}</span>
            ))}
          </div>
        )}
        <div className="kite-flyui-workflowTemplate__footer">
          <span className="kite-flyui-workflowTemplate__meta">
            {stepCount !== undefined && <span>{stepCount} steps{(author || estimatedRuntime) ? " · " : ""}</span>}
            {author && <span>{author}{estimatedRuntime ? " · " : ""}</span>}
            {estimatedRuntime && <span>{estimatedRuntime}</span>}
          </span>
          {complexity && (
            <span className={`kite-flyui-workflowTemplate__meta kite-flyui-workflowTemplate__complexity--${complexity}`}>
              {complexityLabel ?? complexity}
            </span>
          )}
        </div>
        {(onUse || onPreview || footerSlot) && (
          <div className="kite-flyui-agentActions">
            {footerSlot}
            {onPreview && (
              <button className="kite-flyui-agentBtn" onClick={(e) => { e.stopPropagation(); onPreview(); }} type="button">
                {previewLabel}
              </button>
            )}
            {onUse && (
              <button className="kite-flyui-agentBtn kite-flyui-agentBtn--primary" onClick={(e) => { e.stopPropagation(); onUse(); }} type="button">
                {useLabel}
              </button>
            )}
          </div>
        )}
      </div>
    );
  },
);
