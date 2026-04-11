import { forwardRef, useState, type CSSProperties, type ComponentPropsWithoutRef, type ReactNode } from "react";
import { buildKiteThemeStyle, mergeKiteTheme, type KiteTheme } from "../../kite/theme";
import { useFlyUITheme } from "../../kite/theme";
import "../agent.css";

export type HttpMethod = "GET" | "POST" | "PUT" | "PATCH" | "DELETE";

export interface ApiRequestInspectorProps extends Omit<ComponentPropsWithoutRef<"div">, "onCopy"> {
  method: HttpMethod;
  endpoint: string;
  statusCode?: number;
  latencyMs?: number;
  requestHeaders?: Record<string, string>;
  requestBody?: unknown;
  responseHeaders?: Record<string, string>;
  responseBody?: unknown;
  /** Override tab labels. */
  tabLabels?: { request?: string; response?: string; headers?: string };
  /** Extra tabs to display alongside the built-in three. */
  extraTabs?: Array<{ id: string; label: string; content: ReactNode }>;
  /** The initially active tab. @default "request" */
  defaultTab?: string;
  /** Called when a section is copied. */
  onCopy?: (section: "request" | "response" | "headers" | string, content: string) => void;
  /** Label for the copy button. @default "Copy" */
  copyLabel?: ReactNode;
  /** Label shown briefly after copying. @default "Copied!" — set null to disable feedback */
  copyFeedbackLabel?: ReactNode | null;
  /** Duration in ms for the copy feedback. @default 1500 */
  copyFeedbackDuration?: number;
  /** Called when the retry button is clicked. When provided, a Retry button appears. */
  onRetry?: () => void;
  /** Label for the retry button. @default "Retry" */
  retryLabel?: ReactNode;
  /** Slot rendered in the header line alongside method/endpoint/status. */
  headerSlot?: ReactNode;
  theme?: KiteTheme;
}

type BuiltInTab = "request" | "response" | "headers";

