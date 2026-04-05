import type { Meta, StoryObj } from "@storybook/react-vite";

import { Message } from "./Message";
import { Thread } from "./Thread";

const meta = {
  title: "Agent Components/Base/Thread",
  component: Thread.Root,
  tags: ["autodocs"],
  args: {
    autoScroll: true,
  },
} satisfies Meta<typeof Thread.Root>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: (args) => (
    <div style={{ height: 420, padding: 16 }}>
      <Thread.Root {...args}>
        <Thread.List>
          <li>
            <Message.Root role="assistant" status="done">
              <Message.Avatar fallback="AI" />
              <Message.Content>
                <Message.Text>Thread item 1</Message.Text>
              </Message.Content>
            </Message.Root>
          </li>
          <li>
            <Message.Root role="user" status="done">
              <Message.Avatar fallback="U" />
              <Message.Content>
                <Message.Text>Thread item 2</Message.Text>
              </Message.Content>
            </Message.Root>
          </li>
          <li>
            <Message.Root role="assistant" status="streaming">
              <Message.Avatar fallback="AI" />
              <Message.Content>
                <Message.Text>Streaming response...</Message.Text>
              </Message.Content>
            </Message.Root>
          </li>
        </Thread.List>
        <Thread.ScrollAnchor />
      </Thread.Root>
    </div>
  ),
};

export const Empty: Story = {
  render: (args) => (
    <div style={{ height: 320, padding: 16 }}>
      <Thread.Root {...args}>
        <Thread.Empty>No messages yet.</Thread.Empty>
        <Thread.ScrollAnchor />
      </Thread.Root>
    </div>
  ),
};
