import type { Meta, StoryObj } from "@storybook/react-vite";

import { Artifact } from "./Artifact";

const sql = "CREATE INDEX idx_jobs_tenant_status ON jobs(tenant_id, status);";

const meta = {
  title: "Agent Components/Base/Artifact",
  component: Artifact.Root,
  tags: ["autodocs"],
} satisfies Meta<typeof Artifact.Root>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => (
    <div style={{ padding: 16 }}>
      <Artifact.Root type="code" valueForCopy={sql} defaultOpen>
        <Artifact.Header>
          <Artifact.Title>V12__add_index.sql</Artifact.Title>
          <Artifact.Language>sql</Artifact.Language>
          <Artifact.Actions>
            <Artifact.CopyTrigger />
          </Artifact.Actions>
        </Artifact.Header>
        <Artifact.Content value={sql} />
      </Artifact.Root>
    </div>
  ),
};
