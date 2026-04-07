import type { Meta, StoryObj } from "@storybook/react-vite";

import { AgentMemoryPanel } from "../components/agent/agent/AgentMemoryPanel";
import { AgentStatusCard } from "../components/agent/agent/AgentStatusCard";
import { AgentStepTimeline } from "../components/agent/agent/AgentStepTimeline";
import { ToolCallInspector } from "../components/agent/agent/ToolCallInspector";
import { TokenUsageCard } from "../components/agent/observability/TokenUsageCard";

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
  gap: 12,
};

const BREADCRUMB: React.CSSProperties = { fontSize: 12, color: "#64748b", display: "flex", alignItems: "center", gap: 6 };
const PAGE_TITLE: React.CSSProperties = { fontSize: 18, fontWeight: 700, color: "#0f172a", margin: 0 };
const PAGE_SUBTITLE: React.CSSProperties = { fontSize: 13, color: "#64748b", margin: "2px 0 0", fontWeight: 400 };

const STATUS_PILL = (color: string, bg: string): React.CSSProperties => ({
  fontSize: 11, fontWeight: 600, padding: "3px 10px", borderRadius: 99, background: bg, color: color, border: `1px solid ${color}30`,
});

const CONTENT: React.CSSProperties = {
  flex: 1,
  overflow: "auto",
  padding: "20px 28px",
  display: "flex",
  flexDirection: "column",
  gap: 16,
};

const TOP_ROW: React.CSSProperties = { display: "grid", gridTemplateColumns: "1fr 320px", gap: 16 };
const BODY_ROW: React.CSSProperties = { display: "grid", gridTemplateColumns: "1fr 360px", gap: 16, alignItems: "start" };
const SIDE_COL: React.CSSProperties = { display: "flex", flexDirection: "column", gap: 12 };

function TopBar({ status }: { status: string }) {
  return (
    <div style={TOPBAR}>
      <span style={TOPBAR_LOGO}>✦ AgentOps</span>
      {["Agent Runs", "Pipelines", "Prompts", "Observability"].map((l) => (
        <span key={l} style={NAV_ITEM(l === "Agent Runs")}>{l}</span>
      ))}
      <div style={TOPBAR_SPACER} />
      <span style={{ ...STATUS_PILL(status === "running" ? "#10b981" : status === "error" ? "#ef4444" : "#6366f1", status === "running" ? "#10b98118" : status === "error" ? "#ef444418" : "#6366f118") }}>
        {status === "running" ? "● Live" : status === "error" ? "✕ Error" : "✓ Done"}
      </span>
      <div style={TOPBAR_AVATAR}>BT</div>
    </div>
  );
}

function LeftNav({ active }: { active: string }) {
  return (
    <div style={LEFT_NAV}>
      <div style={SECTION_LABEL}>Runs</div>
      {[{ icon: "🔴", label: "Live Agents" }, { icon: "📋", label: "Run History" }, { icon: "📊", label: "Analytics" }].map(({ icon, label }) => (
        <div key={label} style={SIDE_ITEM(label === active)}>
          <span>{icon}</span><span>{label}</span>
        </div>
      ))}
      <div style={SECTION_LABEL}>Config</div>
      {[{ icon: "🔧", label: "Agent Config" }, { icon: "🛠️", label: "Tools" }, { icon: "🔑", label: "Credentials" }].map(({ icon, label }) => (
        <div key={label} style={SIDE_ITEM(false)}>
          <span>{icon}</span><span>{label}</span>
        </div>
      ))}
    </div>
  );
}

// ─── Meta ──────────────────────────────────────────────────────────────────────

