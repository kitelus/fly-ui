import type { Meta, StoryObj } from "@storybook/react-vite";

import { ConversationList } from "../components/agent/chat/ConversationList";
import { MessageBubble } from "../components/agent/chat/MessageBubble";
import { MessageInput } from "../components/agent/chat/MessageInput";
import { StreamingText } from "../components/agent/chat/StreamingText";
import { SuggestionPills } from "../components/agent/chat/SuggestionPills";

// ─── App shell styles ──────────────────────────────────────────────────────────

const APP: React.CSSProperties = {
  fontFamily: '"Inter Variable", Inter, ui-sans-serif, system-ui, sans-serif',
  display: "grid",
  gridTemplateRows: "48px 1fr",
  gridTemplateColumns: "220px 280px 1fr",
  minHeight: "100vh",
  background: "#f1f5f9",
};

const TOPBAR: React.CSSProperties = {
  gridColumn: "1 / -1",
  background: "#0f172a",
  display: "flex",
  alignItems: "center",
  padding: "0 20px",
  gap: 16,
  zIndex: 10,
};

const TOPBAR_LOGO: React.CSSProperties = {
  color: "#fff",
  fontWeight: 700,
  fontSize: 15,
  letterSpacing: "-0.02em",
  marginRight: 24,
};

const TOPBAR_NAV_ITEM = (active: boolean): React.CSSProperties => ({
  color: active ? "#fff" : "#94a3b8",
  fontSize: 13,
  fontWeight: active ? 600 : 400,
  padding: "4px 10px",
  borderRadius: 6,
  background: active ? "rgba(255,255,255,0.08)" : "transparent",
  cursor: "pointer",
  border: "none",
  textDecoration: "none",
});

const TOPBAR_SPACER: React.CSSProperties = { flex: 1 };

const TOPBAR_AVATAR: React.CSSProperties = {
  width: 28,
  height: 28,
  borderRadius: "50%",
  background: "#6366f1",
  color: "#fff",
  fontSize: 11,
  fontWeight: 700,
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
};

const LEFT_NAV: React.CSSProperties = {
  background: "#1e293b",
  color: "#cbd5e1",
  display: "flex",
  flexDirection: "column",
  padding: "16px 12px",
  gap: 2,
  overflowY: "auto",
};

const NAV_SECTION_LABEL: React.CSSProperties = {
  fontSize: 10,
  fontWeight: 600,
  letterSpacing: "0.08em",
  textTransform: "uppercase",
  color: "#475569",
  padding: "12px 8px 4px",
};

const NAV_ITEM = (active: boolean): React.CSSProperties => ({
  display: "flex",
  alignItems: "center",
  gap: 8,
  padding: "7px 10px",
  borderRadius: 6,
  fontSize: 13,
  fontWeight: active ? 600 : 400,
  color: active ? "#fff" : "#94a3b8",
  background: active ? "rgba(99,102,241,0.3)" : "transparent",
  cursor: "pointer",
});

const SIDEBAR: React.CSSProperties = {
  borderRight: "1px solid #e2e8f0",
  background: "#ffffff",
  display: "flex",
  flexDirection: "column",
  overflow: "hidden",
};

const CHAT_AREA: React.CSSProperties = {
  display: "flex",
  flexDirection: "column",
  background: "#f8fafc",
  overflow: "hidden",
};

const CHAT_HEADER: React.CSSProperties = {
  padding: "14px 24px",
  borderBottom: "1px solid #e2e8f0",
  background: "#ffffff",
  display: "flex",
  alignItems: "center",
  gap: 12,
};

const CHAT_TITLE: React.CSSProperties = {
  fontSize: 15,
  fontWeight: 600,
  color: "#0f172a",
  flex: 1,
};

const STATUS_PILL = (color: string): React.CSSProperties => ({
  fontSize: 11,
  fontWeight: 600,
  padding: "2px 8px",
  borderRadius: 99,
  background: `${color}18`,
  color: color,
  letterSpacing: "0.02em",
});

const MESSAGES: React.CSSProperties = {
  flex: 1,
  overflowY: "auto",
  padding: "20px 28px",
  display: "flex",
  flexDirection: "column",
  gap: 10,
};

