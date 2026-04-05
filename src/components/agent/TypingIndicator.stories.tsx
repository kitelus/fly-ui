import type { Meta, StoryObj } from "@storybook/react-vite";

import { TypingIndicator } from "./TypingIndicator";

const meta = {
  title: "Agent Components/Base/TypingIndicator",
  component: TypingIndicator.Root,
  tags: ["autodocs"],
} satisfies Meta<typeof TypingIndicator.Root>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => (
    <div style={{ padding: 16 }}>
      <TypingIndicator count={3} />
    </div>
  ),
};

export const DotVariants: Story = {
  render: () => (
    <div style={{ padding: 16, display: "flex", gap: 8 }}>
      <TypingIndicator.Dot />
      <TypingIndicator.Dot />
      <TypingIndicator.Dot />
    </div>
  ),
};
