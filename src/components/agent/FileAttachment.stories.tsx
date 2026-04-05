import type { Meta, StoryObj } from "@storybook/react-vite";

import { FileAttachment } from "./FileAttachment";

const meta = {
  title: "Agent Components/Base/FileAttachment",
  component: FileAttachment.Root,
  tags: ["autodocs"],
} satisfies Meta<typeof FileAttachment.Root>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => (
    <div style={{ padding: 16, display: "grid", gap: 8 }}>
      <FileAttachment
        file={{ name: "notes.md", size: 23400, type: "text/markdown" }}
        status="done"
      />
      <FileAttachment
        file={{ name: "report.pdf", size: 2450000, type: "application/pdf" }}
        status="uploading"
        progress={66}
      />
    </div>
  ),
};
