import type { Meta, StoryObj } from "@storybook/react-vite";

import { InlineAgentWidget } from "./InlineAgentWidget";

const messages = [
  {
    id: "1",
    role: "assistant" as const,
    content: "Hi, I am your copilot widget.",
  },
  { id: "2", role: "user" as const, content: "Help me summarize this page." },
];

const meta = {
  title: "Agent Component/InlineAgentWidget",
  component: InlineAgentWidget,
  tags: ["autodocs"],
  args: {
    messages,
    onSend: (text: string) => console.log(text),
    defaultOpen: true,
    unreadCount: 2,
    triggerLabel: "Assistant",
  },
} satisfies Meta<typeof InlineAgentWidget>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: (args) => (
    <div style={{ minHeight: 680 }}>
      <InlineAgentWidget {...args} />
    </div>
  ),
};

export const AllStates: Story = {
  render: (args) => (
    <div style={{ minHeight: 680 }}>
      <InlineAgentWidget {...args} defaultOpen={false} unreadCount={5} />
      <InlineAgentWidget {...args} position="top-left" defaultOpen isLoading />
    </div>
  ),
};

export const ThemeOverride: Story = {
  render: (args) => (
    <div
      style={{
        minHeight: 680,
        ["--kfa-accent" as string]: "#0891b2",
        ["--kfa-surface" as string]: "#ecfeff",
      }}
    >
      <InlineAgentWidget {...args} />
    </div>
  ),
};

export const ClassNameOverride: Story = {
  render: (args) => (
    <>
      <style>{`.widget-override .kite-fu-agent-inline-widget-trigger{background:#e2e8f0;border-color:#334155;color:#0f172a;}`}</style>
      <div style={{ minHeight: 680 }}>
        <InlineAgentWidget {...args} className="widget-override" />
      </div>
    </>
  ),
};

export const DarkMode: Story = {
  render: (args) => (
    <div data-theme="dark" style={{ minHeight: 680 }}>
      <InlineAgentWidget {...args} />
    </div>
  ),
};

export const ComposedExample: Story = {
  render: (args) => (
    <div style={{ minHeight: 680 }}>
      <InlineAgentWidget
        {...args}
        slots={{
          header: ({ agentName }) => (
            <div
              style={{
                padding: 12,
                borderBottom: "1px solid var(--kfa-border)",
                display: "flex",
                justifyContent: "space-between",
              }}
            >
              <strong>{String(agentName)} • Help Desk</strong>
              <button type="button">Escalate</button>
            </div>
          ),
        }}
      />
    </div>
  ),
};
