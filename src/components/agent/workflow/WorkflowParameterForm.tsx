import { forwardRef, type CSSProperties, type ComponentPropsWithoutRef, type ChangeEvent } from "react";
import { buildKiteThemeStyle, mergeKiteTheme, type KiteTheme } from "../../kite/theme";
import { useFlyUITheme } from "../../kite/theme";
import "../agent.css";

export type ParameterType = "string" | "number" | "boolean" | "select";

export interface WorkflowParameter {
  key: string;
  label: string;
  type: ParameterType;
  description?: string;
  required?: boolean;
  placeholder?: string;
  options?: { label: string; value: string }[];
  disabled?: boolean;
  validationError?: string;
}

export interface WorkflowParameterFormProps extends Omit<ComponentPropsWithoutRef<"div">, "onChange"> {
  parameters: WorkflowParameter[];
  values: Record<string, string | boolean | number>;
  onChange?: (key: string, value: string | boolean | number) => void;
  theme?: KiteTheme;
}

export const WorkflowParameterForm = forwardRef<HTMLDivElement, WorkflowParameterFormProps>(
  function WorkflowParameterForm({ parameters, values, onChange, theme, style, ...rest }, ref) {
    const contextTheme = useFlyUITheme();
    const themeStyle = buildKiteThemeStyle(mergeKiteTheme(contextTheme, theme));

    const handleChange = (key: string, type: ParameterType, e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
      if (type === "number") {
        onChange?.(key, Number(e.target.value));
      } else {
        onChange?.(key, e.target.value);
      }
    };

    return (
      <div
        ref={ref}
        className="kite-flyui-host kite-flyui-workflowParams"
        style={{ ...themeStyle, ...style } as CSSProperties}
        {...rest}
      >
        {parameters.map((param) => (
          <div key={param.key} className="kite-flyui-workflowParams__field">
            <label className="kite-flyui-workflowParams__label" htmlFor={`param-${param.key}`}>
              {param.label}
              {param.required && <span className="kite-flyui-workflowParams__required">*</span>}
            </label>
            {param.description && (
              <span className="kite-flyui-workflowParams__desc">{param.description}</span>
            )}
            {param.type === "boolean" ? (
              <div className="kite-flyui-workflowParams__checkbox">
                <input
                  id={`param-${param.key}`}
                  className="kite-flyui-workflowParams__checkboxInput"
                  type="checkbox"
                  checked={Boolean(values[param.key])}
                  onChange={(e) => onChange?.(param.key, e.target.checked)}
                  disabled={param.disabled}
                />
                <span className="kite-flyui-workflowParams__label" style={{ textTransform: "none", letterSpacing: 0, fontWeight: 400 }}>
                  {param.placeholder ?? "Enable"}
                </span>
              </div>
            ) : param.type === "select" ? (
              <select
                id={`param-${param.key}`}
                className="kite-flyui-workflowParams__select"
                value={String(values[param.key] ?? "")}
                onChange={(e) => handleChange(param.key, param.type, e)}
                disabled={param.disabled}
              >
                <option value="">{param.placeholder ?? "Select…"}</option>
                {param.options?.map((opt) => (
                  <option key={opt.value} value={opt.value}>{opt.label}</option>
                ))}
              </select>
            ) : (
              <input
                id={`param-${param.key}`}
                className="kite-flyui-workflowParams__input"
                type={param.type === "number" ? "number" : "text"}
                value={String(values[param.key] ?? "")}
                placeholder={param.placeholder}
                onChange={(e) => handleChange(param.key, param.type, e)}
                disabled={param.disabled}
                required={param.required}
                aria-invalid={!!param.validationError}
                aria-describedby={param.validationError ? `${param.key}-error` : undefined}
              />
            )}
            {param.validationError && (
              <span id={`${param.key}-error`} className="kite-flyui-workflowParams__validationError" role="alert">
                {param.validationError}
              </span>
            )}
          </div>
        ))}
      </div>
    );
  },
);