const meta = {
  title: "Examples/Agent Dashboard",
  tags: ["autodocs"],
  parameters: {
    layout: "fullscreen",
    docs: {
      description: {
        component: `
## Agent Monitoring Dashboard — Full Application Screen

A production agent operations console. Left navigation, top status bar, page header with breadcrumb, and a multi-panel live view of a running autonomous agent — status summary, token budget, step-by-step execution trace, tool call inspection, and memory panel.

**Scenario**: A research agent is running inside an internal AgentOps platform. An operator can monitor every thought/tool/observation step in real time, inspect individual API calls, and intervene (stop, retry) if something goes wrong.

### Components used

| Component | Role |
|---|---|
| \`AgentStatusCard\` | Top-level badge — lifecycle state, model, token counts, Stop / Retry actions |
| \`TokenUsageCard\` | Live token budget — input/output split, cost, context-window progress bar |
| \`AgentStepTimeline\` | Vertical trace: thought → tool call → observation → decision |
| \`ToolCallInspector\` | Per-call card — input JSON, response, latency, error details |
| \`AgentMemoryPanel\` | Context window bar + categorised short/long-term/episodic entries |

### Best practices demonstrated

- Breadcrumb links the run back to its parent list for navigation context
- Status badge in the top bar mirrors the agent state so operators always know without reading the cards
- Step timeline is the primary content column — the operator's main focus while the agent runs
- Tool inspectors stack in the right column, aligned with the steps that triggered them
- Error story shows both the status card error message AND the failed tool call simultaneously
        `,
      },
    },
  },
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

// ─── Stories ───────────────────────────────────────────────────────────────────

export const AgentRunning: Story = {
  render: () => (
    <div style={APP}>
      <TopBar status="running" />
      <LeftNav active="Live Agents" />
      <div style={MAIN}>
        <div style={PAGE_HEADER}>
          <div style={{ flex: 1 }}>
            <div style={BREADCRUMB}>
              <span>Agent Runs</span><span>›</span><span>Live Agents</span><span>›</span>
              <span style={{ color: "#0f172a", fontWeight: 500 }}>run_research_01</span>
            </div>
            <p style={PAGE_TITLE}>Research Agent</p>
            <p style={PAGE_SUBTITLE}>Step 3 of 5 · Searching the web for competitor pricing data</p>
          </div>
          <span style={STATUS_PILL("#10b981", "#10b98115")}>● Running</span>
          <span style={{ fontSize: 12, color: "#94a3b8" }}>Started 10:00 AM</span>
        </div>
        <div style={CONTENT}>
          <div style={TOP_ROW}>
            <AgentStatusCard
              name="Research Agent"
              status="running"
              model="claude-opus-4"
              description="Step 3 of 5 — searching the web for competitor pricing data."
              inputTokens={28_400}
              outputTokens={4_200}
              onStop={() => {}}
            />
            <TokenUsageCard
              modelName="claude-opus-4"
              inputTokens={28_400}
              outputTokens={4_200}
              costUsd={0.0218}
              maxTokens={200_000}
            />
          </div>
          <div style={BODY_ROW}>
            <AgentStepTimeline
              steps={[
                { id: "1", type: "thought", content: "I need to gather current competitor pricing before making a recommendation.", timestamp: "10:00:01", durationMs: 95 },
                { id: "2", type: "tool_use", content: "database_query — fetch active pricing tiers", detail: '{"table":"pricing_tiers","filter":"active=true"}', timestamp: "10:00:02", durationMs: 310 },
                { id: "3", type: "observation", content: "Retrieved 4 tiers. Enterprise tier: $1 200/mo.", timestamp: "10:00:03" },
                { id: "4", type: "tool_use", content: "web_search — competitor pricing pages", detail: '{"query":"enterprise SaaS pricing 2025","max_results":8}', timestamp: "10:00:04", isStreaming: true },
                { id: "5", type: "action", content: "Generating pricing comparison report…", timestamp: "10:00:05", isStreaming: true },
              ]}
            />
            <div style={SIDE_COL}>
              <ToolCallInspector
                toolName="database_query"
                description="Read-only SQL query against internal pricing DB"
                status="completed"
                input={{ table: "pricing_tiers", filter: "active=true" }}
                output={[{ tier: "starter", price: 49 }, { tier: "growth", price: 199 }, { tier: "business", price: 599 }, { tier: "enterprise", price: 1200 }]}
                latencyMs={310}
              />
              <ToolCallInspector
                toolName="web_search"
                description="Search the web for recent competitor pricing pages"
                status="running"
                input={{ query: "enterprise SaaS pricing 2025", max_results: 8 }}
              />
              <AgentMemoryPanel
                usedTokens={28_400}
                maxTokens={200_000}
                entries={[
                  { id: "m1", type: "short_term", content: "Task: produce pricing recommendation from competitor analysis.", createdAt: "Just now" },
                  { id: "m2", type: "short_term", content: "Our enterprise tier: $1 200/mo — retrieved from DB.", createdAt: "30 s ago" },
                  { id: "m3", type: "long_term", content: "User prefers concise bullet-point output.", createdAt: "3 days ago" },
                ]}
                onDelete={() => {}}
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
        story: "Agent mid-execution: DB query complete, web search active (streaming cursor in timeline). Memory panel shows 14% context window used. The Stop button in the status card lets operators abort cleanly.",
      },
      source: {
        code: `import { AgentStatusCard, TokenUsageCard, AgentStepTimeline, ToolCallInspector, AgentMemoryPanel } from "@kitelus/fly-ui";

<AgentStatusCard name="Research Agent" status="running" model="claude-opus-4"
  inputTokens={inputTokens} outputTokens={outputTokens} onStop={abortAgent} />
<TokenUsageCard modelName="claude-opus-4" inputTokens={inputTokens} outputTokens={outputTokens}
  costUsd={cost} maxTokens={200000} />
<AgentStepTimeline steps={agentSteps} />
<ToolCallInspector toolName="web_search" status="running" input={searchInput} />
<AgentMemoryPanel usedTokens={usedTokens} maxTokens={200000} entries={memoryEntries} onDelete={deleteEntry} />`,
      },
    },
  },
};

