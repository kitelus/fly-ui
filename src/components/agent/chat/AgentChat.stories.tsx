import type { Meta, StoryObj } from "@storybook/react-vite";

import { ConversationList } from "./ConversationList";
import { MessageBubble } from "./MessageBubble";
import { MessageInput } from "./MessageInput";
import { StreamingText } from "./StreamingText";
import { SuggestionPills } from "./SuggestionPills";

// ─── THEME ARGTYPE ─────────────────────────────────────────────────────────────

const themeArgType = {
  description:
    "Optional per-component theme override. Use `FlyUIThemeProvider` for app-wide theming.",
  control: "object",
  table: {
    type: {
      summary: "KiteTheme",
      detail:
        "{\n  primary?: string;\n  primaryHover?: string;\n  primaryActive?: string;\n  primarySubtle?: string;\n  foreground?: string;\n  muted?: string;\n  disabled?: string;\n  background?: string;\n  surface?: string;\n  border?: string;\n  radius?: string;\n  success?: string;\n  warning?: string;\n  danger?: string;\n  fontFamily?: string;\n  shadowSm?: string;\n  shadowMd?: string;\n  overlayBackground?: string;\n  overlayBlur?: string;\n}",
    },
    defaultValue: { summary: "undefined" },
  },
};

// ─── META ──────────────────────────────────────────────────────────────────────

const meta = {
  title: "Components/Chat",
  component: MessageBubble,
  subcomponents: { MessageInput, StreamingText, ConversationList, SuggestionPills },
  tags: ["autodocs"],
  args: {
    role: "assistant",
    content: "Hello! How can I help you today?",
    authorName: "Assistant",
    timestamp: "Just now",
    isLoading: false,
  },
  argTypes: {
    role: {
      description:
        "Controls bubble alignment and visual style. `user` aligns right with primary colour, `assistant` aligns left on a surface background, `system` centres with a warning tint.",
      options: ["user", "assistant", "system"],
      control: { type: "inline-radio" },
      table: { defaultValue: { summary: "assistant" } },
    },
    content: {
      description: "Text content rendered inside the bubble. Ignored when `children` is provided.",
      control: "text",
      table: { defaultValue: { summary: "undefined" } },
    },
    authorName: {
      description:
        "Display name shown above the bubble. Also used to generate the avatar initials when `avatarText` is omitted.",
      control: "text",
      table: { defaultValue: { summary: "undefined" } },
    },
    avatarText: {
      description:
        "One or two characters displayed inside the avatar circle. Falls back to the first letter of `authorName`.",
      control: "text",
      table: { defaultValue: { summary: "undefined" } },
    },
    timestamp: {
      description: "Timestamp string rendered next to the author name.",
      control: "text",
      table: { defaultValue: { summary: "undefined" } },
    },
    isLoading: {
      description: "When `true` replaces the bubble content with a three-dot animated indicator.",
      control: "boolean",
      table: { defaultValue: { summary: "false" } },
    },
    actions: {
      description:
        "Array of `{ label, onClick }` action buttons shown on hover below the bubble.",
      control: "object",
      table: { defaultValue: { summary: "undefined" } },
    },
    theme: themeArgType,
    className: { table: { category: "Styling" } },
    style: { table: { category: "Styling" } },
  },
  parameters: {
    docs: {
      description: {
        component: `
Chat UI components for AI agent conversations — messages, input, conversations list, and suggestions.

---

## Import

\`\`\`tsx
import { MessageBubble, MessageInput, StreamingText, ConversationList, SuggestionPills } from "@kitelus/fly-ui";
\`\`\`

## Components

| Component | Description |
|---|---|
| \`MessageBubble\` | Chat bubble supporting \`user\`, \`assistant\` and \`system\` roles with avatar, timestamp and hover actions |
| \`MessageInput\` | Textarea with Send button, character counter, and \`Shift+Enter\` multi-line support |
| \`StreamingText\` | Inline text with an animated cursor for real-time token streaming |
| \`ConversationList\` | Scrollable list of past conversations with search and active state |
| \`SuggestionPills\` | Horizontal or vertical pill buttons for pre-built prompt suggestions |

## Usage

\`\`\`tsx
import { MessageBubble, MessageInput, SuggestionPills } from "@kitelus/fly-ui";

<MessageBubble role="assistant" content="Hi! How can I help?" authorName="Agent" />
<MessageBubble role="user" content="Summarise this document." authorName="You" />
<MessageInput value={draft} onChange={setDraft} onSend={sendMessage} />
<SuggestionPills suggestions={SUGGESTIONS} onSelect={handleSuggestion} />
\`\`\`
        `,
      },
    },
  },
} satisfies Meta<typeof MessageBubble>;

export default meta;

