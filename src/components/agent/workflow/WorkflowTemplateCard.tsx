import { forwardRef, type CSSProperties, type ComponentPropsWithoutRef } from "react";
import { buildKiteThemeStyle, mergeKiteTheme, type KiteTheme } from "../../kite/theme";
import { useFlyUITheme } from "../../kite/theme";
import "../agent.css";

export type WorkflowComplexity = "simple" | "medium" | "complex";

export interface WorkflowTemplateCardProps extends ComponentPropsWithoutRef<"div"> {
  name: string;
  description?: string;
  tags?: string[];
  complexity?: WorkflowComplexity;
  stepCount?: number;
  author?: string;
  onUse?: () => void;
  onPreview?: () => void;
  theme?: KiteTheme;
}

export const WorkflowTemplateCard = forwardRef<HTMLDivElement, WorkflowTemplateCardProps>(
  function WorkflowTemplateCard(
    {
      name,
      description,
      tags,
      complexity,
      stepCount,
      author,
      onUse,
      onPreview,
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
        {...rest}
      >
        <p className="kite-flyui-workflowTemplate__name">{name}</p>
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
            {stepCount !== undefined && <span>{stepCount} steps{author ? " · " : ""}</span>}
            {author && <span>{author}</span>}
          </span>
          {complexity && (
            <span className={`kite-flyui-workflowTemplate__meta kite-flyui-workflowTemplate__complexity--${complexity}`}>
              {complexity}
            </span>
          )}
        </div>
        {(onUse || onPreview) && (
          <div className="kite-flyui-agentActions">
            {onPreview && (
              <button className="kite-flyui-agentBtn" onClick={onPreview} type="button">
                Preview
              </button>
            )}
            {onUse && (
              <button className="kite-flyui-agentBtn kite-flyui-agentBtn--primary" onClick={onUse} type="button">
                Use Template
              </button>
            )}
          </div>
        )}
      </div>
    );
  },
);
