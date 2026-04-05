import { ConversationLayout } from "./ConversationLayout";
import { ContextPanel } from "./ContextPanel";
import { MessageInput } from "./MessageInput";
import { Thread } from "./Thread";

const meta = {
  title: "Agent Components/Example/Conversation Inbox",
  tags: ["autodocs"],
};

export default meta;

export const Default = {
  render: () => (
    <div style={{ padding: 16, height: 680 }}>
      <ConversationLayout>
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
              <ContextPanel>
                <ContextPanel.Trigger>Context</ContextPanel.Trigger>
                <ContextPanel.Content>
                  <ContextPanel.Section>
                    <ContextPanel.Item>Tenant: demo-tenant</ContextPanel.Item>
                    <ContextPanel.Item>
                      Workspace: Platform Team
                    </ContextPanel.Item>
                  </ContextPanel.Section>
                </ContextPanel.Content>
              </ContextPanel>
            </div>
          </ConversationLayout.Header>

          <div style={{ flex: 1, minHeight: 0, padding: 12 }}>
            <Thread
              messages={[
                {
                  id: "inbox-1",
                  role: "assistant",
                  status: "done",
                  content: "Workspace loaded. Ready to assist.",
                },
                {
                  id: "inbox-2",
                  role: "user",
                  status: "done",
                  content: "Summarize latest deployment notes.",
                },
              ]}
            />
          </div>

          <ConversationLayout.Footer>
            <MessageInput
              onSend={(value) => console.log(value)}
              placeholder="Reply in this conversation"
              showCounter
              showSubmit
            />
          </ConversationLayout.Footer>
        </ConversationLayout.Main>
      </ConversationLayout>
    </div>
  ),
};
