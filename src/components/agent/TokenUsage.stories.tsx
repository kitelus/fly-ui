import type { Meta, StoryObj } from "@storybook/react-vite";

import { TokenUsage } from "./TokenUsage";

const meta = {
  title: "Agent Components/Base/TokenUsage",
  component: TokenUsage.Root,
  tags: ["autodocs"],
} satisfies Meta<typeof TokenUsage.Root>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => (
    <div style={{ padding: 16 }}>
      <TokenUsage.Root used={6200} max={10000}>
        <TokenUsage.Label>Context usage</TokenUsage.Label>
        <TokenUsage.Bar />
        <TokenUsage.Count />
      </TokenUsage.Root>
    </div>
  ),
};

export const Warning: Story = {
  render: () => (
    <div style={{ padding: 16 }}>
      <TokenUsage.Root used={9300} max={10000} warnAt={0.8}>
        <TokenUsage.Label>Near limit</TokenUsage.Label>
        <TokenUsage.Bar />
        <TokenUsage.Count />
      </TokenUsage.Root>
    </div>
  ),
};
