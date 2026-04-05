import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";

import { AgentTracePanel } from "./AgentTracePanel";

describe("AgentTracePanel", () => {
  it("renders step labels", () => {
    const html = renderToStaticMarkup(
      <AgentTracePanel
        status="running"
        steps={[
          { id: "1", label: "Fetch context", status: "done" },
          { id: "2", label: "Generate answer", status: "running" },
        ]}
      />,
    );

    expect(html).toContain("Fetch context");
    expect(html).toContain("Generate answer");
  });

  it("renders tool call details when enabled", () => {
    const html = renderToStaticMarkup(
      <AgentTracePanel
        showToolArgs
        showToolResults
        steps={[
          {
            id: "1",
            label: "Call tool",
            status: "done",
            toolCall: {
              name: "search_docs",
              callId: "tc-1",
              status: "success",
              args: { q: "auth" },
              result: { total: 3 },
            },
          },
        ]}
      />,
    );

    expect(html).toContain("search_docs");
    expect(html).toContain("success");
  });
});
