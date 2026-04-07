import type { Meta, StoryObj } from "@storybook/react-vite";

import { ApiRequestInspector } from "../components/agent/observability/ApiRequestInspector";
import { ErrorLogViewer } from "../components/agent/observability/ErrorLogViewer";
import { ModelMetricsCard } from "../components/agent/observability/ModelMetricsCard";
import { PromptVersionHistory } from "../components/agent/observability/PromptVersionHistory";
import { TokenUsageCard } from "../components/agent/observability/TokenUsageCard";
import { PromptEditor } from "../components/agent/content/PromptEditor";

// ─── App shell ─────────────────────────────────────────────────────────────────

const APP: React.CSSProperties = {
  fontFamily: '"Inter Variable", Inter, ui-sans-serif, system-ui, sans-serif',
  display: "grid",
  gridTemplateRows: "48px 1fr",
  gridTemplateColumns: "220px 1fr",
  minHeight: "100vh",
  background: "#f1f5f9",
};

const TOPBAR: React.CSSProperties = { gridColumn: "1 / -1", background: "#0f172a", display: "flex", alignItems: "center", padding: "0 20px", gap: 16 };
const TOPBAR_LOGO: React.CSSProperties = { color: "#fff", fontWeight: 700, fontSize: 15, letterSpacing: "-0.02em", marginRight: 24 };
const TOPBAR_SPACER: React.CSSProperties = { flex: 1 };
const TOPBAR_AVATAR: React.CSSProperties = { width: 28, height: 28, borderRadius: "50%", background: "#6366f1", color: "#fff", fontSize: 11, fontWeight: 700, display: "flex", alignItems: "center", justifyContent: "center" };
const T_NAV = (a: boolean): React.CSSProperties => ({ color: a ? "#fff" : "#94a3b8", fontSize: 13, fontWeight: a ? 600 : 400, padding: "4px 10px", borderRadius: 6, background: a ? "rgba(255,255,255,0.08)" : "transparent", cursor: "pointer" });

const LEFT_NAV: React.CSSProperties = { background: "#1e293b", color: "#cbd5e1", display: "flex", flexDirection: "column", padding: "16px 12px", gap: 2, overflowY: "auto" };
const SECTION_LABEL: React.CSSProperties = { fontSize: 10, fontWeight: 600, letterSpacing: "0.08em", textTransform: "uppercase" as const, color: "#475569", padding: "12px 8px 4px" };
const S_ITEM = (a: boolean): React.CSSProperties => ({ display: "flex", alignItems: "center", gap: 8, padding: "7px 10px", borderRadius: 6, fontSize: 13, fontWeight: a ? 600 : 400, color: a ? "#fff" : "#94a3b8", background: a ? "rgba(99,102,241,0.3)" : "transparent", cursor: "pointer" });

const MAIN: React.CSSProperties = { display: "flex", flexDirection: "column", overflow: "hidden" };

const PAGE_HEADER: React.CSSProperties = { padding: "16px 28px 14px", background: "#ffffff", borderBottom: "1px solid #e2e8f0", display: "flex", alignItems: "center", gap: 16 };
const BREADCRUMB: React.CSSProperties = { fontSize: 12, color: "#64748b", display: "flex", alignItems: "center", gap: 6, marginBottom: 4 };
const PAGE_TITLE: React.CSSProperties = { fontSize: 18, fontWeight: 700, color: "#0f172a", margin: 0 };
const PAGE_META: React.CSSProperties = { fontSize: 13, color: "#64748b", margin: "2px 0 0" };
const STATUS_PILL = (color: string, bg: string): React.CSSProperties => ({ fontSize: 11, fontWeight: 600, padding: "3px 10px", borderRadius: 99, background: bg, color: color, border: `1px solid ${color}30` });

const CONTENT: React.CSSProperties = { flex: 1, overflow: "auto", padding: "20px 28px", display: "flex", flexDirection: "column", gap: 16 };

// Top section: version history | editor + token | metrics
const TOP_GRID: React.CSSProperties = { display: "grid", gridTemplateColumns: "260px 1fr 300px", gap: 16, alignItems: "start" };
const CENTER_COL: React.CSSProperties = { display: "flex", flexDirection: "column", gap: 14 };
const BOTTOM_GRID: React.CSSProperties = { display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, alignItems: "start" };

// ─── Sample data ───────────────────────────────────────────────────────────────