export const ApiRequestInspector = forwardRef<HTMLDivElement, ApiRequestInspectorProps>(
  function ApiRequestInspector(
    {
      method,
      endpoint,
      statusCode,
      latencyMs,
      requestHeaders,
      requestBody,
      responseHeaders,
      responseBody,
      tabLabels,
      extraTabs,
      defaultTab = "request",
      onCopy,
      copyLabel = "Copy",
      copyFeedbackLabel = "Copied!",
      copyFeedbackDuration = 1500,
      onRetry,
      retryLabel = "Retry",
      headerSlot,
      theme,
      style,
      ...rest
    },
    ref,
  ) {
    const contextTheme = useFlyUITheme();
    const themeStyle = buildKiteThemeStyle(mergeKiteTheme(contextTheme, theme));
    const [tab, setTab] = useState<string>(defaultTab);
    const [copied, setCopied] = useState(false);

    const statusClass =
      statusCode && statusCode >= 500
        ? "kite-flyui-apiInspector__status--5xx"
        : statusCode && statusCode >= 400
          ? "kite-flyui-apiInspector__status--4xx"
          : "kite-flyui-apiInspector__status--2xx";

    const serialize = (v: unknown) =>
      typeof v === "string" ? v : JSON.stringify(v, null, 2);

    const labels: Record<BuiltInTab, string> = {
      request:  tabLabels?.request  ?? "Request",
      response: tabLabels?.response ?? "Response",
      headers:  tabLabels?.headers  ?? "Headers",
    };

    const builtInTabs: BuiltInTab[] = ["request", "response", "headers"];

    const getBuiltInContent = (t: BuiltInTab): string => {
      if (t === "request")  return requestBody  !== undefined ? serialize(requestBody)  : "";
      if (t === "response") return responseBody !== undefined ? serialize(responseBody) : "";
      const parts: string[] = [];
      if (requestHeaders  && Object.keys(requestHeaders).length  > 0) parts.push(`// Request Headers\n${serialize(requestHeaders)}`);
      if (responseHeaders && Object.keys(responseHeaders).length > 0) parts.push(`// Response Headers\n${serialize(responseHeaders)}`);
      return parts.join("\n\n");
    };

    const handleCopy = () => {
      let content = "";
      if (builtInTabs.includes(tab as BuiltInTab)) {
        content = getBuiltInContent(tab as BuiltInTab);
      } else {
        const extraTab = extraTabs?.find((t) => t.id === tab);
        if (extraTab && typeof extraTab.content === "string") {
          content = extraTab.content;
        }
      }
      onCopy?.(tab, content);
      if (copyFeedbackLabel !== null) {
        setCopied(true);
        setTimeout(() => setCopied(false), copyFeedbackDuration);
      }
    };

    return (
      <div
        ref={ref}
        className="kite-flyui-host kite-flyui-agentCard kite-flyui-apiInspector"
        style={{ ...themeStyle, ...style } as CSSProperties}
        {...rest}
      >
        <div className="kite-flyui-apiInspector__line">
          <span className="kite-flyui-apiInspector__method">{method}</span>
          <span className="kite-flyui-apiInspector__endpoint">{endpoint}</span>
          {statusCode !== undefined && (
            <span className={statusClass}>{statusCode}</span>
          )}
          {latencyMs !== undefined && (
            <span className="kite-flyui-apiInspector__latency">{latencyMs}ms</span>
          )}
          {headerSlot}
          {onRetry && (
            <button
              type="button"
              className="kite-flyui-agentBtn"
              onClick={onRetry}
              aria-label="Retry request"
            >
              {retryLabel}
            </button>
          )}
          {onCopy && (
            <button
              type="button"
              className="kite-flyui-agentBtn"
              onClick={handleCopy}
              aria-label={`Copy ${tab}`}
            >
              {copied && copyFeedbackLabel !== null ? copyFeedbackLabel : copyLabel}
            </button>
          )}
        </div>
        <div className="kite-flyui-apiInspector__tabs" role="tablist">
          {builtInTabs.map((t) => (
            <button
              key={t}
              role="tab"
              aria-selected={tab === t}
              className={`kite-flyui-apiInspector__tab${tab === t ? " kite-flyui-apiInspector__tab--active" : ""}`}
              onClick={() => setTab(t)}
              type="button"
            >
              {labels[t]}
            </button>
          ))}
          {extraTabs?.map((t) => (
            <button
              key={t.id}
              role="tab"
              aria-selected={tab === t.id}
              className={`kite-flyui-apiInspector__tab${tab === t.id ? " kite-flyui-apiInspector__tab--active" : ""}`}
              onClick={() => setTab(t.id)}
              type="button"
            >
              {t.label}
            </button>
          ))}
        </div>
        <div role="tabpanel">
          {tab === "request" && (
            <pre className="kite-flyui-toolCall__code">
              {requestBody !== undefined ? serialize(requestBody) : "(empty)"}
            </pre>
          )}
          {tab === "response" && (
            <pre className="kite-flyui-toolCall__code">
              {responseBody !== undefined ? serialize(responseBody) : "(empty)"}
            </pre>
          )}
          {tab === "headers" && (
            <div>
              {requestHeaders && Object.keys(requestHeaders).length > 0 && (
                <>
                  <p className="kite-flyui-toolCall__sectionLabel">Request Headers</p>
                  <pre className="kite-flyui-toolCall__code">{serialize(requestHeaders)}</pre>
                </>
              )}
              {responseHeaders && Object.keys(responseHeaders).length > 0 && (
                <>
                  <p className="kite-flyui-toolCall__sectionLabel kite-flyui-toolCall__sectionLabel--mt">Response Headers</p>
                  <pre className="kite-flyui-toolCall__code">{serialize(responseHeaders)}</pre>
                </>
              )}
              {(!requestHeaders || Object.keys(requestHeaders).length === 0) &&
               (!responseHeaders || Object.keys(responseHeaders).length === 0) && (
                <p className="kite-flyui-toolCall__code">(no headers)</p>
              )}
            </div>
          )}
          {extraTabs?.map((t) => tab === t.id && (
            <div key={t.id}>{t.content}</div>
          ))}
        </div>
      </div>
    );
  },
);