const INPUT_BAR: React.CSSProperties = {
  padding: "14px 24px 18px",
  borderTop: "1px solid #e2e8f0",
  background: "#ffffff",
};

const INPUT_HINT: React.CSSProperties = {
  fontSize: 11,
  color: "#94a3b8",
  marginTop: 6,
  paddingLeft: 2,
};

// ─── Sample data ───────────────────────────────────────────────────────────────

const CONVERSATIONS = [
  { id: "c1", title: "Q3 Sales Analysis", preview: "Revenue grew 23% YoY driven by enterprise", timestamp: "10:42 AM", pinned: true, avatarText: "Q3", unread: 2 },
  { id: "c2", title: "Customer Churn Report", preview: "Retention improved to 97.2% this quarter", timestamp: "Yesterday", pinned: true, avatarText: "CC" },
  { id: "c3", title: "Product Roadmap Review", preview: "Three features prioritised for Q4", timestamp: "Mon", avatarText: "PR" },
  { id: "c4", title: "Competitor Benchmarking", preview: "FlyUI leads in developer ergonomics", timestamp: "Sun", avatarText: "CB" },
  { id: "c5", title: "APAC Expansion Plan", preview: "Market entry recommended for H1 2026", timestamp: "Fri", avatarText: "AP" },
];

const SUGGESTIONS = [
  { id: "s1", label: "Summarise this dataset", icon: "📄" },
  { id: "s2", label: "Find key revenue drivers", icon: "🔍" },
  { id: "s3", label: "Generate executive summary", icon: "📊" },
  { id: "s4", label: "Compare with last quarter", icon: "⚖️" },
];

// ─── Shared app chrome ─────────────────────────────────────────────────────────

function TopBar() {
  return (
    <div style={TOPBAR}>
      <span style={TOPBAR_LOGO}>✦ Analyst AI</span>
      {["Chat", "Pipelines", "Reports", "Settings"].map((label) => (
        <span key={label} style={TOPBAR_NAV_ITEM(label === "Chat")}>{label}</span>
      ))}
      <div style={TOPBAR_SPACER} />
      <span style={{ color: "#64748b", fontSize: 12 }}>Workspace: Acme Corp</span>
      <div style={TOPBAR_AVATAR}>BT</div>
    </div>
  );
}

function LeftNav() {
  return (
    <div style={LEFT_NAV}>
      <div style={NAV_SECTION_LABEL}>Assistants</div>
      {[
        { icon: "💬", label: "Chat", active: true },
        { icon: "🤖", label: "Agent Runs" },
        { icon: "📋", label: "Tasks" },
      ].map(({ icon, label, active }) => (
        <div key={label} style={NAV_ITEM(!!active)}>
          <span>{icon}</span>
          <span>{label}</span>
        </div>
      ))}
      <div style={NAV_SECTION_LABEL}>Data</div>
      {[
        { icon: "🗂️", label: "Datasets" },
        { icon: "📈", label: "Metrics" },
        { icon: "⚙️", label: "Pipelines" },
      ].map(({ icon, label }) => (
        <div key={label} style={NAV_ITEM(false)}>
          <span>{icon}</span>
          <span>{label}</span>
        </div>
      ))}
    </div>
  );
}

// ─── Meta ──────────────────────────────────────────────────────────────────────

