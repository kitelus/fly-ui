import { forwardRef, useState, useEffect, type CSSProperties, type ComponentPropsWithoutRef, type ReactNode } from "react";
import { buildKiteThemeStyle, mergeKiteTheme, type KiteTheme } from "../../kite/theme";
import { useFlyUITheme } from "../../kite/theme";
import "../agent.css";

export type DiffMode = "unified" | "split";

export interface DiffLine {
  type: "added" | "removed" | "unchanged";
  content: string;
  lineNumber?: number;
}

export interface DiffViewerProps extends Omit<ComponentPropsWithoutRef<"div">, "onCopy" | "title"> {
  before?: string;
  after?: string;
  lines?: DiffLine[];
  beforeLabel?: string;
  afterLabel?: string;
  mode?: DiffMode;
  onModeChange?: (mode: DiffMode) => void;
  /** Override the title shown in the toolbar. @default "Diff" */
  title?: ReactNode;
  /** Whether to show line numbers. @default true when lineNumber is present on lines */
  showLineNumbers?: boolean;
  /** Called when the copy button is clicked. */
  onCopy?: (content: string) => void;
  /** Label for the copy button. @default "Copy" */
  copyLabel?: ReactNode;
  /** Label shown briefly after copying. @default "Copied!" — set null to disable feedback */
  copyFeedbackLabel?: ReactNode | null;
  /** Duration in ms for the copy feedback. @default 1500 */
  copyFeedbackDuration?: number;
  /** Slot rendered in the toolbar alongside mode buttons. */
  toolbarSlot?: ReactNode;
  /** Override mode button labels. */
  modeLabels?: { unified?: string; split?: string };
  theme?: KiteTheme;
}

function parseSimpleDiff(before: string, after: string): DiffLine[] {
  const beforeLines = before.split("\n");
  const afterLines = after.split("\n");
  const result: DiffLine[] = [];
  const maxLen = Math.max(beforeLines.length, afterLines.length);
  for (let i = 0; i < maxLen; i++) {
    const b = beforeLines[i];
    const a = afterLines[i];
    if (b !== undefined && b === a) {
      result.push({ type: "unchanged", content: b, lineNumber: i + 1 });
    } else {
      if (b !== undefined) result.push({ type: "removed", content: b, lineNumber: i + 1 });
      if (a !== undefined) result.push({ type: "added", content: a, lineNumber: i + 1 });
    }
  }
  return result;
}

export const DiffViewer = forwardRef<HTMLDivElement, DiffViewerProps>(
  function DiffViewer(
    {
      before,
      after,
      lines,
      beforeLabel = "Before",
      afterLabel = "After",
      mode = "unified",
      onModeChange,
      title = "Diff",
      showLineNumbers,
      onCopy,
      copyLabel = "Copy",
      copyFeedbackLabel = "Copied!",
      copyFeedbackDuration = 1500,
      toolbarSlot,
      modeLabels,
      theme,
      style,
      ...rest
    },
    ref,
  ) {
    const contextTheme = useFlyUITheme();
    const themeStyle = buildKiteThemeStyle(mergeKiteTheme(contextTheme, theme));
    const [activeMode, setActiveMode] = useState<DiffMode>(mode);
    const [copied, setCopied] = useState(false);

    useEffect(() => { setActiveMode(mode); }, [mode]);

    const diffLines =
      lines ?? (before !== undefined && after !== undefined ? parseSimpleDiff(before, after) : []);

    const handleMode = (m: DiffMode) => {
      setActiveMode(m);
      onModeChange?.(m);
    };

    const handleCopy = () => {
      const content = diffLines.map((l) => l.content).join("\n");
      onCopy?.(content);
      if (copyFeedbackLabel !== null) {
        setCopied(true);
        setTimeout(() => setCopied(false), copyFeedbackDuration);
      }
    };

    const shouldShowLineNums = showLineNumbers ?? diffLines.some((l) => l.lineNumber !== undefined);

    const modeLabelMap = { unified: "Unified", split: "Split", ...modeLabels };

    const renderLines = (filter?: "removed" | "added") =>
      diffLines
        .filter((l) => !filter || l.type === filter || l.type === "unchanged")
        .map((line, i) => (
          <div key={i} className={`kite-flyui-diffViewer__line kite-flyui-diffViewer__line--${line.type}`}>
            {shouldShowLineNums && (
              <span className="kite-flyui-diffViewer__lineNum">
                {line.lineNumber !== undefined ? line.lineNumber : ""}
              </span>
            )}
            <span className="kite-flyui-diffViewer__lineContent">{line.content}</span>
          </div>
        ));

    return (
      <div
        ref={ref}
        className="kite-flyui-host kite-flyui-agentCard kite-flyui-diffViewer"
        style={{ ...themeStyle, ...style } as CSSProperties}
        {...rest}
      >
        <div className="kite-flyui-diffViewer__toolbar">
          <span className="kite-flyui-diffViewer__title">{title}</span>
          <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
            {toolbarSlot}
            {onCopy && (
              <button
                type="button"
                className="kite-flyui-agentBtn"
                onClick={handleCopy}
                aria-label="Copy diff"
              >
                {copied && copyFeedbackLabel !== null ? copyFeedbackLabel : copyLabel}
              </button>
            )}
            <div className="kite-flyui-diffViewer__modes" role="group" aria-label="Diff view mode">
              {(["unified", "split"] as DiffMode[]).map((m) => (
                <button
                  key={m}
                  className={`kite-flyui-diffViewer__modeBtn${activeMode === m ? " kite-flyui-diffViewer__modeBtn--active" : ""}`}
                  onClick={() => handleMode(m)}
                  type="button"
                  aria-pressed={activeMode === m}
                >
                  {modeLabelMap[m]}
                </button>
              ))}
            </div>
          </div>
        </div>
        <div className="kite-flyui-diffViewer__container">
          {activeMode === "split" ? (
            <div className="kite-flyui-diffViewer__side">
              <div className="kite-flyui-diffViewer__pane">
                <div className="kite-flyui-diffViewer__paneHeader">{beforeLabel}</div>
                <div className="kite-flyui-diffViewer__lines">{renderLines("removed")}</div>
              </div>
              <div className="kite-flyui-diffViewer__pane">
                <div className="kite-flyui-diffViewer__paneHeader">{afterLabel}</div>
                <div className="kite-flyui-diffViewer__lines">{renderLines("added")}</div>
              </div>
            </div>
          ) : (
            <div className="kite-flyui-diffViewer__lines">{renderLines()}</div>
          )}
        </div>
      </div>
    );
  },
);
