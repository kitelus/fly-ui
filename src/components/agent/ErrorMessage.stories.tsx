import type { Meta, StoryObj } from "@storybook/react-vite";

import { ErrorMessage } from "./ErrorMessage";

const meta = {
  title: "Agent Components/Base/ErrorMessage",
  component: ErrorMessage.Root,
  tags: ["autodocs"],
} satisfies Meta<typeof ErrorMessage.Root>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => (
    <div style={{ padding: 16 }}>
      <ErrorMessage
        error="Failed to fetch trace data"
        onRetry={() => console.log("retry")}
      />
    </div>
  ),
};
