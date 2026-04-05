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
      <ConversationLayout
        sidebar={
          <>
            <div style={{ padding: 12, fontWeight: 600 }}>
              JPMorgan Ops Channels
            </div>
            <div
              style={{ padding: 12, borderTop: "1px solid var(--kfa-border)" }}
            >
              Fraud Triage - Cards
            </div>
            <div
              style={{ padding: 12, borderTop: "1px solid var(--kfa-border)" }}
            >
              AML Alerts - Wire
            </div>
            <div
              style={{ padding: 12, borderTop: "1px solid var(--kfa-border)" }}
            >
              KYC Exceptions
            </div>
          </>
        }
        header={
          <div style={{ display: "flex", justifyContent: "space-between" }}>
            <strong>Fraud Triage - Cards</strong>
            <ContextPanel
              triggerLabel="Context"
              content={
                <>
                  <ContextPanel.Section>
                    <ContextPanel.Item>Region: North America</ContextPanel.Item>
                    <ContextPanel.Item>Priority: P1</ContextPanel.Item>
                  </ContextPanel.Section>
                </>
              }
            />
          </div>
        }
        main={
          <div style={{ flex: 1, minHeight: 0, padding: 12 }}>
            <Thread
              messages={[
                {
                  id: "inbox-1",
                  role: "assistant",
                  status: "done",
                  content:
                    "Loaded 4 correlated chargeback spikes in the last 30 minutes.",
                },
                {
                  id: "inbox-2",
                  role: "user",
                  status: "done",
                  content:
                    "Freeze high-risk BIN range and draft regulator-ready incident summary.",
                },
              ]}
            />
          </div>
        }
        footer={
          <MessageInput
            onSend={(value) => console.log(value)}
            placeholder="Reply in this conversation"
            showCounter
            showSubmit
          />
        }
      />
    </div>
  ),
};
