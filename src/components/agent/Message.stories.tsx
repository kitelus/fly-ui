import type { Meta, StoryObj } from "@storybook/react-vite";

import { Message } from "./Message";

const meta = {
  title: "Agent Components/Base/Message",
  component: Message.Root,
  tags: ["autodocs"],
} satisfies Meta<typeof Message.Root>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => (
    <div style={{ display: "grid", gap: 10, padding: 16 }}>
      <Message.Root role="assistant" status="done">
        <Message.Avatar fallback="AI" />
        <Message.Content>
          <Message.Text>
            This is an assistant message with default style.
          </Message.Text>
          <Message.Timestamp value={new Date()} />
        </Message.Content>
      </Message.Root>
      <Message.Root role="user" status="done">
        <Message.Avatar fallback="U" />
        <Message.Content>
          <Message.Text>User message with compact spacing.</Message.Text>
          <Message.Timestamp value={new Date()} />
        </Message.Content>
      </Message.Root>
      <Message.Root role="system" status="done">
        <Message.Content>
          <Message.Text>System notice for timeline context.</Message.Text>
        </Message.Content>
      </Message.Root>
    </div>
  ),
};

export const WithActions: Story = {
  render: () => (
    <div style={{ padding: 16 }}>
      <Message.Root role="assistant" status="done">
        <Message.Avatar fallback="AI" />
        <Message.Content>
          <Message.Header>
            <Message.Status>complete</Message.Status>
            <Message.Timestamp value={new Date()} />
          </Message.Header>
          <Message.Text>Message with custom action controls.</Message.Text>
          <Message.Actions showOnHover={false}>
            <button type="button">Copy</button>
            <button type="button">Retry</button>
          </Message.Actions>
        </Message.Content>
      </Message.Root>
    </div>
  ),
};