export const AgentCompleted: Story = {
  render: () => (
    <div style={APP}>
      <TopBar status="completed" />
      <LeftNav active="Run History" />
      <div style={MAIN}>
        <div style={PAGE_HEADER}>
          <div style={{ flex: 1 }}>
            <div style={BREADCRUMB}>
              <span>Agent Runs</span><span>›</span><span>Run History</span><span>›</span>
              <span style={{ color: "#0f172a", fontWeight: 500 }}>run_research_01</span>
            </div>
            <p style={PAGE_TITLE}>Research Agent</p>
            <p style={PAGE_SUBTITLE}>All 6 steps completed · Pricing recommendation delivered</p>
          </div>
          <span style={STATUS_PILL("#6366f1", "#6366f115")}>✓ Completed</span>
          <span style={{ fontSize: 12, color: "#94a3b8" }}>Duration: 2 m 14 s</span>
        </div>
        <div style={CONTENT}>
          <div style={TOP_ROW}>
            <AgentStatusCard
              name="Research Agent"
              status="completed"
              model="claude-opus-4"
              description="All 6 steps completed. Pricing recommendation report delivered."
              inputTokens={45_200}
              outputTokens={12_800}
            />
            <TokenUsageCard
              modelName="claude-opus-4"
              inputTokens={45_200}
              outputTokens={12_800}
              costUsd={0.0486}
              maxTokens={200_000}
            />
          </div>
          <div style={BODY_ROW}>
            <AgentStepTimeline
              steps={[
                { id: "1", type: "thought", content: "I need to gather current competitor pricing.", timestamp: "10:00:01", durationMs: 95 },
                { id: "2", type: "tool_use", content: "database_query — active pricing tiers", timestamp: "10:00:02", durationMs: 310 },
                { id: "3", type: "observation", content: "4 tiers retrieved. Enterprise: $1 200/mo.", timestamp: "10:00:03" },
                { id: "4", type: "tool_use", content: "web_search — competitor pricing", timestamp: "10:00:04", durationMs: 1840 },
                { id: "5", type: "observation", content: "6 competitors found. Median enterprise price: $980/mo. We are 22% above median.", timestamp: "10:00:06" },
                { id: "6", type: "decision", content: "Recommend enterprise price → $980/mo + new $1 500/mo premium tier. Projected net impact: +8% ARR.", timestamp: "10:00:07", durationMs: 420 },
              ]}
            />
            <div style={SIDE_COL}>
              <ToolCallInspector
                toolName="database_query"
                status="completed"
                input={{ table: "pricing_tiers" }}
                output={[{ tier: "starter", price: 49 }, { tier: "enterprise", price: 1200 }]}
                latencyMs={310}
              />
              <ToolCallInspector
                toolName="web_search"
                status="completed"
                input={{ query: "enterprise SaaS pricing 2025" }}
                output={[{ competitor: "Acme", price: 890 }, { competitor: "Globex", price: 1100 }, { competitor: "Initech", price: 950 }]}
                latencyMs={1840}
              />
              <AgentMemoryPanel
                usedTokens={45_200}
                maxTokens={200_000}
                entries={[
                  { id: "m1", type: "short_term", content: "Task completed: pricing recommendation delivered.", createdAt: "Just now" },
                  { id: "m2", type: "short_term", content: "Recommendation: enterprise → $980/mo + $1 500/mo premium.", createdAt: "20 s ago" },
                  { id: "m3", type: "long_term", content: "User prefers bullet-point output.", createdAt: "3 days ago" },
                  { id: "m4", type: "episodic", content: "Prior session: user accepted the enterprise discount recommendation.", createdAt: "2 wks ago" },
                ]}
                onDelete={() => {}}
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
        story: "All 6 steps complete. Status badge is green, both tool calls show completed state with latencies, memory panel holds 4 entries including an episodic memory from a prior session.",
      },
    },
  },
};