const SYSTEM_PROMPT_V3 = `You are a senior customer support agent for Acme Corp.

Your responsibilities:
- Answer product questions using the knowledge base
- Resolve billing issues up to $200 without escalation
- Escalate legal threats, refund requests above $200, and data deletion requests to a human agent
- Always greet the customer by first name if available
- Tone: professional, empathetic, concise

You may NOT: speculate about unreleased features, make promises about SLAs, or share internal escalation paths.`;

const SYSTEM_PROMPT_V2 = `You are a customer support agent for Acme Corp.

Answer product questions and resolve billing issues.
Escalate complex issues to a human agent.
Do not offer refunds without manager approval.
Tone: professional and polite.`;

const VARIABLES = [
  { name: "customer_name", description: "Customer first name if known" },
  { name: "account_tier", description: "free | pro | enterprise" },
  { name: "kb_context", description: "Injected knowledge base snippets" },
];

function TopBar({ title, statusLabel, statusColor }: { title: string; statusLabel: string; statusColor: string }) {
  return (
    <div style={TOPBAR}>
      <span style={TOPBAR_LOGO}>⚙ PromptLab</span>
      {["Prompts", "Evaluations", "Deployments", "Observability"].map((l) => (
        <span key={l} style={T_NAV(l === "Prompts")}>{l}</span>
      ))}
      <div style={TOPBAR_SPACER} />
      <span style={{ color: "#64748b", fontSize: 12 }}>{title}</span>
      <span style={{ ...STATUS_PILL(statusColor, `${statusColor}18`) }}>{statusLabel}</span>
      <div style={TOPBAR_AVATAR}>BT</div>
    </div>
  );
}

function LeftNav({ active }: { active: string }) {
  return (
    <div style={LEFT_NAV}>
      <div style={SECTION_LABEL}>Prompts</div>
      {[{ icon: "✎", label: "All Prompts" }, { icon: "⭐", label: "Favourites" }, { icon: "🕐", label: "Recent" }].map(({ icon, label }) => (
        <div key={label} style={S_ITEM(label === active)}>
          <span>{icon}</span><span>{label}</span>
        </div>
      ))}
      <div style={SECTION_LABEL}>Workspace</div>
      {[{ icon: "📊", label: "Evaluations" }, { icon: "🚀", label: "Deployments" }, { icon: "📋", label: "Changelog" }].map(({ icon, label }) => (
        <div key={label} style={S_ITEM(label === active)}>
          <span>{icon}</span><span>{label}</span>
        </div>
      ))}
      <div style={SECTION_LABEL}>Ops</div>
      {[{ icon: "🔔", label: "Alerts" }, { icon: "⚙️", label: "Settings" }].map(({ icon, label }) => (
        <div key={label} style={S_ITEM(false)}>
          <span>{icon}</span><span>{label}</span>
        </div>
      ))}
    </div>
  );
}

// ─── Meta ──────────────────────────────────────────────────────────────────────

