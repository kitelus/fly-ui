import { Artifact } from "./Artifact";
import { ErrorMessage } from "./ErrorMessage";
import { FeedbackBar } from "./FeedbackBar";

const meta = {
  title: "Agent Components/Example/Artifact Review",
  tags: ["autodocs"],
};

export default meta;

const sql =
  "CREATE INDEX idx_txn_region_risk ON transactions(region_code, risk_score DESC);";

export const Default = {
  render: () => (
    <div style={{ padding: 16, display: "grid", gap: 12 }}>
      <Artifact
        type="code"
        valueForCopy={sql}
        defaultOpen
        title="V22__risk_index.sql"
        language="sql"
        content={sql}
      />

      <FeedbackBar>
        <FeedbackBar.ThumbUp>Accept</FeedbackBar.ThumbUp>
        <FeedbackBar.ThumbDown>Request changes</FeedbackBar.ThumbDown>
      </FeedbackBar>

      <ErrorMessage
        error="Risk backfill check failed for one region shard."
        onRetry={() => console.log("retry")}
      />
    </div>
  ),
};

export const ArtifactDeliveryApp = {
  render: () => {
    const clinicalSummary =
      "Clinical summary draft: Cohort B shows improved endpoint response with no severe safety signal; pending final adjudication.";

    return (
      <div style={{ padding: 16, display: "grid", gap: 12 }}>
        <Artifact
          type="text"
          valueForCopy={clinicalSummary}
          defaultOpen
          title="Pfizer_Phase3_Clinical_Summary.txt"
          language="markdown"
          content={clinicalSummary}
        />

        <ErrorMessage
          error="Compliance check blocked publish: missing protocol deviation appendix."
          onRetry={() => console.log("retry")}
        />
      </div>
    );
  },
};
