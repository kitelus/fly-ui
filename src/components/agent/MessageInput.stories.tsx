import type { Meta, StoryObj } from "@storybook/react-vite";

import { MessageInput } from "./MessageInput";

const meta = {
  title: "Agent Components/Base/MessageInput",
  component: MessageInput.Root,
  tags: ["autodocs"],
} satisfies Meta<typeof MessageInput.Root>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => (
    <div style={{ padding: 16 }}>
      <MessageInput.Root onSend={(value) => console.log(value)} maxLength={300}>
        <MessageInput.Field placeholder="Type your request" />
        <MessageInput.Toolbar>
          <MessageInput.AttachTrigger />
          <MessageInput.Counter />
          <MessageInput.Submit />
        </MessageInput.Toolbar>
      </MessageInput.Root>
    </div>
  ),
};