const meta = {
  title: "Examples/Prompt Management",
  tags: ["autodocs"],
  parameters: {
    layout: "fullscreen",
    docs: {
      description: {
        component: `
## Prompt Engineering Workspace — Full Application Screen

A complete prompt management platform screen. Version history on the left, live template editor and token budget in the centre, real-time quality metrics on the right, and API inspector + error log below. Everything a prompt engineer needs to write, test, and diagnose production system prompts in one view.

**Scenario**: The customer support team's AI agent runs on a system prompt that is version-controlled and A/B tested. A prompt engineer is working in PromptLab — iterating on v3, checking if the new billing authority rules improved CSAT, and investigating a recent latency spike.

### Components used

| Component | Role |
|---|---|
| \`PromptVersionHistory\` | Version list with inline diff — click any version to restore |
| \`PromptEditor\` | Template editor with variable chips, token counter, and read-only mode |
| \`TokenUsageCard\` | Live token budget — input/output split, cost estimate, context-window bar |
| \`ModelMetricsCard\` | Response quality KPIs — latency, CSAT, resolution rate, escalation rate |
| \`ApiRequestInspector\` | Last API call — request body, response, headers, status code |
| \`ErrorLogViewer\` | Filterable log of model errors, policy gaps, and latency warnings |

### Best practices demonstrated

- Version history on the left keeps the full change timeline visible without obscuring the editor
- Variable chips insert \`{{placeholder}}\` syntax — safe templating without string concatenation
- Token card sits directly below the editor — cost is visible as the prompt grows
- Metrics card is right-aligned — quality KPIs are secondary to authoring, not dominant
- \`ApiRequestInspector\` and \`ErrorLogViewer\` share the bottom row — debug tools available but not dominant
- Error log uses severity tiers so critical failures are immediately visible
        `,
      },
    },
  },
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

// ─── Stories ───────────────────────────────────────────────────────────────────

export const EditingPrompt: Story = {
  render: () => (
    <div style={APP}>
      <TopBar title="support-agent · v3 (active)" statusLabel="● Live" statusColor="#10b981" />
      <LeftNav active="All Prompts" />
      <div style={MAIN}>
        <div style={PAGE_HEADER}>
          <div style={{ flex: 1 }}>
            <div style={BREADCRUMB}>
              <span>Prompts</span><span>›</span><span>All Prompts</span><span>›</span>
              <span style={{ color: "#0f172a", fontWeight: 500 }}>support-agent</span>
            </div>
            <p style={PAGE_TITLE}>Support Agent System Prompt</p>
            <p style={PAGE_META}>v3 · Active in production · 1 204 calls today · CSAT 4.7/5</p>
          </div>
          <span style={STATUS_PILL("#10b981", "#10b98115")}>● v3 Active</span>
          <button style={{ fontSize: 12, padding: "6px 14px", borderRadius: 6, background: "#6366f1", color: "#fff", border: "none", fontWeight: 600, cursor: "pointer", fontFamily: "inherit" }}>
            Deploy v3
          </button>
        </div>
        <div style={CONTENT}>
          <div style={TOP_GRID}>
            <PromptVersionHistory
              versions={[
                { id: "v3", version: "v3", description: "Add billing authority + escalation rules", author: "Binh T.", createdAt: "Today 10:42", tokens: 184, isActive: true },
                { id: "v2", version: "v2", description: "Expand tone guidelines", author: "Sarah P.", createdAt: "Yesterday 16:10", tokens: 112, diffAdded: ["professional, empathetic, concise"], diffRemoved: ["professional and polite"] },
                { id: "v1", version: "v1", description: "Initial system prompt", author: "Binh T.", createdAt: "3 days ago", tokens: 74 },
              ]}
              activeVersionId="v3"
              onSelect={() => {}}
              onRestore={() => {}}
            />
            <div style={CENTER_COL}>
              <PromptEditor
                label="System Prompt — v3 (active)"
                value={SYSTEM_PROMPT_V3}
                estimatedTokens={184}
                maxTokens={4_096}
                variables={VARIABLES}
                onChange={() => {}}
                onVariableInsert={() => {}}
              />
              <TokenUsageCard
                modelName="claude-opus-4"
                inputTokens={2_640}
                outputTokens={840}
                costUsd={0.0024}
                maxTokens={4_096}
              />
            </div>
            <ModelMetricsCard
              title="Live Metrics — v3"
              modelName="claude-opus-4"
              metrics={[
                { label: "Avg latency", value: 1.4, unit: "s", trend: "down", trendLabel: "−0.3 s vs v2" },
                { label: "CSAT score", value: "4.7", unit: "/5", trend: "up", trendLabel: "+0.2 vs v2" },
                { label: "Resolution rate", value: "82", unit: "%", trend: "up", trendLabel: "+6% vs v2" },
                { label: "Escalation rate", value: "11", unit: "%", trend: "down", trendLabel: "−4% vs v2" },
                { label: "Calls today", value: "1 204", trend: "stable" },
                { label: "Error rate", value: "0.8", unit: "%", trend: "stable" },
              ]}
            />
          </div>
          <div style={BOTTOM_GRID}>
            <ApiRequestInspector
              method="POST"
              endpoint="/v1/messages"
              statusCode={200}
              latencyMs={1_380}
              requestBody={{
                model: "claude-opus-4",
                max_tokens: 1024,
                system: SYSTEM_PROMPT_V3.slice(0, 60) + "…",
                messages: [{ role: "user", content: "Hi, my last invoice seems wrong." }],
              }}
              responseBody={{
                id: "msg_01XaBcDe",
                type: "message",
                role: "assistant",
                content: [{ type: "text", text: "Hi! I'd be happy to help you review your invoice. Could you share the invoice number so I can pull up the details?" }],
                usage: { input_tokens: 2640, output_tokens: 38 },
              }}
              requestHeaders={{ "Content-Type": "application/json", "anthropic-version": "2023-06-01" }}
              responseHeaders={{ "Content-Type": "application/json", "x-request-id": "req_01Ab" }}
            />
            <ErrorLogViewer
              entries={[
                { id: "e1", severity: "info", message: "Prompt v3 deployed to production", timestamp: "10:42 AM", source: "deploy-service" },
                { id: "e2", severity: "warning", message: "Response latency spike — 4.2 s on 3 requests", timestamp: "10:15 AM", source: "inference-proxy", code: "LATENCY_WARNING" },
                { id: "e3", severity: "info", message: "A/B test started — v3 vs v2, 20% traffic split", timestamp: "09:58 AM", source: "experiment-service" },
              ]}
              onFilterChange={() => {}}
            />
          </div>
        </div>
      </div>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: "v3 is active in production. All KPIs are trending positively vs v2 — CSAT up 0.2, resolution rate up 6%, escalation down 4%. The API inspector shows the last successful call. The error log has only a warning and two info events.",
      },
      source: {
        code: `import { PromptVersionHistory, PromptEditor, TokenUsageCard, ModelMetricsCard, ApiRequestInspector, ErrorLogViewer } from "@kitelus/fly-ui";

<PromptVersionHistory
  versions={promptVersions}
  activeVersionId={activeId}
  onSelect={setActiveVersion}
  onRestore={(id) => restoreVersion(id)}
/>
<PromptEditor
  label="System Prompt"
  value={promptText}
  estimatedTokens={tokenCount}
  maxTokens={4096}
  variables={templateVars}
  onChange={setPromptText}
  onVariableInsert={(name) => insertAtCursor(\`{{\${name}}}\`)}
/>
<TokenUsageCard modelName="claude-opus-4" inputTokens={inputTokens} outputTokens={outputTokens} costUsd={cost} />
<ModelMetricsCard title="Live Metrics" modelName="claude-opus-4" metrics={kpiMetrics} />
<ApiRequestInspector method="POST" endpoint="/v1/messages" statusCode={200} latencyMs={latency}
  requestBody={lastRequest} responseBody={lastResponse} />
<ErrorLogViewer entries={errorEntries} onFilterChange={setFilter} />`,
      },
    },
  },
};

