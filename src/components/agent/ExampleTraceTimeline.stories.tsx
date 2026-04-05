import { AgentStatus } from "./AgentStatus";
import { Reasoning } from "./Reasoning";
import { SourceCard, SourceList } from "./SourceCard";
import { StepList } from "./StepList";
import { ToolCall } from "./ToolCall";

const meta = {
  title: "Agent Components/Example/Trace Timeline",
  tags: ["autodocs"],
};

export default meta;

export const Default = {
  render: () => (
    <div style={{ padding: 16, display: "grid", gap: 12 }}>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <strong>Execution Trace</strong>
        <AgentStatus status="running" />
      </div>

      <StepList
        steps={[
          {
            id: "trace-step-1",
            label: "Collect requirements",
            meta: "Finished in 0.8s",
            status: "done",
          },
          {
            id: "trace-step-2",
            label: "Run documentation search",
            meta: "In progress",
            status: "running",
          },
          {
            id: "trace-step-3",
            label: "Draft final response",
            meta: "Waiting for tool result",
            status: "pending",
          },
        ]}
      />

      <div style={{ display: "grid", gap: 8 }}>
        <Reasoning
          defaultOpen
          duration={1600}
          summary="Thought for 1.6s"
          content="Prioritizing high-signal references from architecture and release docs."
        />
        <ToolCall
          toolName="search_docs"
          status="running"
          defaultOpen
          headerLabel="search_docs"
          statusLabel="running"
          argsValue={{ query: "release summary", maxResults: 5 }}
        />
      </div>
    </div>
  ),
};

export const ResearchAndTraceApp = {
  render: () => (
    <div
      style={{
        padding: 16,
        display: "grid",
        gridTemplateColumns: "1fr 1fr",
        gap: 12,
      }}
    >
      <div style={{ display: "grid", gap: 10 }}>
        <h4 style={{ margin: 0 }}>Sources</h4>
        <SourceList>
          <SourceList.Item>
            <SourceCard
              title="Architecture Guide"
              url="https://example.com/arch"
              excerpt="Domain boundaries and event patterns"
            />
          </SourceList.Item>
          <SourceList.Item>
            <SourceCard
              title="Deployment Runbook"
              url="https://example.com/runbook"
              excerpt="Staging and production rollout steps"
            />
          </SourceList.Item>
        </SourceList>
      </div>

      <div style={{ display: "grid", gap: 10 }}>
        <h4 style={{ margin: 0 }}>Trace Timeline</h4>
        <StepList
          steps={[
            {
              id: "research-step-1",
              label: "Collect references",
              meta: "2 sources found",
              status: "done",
            },
            {
              id: "research-step-2",
              label: "Draft answer",
              meta: "In progress",
              status: "running",
            },
          ]}
        />
        <ToolCall
          toolName="search_docs"
          status="success"
          defaultOpen
          headerLabel="search_docs"
          statusLabel="success"
          resultValue={{ hits: 2 }}
        />
      </div>
    </div>
  ),
};
