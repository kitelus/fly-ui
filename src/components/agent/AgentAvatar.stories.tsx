import type { Meta, StoryObj } from "@storybook/react-vite";

import { AgentAvatar } from "./AgentAvatar";

const meta = {
  title: "Agent Components/Base/AgentAvatar",
  component: AgentAvatar.Root,
  tags: ["autodocs"],
} satisfies Meta<typeof AgentAvatar.Root>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => (
    <div style={{ padding: 16, display: "flex", gap: 12 }}>
      <AgentAvatar.Root>
        <AgentAvatar.Fallback>AI</AgentAvatar.Fallback>
      </AgentAvatar.Root>
      <AgentAvatar.Root>
        <AgentAvatar.Fallback>PL</AgentAvatar.Fallback>
        <AgentAvatar.StatusDot status="running" />
      </AgentAvatar.Root>
      <AgentAvatar.Root>
        <AgentAvatar.Fallback>RV</AgentAvatar.Fallback>
        <AgentAvatar.StatusDot status="done" />
      </AgentAvatar.Root>
    </div>
  ),
};
