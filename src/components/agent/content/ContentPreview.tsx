import { forwardRef, useState, type CSSProperties, type ComponentPropsWithoutRef, type ReactNode } from "react";
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
  onExport?: () => void;
  /** Override the label shown in the toolbar for the format. */
  formatLabel?: string;
  /** Custom slot in the toolbar right side (alongside Edit/Copy). */
  toolbarSlot?: ReactNode;
  /** Render the content with custom formatting (e.g. a markdown renderer). */
  renderContent?: (content: string, format: ContentFormat) => ReactNode;
  /** Label for the Edit button. @default "Edit" */
  editLabel?: ReactNode;
  /** Label for the Copy button. @default "Copy" */
  copyLabel?: ReactNode;
  /** Label shown briefly after copying. @default "Copied!" — set null to disable */
  copyFeedbackLabel?: ReactNode | null;
  /** Duration in ms for the copy feedback. @default 1500 */
  copyFeedbackDuration?: number;
  /** Label for the Export button. @default "Export" */
  exportLabel?: ReactNode;
  /** Override the quality score label. @default "Quality" */
  qualityLabel?: string;
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
      onExport,
      formatLabel,
      toolbarSlot,
      renderContent,
      editLabel = "Edit",
      copyLabel = "Copy",
      copyFeedbackLabel = "Copied!",
      copyFeedbackDuration = 1500,
      exportLabel = "Export",
      qualityLabel = "Quality",
      theme,
      style,
      ...rest
    },
    ref,
  ) {
    const contextTheme = useFlyUITheme();
    const themeStyle = buildKiteThemeStyle(mergeKiteTheme(contextTheme, theme));
    const [copied, setCopied] = useState(false);

    const handleCopy = () => {
      onCopy?.(content);
      if (copyFeedbackLabel !== null) {
        setCopied(true);
        setTimeout(() => setCopied(false), copyFeedbackDuration);
      }
    };

    return (
      <div
        ref={ref}
        className="kite-flyui-host kite-flyui-agentCard kite-flyui-contentPreview"
        style={{ ...themeStyle, ...style } as CSSProperties}
        {...rest}
      >
        <div className="kite-flyui-contentPreview__toolbar">
          {title && <p className="kite-flyui-contentPreview__title">{title}</p>}
          <div className="kite-flyui-contentPreview__toolbarRight">
            <span className="kite-flyui-contentPreview__format">{formatLabel ?? format}</span>
            {toolbarSlot}
            {onExport && (
              <button className="kite-flyui-agentBtn" onClick={onExport} type="button">{exportLabel}</button>
            )}
            {onEdit && (
              <button className="kite-flyui-agentBtn" onClick={onEdit} type="button">{editLabel}</button>
            )}
            {onCopy && (
              <button className="kite-flyui-agentBtn" onClick={handleCopy} type="button">
                {copied && copyFeedbackLabel !== null ? copyFeedbackLabel : copyLabel}
              </button>
            )}
          </div>
        </div>
        <div
          className="kite-flyui-contentPreview__body"
          aria-label="Content preview"
        >
          {renderContent ? renderContent(content, format) : content}
        </div>
        {(wordCount !== undefined || readingTimeMin !== undefined || qualityScore !== undefined) && (
          <div className="kite-flyui-contentPreview__score">
            {wordCount !== undefined && <span>{wordCount.toLocaleString()} words</span>}
            {readingTimeMin !== undefined && <span>· ~{readingTimeMin} min read</span>}
            {qualityScore !== undefined && (
              <span>
                · {qualityLabel}: <span className="kite-flyui-contentPreview__scoreBadge">{qualityScore}/100</span>
              </span>
            )}
          </div>
        )}
      </div>
    );
  },
);