type Story = StoryObj<typeof meta>;

// ─── PLAYGROUND ────────────────────────────────────────────────────────────────

export const Playground: Story = {
  parameters: {
    docs: {
      description: {
        story:
          "Interactive playground — switch roles, toggle `isLoading`, add an author name, and change the content using the controls panel.",
      },
    },
  },
};

// ─── ROLE VARIANTS ─────────────────────────────────────────────────────────────

export const AssistantBubble: Story = {
  args: {
    role: "assistant",
    content:
      "I've analysed your dataset. It has 12 columns and 4 820 rows. The most common issue is missing values in the `age` column (7.3%).",
    authorName: "AI Agent",
    avatarText: "AI",
    timestamp: "10:42 AM",
  },
  parameters: {
    docs: {
      description: {
        story:
          "Assistant role — left-aligned with a surface background, suitable for agent responses.",
      },
    },
  },
};

export const UserBubble: Story = {
  args: {
    role: "user",
    content: "Can you summarise the key findings from the last report?",
    authorName: "You",
    timestamp: "10:41 AM",
  },
  parameters: {
    docs: {
      description: {
        story:
          "User role — right-aligned with primary colour background, mirrored layout.",
      },
    },
  },
};

export const SystemBubble: Story = {
  args: {
    role: "system",
    content: "Session resumed. Context window is at 68% capacity.",
    authorName: "",
  },
  parameters: {
    docs: {
      description: {
        story:
          "System role — centred with a warning-tinted background. Use for status notices and agent metadata.",
      },
    },
  },
};

export const LoadingBubble: Story = {
  args: {
    role: "assistant",
    authorName: "AI Agent",
    avatarText: "AI",
    isLoading: true,
  },
  parameters: {
    docs: {
      description: {
        story:
          "Pass `isLoading` to replace the bubble content with a three-dot animation while waiting for the model response.",
      },
    },
  },
};

export const WithHoverActions: Story = {
  args: {
    role: "assistant",
    content: "The root cause is a misconfigured retry policy in the payment gateway.",
    authorName: "AI Agent",
    timestamp: "11:05 AM",
    actions: [
      { label: "Copy", onClick: () => {} },
      { label: "Retry", onClick: () => {} },
      { label: "Flag", onClick: () => {} },
    ],
  },
  parameters: {
    docs: {
      description: {
        story:
          "Pass an `actions` array to reveal action buttons on hover — useful for copy, retry, flag, or custom actions.",
      },
      source: {
        code: `<MessageBubble
  role="assistant"
  content="The root cause is a misconfigured retry policy in the payment gateway."
  authorName="AI Agent"
  actions={[
    { label: "Copy", onClick: () => {} },
    { label: "Retry", onClick: () => {} },
  ]}
/>`,
      },
    },
  },
};

export const Themed: Story = {
  args: {
    role: "assistant",
    content: "Theme applied via the `theme` prop — no provider needed.",
    authorName: "Agent",
    theme: { primary: "#7c3aed", primarySubtle: "#ede9fe", foreground: "#1e1b4b" },
  },
  parameters: {
    docs: {
      description: {
        story: "Per-component colour override via the `theme` prop.",
      },
    },
  },
};

export const DarkMode: Story = {
  args: {
    role: "assistant",
    content: "Dark mode is applied automatically via `prefers-color-scheme: dark`.",
    authorName: "AI Agent",
    timestamp: "Now",
    theme: { primary: "#38bdf8", foreground: "#f1f5f9", muted: "#94a3b8", surface: "#1e293b", background: "#0f172a", border: "#334155" },
  },
  parameters: {
    backgrounds: { default: "ink" },
    docs: {
      description: {
        story: "Dark-mode appearance — colours adapt automatically via `prefers-color-scheme: dark`.",
      },
      source: { code: `<MessageBubble role="assistant" content="Hello." authorName="AI Agent" />` },
    },
  },
  decorators: [
    (Story) => (
      <div style={{ background: "#0f172a", padding: "1.5rem", borderRadius: 8, maxWidth: 480 }}>
        <Story />
      </div>
    ),
  ],
};

// ─── OTHER COMPONENT SHOWCASES ─────────────────────────────────────────────────

