import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it, vi } from "vitest";

import { ChatWindow } from "./ChatWindow";

describe("ChatWindow", () => {
  it("renders empty state when there are no messages", () => {
    const html = renderToStaticMarkup(
      <ChatWindow messages={[]} onSend={vi.fn()} />,
    );

    expect(html).toContain("No messages yet.");
  });

  it("renders provided messages", () => {
    const html = renderToStaticMarkup(
      <ChatWindow
        messages={[
          { id: "1", role: "assistant", content: "Hello" },
          { id: "2", role: "user", content: "Hi" },
        ]}
        onSend={vi.fn()}
      />,
    );

    expect(html).toContain("Hello");
    expect(html).toContain("Hi");
  });
});
