import type { Meta, StoryObj } from "@storybook/react-vite";
import React from "react";

import { ConversationList } from "./ConversationList";
import { MessageBubble } from "./MessageBubble";
import { MessageInput } from "./MessageInput";
import { StreamingText } from "./StreamingText";
import { SuggestionPills } from "./SuggestionPills";

/** Minimal inline markdown renderer — no external deps required */
function renderMarkdown(text: string) {
  const lines = text.split("\n");
  const nodes: React.ReactNode[] = [];
  let listItems: React.ReactNode[] = [];

  const flushList = () => {
    if (listItems.length) {
      nodes.push(
        <ul
          key={`ul-${nodes.length}`}
          style={{ margin: "4px 0", paddingLeft: 20 }}
        >
          {listItems}
        </ul>,
      );
      listItems = [];
    }
  };

  const renderInline = (s: string, key: number): React.ReactNode => {
    const parts: React.ReactNode[] = [];
    let last = 0;
    const combined = /\*\*(.+?)\*\*|_(.+?)_|`([^`]+)`/g;
    let m: RegExpExecArray | null;
    while ((m = combined.exec(s)) !== null) {
      if (m.index > last) parts.push(s.slice(last, m.index));
      if (m[1] !== undefined) parts.push(<strong key={m.index}>{m[1]}</strong>);
      else if (m[2] !== undefined) parts.push(<em key={m.index}>{m[2]}</em>);
      else if (m[3] !== undefined)
        parts.push(
          <code
            key={m.index}
            style={{
              fontFamily: "monospace",
              background: "var(--kite-surface)",
              padding: "1px 4px",
              borderRadius: 3,
              fontSize: "0.9em",
            }}
          >
            {m[3]}
          </code>,
        );
      last = m.index + m[0].length;
    }
    if (last < s.length) parts.push(s.slice(last));
    return <span key={key}>{parts}</span>;
  };

  lines.forEach((line, i) => {
    const li = line.match(/^[-*] (.+)/);
    if (li) {
      listItems.push(<li key={i}>{renderInline(li[1], i)}</li>);
    } else {
      flushList();
      if (line.trim())
        nodes.push(
          <p key={i} style={{ margin: "2px 0" }}>
            {renderInline(line, i)}
          </p>,
        );
    }
  });
  flushList();
  return <div style={{ lineHeight: 1.6 }}>{nodes}</div>;
}

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

const meta = {
  title: "Components/Chat",
  component: MessageBubble,
  subcomponents: {
    MessageInput,
    StreamingText,
    ConversationList,
    SuggestionPills,
  },
  tags: ["autodocs"],
  args: {
    role: "assistant",
    content: "Hello! How can I help you today?",
    authorName: "Assistant",
    timestamp: "Just now",
    isLoading: false,
    renderContent: (content: string) => renderMarkdown(content),
  },
  argTypes: {
    role: {
      description:
        "Controls bubble alignment and visual style. `user` aligns right with primary colour, `assistant` aligns left on a surface background, `system` centres with a horizontal rule separator.",
      options: ["user", "assistant", "system"],
      control: { type: "inline-radio" },
      table: { defaultValue: { summary: "assistant" } },
    },
    content: {
      description:
        "Text content rendered inside the bubble. Ignored when `renderContent` is provided.",
      control: "text",
      table: { defaultValue: { summary: "undefined" } },
    },
    authorName: {
      description:
        "Display name shown above the bubble. Also used to generate avatar initials when `avatarText` is omitted.",
      control: "text",
      table: { defaultValue: { summary: "undefined" } },
    },
    avatarText: {
      description:
        "One or two characters displayed inside the avatar circle. Falls back to the first letter of `authorName`.",
      control: "text",
      table: { defaultValue: { summary: "undefined" } },
    },
    avatarUrl: {
      description:
        "URL of an avatar image. When provided, replaces the initials with the image.",
      control: "text",
      table: { defaultValue: { summary: "undefined" } },
    },
    timestamp: {
      description: "Timestamp string rendered next to the author name.",
      control: "text",
      table: { defaultValue: { summary: "undefined" } },
    },
    showTimestamp: {
      description:
        "Show or hide the timestamp. When `false`, the timestamp is not rendered even if `timestamp` is set.",
      control: "boolean",
      table: { defaultValue: { summary: "true" } },
    },
    isLoading: {
      description:
        "When `true`, replaces the bubble content with a three-dot animated indicator.",
      control: "boolean",
      table: { defaultValue: { summary: "false" } },
    },
    loadingLabel: {
      description:
        "Accessible label read by screen readers when the loading indicator is shown.",
      control: "text",
      table: { defaultValue: { summary: '"Loading response"' } },
    },
    isFailed: {
      description:
        "Marks the message as failed — dims the bubble and shows `errorMessage` below it.",
      control: "boolean",
      table: { defaultValue: { summary: "false" } },
    },
    errorMessage: {
      description:
        "Error text shown below the bubble when the message failed to send.",
      control: "text",
      table: { defaultValue: { summary: "undefined" } },
    },
    onRetry: {
      description:
        "Callback — shows a Retry button below a failed message when provided.",
      control: false,
    },
    retryLabel: {
      description: "Label for the Retry button.",
      control: "text",
      table: { defaultValue: { summary: '"Retry"' } },
    },
    actions: {
      description:
        "Array of `{ label, onClick, icon?, danger?, disabled?, ariaLabel? }` action buttons revealed on hover below the bubble.",
      control: "object",
      table: { defaultValue: { summary: "undefined" } },
    },
    actionsAriaLabel: {
      description: "Accessible label for the actions button group.",
      control: "text",
      table: { defaultValue: { summary: '"Message actions"' } },
    },
    renderContent: {
      description:
        "Custom render function for the message text — receives `(content, role)` and returns a ReactNode. Use for markdown rendering, syntax highlighting, etc.",
      control: false,
    },
    renderAvatar: {
      description:
        "Custom render function for the avatar — receives `role` and returns a ReactNode.",
      control: false,
    },
    headerSlot: {
      description:
        "ReactNode injected in the bubble header (between the author row and the bubble).",
      control: false,
      table: { category: "Slots" },
    },
    footerSlot: {
      description: "ReactNode injected below the bubble (after actions).",
      control: false,
      table: { category: "Slots" },
    },
    theme: themeArgType,
    className: { table: { category: "Styling" } },
    style: { table: { category: "Styling" } },
  },
  parameters: {
    docs: {
      description: {
        component: `
