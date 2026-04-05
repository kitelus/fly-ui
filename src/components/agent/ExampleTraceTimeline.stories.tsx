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
        <strong>Walmart Supply Chain Planner Trace</strong>
        <AgentStatus status="running" />
      </div>

      <StepList
        steps={[
          {
            id: "trace-step-1",
            label: "Ingest store demand spikes",
            meta: "Finished in 0.9s",
            status: "done",
          },
          {
            id: "trace-step-2",
            label: "Optimize lane allocation",
            meta: "In progress",
            status: "running",
          },
          {
            id: "trace-step-3",
            label: "Propose reroute plan",
            meta: "Waiting for solver output",
            status: "pending",
          },
        ]}
      />

      <div style={{ display: "grid", gap: 8 }}>
        <Reasoning
          defaultOpen
          duration={1600}
          summary="Thought for 1.6s"
          content="Balancing shelf-availability targets against fuel cost and carrier SLA constraints."
        />
        <ToolCall
          toolName="route_optimizer"
          status="running"
          defaultOpen
          headerLabel="route_optimizer"
          statusLabel="running"
          argsValue={{
            region: "US-South",
            horizonHours: 24,
            objective: "minimize_stockout",
          }}
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
        <h4 style={{ margin: 0 }}>Source Signals</h4>
        <SourceList>
          <SourceList.Item>
            <SourceCard
              title="Shell Refinery Throughput Feed"
              url="https://example.com/refinery-feed"
              excerpt="Current unit utilization and outage windows"
            />
          </SourceList.Item>
          <SourceList.Item>
            <SourceCard
              title="Pipeline Telemetry Summary"
              url="https://example.com/pipeline-telemetry"
              excerpt="Pressure anomalies and expected transfer delays"
            />
          </SourceList.Item>
        </SourceList>
      </div>

      <div style={{ display: "grid", gap: 10 }}>
        <h4 style={{ margin: 0 }}>Shell Energy Operations Trace</h4>
        <StepList
          steps={[
            {
              id: "research-step-1",
              label: "Validate telemetry freshness",
              meta: "2 streams verified",
              status: "done",
            },
            {
              id: "research-step-2",
              label: "Compute contingency dispatch",
              meta: "In progress",
              status: "running",
            },
          ]}
        />
        <ToolCall
          toolName="dispatch_simulator"
          status="success"
          defaultOpen
          headerLabel="dispatch_simulator"
          statusLabel="success"
          resultValue={{
            scenarios: 3,
            recommended: "shift-load-to-houston-terminal",
          }}
        />
      </div>
    </div>
  ),
};
