import { Artifact } from "./Artifact";
import { ErrorMessage } from "./ErrorMessage";
import { FeedbackBar } from "./FeedbackBar";

const meta = {
  title: "Agent Components/Example/Artifact Review",
  tags: ["autodocs"],
};

export default meta;

const sql = "CREATE INDEX idx_jobs_tenant_status ON jobs(tenant_id, status);";

export const Default = {
  render: () => (
    <div style={{ padding: 16, display: "grid", gap: 12 }}>
      <Artifact
        type="code"
        valueForCopy={sql}
        defaultOpen
        title="V12__add_index.sql"
        language="sql"
        content={sql}
      />

      <FeedbackBar>
        <FeedbackBar.ThumbUp>Accept</FeedbackBar.ThumbUp>
        <FeedbackBar.ThumbDown>Request changes</FeedbackBar.ThumbDown>
      </FeedbackBar>

      <ErrorMessage
        error="Migration test failed on tenant scope."
        onRetry={() => console.log("retry")}
      />
    </div>
  ),
};

export const ArtifactDeliveryApp = {
  render: () => {
    const migrationSql =
      "CREATE INDEX idx_jobs_tenant_status ON jobs(tenant_id, status);";

    return (
      <div style={{ padding: 16, display: "grid", gap: 12 }}>
        <Artifact
          type="code"
          valueForCopy={migrationSql}
          defaultOpen
          title="V12__add_index.sql"
          language="sql"
          content={migrationSql}
        />

        <ErrorMessage
          error="Execution on staging failed. Please retry."
          onRetry={() => console.log("retry")}
        />
      </div>
    );
  },
};