export const ReviewingDiff: Story = {
  render: () => (
    <div style={APP}>
      <TopBar title="support-agent · comparing v3 vs v2" statusLabel="Comparing" statusColor="#6366f1" />
      <LeftNav active="All Prompts" />
      <div style={MAIN}>
        <div style={PAGE_HEADER}>
          <div style={{ flex: 1 }}>
            <div style={BREADCRUMB}>
              <span>Prompts</span><span>›</span><span>support-agent</span><span>›</span>
              <span style={{ color: "#0f172a", fontWeight: 500 }}>v3 vs v2 comparison</span>
            </div>
            <p style={PAGE_TITLE}>Support Agent System Prompt</p>
            <p style={PAGE_META}>Comparing v3 (active) vs v2 (baseline) — click Restore on v2 to rollback</p>
          </div>
          <span style={STATUS_PILL("#6366f1", "#6366f115")}>Comparing v3 → v2</span>
          <button style={{ fontSize: 12, padding: "6px 14px", borderRadius: 6, background: "#f1f5f9", color: "#475569", border: "1px solid #e2e8f0", fontWeight: 600, cursor: "pointer", fontFamily: "inherit" }}>
            Restore v2
          </button>
        </div>
        <div style={CONTENT}>
          <div style={TOP_GRID}>
            <PromptVersionHistory
              versions={[
                {
                  id: "v3",
                  version: "v3",
                  description: "Add billing authority + escalation rules",
                  author: "Binh T.",
                  createdAt: "Today 10:42",
                  tokens: 184,
                  isActive: true,
                  diffAdded: [
                    "Resolve billing issues up to $200 without escalation",
                    "Always greet the customer by first name if available",
                    "You may NOT: speculate about unreleased features…",
                  ],
                  diffRemoved: [
                    "Answer product questions and resolve billing issues.",
                    "Do not offer refunds without manager approval.",
                  ],
                },
                { id: "v2", version: "v2", description: "Expand tone guidelines", author: "Sarah P.", createdAt: "Yesterday 16:10", tokens: 112 },
                { id: "v1", version: "v1", description: "Initial system prompt", author: "Binh T.", createdAt: "3 days ago", tokens: 74 },
              ]}
              activeVersionId="v3"
              onSelect={() => {}}
              onRestore={() => {}}
            />
            <div style={CENTER_COL}>
              <PromptEditor
                label="System Prompt — v2 (baseline, read-only)"
                value={SYSTEM_PROMPT_V2}
                estimatedTokens={112}
                maxTokens={4_096}
                variables={VARIABLES}
                readOnly
                onChange={() => {}}
                onVariableInsert={() => {}}
              />
              <TokenUsageCard
                modelName="claude-opus-4"
                inputTokens={1_820}
                outputTokens={620}
                costUsd={0.0017}
                maxTokens={4_096}
              />
            </div>
            <ModelMetricsCard
              title="Baseline Metrics — v2"
              modelName="claude-opus-4"
              metrics={[
                { label: "Avg latency", value: 1.7, unit: "s" },
                { label: "CSAT score", value: "4.5", unit: "/5" },
                { label: "Resolution rate", value: "76", unit: "%" },
                { label: "Escalation rate", value: "15", unit: "%" },
                { label: "Calls sampled", value: "3 200" },
                { label: "Error rate", value: "0.9", unit: "%" },
              ]}
            />
          </div>
          <div style={BOTTOM_GRID}>
            <ApiRequestInspector
              method="POST"
              endpoint="/v1/messages"
              statusCode={429}
              latencyMs={210}
              requestBody={{
                model: "claude-opus-4",
                max_tokens: 1024,
                system: SYSTEM_PROMPT_V2.slice(0, 60) + "…",
                messages: [{ role: "user", content: "I want a full refund for the past 3 months." }],
              }}
              responseBody={{
                type: "error",
                error: { type: "rate_limit_error", message: "Rate limit exceeded. Retry after 30 seconds." },
              }}
              requestHeaders={{ "Content-Type": "application/json", "anthropic-version": "2023-06-01" }}
              responseHeaders={{ "retry-after": "30", "x-ratelimit-limit-requests": "500" }}
            />
            <ErrorLogViewer
              entries={[
                { id: "e1", severity: "error", message: "Rate limit hit — 429 from Anthropic API", timestamp: "11:03 AM", source: "inference-proxy", code: "RATE_LIMIT_429", stack: "POST /v1/messages → 429 Too Many Requests\nretry-after: 30s\nAffected requests: 14" },
                { id: "e2", severity: "warning", message: "v2 prompt missing escalation rule for legal threats — 2 tickets mis-routed", timestamp: "10:48 AM", source: "routing-audit", code: "POLICY_GAP" },
                { id: "e3", severity: "warning", message: "Response latency spike — 4.2 s on 3 requests", timestamp: "10:15 AM", source: "inference-proxy", code: "LATENCY_WARNING" },
                { id: "e4", severity: "info", message: "Comparison mode: viewing v2 metrics baseline", timestamp: "10:00 AM", source: "prompt-manager" },
              ]}
              onFilterChange={() => {}}
            />
          </div>
        </div>
      </div>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: "Comparing v3 against v2. The version history shows the inline diff (added/removed lines). The editor is read-only showing v2's simpler text. v2 baseline metrics — lower resolution rate and higher escalation rate — confirm v3 is the improvement. The error log shows the policy gap (no legal escalation rule in v2) that motivated the update.",
      },
      source: {
        code: `// Read-only editor for historical version comparison
<PromptEditor
  label="System Prompt — v2 (baseline)"
  value={historicalPrompt}
  readOnly
  estimatedTokens={112}
  maxTokens={4096}
  variables={templateVars}
  onChange={() => {}}
  onVariableInsert={() => {}}
/>

// Show baseline metrics alongside active metrics for direct comparison
<ModelMetricsCard title="Baseline Metrics — v2" metrics={v2Metrics} />

// API inspector shows last call made with the compared version
<ApiRequestInspector method="POST" endpoint="/v1/messages" statusCode={429} latencyMs={210}
  requestBody={lastV2Request} responseBody={errorResponse} />`,
      },
    },
  },
};

