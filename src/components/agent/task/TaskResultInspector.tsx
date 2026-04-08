import { forwardRef, useState, type CSSProperties, type ComponentPropsWithoutRef, type ReactNode } from "react";
import { buildKiteThemeStyle, mergeKiteTheme, type KiteTheme } from "../../kite/theme";
import { useFlyUITheme } from "../../kite/theme";
import "../agent.css";

export type ResultFormat = "json" | "text" | "markdown";

export interface TaskResultInspectorProps extends Omit<ComponentPropsWithoutRef<"div">, "onCopy"> {
  result: unknown;
  format?: ResultFormat;
  onFormatChange?: (format: ResultFormat) => void;
  onCopy?: (content: string) => void;
  onDownload?: (content: string) => void;
  tokenCount?: number;
  durationMs?: number;
  /** Override labels for format toggle buttons. */
  formatLabels?: Partial<Record<ResultFormat, string>>;
  /** Additional format options beyond the built-in three. */
  extraFormats?: Array<{ id: string; label: string; render: (result: unknown) => string }>;
  /** Render the output using a custom renderer (e.g. markdown renderer). */
  renderOutput?: (content: string, format: ResultFormat | string) => ReactNode;
  /** Slot rendered in the toolbar alongside Copy/Download. */
  toolbarSlot?: ReactNode;
  theme?: KiteTheme;
}

export const TaskResultInspector = forwardRef<HTMLDivElement, TaskResultInspectorProps>(
  function TaskResultInspector(
    {
      result,
      format = "json",
      onFormatChange,
      onCopy,
      onDownload,
      tokenCount,
      durationMs,
      formatLabels,
      extraFormats,
      renderOutput,
      toolbarSlot,
      theme,
      style,
      ...rest
    },
    ref,
  ) {
    const contextTheme = useFlyUITheme();
    const themeStyle = buildKiteThemeStyle(mergeKiteTheme(contextTheme, theme));
    const [activeFormat, setActiveFormat] = useState<string>(format);

    const handleFormat = (f: string) => {
      setActiveFormat(f);
      if (["json", "text", "markdown"].includes(f)) {
        onFormatChange?.(f as ResultFormat);
      }
    };

    const serialize = (f: string): string => {
      const extra = extraFormats?.find((ef) => ef.id === f);
      if (extra) return extra.render(result);
      if (f === "json") return JSON.stringify(result, null, 2);
      return typeof result === "string" ? result : JSON.stringify(result, null, 2);
    };

    const serialized = serialize(activeFormat);

    const builtInFormats: ResultFormat[] = ["json", "text", "markdown"];

    return (
      <div
        ref={ref}
        className="kite-flyui-host kite-flyui-agentCard kite-flyui-taskResult"
        style={{ ...themeStyle, ...style } as CSSProperties}
        {...rest}
      >
        <div className="kite-flyui-taskResult__toolbar">
          <div className="kite-flyui-taskResult__format" role="group" aria-label="Result format">
            {builtInFormats.map((f) => (
              <button
                key={f}
                className={`kite-flyui-taskResult__formatBtn${activeFormat === f ? " kite-flyui-taskResult__formatBtn--active" : ""}`}
                onClick={() => handleFormat(f)}
                type="button"
                aria-pressed={activeFormat === f}
              >
                {formatLabels?.[f] ?? f.toUpperCase()}
              </button>
            ))}
            {extraFormats?.map((ef) => (
              <button
                key={ef.id}
                className={`kite-flyui-taskResult__formatBtn${activeFormat === ef.id ? " kite-flyui-taskResult__formatBtn--active" : ""}`}
                onClick={() => handleFormat(ef.id)}
                type="button"
                aria-pressed={activeFormat === ef.id}
              >
                {ef.label}
              </button>
            ))}
          </div>
          <div className="kite-flyui-taskResult__actions">
            {toolbarSlot}
            {onCopy && (
              <button className="kite-flyui-agentBtn" onClick={() => onCopy(serialized)} type="button">
                Copy
              </button>
            )}
            {onDownload && (
              <button className="kite-flyui-agentBtn" onClick={() => onDownload(serialized)} type="button">
                Download
              </button>
            )}
          </div>
        </div>
        {renderOutput ? (
          <div className="kite-flyui-taskResult__output kite-flyui-taskResult__output--text">
            {renderOutput(serialized, activeFormat)}
          </div>
        ) : (
          <pre className={`kite-flyui-taskResult__output${activeFormat !== "json" ? " kite-flyui-taskResult__output--text" : ""}`}>
            {serialized}
          </pre>
        )}
        {(tokenCount !== undefined || durationMs !== undefined) && (
          <div className="kite-flyui-taskResult__meta">
            {tokenCount !== undefined && <span>{tokenCount.toLocaleString()} tokens</span>}
            {durationMs !== undefined && <span>{durationMs.toLocaleString()}ms</span>}
          </div>
        )}
      </div>
    );
  },
);
