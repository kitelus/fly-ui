import { forwardRef, type CSSProperties, type ComponentPropsWithoutRef, type ReactNode, type ChangeEvent } from "react";
import { buildKiteThemeStyle, mergeKiteTheme, type KiteTheme } from "../../kite/theme";
import { useFlyUITheme } from "../../kite/theme";
import "../agent.css";

export type ParameterType = "string" | "number" | "boolean" | "select" | "textarea";

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
  /** Min value for number inputs. */
  min?: number;
  /** Max value for number inputs. */
  max?: number;
  /** Step value for number inputs. */
  step?: number;
  /** Rows for textarea inputs. @default 3 */
  rows?: number;
}

export interface WorkflowParameterFormProps extends Omit<ComponentPropsWithoutRef<"div">, "onChange" | "onSubmit"> {
  parameters: WorkflowParameter[];
  values: Record<string, string | boolean | number>;
  onChange?: (key: string, value: string | boolean | number) => void;
  /** Called when the user submits the form. */
  onSubmit?: (values: Record<string, string | boolean | number>) => void;
  /** Label for the submit button. Only rendered when onSubmit is provided. */
  submitLabel?: ReactNode;
  /** Called when the user resets the form. */
  onReset?: () => void;
  /** Label for the reset button. Only rendered when onReset is provided. */
  resetLabel?: ReactNode;
  /** Mark all fields as read-only. */
  readOnly?: boolean;
  /** Slot rendered below the form fields, above the buttons. */
  footerSlot?: ReactNode;
  theme?: KiteTheme;
}

export const WorkflowParameterForm = forwardRef<HTMLDivElement, WorkflowParameterFormProps>(
  function WorkflowParameterForm(
    {
      parameters,
      values,
      onChange,
      onSubmit,
      submitLabel = "Run Workflow",
      onReset,
      resetLabel = "Reset",
      readOnly = false,
      footerSlot,
      theme,
      style,
      ...rest
    },
    ref,
  ) {
    const contextTheme = useFlyUITheme();
    const themeStyle = buildKiteThemeStyle(mergeKiteTheme(contextTheme, theme));

    const handleChange = (key: string, type: ParameterType, e: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
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
                  disabled={param.disabled || readOnly}
                />
                <span className="kite-flyui-workflowParams__checkLabel">
                  {param.placeholder ?? "Enable"}
                </span>
              </div>
            ) : param.type === "select" ? (
              <select
                id={`param-${param.key}`}
                className="kite-flyui-workflowParams__select"
                value={String(values[param.key] ?? "")}
                onChange={(e) => handleChange(param.key, param.type, e)}
                disabled={param.disabled || readOnly}
                aria-invalid={!!param.validationError}
                aria-describedby={param.validationError ? `${param.key}-error` : undefined}
              >
                <option value="">{param.placeholder ?? "Select…"}</option>
                {param.options?.map((opt) => (
                  <option key={opt.value} value={opt.value}>{opt.label}</option>
                ))}
              </select>
            ) : param.type === "textarea" ? (
              <textarea
                id={`param-${param.key}`}
                className="kite-flyui-workflowParams__textarea"
                value={String(values[param.key] ?? "")}
                placeholder={param.placeholder}
                onChange={(e) => handleChange(param.key, param.type, e)}
                disabled={param.disabled || readOnly}
                required={param.required}
                rows={param.rows ?? 3}
                aria-invalid={!!param.validationError}
                aria-describedby={param.validationError ? `${param.key}-error` : undefined}
              />
            ) : (
              <input
                id={`param-${param.key}`}
                className="kite-flyui-workflowParams__input"
                type={param.type === "number" ? "number" : "text"}
                value={String(values[param.key] ?? "")}
                placeholder={param.placeholder}
                onChange={(e) => handleChange(param.key, param.type, e)}
                disabled={param.disabled || readOnly}
                required={param.required}
                min={param.min}
                max={param.max}
                step={param.step}
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

        {footerSlot}

        {(onSubmit || onReset) && (
          <div className="kite-flyui-agentActions">
            {onReset && (
              <button
                type="button"
                className="kite-flyui-agentBtn"
                onClick={onReset}
                disabled={readOnly}
              >
                {resetLabel}
              </button>
            )}
            {onSubmit && (
              <button
                type="button"
                className="kite-flyui-agentBtn kite-flyui-agentBtn--primary"
                onClick={() => onSubmit(values)}
                disabled={readOnly}
              >
                {submitLabel}
              </button>
            )}
          </div>
        )}
      </div>
    );
  },
);