Chat UI components for AI agent conversations — messages, input, conversation sidebar, and prompt suggestions.

  > Availability: These components are available in '@kitelus/fly-ui' version '0.1.5-rc.0' and later.

---

## Install

\`\`\`bash
npm install @kitelus/fly-ui
\`\`\`

## Import

\`\`\`tsx
import {
  MessageBubble,
  MessageInput,
  StreamingText,
  ConversationList,
  SuggestionPills,
} from "@kitelus/fly-ui";
\`\`\`

## Components

| Component | Description |
|---|---|
| \`MessageBubble\` | Chat bubble for \`user\`, \`assistant\`, and \`system\` roles with avatar, timestamp, hover actions, and error/retry state |
| \`MessageInput\` | Pill-style textarea with Send button, attach, actions dropdown, char counter, and auto-grow |
| \`StreamingText\` | Inline text with an animated blinking cursor for real-time token streaming |
| \`ConversationList\` | Scrollable sidebar list with pinned groups, search, unread badges, and per-item actions |
| \`SuggestionPills\` | Prompt suggestion chips in row, column, or grid layout |

---

## Quick start

\`\`\`tsx
import { MessageBubble, MessageInput, SuggestionPills } from "@kitelus/fly-ui";

// Render a conversation
<MessageBubble role="user"      content="Summarise this document." authorName="You" />
<MessageBubble role="assistant" content="Sure! Here are the key points…" authorName="Agent" />

// Input with send handler
<MessageInput
  value={draft}
  placeholder="Ask the agent anything…"
  onChange={setDraft}
  onSend={(text) => sendMessage(text)}
/>

// Suggestion pills
<SuggestionPills
  suggestions={[
    { id: "1", label: "Summarise document" },
    { id: "2", label: "Find anomalies" },
  ]}
  onSelect={(s) => setDraft(s.label)}
/>
\`\`\`
        `,
      },
    },
  },
} satisfies Meta<typeof MessageBubble>;

