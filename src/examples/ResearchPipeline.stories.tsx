import type { Meta, StoryObj } from "@storybook/react-vite";

import { MultiAgentDiagram } from "../components/agent/agent/MultiAgentDiagram";
import { BatchMonitor } from "../components/agent/task/BatchMonitor";
import { TaskResultInspector } from "../components/agent/task/TaskResultInspector";
import { TaskStatusCard } from "../components/agent/task/TaskStatusCard";
import { WorkflowStepList } from "../components/agent/workflow/WorkflowStepList";

// ─── App shell ─────────────────────────────────────────────────────────────────

const APP: React.CSSProperties = {
  fontFamily: '"Inter Variable", Inter, ui-sans-serif, system-ui, sans-serif',
  display: "grid",
  gridTemplateRows: "48px 1fr",
  gridTemplateColumns: "220px 1fr",
  minHeight: "100vh",
  background: "#f1f5f9",
};

const TOPBAR: React.CSSProperties = {
  gridColumn: "1 / -1",
  background: "#0f172a",
  display: "flex",
  alignItems: "center",
  padding: "0 20px",
  gap: 16,
};

const TOPBAR_LOGO: React.CSSProperties = { color: "#fff", fontWeight: 700, fontSize: 15, letterSpacing: "-0.02em", marginRight: 24 };
const TOPBAR_SPACER: React.CSSProperties = { flex: 1 };
const TOPBAR_AVATAR: React.CSSProperties = { width: 28, height: 28, borderRadius: "50%", background: "#6366f1", color: "#fff", fontSize: 11, fontWeight: 700, display: "flex", alignItems: "center", justifyContent: "center" };
const NAV_ITEM = (a: boolean): React.CSSProperties => ({ color: a ? "#fff" : "#94a3b8", fontSize: 13, fontWeight: a ? 600 : 400, padding: "4px 10px", borderRadius: 6, background: a ? "rgba(255,255,255,0.08)" : "transparent", cursor: "pointer" });

const LEFT_NAV: React.CSSProperties = { background: "#1e293b", color: "#cbd5e1", display: "flex", flexDirection: "column", padding: "16px 12px", gap: 2, overflowY: "auto" };
const SECTION_LABEL: React.CSSProperties = { fontSize: 10, fontWeight: 600, letterSpacing: "0.08em", textTransform: "uppercase" as const, color: "#475569", padding: "12px 8px 4px" };
const SIDE_ITEM = (a: boolean): React.CSSProperties => ({ display: "flex", alignItems: "center", gap: 8, padding: "7px 10px", borderRadius: 6, fontSize: 13, fontWeight: a ? 600 : 400, color: a ? "#fff" : "#94a3b8", background: a ? "rgba(99,102,241,0.3)" : "transparent", cursor: "pointer" });

const MAIN: React.CSSProperties = { display: "flex", flexDirection: "column", overflow: "hidden", background: "#f1f5f9" };

const PAGE_HEADER: React.CSSProperties = {
  padding: "16px 28px 14px",
  background: "#ffffff",
  borderBottom: "1px solid #e2e8f0",
  display: "flex",
  alignItems: "center",
  gap: 16,
};

const BREADCRUMB: React.CSSProperties = { fontSize: 12, color: "#64748b", display: "flex", alignItems: "center", gap: 6, marginBottom: 4 };
const PAGE_TITLE: React.CSSProperties = { fontSize: 18, fontWeight: 700, color: "#0f172a", margin: 0 };
const PAGE_META: React.CSSProperties = { fontSize: 13, color: "#64748b", margin: "2px 0 0" };
const STATUS_PILL = (color: string, bg: string): React.CSSProperties => ({ fontSize: 11, fontWeight: 600, padding: "3px 10px", borderRadius: 99, background: bg, color: color, border: `1px solid ${color}30` });

const CONTENT: React.CSSProperties = { flex: 1, overflow: "auto", padding: "20px 28px", display: "flex", flexDirection: "column", gap: 16 };
const ROW2: React.CSSProperties = { display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, alignItems: "start" };
const TASK_COL: React.CSSProperties = { display: "flex", flexDirection: "column", gap: 10 };

function TopBar({ label }: { label: string }) {
  return (
    <div style={TOPBAR}>
      <span style={TOPBAR_LOGO}>✦ AgentOps</span>
      {["Agent Runs", "Pipelines", "Prompts", "Observability"].map((l) => (
        <span key={l} style={NAV_ITEM(l === "Agent Runs")}>{l}</span>
      ))}
      <div style={TOPBAR_SPACER} />
      <span style={{ color: "#64748b", fontSize: 12 }}>{label}</span>
      <div style={TOPBAR_AVATAR}>BT</div>
    </div>
  );
}

