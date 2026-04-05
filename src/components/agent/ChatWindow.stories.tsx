import type { Meta, StoryObj } from "@storybook/react-vite";

import { ChatWindow, type ChatMessage } from "./ChatWindow";

const demoMessages: ChatMessage[] = [
  {
    id: "1",
    role: "assistant",
    content: "Hello, how can I help?",
    status: "done",
    timestamp: new Date(),
  },
  {
    id: "2",
    role: "user",
    content: "Draft a release summary.",
    status: "done",
    timestamp: new Date(),
  },
  {
    id: "3",
    role: "assistant",
    content: "Sure, working on it...",
    status: "streaming",
    timestamp: new Date(),
  },
];

const meta = {
  title: "Agent Component/ChatWindow",
  component: ChatWindow,
  tags: ["autodocs"],
  args: {
    messages: demoMessages,
    onSend: (value: string) => console.log("send", value),
    isStreaming: true,
    streamingMessageId: "3",
    showTimestamps: true,
    allowAttachments: true,
  },
  parameters: {
    layout: "fullscreen",
  },
} satisfies Meta<typeof ChatWindow>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: (args) => (
    <div style={{ height: 520, padding: 16 }}>
      <ChatWindow {...args} />
    </div>
  ),
};

export const AllStates: Story = {
  render: (args) => (
    <div style={{ height: 560, padding: 16, display: "grid", gap: 12 }}>
      <div
        style={{
          border: "1px solid var(--kfa-border)",
          borderRadius: 8,
          padding: 8,
        }}
      >
        <ChatWindow {...args} messages={[]} isStreaming={false} />
      </div>
      <div
        style={{
          border: "1px solid var(--kfa-border)",
          borderRadius: 8,
          padding: 8,
        }}
      >
        <ChatWindow {...args} isLoading />
      </div>
    </div>
  ),
};

export const ThemeOverride: Story = {
  render: (args) => (
    <div
      style={{
        height: 520,
        padding: 16,
        ["--kfa-accent" as string]: "#0f766e",
        ["--kfa-user-bg" as string]: "#115e59",
        ["--kfa-user-fg" as string]: "#f0fdfa",
        ["--kfa-surface" as string]: "#f0fdfa",
      }}
    >
      <ChatWindow {...args} />
    </div>
  ),
};

export const ClassNameOverride: Story = {
  render: (args) => (
    <>
      <style>{`.chat-window-override{border:2px dashed #0ea5e9;border-radius:12px;padding:12px;background:#f8fbff;}`}</style>
      <div style={{ height: 520, padding: 16 }}>
        <ChatWindow {...args} className="chat-window-override" />
      </div>
    </>
  ),
};

export const DarkMode: Story = {
  render: (args) => (
    <div data-theme="dark" style={{ height: 520, padding: 16 }}>
      <ChatWindow {...args} />
    </div>
  ),
};

export const ComposedExample: Story = {
  render: (args) => (
    <div
      style={{
        height: 560,
        padding: 16,
        display: "grid",
        gridTemplateRows: "auto 1fr",
      }}
    >
      <div style={{ fontSize: 12, opacity: 0.7, marginBottom: 8 }}>
        Team Assistant
      </div>
      <ChatWindow
        {...args}
        renderMessageActions={(msg) => (
          <div style={{ display: "flex", gap: 6 }}>
            <button type="button">Copy</button>
            {msg.role === "assistant" ? (
              <button type="button">Regenerate</button>
            ) : null}
          </div>
        )}
      />
    </div>
  ),
};