export default meta;

type Story = StoryObj<typeof meta>;

// ─── MessageBubble stories ────────────────────────────────────────────────────

export const Playground: Story = {
  parameters: {
    docs: {
      description: {
        story:
          "Interactive playground — switch roles, toggle `isLoading` and `isFailed`, add an author name, and change the content using the controls panel.",
      },
    },
  },
};

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
          "System role — centred with a horizontal rule separator. Use for status notices and agent metadata.",
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
    loadingLabel: "AI is thinking",
  },
  parameters: {
    docs: {
      description: {
        story:
          "Pass `isLoading` to replace the bubble content with a three-dot animation while waiting for a model response. `loadingLabel` is read by screen readers.",
      },
      source: {
        code: `<MessageBubble
  role="assistant"
  authorName="AI Agent"
  isLoading
  loadingLabel="AI is thinking"
/>`,
      },
    },
  },
};

export const FailedBubble: Story = {
  args: {
    role: "user",
    content: "Send the weekly report to the team.",
    authorName: "You",
    isFailed: true,
    errorMessage: "Message failed to send — network timeout.",
    onRetry: () => {},
    retryLabel: "Retry",
  },
  parameters: {
    docs: {
      description: {
        story:
          "Error state — set `isFailed` to dim the bubble. Add `errorMessage` to show a reason below, and `onRetry` to show a Retry button.",
      },
      source: {
        code: `<MessageBubble
  role="user"
  content="Send the weekly report to the team."
  authorName="You"
  isFailed
  errorMessage="Message failed to send — network timeout."
  onRetry={() => retrySend(messageId)}
  retryLabel="Retry"
/>`,
      },
    },
  },
};

export const WithHoverActions: Story = {
  args: {
    role: "assistant",
    content:
      "The root cause is a misconfigured retry policy in the payment gateway.",
    authorName: "AI Agent",
    timestamp: "11:05 AM",
    actions: [
      { label: "Copy", onClick: () => {} },
      { label: "Retry", onClick: () => {} },
      { label: "Flag", onClick: () => {}, danger: true },
    ],
    actionsAriaLabel: "Message actions",
  },
  parameters: {
    docs: {
      description: {
        story:
          "Pass an `actions` array to reveal buttons on hover. Each action accepts `label`, `onClick`, optional `icon`, `danger` (red style), `disabled`, and `ariaLabel`. Use `actionsAriaLabel` to override the group label for accessibility.",
      },
      source: {
        code: `<MessageBubble
  role="assistant"
  content="The root cause is a misconfigured retry policy."
  authorName="AI Agent"
  actions={[
    { label: "Copy",  onClick: () => navigator.clipboard.writeText(content) },
    { label: "Retry", onClick: () => regenerate(messageId) },
    { label: "Flag",  onClick: () => flagMessage(messageId), danger: true },
  ]}
  actionsAriaLabel="Message actions"
/>`,
      },
    },
  },
};

export const WithTimestampHidden: Story = {
  args: {
    role: "assistant",
    content: "Timestamp is hidden on this bubble.",
    authorName: "AI Agent",
    timestamp: "10:42 AM",
    showTimestamp: false,
  },
  parameters: {
    docs: {
      description: {
        story:
          "Set `showTimestamp={false}` to hide the timestamp even when a `timestamp` value is provided — useful for dense chat layouts.",
      },
      source: {
        code: `<MessageBubble
  role="assistant"
  content="Timestamp is hidden on this bubble."
  authorName="AI Agent"
  timestamp="10:42 AM"
  showTimestamp={false}
/>`,
      },
    },
  },
};

