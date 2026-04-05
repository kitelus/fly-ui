import { AgentAvatar } from "./AgentAvatar";
import { MessageInput } from "./MessageInput";
import { Thread } from "./Thread";
import { Loading } from "../loading/Loading";

const meta = {
  title: "Agent Components/Example/Inline Helper",
  tags: ["autodocs"],
};

export default meta;

export const Default = {
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
        <AgentAvatar fallback="AI" status="running" />
        Google Workspace Copilot
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
        <Thread
          messages={[
            {
              id: "inline-helper-1",
              role: "assistant",
              status: "done",
              content:
                "Need help summarizing this doc and drafting an executive email?",
            },
            {
              id: "inline-helper-2",
              role: "assistant",
              status: "streaming",
              content: <Loading label="Building concise executive brief" />,
            },
          ]}
        />

        <MessageInput
          onSend={(value) => console.log(value)}
          placeholder="Ask about this document"
          showCounter={false}
          showSubmit
        />
      </div>
    </div>
  ),
};
