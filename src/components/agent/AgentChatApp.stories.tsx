import type { Meta, StoryObj } from "@storybook/react-vite";

import { AgentChatApp, type AgentChatMessage } from "./AgentChatApp";
import type { AgentStep } from "./AgentTracePanel";

const messages: AgentChatMessage[] = [
  {
    id: "1",
    role: "user",
    content: "Summarize this week updates.",
    status: "done",
  },
  {
    id: "2",
    role: "assistant",
    content: "Here is the weekly summary...",
    status: "done",
    sources: [
      {
        index: 1,
        title: "Sprint Board",
        url: "https://example.com/sprint",
        excerpt: "10 tickets completed",
      },
    ],
  },
];

const steps: AgentStep[] = [
  { id: "s1", label: "Fetch tasks", status: "done" },
  {
    id: "s2",
    label: "Generate summary",
    status: "running",
    reasoning: {
      content: "Prioritizing critical outcomes...",
      isStreaming: true,
    },
  },
];

const meta = {
  title: "Agent Component/AgentChatApp",
  component: AgentChatApp,
  tags: ["autodocs"],
  args: {
    messages,
    steps,
    onSend: (text: string) => console.log("send", text),
    isStreaming: true,
    streamingMessageId: "2",
    agentStatus: "running",
    suggestions: [
      "Write release notes",
      "Create changelog",
      "Generate QA checklist",
    ],
  },
  parameters: { layout: "fullscreen" },
} satisfies Meta<typeof AgentChatApp>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: (args) => (
    <div style={{ minHeight: 620, padding: 16 }}>
      <AgentChatApp {...args} />
    </div>
  ),
};

export const AllStates: Story = {
  render: (args) => (
    <div style={{ display: "grid", gap: 12, padding: 16 }}>
      <AgentChatApp
        {...args}
        showTrace={false}
        error="Temporary failure"
        agentStatus="error"
      />
      <AgentChatApp
        {...args}
        showSources={false}
        showFeedback={false}
        showTokenUsage
        tokenUsage={{ used: 8500, max: 10000 }}
        agentStatus="thinking"
      />
    </div>
  ),
};

export const ThemeOverride: Story = {
  render: (args) => (
    <div
      style={{
        minHeight: 620,
        padding: 16,
        ["--kfa-accent" as string]: "#be123c",
      }}
    >
      <AgentChatApp {...args} />
    </div>
  ),
};

export const ClassNameOverride: Story = {
  render: (args) => (
    <>
      <style>{`.agent-chat-override{border:2px solid #14b8a6;border-radius:16px;padding:12px;background:#f0fdfa;}`}</style>
      <div style={{ minHeight: 620, padding: 16 }}>
        <AgentChatApp {...args} className="agent-chat-override" />
      </div>
    </>
  ),
};

export const DarkMode: Story = {
  render: (args) => (
    <div data-theme="dark" style={{ minHeight: 620, padding: 16 }}>
      <AgentChatApp {...args} />
    </div>
  ),
};

export const ComposedExample: Story = {
  render: (args) => (
    <div style={{ minHeight: 620, padding: 16 }}>
      <AgentChatApp
        {...args}
        slots={{
          header: ({ agentName }) => (
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <h3 style={{ margin: 0 }}>
                {String(agentName)} • Workspace Assistant
              </h3>
              <button type="button">Escalate</button>
            </div>
          ),
        }}
      />
    </div>
  ),
};
