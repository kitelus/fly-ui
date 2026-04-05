import type { Meta, StoryObj } from "@storybook/react-vite";

import { ToolCall } from "./ToolCall";

const meta = {
  title: "Agent Components/Base/ToolCall",
  component: ToolCall.Root,
  tags: ["autodocs"],
} satisfies Meta<typeof ToolCall.Root>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => (
    <div style={{ padding: 16 }}>
      <ToolCall.Root
        toolName="search_docs"
        status="running"
        defaultOpen
        callId="tc-1"
      >
        <ToolCall.Header>
          <ToolCall.Name>search_docs</ToolCall.Name>
          <ToolCall.Status>running</ToolCall.Status>
        </ToolCall.Header>
        <ToolCall.Args value={{ query: "storybook organization", limit: 5 }} />
        <ToolCall.Result value={{ hits: 3 }} />
      </ToolCall.Root>
    </div>
  ),
};