export const CustomContentRender: Story = {
  render: (args) => (
    <MessageBubble
      {...args}
      role="assistant"
      authorName="AI Agent"
      timestamp="Now"
      content={`**Bold text**, _italic text_, and \`inline code\`.

- Item 1
- Item 2
- Item 3`}
      renderContent={(content) => renderMarkdown(content)}
    />
  ),
  parameters: {
    docs: {
      description: {
        story:
          "Use `renderContent(content, role)` to apply custom formatting — markdown rendering, syntax highlighting, or any ReactNode. Install `react-markdown` for full CommonMark support, or use a lightweight inline parser as shown here.",
      },
      source: {
        code: `import ReactMarkdown from "react-markdown";

<MessageBubble
  role="assistant"
  content={markdownContent}
  authorName="AI Agent"
  renderContent={(content) => <ReactMarkdown>{content}</ReactMarkdown>}
/>`,
      },
    },
  },
};

export const WithHeaderAndFooterSlots: Story = {
  args: {
    role: "assistant",
    content: "Analysis complete — 3 anomalies detected.",
    authorName: "Analysis Agent",
    timestamp: "10:45 AM",
    headerSlot: (
      <div
        style={{
          fontSize: 11,
          color: "#7c3aed",
          fontWeight: 600,
          marginBottom: 4,
        }}
      >
        AGENT · HIGH PRIORITY
      </div>
    ),
    footerSlot: (
      <div style={{ marginTop: 6, fontSize: 11, color: "#64748b" }}>
        Analysed 12,450 rows · 2.3s
      </div>
    ),
  },
  parameters: {
    docs: {
      description: {
        story:
          "Use `headerSlot` to inject content above the bubble and `footerSlot` to append content below the actions row — for metadata, reactions, or thread counts.",
      },
      source: {
        code: `<MessageBubble
  role="assistant"
  content="Analysis complete — 3 anomalies detected."
  authorName="Analysis Agent"
  headerSlot={<AgentBadge label="HIGH PRIORITY" />}
  footerSlot={<span>Analysed 12,450 rows · 2.3s</span>}
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
    theme: {
      primary: "#7c3aed",
      primarySubtle: "#ede9fe",
      foreground: "#1e1b4b",
    },
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
    content:
      "Dark mode is applied automatically via `prefers-color-scheme: dark`.",
    authorName: "AI Agent",
    timestamp: "Now",
    theme: {
      primary: "#38bdf8",
      foreground: "#f1f5f9",
      muted: "#94a3b8",
      surface: "#1e293b",
      background: "#0f172a",
      border: "#334155",
    },
  },
  parameters: {
    backgrounds: { default: "ink" },
    docs: {
      description: {
        story:
          "Dark-mode appearance — supply a dark theme or rely on `prefers-color-scheme: dark` in production.",
      },
      source: {
        code: `<MessageBubble
  role="assistant"
  content="Dark mode is applied automatically via \`prefers-color-scheme: dark\`."
  authorName="AI Agent"
  timestamp="Now"
  theme={{ primary: "#38bdf8", foreground: "#f1f5f9", muted: "#94a3b8", surface: "#1e293b", background: "#0f172a", border: "#334155" }}
/>`,
      },
    },
  },
  decorators: [
    (Story) => (
      <div
        style={{
          background: "#0f172a",
          padding: "1.5rem",
          borderRadius: 8,
          maxWidth: 480,
        }}
      >
        <Story />
      </div>
    ),
  ],
};

// ─── StreamingText showcase ───────────────────────────────────────────────────

export const StreamingTextShowcase: Story = {
  render: () => (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        gap: 24,
        maxWidth: 560,
      }}
    >
      <div>
        <p style={{ fontSize: 12, color: "#64748b", marginBottom: 8 }}>
          Streaming — cursor visible
        </p>
        <StreamingText
          content="Analysing your data in real time..."
          isStreaming
          cursorVisible
        />
      </div>
      <div>
        <p style={{ fontSize: 12, color: "#64748b", marginBottom: 8 }}>
          Completed — no cursor
        </p>
        <StreamingText
          content="Analysis complete. Found 3 anomalies."
          isStreaming={false}
        />
      </div>
      <div>
        <p style={{ fontSize: 12, color: "#64748b", marginBottom: 8 }}>
          With Stop + Copy + extra action
        </p>
        <StreamingText
          content="Generating executive summary..."
          isStreaming
          onStopStream={() => {}}
          onCopyText={() => {}}
          stopLabel="Stop generating"
          copyLabel="Copy text"
          copyFeedbackLabel="Copied!"
          copyFeedbackDuration={2000}
          extraActions={[
            { label: "Export", onClick: () => {}, ariaLabel: "Export content" },
          ]}
        />
      </div>
      <div>
        <p style={{ fontSize: 12, color: "#64748b", marginBottom: 8 }}>
          renderContent — inline markdown formatting
        </p>
        <StreamingText
          content="**Analysis complete.** Found `3 anomalies` in the dataset. Key finding: _revenue is trending upward_."
          isStreaming={false}
          onCopyText={() => {}}
          copyLabel="Copy"
          renderContent={(text) => renderMarkdown(text)}
        />
      </div>
      <div>
        <p style={{ fontSize: 12, color: "#64748b", marginBottom: 8 }}>
          No copy feedback (set to null)
        </p>
        <StreamingText
          content="Silent copy — no feedback shown."
          isStreaming={false}
          onCopyText={() => {}}
          copyFeedbackLabel={null}
        />
      </div>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: `
\`StreamingText\` — inline text with an animated blinking cursor during streaming.

**Key features:**
- \`isStreaming\` + \`cursorVisible\` shows the blinking cursor
- \`onStopStream\` shows a Stop button (\`stopLabel\` overrides the label)
- \`onCopyText\` shows a Copy button (\`copyLabel\` overrides the label)
- \`copyFeedbackLabel\` text shown briefly after copying (set to \`null\` to disable feedback)
- \`copyFeedbackDuration\` controls how long the feedback text is shown (default 1500 ms)
- \`extraActions\` array adds additional buttons alongside Stop/Copy
- \`renderContent(text)\` replaces plain text with custom formatting
- \`renderActions(content, isStreaming)\` fully replaces the actions bar
        `,
      },
      source: {
        code: `// Basic streaming with cursor
<StreamingText content="Analysing data in real time..." isStreaming cursorVisible />

// With Stop, Copy, and custom extra action
<StreamingText
  content="Generating report..."
  isStreaming
  onStopStream={() => abortController.abort()}
  onCopyText={(text) => navigator.clipboard.writeText(text)}
  stopLabel="Stop generating"
  copyLabel="Copy text"
  copyFeedbackLabel="Copied!"
  copyFeedbackDuration={2000}
  extraActions={[
    { label: "Export", onClick: () => exportContent(), ariaLabel: "Export as file" },
  ]}
/>

// No copy feedback
<StreamingText
  content={completedText}
  isStreaming={false}
  onCopyText={(text) => navigator.clipboard.writeText(text)}
  copyFeedbackLabel={null}
/>

// Markdown render with custom content renderer
<StreamingText
  content={markdownText}
  isStreaming={false}
  renderContent={(text) => <ReactMarkdown>{text}</ReactMarkdown>}
/>`,
      },
    },
  },
};

