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
        <strong>Support Assistant</strong>
        <AgentStatus status="running" />
      </div>

      <div style={{ height: 420 }}>
        <Thread
          messages={[
            {
              id: "chat-1",
              role: "assistant",
              status: "done",
              content: "Hello, how can I help with your release today?",
            },
            {
              id: "chat-2",
              role: "user",
              status: "done",
              content: "I need a short release summary from sprint tasks.",
            },
            {
              id: "chat-3",
              role: "assistant",
              status: "streaming",
              content: "Generating summary from completed tickets...",
            },
          ]}
        />
      </div>

      <SuggestedAction
        actions={[
          { value: "Write release notes" },
          { value: "List key blockers" },
          { value: "Draft stakeholder update" },
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
        <AgentStatus status="running" />
        <TokenUsage used={5200} max={10000} label="Context" />
      </div>

      <div style={{ height: 420 }}>
        <Thread
          autoScroll
          messages={[
            {
              id: "support-1",
              role: "assistant",
              status: "done",
              content: "Hello, what do you need help with?",
            },
            {
              id: "support-2",
              role: "user",
              status: "done",
              content: "Generate release notes for sprint 18.",
            },
            {
              id: "support-3",
              role: "assistant",
              status: "streaming",
              content: "Grouping tickets by feature area and impact.",
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
