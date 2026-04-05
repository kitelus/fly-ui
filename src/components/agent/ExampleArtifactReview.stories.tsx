import type { Meta, StoryObj } from "@storybook/react-vite";

import { Artifact } from "./Artifact";
import { ErrorMessage } from "./ErrorMessage";
import { FeedbackBar } from "./FeedbackBar";

const meta = {
  title: "Agent Components/Example/Artifact Review",
  tags: ["autodocs"],
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

const sql = "CREATE INDEX idx_jobs_tenant_status ON jobs(tenant_id, status);";

export const Default: Story = {
  render: () => (
    <div style={{ padding: 16, display: "grid", gap: 12 }}>
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

      <FeedbackBar.Root>
        <FeedbackBar.ThumbUp>Accept</FeedbackBar.ThumbUp>
        <FeedbackBar.ThumbDown>Request changes</FeedbackBar.ThumbDown>
      </FeedbackBar.Root>

      <ErrorMessage
        error="Migration test failed on tenant scope."
        onRetry={() => console.log("retry")}
      />
    </div>
  ),
};

export const ArtifactDeliveryApp: Story = {
  render: () => {
    const migrationSql =
      "CREATE INDEX idx_jobs_tenant_status ON jobs(tenant_id, status);";

    return (
      <div style={{ padding: 16, display: "grid", gap: 12 }}>
        <Artifact.Root type="code" valueForCopy={migrationSql} defaultOpen>
          <Artifact.Header>
            <Artifact.Title>V12__add_index.sql</Artifact.Title>
            <Artifact.Language>sql</Artifact.Language>
            <Artifact.Actions>
              <Artifact.CopyTrigger />
            </Artifact.Actions>
          </Artifact.Header>
          <Artifact.Content value={migrationSql} />
        </Artifact.Root>

        <ErrorMessage
          error="Execution on staging failed. Please retry."
          onRetry={() => console.log("retry")}
        />
      </div>
    );
  },
};
