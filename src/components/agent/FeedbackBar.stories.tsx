import type { Meta, StoryObj } from "@storybook/react-vite";

import { FeedbackBar } from "./FeedbackBar";

const meta = {
  title: "Agent Components/Base/FeedbackBar",
  component: FeedbackBar.Root,
  tags: ["autodocs"],
} satisfies Meta<typeof FeedbackBar.Root>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => (
    <div style={{ padding: 16 }}>
      <FeedbackBar.Root />
    </div>
  ),
};

export const WithComment: Story = {
  render: () => (
    <div style={{ padding: 16, display: "grid", gap: 8 }}>
      <FeedbackBar.Root>
        <FeedbackBar.ThumbUp>Good</FeedbackBar.ThumbUp>
        <FeedbackBar.ThumbDown>Bad</FeedbackBar.ThumbDown>
      </FeedbackBar.Root>
      <FeedbackBar.Comment placeholder="Share your feedback" />
      <FeedbackBar.Submitted>Feedback captured</FeedbackBar.Submitted>
    </div>
  ),
};
