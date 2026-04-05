import type { Meta, StoryObj } from "@storybook/react-vite";

import { ConversationLayout } from "./ConversationLayout";
import { ContextPanel } from "./ContextPanel";
import { Message } from "./Message";
import { MessageInput } from "./MessageInput";
import { Thread } from "./Thread";

const meta = {
  title: "Agent Components/Example/Conversation Inbox",
  tags: ["autodocs"],
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => (
    <div style={{ padding: 16, height: 680 }}>
      <ConversationLayout.Root>
        <ConversationLayout.Sidebar>
          <div style={{ padding: 12, fontWeight: 600 }}>Conversations</div>
          <div
            style={{ padding: 12, borderTop: "1px solid var(--kfa-border)" }}
          >
            Release Planning
          </div>
          <div
            style={{ padding: 12, borderTop: "1px solid var(--kfa-border)" }}
          >
            Hiring Pipeline
          </div>
        </ConversationLayout.Sidebar>

        <ConversationLayout.Main>
          <ConversationLayout.Header>
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <strong>Release Planning</strong>
              <ContextPanel.Root>
                <ContextPanel.Trigger>Context</ContextPanel.Trigger>
                <ContextPanel.Content>
                  <ContextPanel.Section>
                    <ContextPanel.Item>Tenant: demo-tenant</ContextPanel.Item>
                    <ContextPanel.Item>
                      Workspace: Platform Team
                    </ContextPanel.Item>
                  </ContextPanel.Section>
                </ContextPanel.Content>
              </ContextPanel.Root>
            </div>
          </ConversationLayout.Header>

          <div style={{ flex: 1, minHeight: 0, padding: 12 }}>
            <Thread.Root>
              <Thread.List>
                <li>
                  <Message.Root role="assistant" status="done">
                    <Message.Avatar fallback="AI" />
                    <Message.Content>
                      <Message.Text>
                        Workspace loaded. Ready to assist.
                      </Message.Text>
                    </Message.Content>
                  </Message.Root>
                </li>
                <li>
                  <Message.Root role="user" status="done">
                    <Message.Avatar fallback="U" />
                    <Message.Content>
                      <Message.Text>
                        Summarize latest deployment notes.
                      </Message.Text>
                    </Message.Content>
                  </Message.Root>
                </li>
              </Thread.List>
              <Thread.ScrollAnchor />
            </Thread.Root>
          </div>

          <ConversationLayout.Footer>
            <MessageInput.Root onSend={(value) => console.log(value)}>
              <MessageInput.Field placeholder="Reply in this conversation" />
              <MessageInput.Toolbar>
                <MessageInput.Counter />
                <MessageInput.Submit />
              </MessageInput.Toolbar>
            </MessageInput.Root>
          </ConversationLayout.Footer>
        </ConversationLayout.Main>
      </ConversationLayout.Root>
    </div>
  ),
};