export const CriticalIncident: Story = {
  render: () => (
    <div style={APP}>
      <TopBar title="support-agent · INCIDENT" statusLabel="🔴 Incident" statusColor="#ef4444" />
      <LeftNav active="Alerts" />
      <div style={MAIN}>
        <div style={PAGE_HEADER}>
          <div style={{ flex: 1 }}>
            <div style={BREADCRUMB}>
              <span>Prompts</span><span>›</span><span>support-agent</span><span>›</span>
              <span style={{ color: "#ef4444", fontWeight: 600 }}>⚠ Incident Active</span>
            </div>
            <p style={PAGE_TITLE}>Support Agent System Prompt</p>
            <p style={PAGE_META}>v3 active · API overloaded · 218 requests failed in last 10 min · On-call paged</p>
          </div>
          <span style={STATUS_PILL("#ef4444", "#ef444415")}>🔴 Incident Active</span>
          <button style={{ fontSize: 12, padding: "6px 14px", borderRadius: 6, background: "#ef4444", color: "#fff", border: "none", fontWeight: 600, cursor: "pointer", fontFamily: "inherit" }}>
            Rollback to v2
          </button>
        </div>
        <div style={CONTENT}>
          <div style={TOP_GRID}>
            <PromptVersionHistory
              versions={[
                { id: "v3", version: "v3", description: "Add billing authority + escalation rules", author: "Binh T.", createdAt: "Today 10:42", tokens: 184, isActive: true },
                { id: "v2", version: "v2", description: "Expand tone guidelines", author: "Sarah P.", createdAt: "Yesterday", tokens: 112 },
              ]}
              activeVersionId="v3"
              onSelect={() => {}}
              onRestore={() => {}}
            />
            <div style={CENTER_COL}>
              <PromptEditor
                label="System Prompt — v3 (active)"
                value={SYSTEM_PROMPT_V3}
                estimatedTokens={184}
                maxTokens={4_096}
                variables={VARIABLES}
                onChange={() => {}}
                onVariableInsert={() => {}}
              />
              <TokenUsageCard
                modelName="claude-opus-4"
                inputTokens={3_940}
                outputTokens={1_020}
                costUsd={0.0041}
                maxTokens={4_096}
              />
            </div>
            <ModelMetricsCard
              title="Live Metrics — INCIDENT"
              modelName="claude-opus-4"
              metrics={[
                { label: "Avg latency", value: 8.1, unit: "s", trend: "up", trendLabel: "+6.7 s ↑ ALERT" },
                { label: "CSAT score", value: "3.2", unit: "/5", trend: "down", trendLabel: "−1.5 vs normal" },
                { label: "Resolution rate", value: "41", unit: "%", trend: "down", trendLabel: "−41% drop" },
                { label: "Error rate", value: "18", unit: "%", trend: "up", trendLabel: "×22 normal" },
                { label: "Calls failing", value: "218" },
                { label: "Rollback target", value: "v2" },
              ]}
            />
          </div>
          <div style={BOTTOM_GRID}>
            <ApiRequestInspector
              method="POST"
              endpoint="/v1/messages"
              statusCode={500}
              latencyMs={8_100}
              requestBody={{
                model: "claude-opus-4",
                max_tokens: 1024,
                system: SYSTEM_PROMPT_V3.slice(0, 60) + "…",
                messages: [{ role: "user", content: "Can you check my billing status?" }],
              }}
              responseBody={{
                type: "error",
                error: { type: "overloaded_error", message: "Anthropic API is temporarily overloaded. Please retry." },
              }}
              requestHeaders={{ "Content-Type": "application/json", "anthropic-version": "2023-06-01" }}
              responseHeaders={{ "x-request-id": "req_01Err", "retry-after": "60" }}
            />
            <ErrorLogViewer
              entries={[
                {
                  id: "e1",
                  severity: "error",
                  message: "API 500 overloaded — 218 requests failed in last 10 min",
                  timestamp: "11:22 AM",
                  source: "inference-proxy",
                  code: "OVERLOADED_500",
                  stack: "POST /v1/messages → 500 Overloaded\n218 requests affected\nSuggested action: activate fallback model or rollback to v2",
                },
                { id: "e2", severity: "error", message: "CSAT dropped below 3.5 threshold — automated alert triggered", timestamp: "11:20 AM", source: "quality-monitor", code: "CSAT_THRESHOLD" },
                { id: "e3", severity: "warning", message: "Context window usage at 96% — approaching limit", timestamp: "11:18 AM", source: "token-guard", code: "CTX_NEAR_LIMIT" },
                { id: "e4", severity: "error", message: "Latency SLA breach — 8.1 s avg exceeds 2 s SLA", timestamp: "11:17 AM", source: "sla-monitor", code: "LATENCY_SLA_BREACH" },
                { id: "e5", severity: "info", message: "On-call engineer paged via PagerDuty", timestamp: "11:22 AM", source: "alerting" },
              ]}
              onFilterChange={() => {}}
            />
          </div>
        </div>
      </div>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: "Active incident — the Anthropic API is overloaded. All KPIs are in the red: 8.1 s latency, 41% resolution rate, 18% error rate. The ApiRequestInspector shows the 500 overloaded response. The ErrorLogViewer has 4 critical/warning entries. The page header has a Rollback to v2 button as the primary recovery action.",
      },
    },
  },
};
