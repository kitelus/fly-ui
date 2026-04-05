import { AgentStatus } from "./AgentStatus";
import { MessageInput } from "./MessageInput";
import { SuggestedAction } from "./SuggestedAction";
import { Thread } from "./Thread";
import { TokenUsage } from "./TokenUsage";

const meta = {
  title: "Agent Components/Example/Chat Support",
  tags: ["autodocs"],
};

export default meta;

export const Default = {
  render: () => (
    <div style={{ padding: 16, display: "grid", gap: 12 }}>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <strong>Amazon Retail Support Copilot</strong>
        <AgentStatus status="running" />
      </div>

      <div style={{ height: 420 }}>
        <Thread
          messages={[
            {
              id: "chat-1",
              role: "assistant",
              status: "done",
              content:
                "Hi, I can help with your delayed shipment and refund options.",
            },
            {
              id: "chat-2",
              role: "user",
              status: "done",
              content: "Order 991-44321 is late by 4 days. What can I do?",
            },
            {
              id: "chat-3",
              role: "assistant",
              status: "streaming",
              content:
                "Checking carrier status, SLA policy, and available compensation...",
            },
          ]}
        />
      </div>

      <SuggestedAction
        actions={[
          { value: "Issue instant refund" },
          { value: "Reship with priority" },
          { value: "Escalate to logistics" },
        ]}
      />

      <MessageInput
        onSend={(value) => console.log("send", value)}
        placeholder="Send follow-up"
        allowAttachments
        showCounter
        showSubmit
      />
    </div>
  ),
};

export const SupportAssistantApp = {
  render: () => (
    <div style={{ padding: 16, display: "grid", gap: 12 }}>
      <div style={{ display: "flex", justifyContent: "space-between" }}>
        <strong>Microsoft IT Helpdesk Agent</strong>
        <AgentStatus status="running" />
        <TokenUsage used={6800} max={12000} label="Context" />
      </div>

      <div style={{ height: 420 }}>
        <Thread
          autoScroll
          messages={[
            {
              id: "support-1",
              role: "assistant",
              status: "done",
              content:
                "I can diagnose Teams, Outlook, and Intune issues for your device.",
            },
            {
              id: "support-2",
              role: "user",
              status: "done",
              content: "My Teams calls keep dropping after 10 minutes.",
            },
            {
              id: "support-3",
              role: "assistant",
              status: "streaming",
              content:
                "Correlating endpoint telemetry with recent policy rollout and network logs.",
            },
          ]}
        />
      </div>

      <MessageInput
        onSend={(value) => console.log("send", value)}
        placeholder="Ask follow-up"
        showCounter
        showSubmit
      />
    </div>
  ),
};
