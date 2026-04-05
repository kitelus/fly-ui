import type { Meta, StoryObj } from "@storybook/react-vite";

import { AgentStatus } from "./AgentStatus";

const meta = {
  title: "Agent Components/Base/AgentStatus",
  component: AgentStatus.Root,
  tags: ["autodocs"],
} satisfies Meta<typeof AgentStatus.Root>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => (
    <div style={{ padding: 16 }}>
      <AgentStatus status="running" />
    </div>
  ),
};

export const AllStates: Story = {
  render: () => (
    <div style={{ padding: 16, display: "grid", gap: 8 }}>
      <AgentStatus status="idle" />
      <AgentStatus status="thinking" />
      <AgentStatus status="running" />
      <AgentStatus status="paused" />
      <AgentStatus status="done" />
      <AgentStatus status="error" />
    </div>
  ),
};