const meta = {
  title: "Examples/Chat Interface",
  tags: ["autodocs"],
  parameters: {
    layout: "fullscreen",
    docs: {
      description: {
        component: `
## AI Analyst Chat — Full Application Screen

A complete business intelligence chat application — top navigation bar, left product navigation, conversation history sidebar, live message thread, and input bar. This is what a production AI chat product looks like end to end.

**Scenario**: Internal analytics assistant that lets business users query their data warehouse in plain English, view streamed answers, and maintain a history of past sessions.

### Components used

| Component | Role |
|---|---|
| \`ConversationList\` | Conversation history sidebar with search and pinned sessions |
| \`MessageBubble\` | Individual messages (user, assistant, system roles) |
| \`StreamingText\` | Real-time token streaming inside an assistant bubble |
| \`SuggestionPills\` | Quick-start prompts in the new-chat empty state |
| \`MessageInput\` | Controlled textarea with Send, character counter, and disabled state |

### Best practices demonstrated

- Full app shell (top nav + side nav) gives context — the chat is one screen in a larger product
- Conversation sidebar \`activeId\` highlights the current session
- \`isLoading\` bubble appears immediately on send, before the first token arrives
- \`StreamingText\` renders inside \`MessageBubble children\` — the bubble chrome wraps live text
- Input \`disabled\` during fetch prevents duplicate sends
- System messages announce session context without polluting the conversation
        `,
      },
    },
  },
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

// ─── Stories ───────────────────────────────────────────────────────────────────

export const ConversationInProgress: Story = {
  render: () => (
    <div style={APP}>
      <TopBar />
      <LeftNav />
      <div style={SIDEBAR}>
        <ConversationList
          items={CONVERSATIONS}
          activeId="c1"
          onSelect={() => {}}
          showSearch
        />
      </div>
      <div style={CHAT_AREA}>
        <div style={CHAT_HEADER}>
          <span style={CHAT_TITLE}>Q3 Sales Analysis</span>
          <span style={STATUS_PILL("#10b981")}>● Live</span>
          <span style={{ fontSize: 12, color: "#94a3b8" }}>12 450 rows · 18 cols</span>
        </div>
        <div style={MESSAGES}>
          <MessageBubble
            role="system"
            content="Dataset loaded — sales_q3_2025.parquet (12 450 rows, 18 columns). Ready to answer questions."
          />
          <MessageBubble
            role="user"
            content="Can you give me the top 3 revenue drivers for Q3?"
            authorName="You"
            timestamp="10:40 AM"
          />
          <MessageBubble
            role="assistant"
            content="Sure! Let me analyse the dataset."
            authorName="AI Analyst"
            avatarText="AI"
            timestamp="10:40 AM"
          />
          <MessageBubble
            role="user"
            content="Also include the percentage contribution for each driver."
            authorName="You"
            timestamp="10:41 AM"
          />
          <MessageBubble
            role="assistant"
            authorName="AI Analyst"
            avatarText="AI"
            timestamp="10:42 AM"
          >
            <StreamingText
              content={`Based on the Q3 dataset, here are the top 3 revenue drivers:

1. **Enterprise segment** — $2.56M (61% of total). Fortune 500 expansions accounted for 38% of this growth, driven by multi-seat licence deals signed in August.
2. **Widget Pro product line** — $1.42M (34%). Inventory constraints in September limited further upside — restocking is underway for Q4.
3. **APAC region entry** — $420k (10%). New market with 41% MoM growth trajectory; on track to exceed $1M ARR by end of H1 2026.`}
              isStreaming
              cursorVisible
              onStopStream={() => {}}
              onCopyText={() => {}}
            />
          </MessageBubble>
        </div>
        <div style={INPUT_BAR}>
          <MessageInput
            value=""
            placeholder="Ask a follow-up question…"
            onSend={() => {}}
            onChange={() => {}}
          />
          <p style={INPUT_HINT}>Shift+Enter for new line · Results are AI-generated — verify before sharing.</p>
        </div>
      </div>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story:
          "Active analysis session. The assistant is streaming the top-3 revenue drivers answer in real time. `StreamingText` is rendered as `children` of `MessageBubble` so the bubble chrome wraps around the live text.",
      },
      source: {
        code: `import { ConversationList, MessageBubble, StreamingText, MessageInput } from "@kitelus/fly-ui";

// Streaming reply — StreamingText as children of MessageBubble
<MessageBubble role="assistant" authorName="AI Analyst" avatarText="AI" timestamp={ts}>
  <StreamingText
    content={partialText}
    isStreaming={isStreaming}
    cursorVisible
    onStopStream={abortStream}
    onCopyText={(t) => navigator.clipboard.writeText(t)}
  />
</MessageBubble>

// Conversation sidebar with active session
<ConversationList
  items={conversations}
  activeId={currentId}
  onSelect={(id) => loadConversation(id)}
  showSearch
/>`,
      },
    },
  },
};

