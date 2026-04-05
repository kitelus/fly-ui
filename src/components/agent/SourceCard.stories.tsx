import type { Meta, StoryObj } from "@storybook/react-vite";

import { SourceCard, SourceList } from "./SourceCard";

const meta = {
  title: "Agent Components/Base/SourceCard",
  component: SourceCard,
  tags: ["autodocs"],
} satisfies Meta<typeof SourceCard>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => (
    <div style={{ padding: 16 }}>
      <SourceCard
        title="Architecture Guide"
        url="https://example.com/arch"
        excerpt="Modular boundaries and event-driven integration"
      />
    </div>
  ),
};

export const List: Story = {
  render: () => (
    <SourceList.Root style={{ padding: 16 }}>
      <SourceList.Item>
        <SourceCard title="API Handbook" url="https://example.com/api" />
      </SourceList.Item>
      <SourceList.Item>
        <SourceCard
          title="Deployment Checklist"
          url="https://example.com/ops"
        />
      </SourceList.Item>
    </SourceList.Root>
  ),
};
