import { forwardRef, type CSSProperties, type ComponentPropsWithoutRef } from "react";
import { buildKiteThemeStyle, mergeKiteTheme, type KiteTheme } from "../../kite/theme";
import { useFlyUITheme } from "../../kite/theme";
import "../agent.css";

export type ContentFormat = "markdown" | "text" | "html";

export interface ContentPreviewProps extends Omit<ComponentPropsWithoutRef<"div">, "onCopy"> {
  content: string;
  format?: ContentFormat;
  title?: string;
  qualityScore?: number;
  wordCount?: number;
  readingTimeMin?: number;
  onCopy?: (content: string) => void;
  onEdit?: () => void;
  theme?: KiteTheme;
}

export const ContentPreview = forwardRef<HTMLDivElement, ContentPreviewProps>(
  function ContentPreview(
    {
      content,
      format = "text",
      title,
      qualityScore,
      wordCount,
      readingTimeMin,
      onCopy,
      onEdit,
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
        className="kite-flyui-host kite-flyui-agentCard kite-flyui-contentPreview"
        style={{ ...themeStyle, ...style } as CSSProperties}
        {...rest}
      >
        <div className="kite-flyui-contentPreview__toolbar">
          {title && <p className="kite-flyui-contentPreview__title">{title}</p>}
          <div style={{ display: "flex", gap: 6, alignItems: "center" }}>
            <span style={{ fontSize: 11, color: "var(--kite-muted)" }}>{format}</span>
            {onEdit && (
              <button className="kite-flyui-agentBtn" onClick={onEdit} type="button">Edit</button>
            )}
            {onCopy && (
              <button className="kite-flyui-agentBtn" onClick={() => onCopy(content)} type="button">Copy</button>
            )}
          </div>
        </div>
        <div
          className="kite-flyui-contentPreview__body"
          aria-label="Content preview"
        >
          {content}
        </div>
        <div className="kite-flyui-contentPreview__score">
          {wordCount !== undefined && <span>{wordCount.toLocaleString()} words</span>}
          {readingTimeMin !== undefined && <span>· ~{readingTimeMin} min read</span>}
          {qualityScore !== undefined && (
            <span>
              · Quality: <span className="kite-flyui-contentPreview__scoreBadge">{qualityScore}/100</span>
            </span>
          )}
        </div>
      </div>
    );
  },
);
