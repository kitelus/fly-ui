import type { Meta, StoryObj } from "@storybook/react-vite";

import { AgentStatus } from "./AgentStatus";
import { Message } from "./Message";
import { MessageInput } from "./MessageInput";
import { SuggestedAction } from "./SuggestedAction";
import { Thread } from "./Thread";
import { TokenUsage } from "./TokenUsage";

const meta = {
  title: "Agent Components/Example/Chat Support",
  tags: ["autodocs"],
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => (
    <div style={{ padding: 16, display: "grid", gap: 12 }}>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <strong>Support Assistant</strong>
        <AgentStatus status="running" />
      </div>

      <div style={{ height: 420 }}>
        <Thread.Root>
          <Thread.List>
            <li>
              <Message.Root role="assistant" status="done">
                <Message.Avatar fallback="AI" />
                <Message.Content>
                  <Message.Text>
                    Hello, how can I help with your release today?
                  </Message.Text>
                </Message.Content>
              </Message.Root>
            </li>
            <li>
              <Message.Root role="user" status="done">
                <Message.Avatar fallback="U" />
                <Message.Content>
                  <Message.Text>
                    I need a short release summary from sprint tasks.
                  </Message.Text>
                </Message.Content>
              </Message.Root>
            </li>
            <li>
              <Message.Root role="assistant" status="streaming">
                <Message.Avatar fallback="AI" />
                <Message.Content>
                  <Message.Text>
                    Generating summary from completed tickets...
                  </Message.Text>
                </Message.Content>
              </Message.Root>
            </li>
          </Thread.List>
          <Thread.ScrollAnchor />
        </Thread.Root>
      </div>

      <SuggestedAction.Root>
        <SuggestedAction.Item value="Write release notes" />
        <SuggestedAction.Item value="List key blockers" />
        <SuggestedAction.Item value="Draft stakeholder update" />
      </SuggestedAction.Root>

      <MessageInput.Root onSend={(value) => console.log("send", value)}>
        <MessageInput.Field placeholder="Send follow-up" />
        <MessageInput.Toolbar>
          <MessageInput.AttachTrigger />
          <MessageInput.Counter />
          <MessageInput.Submit />
        </MessageInput.Toolbar>
      </MessageInput.Root>
    </div>
  ),
};

export const SupportAssistantApp: Story = {
  render: () => (
    <div style={{ padding: 16, display: "grid", gap: 12 }}>
      <div style={{ display: "flex", justifyContent: "space-between" }}>
        <AgentStatus status="running" />
        <TokenUsage.Root used={5200} max={10000}>
          <TokenUsage.Label>Context</TokenUsage.Label>
          <TokenUsage.Bar />
          <TokenUsage.Count />
        </TokenUsage.Root>
      </div>

      <div style={{ height: 420 }}>
        <Thread.Root autoScroll>
          <Thread.List>
            <li>
              <Message.Root role="assistant" status="done">
                <Message.Avatar fallback="AI" />
                <Message.Content>
                  <Message.Text>
                    Hello, what do you need help with?
                  </Message.Text>
                </Message.Content>
              </Message.Root>
            </li>
            <li>
              <Message.Root role="user" status="done">
                <Message.Avatar fallback="U" />
                <Message.Content>
                  <Message.Text>
                    Generate release notes for sprint 18.
                  </Message.Text>
                </Message.Content>
              </Message.Root>
            </li>
            <li>
              <Message.Root role="assistant" status="streaming">
                <Message.Avatar fallback="AI" />
                <Message.Content>
                  <Message.Text>
                    Grouping tickets by feature area and impact.
                  </Message.Text>
                </Message.Content>
              </Message.Root>
            </li>
          </Thread.List>
          <Thread.ScrollAnchor />
        </Thread.Root>
      </div>

      <MessageInput.Root onSend={(value) => console.log("send", value)}>
        <MessageInput.Field placeholder="Ask follow-up" />
        <MessageInput.Toolbar>
          <MessageInput.Counter />
          <MessageInput.Submit />
        </MessageInput.Toolbar>
      </MessageInput.Root>
    </div>
  ),
};
