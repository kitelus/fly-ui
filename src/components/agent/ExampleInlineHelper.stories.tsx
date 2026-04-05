import type { Meta, StoryObj } from "@storybook/react-vite";

import { AgentAvatar } from "./AgentAvatar";
import { Message } from "./Message";
import { MessageInput } from "./MessageInput";
import { Thread } from "./Thread";
import { TypingIndicator } from "./TypingIndicator";

const meta = {
  title: "Agent Components/Example/Inline Helper",
  tags: ["autodocs"],
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => (
    <div style={{ minHeight: 680, padding: 16, position: "relative" }}>
      <button
        type="button"
        style={{
          border: "1px solid var(--kfa-border)",
          borderRadius: 999,
          padding: "8px 12px",
          display: "inline-flex",
          alignItems: "center",
          gap: 8,
          background: "var(--kfa-surface)",
        }}
      >
        <AgentAvatar.Root>
          <AgentAvatar.Fallback>AI</AgentAvatar.Fallback>
          <AgentAvatar.StatusDot status="running" />
        </AgentAvatar.Root>
        Ask Assistant
      </button>

      <div
        style={{
          position: "absolute",
          right: 16,
          bottom: 16,
          width: 360,
          height: 460,
          border: "1px solid var(--kfa-border)",
          borderRadius: 12,
          background: "var(--kfa-bg)",
          padding: 12,
          display: "grid",
          gridTemplateRows: "1fr auto",
          gap: 10,
        }}
      >
        <Thread.Root>
          <Thread.List>
            <li>
              <Message.Root role="assistant" status="done">
                <Message.Avatar fallback="AI" />
                <Message.Content>
                  <Message.Text>How can I help with this page?</Message.Text>
                </Message.Content>
              </Message.Root>
            </li>
            <li>
              <Message.Root role="assistant" status="streaming">
                <Message.Avatar fallback="AI" />
                <Message.Content>
                  <TypingIndicator />
                </Message.Content>
              </Message.Root>
            </li>
          </Thread.List>
          <Thread.ScrollAnchor />
        </Thread.Root>

        <MessageInput.Root onSend={(value) => console.log(value)}>
          <MessageInput.Field placeholder="Ask about this screen" />
          <MessageInput.Toolbar>
            <MessageInput.Submit />
          </MessageInput.Toolbar>
        </MessageInput.Root>
      </div>
    </div>
  ),
};