function LeftNav({ active }: { active: string }) {
  return (
    <div style={LEFT_NAV}>
      <div style={SECTION_LABEL}>Runs</div>
      {[{ icon: "🔴", label: "Live Agents" }, { icon: "📋", label: "Run History" }, { icon: "🔗", label: "Pipelines", active: true }].map(({ icon, label, active: a }) => (
        <div key={label} style={SIDE_ITEM(label === active || !!a)}>
          <span>{icon}</span><span>{label}</span>
        </div>
      ))}
      <div style={SECTION_LABEL}>Research</div>
      {[{ icon: "📰", label: "Reports" }, { icon: "🗂️", label: "Sources" }, { icon: "🤖", label: "Agent Templates" }].map(({ icon, label }) => (
        <div key={label} style={SIDE_ITEM(label === active)}>
          <span>{icon}</span><span>{label}</span>
        </div>
      ))}
    </div>
  );
}

// ─── Meta ──────────────────────────────────────────────────────────────────────

const meta = {
  title: "Examples/Research Pipeline",
  tags: ["autodocs"],
  parameters: {
    layout: "fullscreen",
    docs: {
      description: {
        component: `
## Multi-Agent Research Pipeline — Full Application Screen

A full pipeline operations screen inside an agent platform. The orchestrator dispatches three specialised sub-agents (Researcher, Analyst, Writer), and the operator can watch the entire execution graph, individual task states, batch progress, and the final structured report — all in one view.

**Scenario**: An automated research pipeline producing a fully cited landscape report on "AI in Healthcare 2025". The pipeline is triggered via API, runs autonomously, and delivers a structured JSON/Markdown report.

### Components used

| Component | Role |
|---|---|
| \`MultiAgentDiagram\` | Visual graph of agents and data-flow edges — click a node to focus |
| \`WorkflowStepList\` | Ordered pipeline stages with status, duration, and error messages |
| \`TaskStatusCard\` | Per-agent status (progress bar, priority, ETA, Cancel button) |
| \`BatchMonitor\` | Aggregate sub-task tracker with retry-failed button |
| \`TaskResultInspector\` | Structured output viewer — JSON / Text / Markdown with copy & download |

### Best practices demonstrated

- \`MultiAgentDiagram\` at the top gives the operator topology context before reading detail panels
- \`WorkflowStepList\` and task cards share the middle row for parallel context
- \`BatchMonitor\` replaces individual task cards once sub-tasks exceed ~5 items
- \`TaskResultInspector\` only appears after results are available — avoids empty-state clutter
- Selected node in the diagram highlights which agent the operator is focused on
        `,
      },
    },
  },
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

// ─── Stories ───────────────────────────────────────────────────────────────────

export const Orchestrating: Story = {
  render: () => (
    <div style={APP}>
      <TopBar label="AI in Healthcare 2025 — running" />
      <LeftNav active="Pipelines" />
      <div style={MAIN}>
        <div style={PAGE_HEADER}>
          <div style={{ flex: 1 }}>
            <div style={BREADCRUMB}>
              <span>Pipelines</span><span>›</span><span>Research</span><span>›</span>
              <span style={{ color: "#0f172a", fontWeight: 500 }}>pipe_healthcare_2025</span>
            </div>
            <p style={PAGE_TITLE}>AI in Healthcare — 2025 Research Pipeline</p>
            <p style={PAGE_META}>Orchestrator · 4 agents · Step 3 of 6 · Analyst active</p>
          </div>
          <span style={STATUS_PILL("#f59e0b", "#f59e0b15")}>⟳ Running</span>
          <span style={{ fontSize: 12, color: "#94a3b8" }}>Started 10:00 AM</span>
        </div>
        <div style={CONTENT}>
          <MultiAgentDiagram
            nodes={[
              { id: "orch", label: "Orchestrator", status: "running", role: "Coordinator" },
              { id: "res", label: "Researcher", status: "completed", role: "Web Search" },
              { id: "ana", label: "Analyst", status: "thinking", role: "Data Analysis" },
              { id: "wri", label: "Writer", status: "idle", role: "Report Generation" },
            ]}
            edges={[
              { from: "orch", to: "res", label: "search task" },
              { from: "orch", to: "ana", label: "analyse data" },
              { from: "res", to: "ana", label: "raw findings" },
              { from: "ana", to: "wri", label: "insights" },
              { from: "wri", to: "orch", label: "draft report" },
            ]}
            selectedId="ana"
            onSelectNode={() => {}}
          />
          <div style={ROW2}>
            <WorkflowStepList
              steps={[
                { id: "1", label: "Validate research topic and scope", status: "completed", durationMs: 120 },
                { id: "2", label: "Researcher: gather 12 sources", status: "completed", durationMs: 4_200 },
                { id: "3", label: "Analyst: extract key insights", status: "running", description: "Processing 12 sources, 8 400 tokens ingested…" },
                { id: "4", label: "Writer: draft structured report", status: "pending" },
                { id: "5", label: "Orchestrator: review and finalise", status: "pending" },
                { id: "6", label: "Deliver report to user", status: "pending" },
              ]}
            />
            <div style={TASK_COL}>
              <TaskStatusCard
                name="Web Research Task"
                taskId="task_researcher_01"
                status="completed"
                priority="high"
                progress={100}
                startedAt="10:00 AM"
              />
              <TaskStatusCard
                name="Data Analysis Task"
                taskId="task_analyst_01"
                status="running"
                priority="high"
                progress={58}
                startedAt="10:01 AM"
                eta="~3 min"
                onCancel={() => {}}
              />
              <TaskStatusCard
                name="Report Writing Task"
                taskId="task_writer_01"
                status="queued"
                priority="normal"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: "Pipeline mid-execution. Researcher is complete (green), Analyst is thinking (highlighted in diagram, 58% progress), Writer is queued. WorkflowStepList step 3 shows a live progress description.",
      },
      source: {
        code: `import { MultiAgentDiagram, WorkflowStepList, TaskStatusCard } from "@kitelus/fly-ui";

<MultiAgentDiagram
  nodes={agentNodes}
  edges={agentEdges}
  selectedId={activeAgentId}
  onSelectNode={setActiveAgentId}
/>
<WorkflowStepList steps={pipelineSteps} />
{agentTasks.map((task) => (
  <TaskStatusCard key={task.taskId} {...task} onCancel={() => cancelTask(task.taskId)} />
))}`,
      },
    },
  },
};

