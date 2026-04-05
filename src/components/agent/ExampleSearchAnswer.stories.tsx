import { SourceCard, SourceList } from "./SourceCard";
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
                content: "Show me deployment checklist for staging.",
              },
              {
                id: "search-answer-2",
                role: "assistant",
                status: "done",
                content:
                  "Here are the validated staging rollout steps with links to references.",
              },
            ]}
          />
        </div>

        <SourceList>
          <SourceList.Item>
            <SourceCard
              title="Deployment Runbook"
              url="https://example.com/runbook"
              excerpt="Preflight checks and rollback criteria"
            />
          </SourceList.Item>
          <SourceList.Item>
            <SourceCard
              title="Release SOP"
              url="https://example.com/sop"
              excerpt="Order of environment promotion"
            />
          </SourceList.Item>
        </SourceList>
      </div>
    </div>
  ),
};