// ─── MessageInput showcase ────────────────────────────────────────────────────

export const MessageInputShowcase: Story = {
  render: () => (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        gap: 24,
        maxWidth: 560,
      }}
    >
      <div>
        <p style={{ fontSize: 12, color: "#64748b", marginBottom: 8 }}>
          Full-featured — attach, actions, hint
        </p>
        <MessageInput
          value=""
          placeholder="Ask the agent anything…"
          onSend={() => {}}
          onChange={() => {}}
          showAttach
          onAttach={() => {}}
          attachAriaLabel="Attach a file"
          actions={[
            { icon: "Web", label: "Search the web", onClick: () => {} },
            { icon: "Doc", label: "Upload document", onClick: () => {} },
          ]}
          actionsAriaLabel="More options"
          hint="Enter to send · Shift+Enter for new line"
        />
      </div>
      <div>
        <p style={{ fontSize: 12, color: "#64748b", marginBottom: 8 }}>
          Character counter + text-label send button
        </p>
        <MessageInput
          value="Draft message with character counter enabled"
          maxLength={200}
          sendLabel="Send"
          sendAriaLabel="Send message"
          onSend={() => {}}
          onChange={() => {}}
        />
      </div>
      <div>
        <p style={{ fontSize: 12, color: "#64748b", marginBottom: 8 }}>
          Enter key disabled — button-only send
        </p>
        <MessageInput
          value=""
          placeholder="Press the button to send…"
          sendOnEnter={false}
          onSend={() => {}}
          onChange={() => {}}
        />
      </div>
      <div>
        <p style={{ fontSize: 12, color: "#64748b", marginBottom: 8 }}>
          Disabled — agent is thinking
        </p>
        <MessageInput
          value=""
          disabled
          placeholder="Agent is thinking…"
          onSend={() => {}}
          onChange={() => {}}
        />
      </div>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: `
\`MessageInput\` — modern pill-style input with a rich toolbar.

**Key features:**
- Auto-growing textarea: expands up to \`maxRows\` (default 200px) before scrolling
- Press **Enter** to send, **Shift+Enter** for a new line (controlled via \`sendOnEnter\`, default \`true\`)
- \`showAttach\` + \`onAttach\` shows an attach icon button (\`attachAriaLabel\` overrides its label)
- \`actions\` array opens a dropdown menu of additional actions (\`actionsAriaLabel\` overrides the trigger label)
- \`maxLength\` shows a character counter; turns amber near the limit, red when over
- \`hint\` shows a keyboard hint next to the send button
- \`sendLabel\` replaces the default icon send button with a text label send button (\`sendAriaLabel\` overrides its label)
- \`autoFocus\` focuses the textarea on mount — useful for modal inboxes
- \`toolbarLeftSlot\` / \`toolbarRightSlot\` inject custom content in the toolbar
- \`renderSendButton(canSend, onClick)\` fully replaces the send button
- \`disabled\` disables the entire input — useful while the agent is processing
        `,
      },
      source: {
        code: `// Full-featured input
<MessageInput
  value={draft}
  placeholder="Ask the agent anything…"
  hint="Enter to send · Shift+Enter for new line"
  showAttach
  onAttach={() => openFilePicker()}
  attachAriaLabel="Attach a file"
  actions={[
    { icon: "Web", label: "Search the web",  onClick: () => enableWebSearch() },
    { icon: "Doc", label: "Upload document", onClick: () => openFilePicker() },
  ]}
  actionsAriaLabel="More options"
  maxLength={2000}
  onSend={(text) => sendMessage(text)}
  onChange={(text) => setDraft(text)}
/>

// Text-label send button with custom aria label
<MessageInput
  value={draft}
  sendLabel="Send"
  sendAriaLabel="Send message"
  onSend={(text) => sendMessage(text)}
  onChange={(text) => setDraft(text)}
/>

// Button-only send (Enter key disabled)
<MessageInput
  value={draft}
  sendOnEnter={false}
  placeholder="Click Send to submit…"
  onSend={(text) => sendMessage(text)}
  onChange={(text) => setDraft(text)}
/>

// Disabled while agent is busy
<MessageInput
  value=""
  disabled
  placeholder="Agent is thinking…"
  onSend={() => {}}
  onChange={() => {}}
/>

// Auto-focused (for modal or drawer inboxes)
<MessageInput
  value={draft}
  autoFocus
  onSend={(text) => sendMessage(text)}
  onChange={(text) => setDraft(text)}
/>`,
      },
    },
  },
};