export const StreamingTextShowcase: Story = {
  render: () => (
    <div style={{ display: "flex", flexDirection: "column", gap: 24, maxWidth: 560 }}>
      <div>
        <p style={{ fontSize: 12, color: "#64748b", marginBottom: 8 }}>Streaming (cursor visible)</p>
        <StreamingText content="Analysing your data in real time..." isStreaming cursorVisible />
      </div>
      <div>
        <p style={{ fontSize: 12, color: "#64748b", marginBottom: 8 }}>Completed (no cursor)</p>
        <StreamingText content="Analysis complete. Found 3 anomalies." isStreaming={false} />
      </div>
      <div>
        <p style={{ fontSize: 12, color: "#64748b", marginBottom: 8 }}>With Stop + Copy buttons</p>
        <StreamingText
          content="Generating report..."
          isStreaming
          onStopStream={() => {}}
          onCopyText={() => {}}
        />
      </div>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story:
          "`StreamingText` renders inline text with an animated blinking cursor during streaming. Pass `onStopStream` and `onCopyText` to show action buttons.",
      },
      source: {
        code: `// Streaming
<StreamingText content="Analysing…" isStreaming cursorVisible />

// Completed
<StreamingText content="Done." isStreaming={false} />

// With actions
<StreamingText
  content="Generating…"
  isStreaming
  onStopStream={() => abortController.abort()}
  onCopyText={(text) => navigator.clipboard.writeText(text)}
/>`,
      },
    },
  },
};

export const MessageInputShowcase: Story = {
  render: () => (
    <div style={{ display: "flex", flexDirection: "column", gap: 24, maxWidth: 560 }}>
      <MessageInput
        value=""
        placeholder="Ask the agent anything…"
        onSend={() => {}}
        onChange={() => {}}
        hint="Shift+Enter for new line"
      />
      <MessageInput
        value="Draft message with character count"
        maxLength={200}
        onSend={() => {}}
        onChange={() => {}}
      />
      <MessageInput
        value=""
        disabled
        placeholder="Agent is thinking…"
        onSend={() => {}}
        onChange={() => {}}
      />
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story:
          "`MessageInput` — controlled textarea with Send button. Supports `maxLength` with a live character counter, `hint` text, and `disabled` state. Press `Enter` to send, `Shift+Enter` for a new line.",
      },
      source: {
        code: `<MessageInput
  value={draft}
  placeholder="Ask the agent anything…"
  hint="Shift+Enter for new line"
  maxLength={2000}
  onSend={(text) => sendMessage(text)}
  onChange={(text) => setDraft(text)}
/>`,
      },
    },
  },
};

export const ConversationListShowcase: Story = {
  render: () => (
    <div style={{ maxWidth: 320 }}>
      <ConversationList
        items={[
          { id: "1", title: "Data analysis report", preview: "Found 3 anomalies in the dataset", timestamp: "10:42 AM", pinned: true },
          { id: "2", title: "Document summarisation", preview: "The executive summary covers Q3 results", timestamp: "Yesterday" },
          { id: "3", title: "Code review session", preview: "Authentication logic looks solid", timestamp: "Mon" },
          { id: "4", title: "Customer support triage", preview: "Issue escalated to engineering", timestamp: "Sun" },
        ]}
        activeId="1"
        onSelect={() => {}}
        showSearch
      />
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story:
          "`ConversationList` — sidebar list of past conversations. Supports search, active highlight, pinned indicator, and previews. Pass `activeId` to highlight the current conversation.",
      },
      source: {
        code: `<ConversationList
  items={conversations}
  activeId={currentId}
  onSelect={(id) => setCurrentId(id)}
  showSearch
/>`,
      },
    },
  },
};

export const SuggestionPillsShowcase: Story = {
  render: () => (
    <div style={{ display: "flex", flexDirection: "column", gap: 24, maxWidth: 560 }}>
      <div>
        <p style={{ fontSize: 12, color: "#64748b", marginBottom: 8 }}>Row layout (default)</p>
        <SuggestionPills
          suggestions={[
            { id: "1", label: "Summarise document", icon: "📄" },
            { id: "2", label: "Find anomalies", icon: "🔍" },
            { id: "3", label: "Generate report", icon: "📊" },
            { id: "4", label: "Compare versions", icon: "⚖️" },
          ]}
          onSelect={() => {}}
        />
      </div>
      <div>
        <p style={{ fontSize: 12, color: "#64748b", marginBottom: 8 }}>Column layout</p>
        <SuggestionPills
          layout="column"
          suggestions={[
            { id: "a", label: "What are the key findings?" },
            { id: "b", label: "Show me the data trends" },
            { id: "c", label: "Draft an executive summary" },
          ]}
          onSelect={() => {}}
        />
      </div>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story:
          "`SuggestionPills` — clickable prompt suggestion chips. Use `layout=\"row\"` (default) for horizontal wrap or `layout=\"column\"` for a vertical list. Each pill can have an optional `icon`.",
      },
      source: {
        code: `<SuggestionPills
  suggestions={[
    { id: "1", label: "Summarise document", icon: "📄" },
    { id: "2", label: "Find anomalies", icon: "🔍" },
  ]}
  onSelect={(s) => setPrompt(s.label)}
/>`,
      },
    },
  },
};
