import { forwardRef, useState, type CSSProperties, type ComponentPropsWithoutRef } from "react";
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
      theme,
      style,
      ...rest
    },
    ref,
  ) {
    const contextTheme = useFlyUITheme();
    const themeStyle = buildKiteThemeStyle(mergeKiteTheme(contextTheme, theme));
    const [activeFormat, setActiveFormat] = useState<ResultFormat>(format);

    const handleFormat = (f: ResultFormat) => {
      setActiveFormat(f);
      onFormatChange?.(f);
    };

    const serialized =
      activeFormat === "json"
        ? JSON.stringify(result, null, 2)
        : typeof result === "string"
          ? result
          : JSON.stringify(result, null, 2);

    return (
      <div
        ref={ref}
        className="kite-flyui-host kite-flyui-agentCard kite-flyui-taskResult"
        style={{ ...themeStyle, ...style } as CSSProperties}
        {...rest}
      >
        <div className="kite-flyui-taskResult__toolbar">
          <div className="kite-flyui-taskResult__format" role="group" aria-label="Result format">
            {(["json", "text", "markdown"] as ResultFormat[]).map((f) => (
              <button
                key={f}
                className={`kite-flyui-taskResult__formatBtn${activeFormat === f ? " kite-flyui-taskResult__formatBtn--active" : ""}`}
                onClick={() => handleFormat(f)}
                type="button"
                aria-pressed={activeFormat === f}
              >
                {f.toUpperCase()}
              </button>
            ))}
          </div>
          <div className="kite-flyui-taskResult__actions">
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
        <pre className={`kite-flyui-taskResult__output${activeFormat === "text" || activeFormat === "markdown" ? " kite-flyui-taskResult__output--text" : ""}`}>
          {serialized}
        </pre>
        {(tokenCount !== undefined || durationMs !== undefined) && (
          <div className="kite-flyui-taskResult__meta">
            {tokenCount !== undefined && <span>{tokenCount.toLocaleString()} tokens</span>}
            {durationMs !== undefined && <span>{durationMs}ms</span>}
          </div>
        )}
      </div>
    );
  },
);
