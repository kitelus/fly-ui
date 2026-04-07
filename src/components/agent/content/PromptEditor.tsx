import { forwardRef, type CSSProperties, type ComponentPropsWithoutRef, type ChangeEvent } from "react";
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
      theme,
      style,
      ...rest
    },
    ref,
  ) {
    const contextTheme = useFlyUITheme();
    const themeStyle = buildKiteThemeStyle(mergeKiteTheme(contextTheme, theme));

    const tokenClass =
      maxTokens && estimatedTokens !== undefined && estimatedTokens > maxTokens
        ? "kite-flyui-promptEditor__tokenCount--warn"
        : "";

    return (
      <div
        ref={ref}
        className="kite-flyui-host kite-flyui-promptEditor"
        style={{ ...themeStyle, ...style } as CSSProperties}
        {...rest}
      >
        <div className="kite-flyui-promptEditor__toolbar">
          {label && <p className="kite-flyui-promptEditor__title">{label}</p>}
          {estimatedTokens !== undefined && (
            <span className={`kite-flyui-promptEditor__tokenCount ${tokenClass}`}>
              ~{estimatedTokens.toLocaleString()} tokens{maxTokens ? ` / ${maxTokens.toLocaleString()}` : ""}
            </span>
          )}
        </div>
        <textarea
          className="kite-flyui-promptEditor__textarea"
          value={value}
          onChange={(e: ChangeEvent<HTMLTextAreaElement>) => onChange?.(e.target.value)}
          placeholder={placeholder}
          readOnly={readOnly}
          aria-label={label ?? "Prompt editor"}
          aria-multiline="true"
        />
        {variables && variables.length > 0 && (
          <div className="kite-flyui-promptEditor__variables" aria-label="Available variables">
            {variables.map((v) => (
              <button
                key={v.name}
                className="kite-flyui-promptEditor__varChip"
                onClick={() => onVariableInsert?.(v.name)}
                title={v.description}
                type="button"
              >
                {`{{${v.name}}}`}
              </button>
            ))}
          </div>
        )}
      </div>
    );
  },
);