export const AwaitingResponse: Story = {
  render: () => (
    <div style={APP}>
      <TopBar />
      <LeftNav />
      <div style={SIDEBAR}>
        <ConversationList
          items={CONVERSATIONS}
          activeId="c2"
          onSelect={() => {}}
          showSearch
        />
      </div>
      <div style={CHAT_AREA}>
        <div style={CHAT_HEADER}>
          <span style={CHAT_TITLE}>Customer Churn Report</span>
          <span style={STATUS_PILL("#f59e0b")}>⟳ Thinking</span>
          <span style={{ fontSize: 12, color: "#94a3b8" }}>Q3 2025 · 48 200 rows</span>
        </div>
        <div style={MESSAGES}>
          <MessageBubble
            role="system"
            content="Dataset loaded — churn_q3_2025.csv (48 200 rows). Customer lifecycle data ready."
          />
          <MessageBubble
            role="user"
            content="What is the current churn rate and how does it compare to last quarter?"
            authorName="You"
            timestamp="11:05 AM"
          />
          <MessageBubble
            role="assistant"
            authorName="AI Analyst"
            avatarText="AI"
            timestamp="11:05 AM"
            isLoading
          />
        </div>
        <div style={INPUT_BAR}>
          <MessageInput
            value=""
            placeholder="Waiting for response…"
            disabled
            onSend={() => {}}
            onChange={() => {}}
          />
          <p style={INPUT_HINT}>Shift+Enter for new line · Results are AI-generated — verify before sharing.</p>
        </div>
      </div>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story:
          "User sent a message. An `isLoading` assistant bubble appears immediately (three-dot animation) while the model generates the response. The input is `disabled` to prevent duplicate sends.",
      },
      source: {
        code: `import { MessageBubble, MessageInput } from "@kitelus/fly-ui";

// Show loading bubble immediately after send
{isFetching && (
  <MessageBubble role="assistant" authorName="AI Analyst" avatarText="AI" isLoading />
)}

// Disable input while generating
<MessageInput value="" placeholder="Waiting for response…" disabled onSend={() => {}} onChange={() => {}} />`,
      },
    },
  },
};

export const NewConversation: Story = {
  render: () => (
    <div style={APP}>
      <TopBar />
      <LeftNav />
      <div style={SIDEBAR}>
        <ConversationList
          items={CONVERSATIONS}
          activeId={undefined}
          onSelect={() => {}}
          showSearch
        />
      </div>
      <div style={CHAT_AREA}>
        <div style={CHAT_HEADER}>
          <span style={CHAT_TITLE}>New Conversation</span>
          <span style={STATUS_PILL("#6366f1")}>Ready</span>
        </div>
        <div
          style={{
            ...MESSAGES,
            alignItems: "center",
            justifyContent: "center",
            gap: 28,
          }}
        >
          <div style={{ textAlign: "center", maxWidth: 440 }}>
            <div style={{ fontSize: 40, marginBottom: 12 }}>✦</div>
            <p style={{ fontSize: 20, fontWeight: 700, color: "#0f172a", margin: "0 0 8px" }}>
              What would you like to explore?
            </p>
            <p style={{ fontSize: 14, color: "#64748b", margin: 0, lineHeight: 1.6 }}>
              Ask a question about your data, generate a report, or choose a suggestion below to get started.
            </p>
          </div>
          <SuggestionPills
            suggestions={SUGGESTIONS}
            layout="grid"
            onSelect={() => {}}
          />
        </div>
        <div style={INPUT_BAR}>
          <MessageInput
            value=""
            placeholder="Ask anything about your data…"
            onSend={() => {}}
            onChange={() => {}}
          />
          <p style={INPUT_HINT}>Shift+Enter for new line · Connected to: sales_q3_2025.parquet, churn_q3_2025.csv</p>
        </div>
      </div>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story:
          "Empty state — no conversation selected. `SuggestionPills` surfaces four common starting actions in a grid layout, reducing blank-page friction. The footer hint shows which datasets are connected.",
      },
      source: {
        code: `import { SuggestionPills, MessageInput } from "@kitelus/fly-ui";

<SuggestionPills
  layout="grid"
  suggestions={[
    { id: "1", label: "Summarise this dataset", icon: "📄" },
    { id: "2", label: "Find key revenue drivers", icon: "🔍" },
    { id: "3", label: "Generate executive summary", icon: "📊" },
    { id: "4", label: "Compare with last quarter", icon: "⚖️" },
  ]}
  onSelect={(s) => setDraft(s.label)}
/>`,
      },
    },
  },
};