// ─── ConversationList showcase ────────────────────────────────────────────────

export const ConversationListShowcase: Story = {
  render: () => (
    <div style={{ display: "flex", gap: 24 }}>
      <div
        style={{
          width: 280,
          border: "1px solid #e2e8f0",
          borderRadius: 8,
          overflow: "hidden",
        }}
      >
        <p
          style={{
            fontSize: 11,
            color: "#64748b",
            padding: "8px 12px",
            margin: 0,
            borderBottom: "1px solid #e2e8f0",
          }}
        >
          Default — with search and groups
        </p>
        <ConversationList
          label="Conversations"
          items={[
            {
              id: "1",
              title: "Data analysis report",
              preview: "Found 3 anomalies in the dataset",
              timestamp: "10:42 AM",
              pinned: true,
              avatarText: "DA",
              unread: 2,
            },
            {
              id: "2",
              title: "Document summarisation",
              preview: "The executive summary covers Q3 results",
              timestamp: "Yesterday",
              pinned: true,
              avatarText: "DS",
            },
            {
              id: "3",
              title: "Code review session",
              preview: "Authentication logic looks solid",
              timestamp: "Mon",
              avatarText: "CR",
            },
            {
              id: "4",
              title: "Customer support triage",
              preview: "Issue escalated to engineering",
              timestamp: "Sun",
              avatarText: "CS",
              unread: 5,
            },
            {
              id: "5",
              title: "Market research brief",
              preview: "Competitor analysis for Q4",
              timestamp: "Fri",
              avatarText: "MR",
            },
          ]}
          activeId="1"
          onSelect={() => {}}
          onNew={() => {}}
          onPin={() => {}}
          onDelete={() => {}}
          onRename={() => {}}
          showSearch
          newAriaLabel="New conversation"
          newLabel="+"
          searchPlaceholder="Search conversations…"
          pinnedGroupLabel="Pinned"
          recentGroupLabel="Recent"
          emptyText="No conversations yet."
        />
      </div>
      <div
        style={{
          width: 280,
          border: "1px solid #e2e8f0",
          borderRadius: 8,
          overflow: "hidden",
        }}
      >
        <p
          style={{
            fontSize: 11,
            color: "#64748b",
            padding: "8px 12px",
            margin: 0,
            borderBottom: "1px solid #e2e8f0",
          }}
        >
          No search bar
        </p>
        <ConversationList
          items={[
            {
              id: "a",
              title: "Quick task",
              preview: "Ask me anything",
              timestamp: "Just now",
              avatarText: "QT",
            },
            {
              id: "b",
              title: "Long session",
              preview: "Deep dive analysis",
              timestamp: "2h ago",
              avatarText: "LS",
            },
          ]}
          activeId="a"
          showSearch={false}
          onSelect={() => {}}
        />
      </div>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: `
\`ConversationList\` — sidebar list with groups, search, and per-item actions.

**Key features:**
- Items with \`pinned: true\` are grouped under a "Pinned" section (\`pinnedGroupLabel\` overrides the label)
- \`activeId\` highlights the current conversation; the title turns primary colour
- \`unread\` (number) shows a pill badge on the item
- \`showSearch\` adds a search box (default \`true\`); pair with \`searchValue\` + \`onSearchChange\` for controlled search
- \`searchPlaceholder\` overrides the search input placeholder
- Per-item contextual actions:
  - \`onPin(id, pinned, item)\` — shows a Pin/Unpin button on hover
  - \`onDelete(id, item)\` — shows a Delete button (danger style) on hover
  - \`onRename(id, item)\` — shows a Rename button on hover
- \`onNew()\` shows a new-conversation button in the header (\`newLabel\` / \`newAriaLabel\` override text and a11y label)
- \`renderItem(item, isActive)\` fully replaces a single row
- \`emptyText\` / \`renderEmpty()\` shown when the filtered list is empty
- \`headerSlot\` / \`footerSlot\` inject content at the top/bottom of the container
        `,
      },
      source: {
        code: `<ConversationList
  label="Conversations"
  items={conversations}
  activeId={currentId}
  onSelect={(id) => setCurrentId(id)}
  onNew={() => createConversation()}
  newLabel="New chat"
  newAriaLabel="Start a new conversation"
  onPin={(id, pinned) => togglePin(id, pinned)}
  onDelete={(id) => deleteConversation(id)}
  onRename={(id) => openRenameDialog(id)}
  showSearch
  searchValue={search}
  onSearchChange={setSearch}
  searchPlaceholder="Search conversations…"
  emptyText="No conversations match your search."
  pinnedGroupLabel="Pinned"
  recentGroupLabel="Recent"
/>`,
      },
    },
  },
};

