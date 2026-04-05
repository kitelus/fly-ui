import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it, vi } from "vitest";

import { AgentChatApp } from "./AgentChatApp";

describe("AgentChatApp", () => {
  it("renders header and messages", () => {
    const html = renderToStaticMarkup(
      <AgentChatApp
        messages={[
          { id: "1", role: "assistant", content: "Welcome" },
          { id: "2", role: "user", content: "Need a summary" },
        ]}
        onSend={vi.fn()}
        agentName="Test Agent"
      />,
    );

    expect(html).toContain("Test Agent");
    expect(html).toContain("Welcome");
  });

  it("renders trace panel when steps are provided", () => {
    const html = renderToStaticMarkup(
      <AgentChatApp
        messages={[{ id: "1", role: "assistant", content: "Running..." }]}
        steps={[{ id: "s1", label: "Plan", status: "done" }]}
        onSend={vi.fn()}
        showTrace
      />,
    );

    expect(html).toContain("Agent Trace");
    expect(html).toContain("Plan");
  });
});