export const AgentError: Story = {
  render: () => (
    <div style={APP}>
      <TopBar status="error" />
      <LeftNav active="Live Agents" />
      <div style={MAIN}>
        <div style={PAGE_HEADER}>
          <div style={{ flex: 1 }}>
            <div style={BREADCRUMB}>
              <span>Agent Runs</span><span>›</span><span>Live Agents</span><span>›</span>
              <span style={{ color: "#0f172a", fontWeight: 500 }}>run_research_01</span>
            </div>
            <p style={PAGE_TITLE}>Research Agent</p>
            <p style={PAGE_SUBTITLE}>Step 4 failed — web_search timed out after 3 retries</p>
          </div>
          <span style={STATUS_PILL("#ef4444", "#ef444415")}>✕ Error</span>
          <span style={{ fontSize: 12, color: "#94a3b8" }}>Failed at 10:00:34</span>
        </div>
        <div style={CONTENT}>
          <div style={TOP_ROW}>
            <AgentStatusCard
              name="Research Agent"
              status="error"
              model="claude-opus-4"
              description="Step 4 failed — web_search timed out after 3 retries."
              inputTokens={31_200}
              outputTokens={4_800}
              errorMessage="Tool call timeout: web_search exceeded the 30 s limit after 3 retries. The search API may be degraded — check status.search-api.example.com."
              onRetry={() => {}}
            />
            <TokenUsageCard
              modelName="claude-opus-4"
              inputTokens={31_200}
              outputTokens={4_800}
              costUsd={0.0268}
              maxTokens={200_000}
            />
          </div>
          <div style={BODY_ROW}>
            <AgentStepTimeline
              steps={[
                { id: "1", type: "thought", content: "Gather competitor pricing before recommending changes.", timestamp: "10:00:01", durationMs: 95 },
                { id: "2", type: "tool_use", content: "database_query — fetch pricing tiers", timestamp: "10:00:02", durationMs: 310 },
                { id: "3", type: "observation", content: "Enterprise tier: $1 200/mo.", timestamp: "10:00:03" },
                { id: "4", type: "tool_use", content: "web_search — FAILED after 3 retries (30 s timeout)", timestamp: "10:00:04", durationMs: 30_000 },
              ]}
            />
            <div style={SIDE_COL}>
              <ToolCallInspector
                toolName="database_query"
                status="completed"
                input={{ table: "pricing_tiers" }}
                output={[{ tier: "enterprise", price: 1200 }]}
                latencyMs={310}
              />
              <ToolCallInspector
                toolName="web_search"
                status="error"
                input={{ query: "enterprise SaaS pricing 2025", max_results: 8 }}
                errorMessage="HTTP 503 Service Unavailable — search API degraded. Retried 3× with exponential backoff (2 s, 4 s, 8 s)."
                latencyMs={30_000}
              />
              <AgentMemoryPanel
                usedTokens={31_200}
                maxTokens={200_000}
                entries={[
                  { id: "m1", type: "short_term", content: "Task blocked at step 4 — web_search unavailable.", createdAt: "Just now" },
                  { id: "m2", type: "short_term", content: "Internal DB data retrieved: enterprise at $1 200/mo.", createdAt: "2 min ago" },
                ]}
                onDelete={() => {}}
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
        story: "Agent hit a hard error on web_search after 3 retries. Status card shows the full error message and a Retry button. The ToolCallInspector shows the HTTP 503 detail with backoff timing. The step timeline stops at step 4.",
      },
    },
  },
};