export const ResultsReady: Story = {
  render: () => (
    <div style={APP}>
      <TopBar label="AI in Healthcare 2025 — completed" />
      <LeftNav active="Pipelines" />
      <div style={MAIN}>
        <div style={PAGE_HEADER}>
          <div style={{ flex: 1 }}>
            <div style={BREADCRUMB}>
              <span>Pipelines</span><span>›</span><span>Research</span><span>›</span>
              <span style={{ color: "#0f172a", fontWeight: 500 }}>pipe_healthcare_2025</span>
            </div>
            <p style={PAGE_TITLE}>AI in Healthcare — 2025 Research Pipeline</p>
            <p style={PAGE_META}>4 agents · 7 sub-tasks · 47 sources reviewed · Duration 2 m 22 s</p>
          </div>
          <span style={STATUS_PILL("#10b981", "#10b98115")}>✓ Completed</span>
          <span style={{ fontSize: 12, color: "#94a3b8" }}>Finished 10:02 AM</span>
        </div>
        <div style={CONTENT}>
          <MultiAgentDiagram
            nodes={[
              { id: "orch", label: "Orchestrator", status: "completed", role: "Coordinator" },
              { id: "res", label: "Researcher", status: "completed", role: "Web Search" },
              { id: "ana", label: "Analyst", status: "completed", role: "Data Analysis" },
              { id: "wri", label: "Writer", status: "completed", role: "Report Generation" },
            ]}
            edges={[
              { from: "orch", to: "res", label: "search task" },
              { from: "res", to: "ana", label: "raw findings" },
              { from: "ana", to: "wri", label: "insights" },
              { from: "wri", to: "orch", label: "draft report" },
            ]}
            onSelectNode={() => {}}
          />
          <div style={ROW2}>
            <BatchMonitor
              batchName="Research Pipeline — AI in Healthcare 2025"
              items={[
                { id: "t1", name: "PubMed search (2024–2025)", status: "completed", progress: 100 },
                { id: "t2", name: "arXiv preprint scan", status: "completed", progress: 100 },
                { id: "t3", name: "News & blog sources", status: "completed", progress: 100 },
                { id: "t4", name: "Extract key themes", status: "completed", progress: 100 },
                { id: "t5", name: "Sentiment & controversy scan", status: "completed", progress: 100 },
                { id: "t6", name: "Draft executive summary", status: "completed", progress: 100 },
                { id: "t7", name: "Generate citations", status: "completed", progress: 100 },
              ]}
            />
            <TaskResultInspector
              result={{
                title: "AI in Healthcare — 2025 Landscape Report",
                executiveSummary: "AI adoption in healthcare accelerated in 2025, with diagnostic AI reaching clinical deployment in 42% of tier-1 hospitals.",
                keyThemes: [
                  "Diagnostic imaging AI: 94% accuracy on chest X-ray triage",
                  "LLM-assisted clinical notes reduce documentation time by 35%",
                  "FDA published final AI/ML device guidance in March 2025",
                  "Equity concerns: bias in training data flagged in 6 of 12 reviewed systems",
                ],
                sourcesReviewed: 47,
                citationCount: 23,
                confidenceScore: 0.87,
                generatedAt: "2025-01-14T10:58:00Z",
                modelUsed: "claude-opus-4",
                tokenCount: 68_420,
              }}
              tokenCount={68_420}
              durationMs={142_000}
              onCopy={() => {}}
              onDownload={() => {}}
            />
          </div>
        </div>
      </div>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: "All 4 agents completed. Diagram nodes all green. BatchMonitor shows 7/7 sub-tasks done. TaskResultInspector displays the synthesised report — toggle JSON, Text, Markdown with the toolbar buttons.",
      },
      source: {
        code: `import { BatchMonitor, TaskResultInspector } from "@kitelus/fly-ui";

<BatchMonitor batchName="Research Pipeline" items={completedItems} />
<TaskResultInspector
  result={reportOutput}
  tokenCount={68420}
  durationMs={142000}
  onCopy={(text) => navigator.clipboard.writeText(text)}
  onDownload={(text) => downloadFile(text, "report.json")}
/>`,
      },
    },
  },
};