// ─── SuggestionPills showcase ─────────────────────────────────────────────────

export const SuggestionPillsShowcase: Story = {
  render: () => (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        gap: 24,
        maxWidth: 560,
      }}
    >
      <div>
        <p style={{ fontSize: 12, color: "#64748b", marginBottom: 8 }}>
          Row layout (default) — with descriptions
        </p>
        <SuggestionPills
          suggestions={[
            {
              id: "1",
              label: "Summarise document",
              description: "Extract key points from uploaded files",
            },
            {
              id: "2",
              label: "Find anomalies",
              description: "Detect outliers in the dataset",
            },
            {
              id: "3",
              label: "Generate report",
              description: "Create a formatted executive summary",
            },
            {
              id: "4",
              label: "Compare versions",
              description: "Show a diff between two outputs",
            },
          ]}
          onSelect={() => {}}
          ariaLabel="Suggested actions"
        />
      </div>
      <div>
        <p style={{ fontSize: 12, color: "#64748b", marginBottom: 8 }}>
          Column layout — with maxVisible=3
        </p>
        <SuggestionPills
          layout="column"
          maxVisible={3}
          suggestions={[
            { id: "a", label: "What are the key findings?" },
            { id: "b", label: "Show me the data trends" },
            { id: "c", label: "Draft an executive summary" },
            { id: "d", label: "This one is hidden" },
          ]}
          onSelect={() => {}}
        />
      </div>
      <div>
        <p style={{ fontSize: 12, color: "#64748b", marginBottom: 8 }}>
          Grid layout — icon at end
        </p>
        <SuggestionPills
          layout="grid"
          iconPosition="end"
          suggestions={[
            { id: "g1", label: "Summarise" },
            { id: "g2", label: "Translate" },
            { id: "g3", label: "Classify" },
            { id: "g4", label: "Extract" },
          ]}
          onSelect={() => {}}
        />
      </div>
      <div>
        <p style={{ fontSize: 12, color: "#64748b", marginBottom: 8 }}>
          Disabled state
        </p>
        <SuggestionPills
          disabled
          suggestions={[
            { id: "d1", label: "Summarise document" },
            { id: "d2", label: "Find anomalies" },
          ]}
          onSelect={() => {}}
        />
      </div>
      <div>
        <p style={{ fontSize: 12, color: "#64748b", marginBottom: 8 }}>
          Loading skeleton state
        </p>
        <SuggestionPills
          suggestions={[]}
          loading
          loadingCount={4}
          onSelect={() => {}}
        />
      </div>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: `
\`SuggestionPills\` — clickable prompt suggestion chips.

**Layouts:**
- \`"row"\` (default) — wrapping horizontal flex
- \`"column"\` — vertical stack
- \`"grid"\` — 2-column grid

**Key features:**
- \`onSelect(suggestion)\` fires with the full suggestion object
- Individual pills can be disabled via \`disabled: true\` on the suggestion object
- \`disabled\` on the component disables all pills at once
- \`loading\` + \`loadingCount\` shows animated skeleton placeholders while suggestions are loading
- \`maxVisible\` limits the number of pills rendered (surplus are silently hidden)
- \`iconPosition\` controls whether pill icons appear \`"start"\` or \`"end"\` (default \`"start"\`)
- \`ariaLabel\` sets the accessible label for the outer container (default \`"Suggestions"\`)
- \`renderPill(suggestion, onClick, isDisabled)\` fully replaces a single pill
        `,
      },
      source: {
        code: `// Default row layout with descriptions
<SuggestionPills
  suggestions={[
    { id: "1", label: "Summarise document",  description: "Extract key points" },
    { id: "2", label: "Find anomalies",       description: "Detect outliers" },
    { id: "3", label: "Disabled option",      disabled: true },
  ]}
  onSelect={(s) => setPrompt(s.label)}
  ariaLabel="Quick actions"
/>

// Column layout — limit visible pills
<SuggestionPills
  layout="column"
  maxVisible={3}
  suggestions={suggestions}
  onSelect={(s) => setPrompt(s.label)}
/>

// Grid layout with icon at end
<SuggestionPills
  layout="grid"
  iconPosition="end"
  suggestions={suggestions}
  onSelect={(s) => setPrompt(s.label)}
/>

// Loading state
<SuggestionPills
  suggestions={[]}
  loading
  loadingCount={4}
  onSelect={() => {}}
/>`,
      },
    },
  },
};
