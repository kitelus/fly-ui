import type { Meta, StoryObj } from "@storybook/react-vite";

import { StreamText } from "./StreamText";

const meta = {
  title: "Agent Components/Base/StreamText",
  component: StreamText.Root,
  tags: ["autodocs"],
} satisfies Meta<typeof StreamText.Root>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => (
    <div style={{ padding: 16, display: "grid", gap: 10 }}>
      <StreamText value="Streaming response in progress" isStreaming />
      <StreamText value="Done response" isStreaming={false} />
    </div>
  ),
};

export const WithCursor: Story = {
  render: () => (
    <div style={{ padding: 16 }}>
      <StreamText.Root value="Token by token" isStreaming>
        <StreamText.Cursor />
      </StreamText.Root>
    </div>
  ),
};
