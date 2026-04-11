import { forwardRef, type CSSProperties, type ComponentPropsWithoutRef, type ChangeEvent, type ReactNode } from "react";
import { buildKiteThemeStyle, mergeKiteTheme, type KiteTheme } from "../../kite/theme";
import { useFlyUITheme } from "../../kite/theme";
import "../agent.css";

export interface PromptVariable {
  name: string;
  description?: string;
}

export interface PromptEditorProps extends Omit<ComponentPropsWithoutRef<"div">, "onChange"> {
  value?: string;
  onChange?: (value: string) => void;
  variables?: PromptVariable[];
  maxTokens?: number;
  estimatedTokens?: number;
  placeholder?: string;
  label?: string;
  readOnly?: boolean;
  onVariableInsert?: (name: string) => void;
  /** Called when the user saves/submits (Ctrl+Enter or a save button). */
  onSave?: (value: string) => void;
  /** Called when the format button is clicked (e.g. to run prettier). */
  onFormat?: (value: string) => void;
  /** Label for the save button. Only rendered when onSave is provided. */
  saveLabel?: ReactNode;
  /** Label for the format button. Only rendered when onFormat is provided. @default "Format" */
  formatLabel?: ReactNode;
  /** Custom render for the toolbar right side. */
  toolbarSlot?: ReactNode;
  /** Slot rendered below the textarea and variables. */
  footerSlot?: ReactNode;
  /** Rows for the textarea. @default 6 */
  rows?: number;
  /** CSS min-height for the textarea (overrides rows-based sizing if set). */
  minHeight?: string | number;
  /** CSS max-height for the textarea. */
  maxHeight?: string | number;
  /** Whether to show a line counter alongside the textarea. @default false */
  showLineNumbers?: boolean;
  theme?: KiteTheme;
}

export const PromptEditor = forwardRef<HTMLDivElement, PromptEditorProps>(
  function PromptEditor(
    {
      value = "",
      onChange,
      variables,
      maxTokens,
      estimatedTokens,
      placeholder = "Enter your prompt…",
      label,
      readOnly = false,
      onVariableInsert,
      onSave,
      onFormat,
      saveLabel = "Save",
      formatLabel = "Format",
      toolbarSlot,
      footerSlot,
      rows = 6,
      minHeight,
      maxHeight,
      showLineNumbers = false,
      theme,
      style,
      ...rest
    },
    ref,
  ) {
    const contextTheme = useFlyUITheme();
    const themeStyle = buildKiteThemeStyle(mergeKiteTheme(contextTheme, theme));

    const isOver = maxTokens != null && estimatedTokens != null && estimatedTokens > maxTokens;
    const tokenClass = isOver ? "kite-flyui-promptEditor__tokenCount--warn" : "";

    const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
      if (onSave && (e.ctrlKey || e.metaKey) && e.key === "Enter") {
        e.preventDefault();
        onSave(value);
      }
    };

    const textareaStyle: React.CSSProperties = {};
    if (minHeight !== undefined) textareaStyle.minHeight = typeof minHeight === "number" ? `${minHeight}px` : minHeight;
    if (maxHeight !== undefined) textareaStyle.maxHeight = typeof maxHeight === "number" ? `${maxHeight}px` : maxHeight;

    const lines = value.split("\n");

    return (
      <div
        ref={ref}
        className="kite-flyui-host kite-flyui-promptEditor"
        style={{ ...themeStyle, ...style } as CSSProperties}
        {...rest}
      >
        <div className="kite-flyui-promptEditor__toolbar">
          <div className="kite-flyui-promptEditor__toolbarLeft">
            {label && <p className="kite-flyui-promptEditor__title">{label}</p>}
            {estimatedTokens !== undefined && (
              <span className={`kite-flyui-promptEditor__tokenCount ${tokenClass}`}>
                ~{estimatedTokens.toLocaleString()} tokens{maxTokens ? ` / ${maxTokens.toLocaleString()}` : ""}
              </span>
            )}
          </div>
          <div className="kite-flyui-promptEditor__toolbarRight">
            {toolbarSlot}
            {onFormat && (
              <button
                type="button"
                className="kite-flyui-agentBtn"
                onClick={() => onFormat(value)}
                disabled={readOnly}
              >
                {formatLabel}
              </button>
            )}
            {onSave && (
              <button
                type="button"
                className="kite-flyui-agentBtn kite-flyui-agentBtn--primary"
                onClick={() => onSave(value)}
                disabled={readOnly}
                title="Save (Ctrl+Enter)"
              >
                {saveLabel}
              </button>
            )}
          </div>
        </div>
        <div className="kite-flyui-promptEditor__editorWrap" style={{ display: "flex" }}>
          {showLineNumbers && (
            <div className="kite-flyui-promptEditor__lineNumbers" aria-hidden="true">
              {lines.map((_, i) => (
                <div key={i} className="kite-flyui-promptEditor__lineNum">{i + 1}</div>
              ))}
            </div>
          )}
          <textarea
            className="kite-flyui-promptEditor__textarea"
            style={Object.keys(textareaStyle).length ? textareaStyle : undefined}
            value={value}
            rows={rows}
            onChange={(e: ChangeEvent<HTMLTextAreaElement>) => onChange?.(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={placeholder}
            readOnly={readOnly}
            aria-label={label ?? "Prompt editor"}
            aria-multiline="true"
            aria-invalid={isOver || undefined}
          />
        </div>
        {variables && variables.length > 0 && (
          <div className="kite-flyui-promptEditor__variables" aria-label="Available variables">
            {variables.map((v) => (
              <button
                key={v.name}
                className="kite-flyui-promptEditor__varChip"
                onClick={() => onVariableInsert?.(v.name)}
                title={v.description}
                type="button"
                disabled={readOnly}
              >
                {`{{${v.name}}}`}
              </button>
            ))}
          </div>
        )}
        {footerSlot}
      </div>
    );
  },
);
