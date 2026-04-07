import { forwardRef, useState, type CSSProperties, type ComponentPropsWithoutRef } from "react";
import { buildKiteThemeStyle, mergeKiteTheme, type KiteTheme } from "../../kite/theme";
import { useFlyUITheme } from "../../kite/theme";
import "../agent.css";

export type HttpMethod = "GET" | "POST" | "PUT" | "PATCH" | "DELETE";

export interface ApiRequestInspectorProps extends ComponentPropsWithoutRef<"div"> {
  method: HttpMethod;
  endpoint: string;
  statusCode?: number;
  latencyMs?: number;
  requestHeaders?: Record<string, string>;
  requestBody?: unknown;
  responseHeaders?: Record<string, string>;
  responseBody?: unknown;
  theme?: KiteTheme;
}

type Tab = "request" | "response" | "headers";

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
      theme,
      style,
      ...rest
    },
    ref,
  ) {
    const contextTheme = useFlyUITheme();
    const themeStyle = buildKiteThemeStyle(mergeKiteTheme(contextTheme, theme));
    const [tab, setTab] = useState<Tab>("request");

    const statusClass =
      statusCode && statusCode >= 500
        ? "kite-flyui-apiInspector__status--5xx"
        : statusCode && statusCode >= 400
          ? "kite-flyui-apiInspector__status--4xx"
          : "kite-flyui-apiInspector__status--2xx";

    const serialize = (v: unknown) =>
      typeof v === "string" ? v : JSON.stringify(v, null, 2);

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
        </div>
        <div className="kite-flyui-apiInspector__tabs" role="tablist">
          {(["request", "response", "headers"] as Tab[]).map((t) => (
            <button
              key={t}
              role="tab"
              aria-selected={tab === t}
              className={`kite-flyui-apiInspector__tab${tab === t ? " kite-flyui-apiInspector__tab--active" : ""}`}
              onClick={() => setTab(t)}
              type="button"
            >
              {t.charAt(0).toUpperCase() + t.slice(1)}
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
                  <pre className="kite-flyui-toolCall__code">
                    {serialize(requestHeaders)}
                  </pre>
                </>
              )}
              {responseHeaders && Object.keys(responseHeaders).length > 0 && (
                <>
                  <p className="kite-flyui-toolCall__sectionLabel" style={{ marginTop: 8 }}>Response Headers</p>
                  <pre className="kite-flyui-toolCall__code">
                    {serialize(responseHeaders)}
                  </pre>
                </>
              )}
            </div>
          )}
        </div>
      </div>
    );
  },
);
