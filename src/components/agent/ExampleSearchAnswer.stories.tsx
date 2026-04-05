import { SourceList } from "./SourceCard";
import { Thread } from "./Thread";

const meta = {
  title: "Agent Components/Example/Search Answer",
  tags: ["autodocs"],
};

export default meta;

export const Default = {
  render: () => (
    <div style={{ padding: 16, display: "grid", gap: 12 }}>
      <div
        style={{ display: "grid", gridTemplateColumns: "1fr 320px", gap: 12 }}
      >
        <div style={{ height: 360 }}>
          <Thread
            messages={[
              {
                id: "search-answer-1",
                role: "user",
                status: "done",
                content:
                  "Summarize latest EU AI Act obligations for foundation model providers.",
              },
              {
                id: "search-answer-2",
                role: "assistant",
                status: "done",
                content:
                  "Here is a compliance summary with citations for risk tiering, transparency, and post-market monitoring.",
              },
            ]}
          />
        </div>

        <SourceList
          items={[
            {
              title: "EU AI Act Official Text",
              url: "https://example.com/eu-ai-act",
              excerpt: "Obligations for high-impact general-purpose AI models",
            },
            {
              title: "Enterprise Governance Policy",
              url: "https://example.com/ai-governance",
              excerpt: "Internal controls for model release and audit evidence",
            },
          ]}
        />
      </div>
    </div>
  ),
};

export const PfizerResearchCopilot = {
  render: () => (
    <div style={{ padding: 16, display: "grid", gap: 12 }}>
      <div
        style={{ display: "grid", gridTemplateColumns: "1fr 320px", gap: 12 }}
      >
        <div style={{ height: 360 }}>
          <Thread
            messages={[
              {
                id: "pfizer-search-1",
                role: "user",
                status: "done",
                content:
                  "Find Phase 3 efficacy signals for RSV vaccine cohorts over 65.",
              },
              {
                id: "pfizer-search-2",
                role: "assistant",
                status: "done",
                content:
                  "I found pooled efficacy and adverse-event highlights with trial references.",
              },
            ]}
          />
        </div>

        <SourceList
          items={[
            {
              title: "Phase 3 Interim Analysis",
              url: "https://example.com/phase3-rsv",
              excerpt: "Cohort efficacy breakdown with confidence intervals",
            },
            {
              title: "Safety Monitoring Board Notes",
              url: "https://example.com/safety-board",
              excerpt: "Observed adverse events and follow-up actions",
            },
          ]}
        />
      </div>
    </div>
  ),
};
