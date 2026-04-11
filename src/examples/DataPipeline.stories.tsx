import type { Meta, StoryObj } from "@storybook/react-vite";

import { BatchMonitor } from "../components/agent/task/BatchMonitor";
import { ColumnStatsCard } from "../components/agent/data/ColumnStatsCard";
import { DataQualityBadge } from "../components/agent/data/DataQualityBadge";
import { DataSummaryCard } from "../components/agent/data/DataSummaryCard";
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

const TOPBAR: React.CSSProperties = { gridColumn: "1 / -1", background: "#0f172a", display: "flex", alignItems: "center", padding: "0 20px", gap: 16 };
const TOPBAR_LOGO: React.CSSProperties = { color: "#fff", fontWeight: 700, fontSize: 15, letterSpacing: "-0.02em", marginRight: 24 };
const TOPBAR_SPACER: React.CSSProperties = { flex: 1 };
const TOPBAR_AVATAR: React.CSSProperties = { width: 28, height: 28, borderRadius: "50%", background: "#0ea5e9", color: "#fff", fontSize: 11, fontWeight: 700, display: "flex", alignItems: "center", justifyContent: "center" };
const T_NAV = (a: boolean): React.CSSProperties => ({ color: a ? "#fff" : "#94a3b8", fontSize: 13, fontWeight: a ? 600 : 400, padding: "4px 10px", borderRadius: 6, background: a ? "rgba(255,255,255,0.08)" : "transparent", cursor: "pointer" });

const LEFT_NAV: React.CSSProperties = { background: "#0c1a2e", color: "#cbd5e1", display: "flex", flexDirection: "column", padding: "16px 12px", gap: 2, overflowY: "auto" };
const SECTION_LABEL: React.CSSProperties = { fontSize: 10, fontWeight: 600, letterSpacing: "0.08em", textTransform: "uppercase" as const, color: "#334155", padding: "12px 8px 4px" };
const S_ITEM = (a: boolean): React.CSSProperties => ({ display: "flex", alignItems: "center", gap: 8, padding: "7px 10px", borderRadius: 6, fontSize: 13, fontWeight: a ? 600 : 400, color: a ? "#fff" : "#94a3b8", background: a ? "rgba(14,165,233,0.25)" : "transparent", cursor: "pointer" });

const MAIN: React.CSSProperties = { display: "flex", flexDirection: "column", overflow: "hidden" };

const PAGE_HEADER: React.CSSProperties = { padding: "16px 28px 14px", background: "#ffffff", borderBottom: "1px solid #e2e8f0", display: "flex", alignItems: "center", gap: 16 };
const BREADCRUMB: React.CSSProperties = { fontSize: 12, color: "#64748b", display: "flex", alignItems: "center", gap: 6, marginBottom: 4 };
const PAGE_TITLE: React.CSSProperties = { fontSize: 18, fontWeight: 700, color: "#0f172a", margin: 0 };
const PAGE_META: React.CSSProperties = { fontSize: 13, color: "#64748b", margin: "2px 0 0" };
const STATUS_PILL = (color: string, bg: string): React.CSSProperties => ({ fontSize: 11, fontWeight: 600, padding: "3px 10px", borderRadius: 99, background: bg, color: color, border: `1px solid ${color}30` });

const CONTENT: React.CSSProperties = { flex: 1, overflow: "auto", padding: "20px 28px", display: "flex", flexDirection: "column", gap: 16 };
const ROW2: React.CSSProperties = { display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, alignItems: "start" };
const ROW3: React.CSSProperties = { display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 14 };

function TopBar({ statusLabel, statusColor }: { statusLabel: string; statusColor: string }) {
  return (
    <div style={TOPBAR}>
      <span style={TOPBAR_LOGO}>◈ DataFlow</span>
      {["Pipelines", "Datasets", "Quality", "Schedules", "Settings"].map((l) => (
        <span key={l} style={T_NAV(l === "Pipelines")}>{l}</span>
      ))}
      <div style={TOPBAR_SPACER} />
      <span style={{ ...STATUS_PILL(statusColor, `${statusColor}18`) }}>{statusLabel}</span>
      <div style={TOPBAR_AVATAR}>AK</div>
    </div>
  );
}

function LeftNav({ active }: { active: string }) {
  return (
    <div style={LEFT_NAV}>
      <div style={SECTION_LABEL}>Ingestion</div>
      {[{ icon: "▶", label: "Active Runs" }, { icon: "📅", label: "Scheduled" }, { icon: "📋", label: "Run History" }].map(({ icon, label }) => (
        <div key={label} style={S_ITEM(label === active)}>
          <span style={{ fontSize: 10 }}>{icon}</span><span>{label}</span>
        </div>
      ))}
      <div style={SECTION_LABEL}>Data</div>
      {[{ icon: "🗂️", label: "Datasets" }, { icon: "✅", label: "Quality Rules" }, { icon: "📊", label: "Metrics" }].map(({ icon, label }) => (
        <div key={label} style={S_ITEM(label === active)}>
          <span>{icon}</span><span>{label}</span>
        </div>
      ))}
      <div style={SECTION_LABEL}>Ops</div>
      {[{ icon: "🔔", label: "Alerts" }, { icon: "⚙️", label: "Config" }].map(({ icon, label }) => (
        <div key={label} style={S_ITEM(false)}>
          <span>{icon}</span><span>{label}</span>
        </div>
      ))}
    </div>
  );
}

// ─── Meta ──────────────────────────────────────────────────────────────────────

const meta = {
  title: "Examples/Data Pipeline",
  tags: ["autodocs"],
  parameters: {
    layout: "fullscreen",
    docs: {
      description: {
        component: `
## AI Data Pipeline Dashboard — Full Application Screen

A complete data ingestion operations screen inside a DataFlow platform. The AI pipeline ingests a Parquet file, validates schema, profiles all 24 columns in parallel, runs quality rules, and loads to the data warehouse. Operators see the full pipeline state, column-level profiles, quality issues, and batch job status in a single view.

**Scenario**: The quarterly sales data file has just landed in S3. The pipeline auto-triggers, and the data engineering team monitors it from this screen. On the QualityIssues story, the pipeline halts because critical data quality rules have failed.

### Components used

| Component | Role |
|---|---|
| \`DataSummaryCard\` | High-level KPIs (row count, missing %, duplicates) with AI-generated insights |
| \`WorkflowStepList\` | Ordered pipeline stages — ingest → schema → profile → quality → ML → load |
| \`ColumnStatsCard\` | Per-column profile: type, missing %, distribution histogram |
| \`DataQualityBadge\` | Colour-coded issue chips grouped by severity (critical → low) |
| \`BatchMonitor\` | Parallel column-profiling job tracker with retry-failed button |

### Best practices demonstrated

- \`DataSummaryCard insights\` surfaces AI-generated observations above raw KPIs
- Column stats use a 3-column grid — compact and naturally responsive
- Pipeline halts at step 4 with a descriptive error message when critical rules fail
- \`DataQualityBadge\` uses \`layout="column"\` so severity tiers are scannable top-to-bottom
- \`BatchMonitor\` shows which profiling jobs failed so engineers can selectively retry
        `,
      },
    },
  },
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

// ─── Stories ───────────────────────────────────────────────────────────────────

export const Profiling: Story = {
  render: () => (
    <div style={APP}>
      <TopBar statusLabel="⟳ Profiling · Step 3 of 6" statusColor="#f59e0b" />
      <LeftNav active="Active Runs" />
      <div style={MAIN}>
        <div style={PAGE_HEADER}>
          <div style={{ flex: 1 }}>
            <div style={BREADCRUMB}>
              <span>Pipelines</span><span>›</span><span>Active Runs</span><span>›</span>
              <span style={{ color: "#0f172a", fontWeight: 500 }}>sales_q3_ingest_20250930</span>
            </div>
            <p style={PAGE_TITLE}>Sales Transactions — Q3 2025</p>
            <p style={PAGE_META}>sales_q3_2025.parquet · 248 450 rows · 24 columns · Step 3 of 6: Column profiling</p>
          </div>
          <span style={STATUS_PILL("#f59e0b", "#f59e0b15")}>⟳ Profiling</span>
          <span style={{ fontSize: 12, color: "#94a3b8" }}>Triggered 2 min ago</span>
        </div>
        <div style={CONTENT}>
          <div style={ROW2}>
            <DataSummaryCard
              title="Sales Transactions — Q3 2025"
              stats={[
                { label: "Rows", value: "248 450" },
                { label: "Columns", value: 24 },
                { label: "Missing", value: "3.2%" },
                { label: "Duplicates", value: 14 },
              ]}
              insights={[
                "Widget Pro drives 34% of total revenue — only 12% of transaction volume",
                "APAC region: 41% YoY growth, highest of all segments",
              ]}
              source="sales_q3_2025.parquet"
              lastUpdated="2 min ago"
            />
            <WorkflowStepList
              steps={[
                { id: "1", label: "Ingest Parquet file → staging", status: "completed", durationMs: 820 },
                { id: "2", label: "Schema validation (24 columns)", status: "completed", durationMs: 140 },
                { id: "3", label: "Column profiling (24 columns)", status: "running", description: "Column 9 of 24 in progress — revenue_usd distribution…" },
                { id: "4", label: "Quality rule evaluation (18 rules)", status: "pending" },
                { id: "5", label: "ML anomaly detection", status: "pending" },
                { id: "6", label: "Load to data warehouse", status: "pending" },
              ]}
            />
          </div>
          <div style={ROW3}>
            <ColumnStatsCard
              columnName="revenue_usd"
              dataType="number"
              totalCount={248_450}
              missingCount={0}
              uniqueCount={214_820}
              min={0.99}
              max={142_000}
              mean={8_420.5}
              median={2_140}
              topBins={[
                { label: "< $100", count: 42_100 },
                { label: "$100–$1k", count: 98_200 },
                { label: "$1k–$10k", count: 74_300 },
                { label: "$10k–$50k", count: 28_900 },
                { label: "$50k+", count: 4_950 },
              ]}
            />
            <ColumnStatsCard
              columnName="region"
              dataType="string"
              totalCount={248_450}
              missingCount={312}
              uniqueCount={6}
              topBins={[
                { label: "EMEA", count: 94_200 },
                { label: "Americas", count: 88_400 },
                { label: "APAC", count: 52_100 },
                { label: "LATAM", count: 9_800 },
                { label: "Other", count: 3_638 },
              ]}
            />
            <ColumnStatsCard
              columnName="transaction_date"
              dataType="date"
              totalCount={248_450}
              missingCount={0}
              uniqueCount={92}
              min="2025-07-01"
              max="2025-09-30"
            />
          </div>
          <div style={ROW2}>
            <BatchMonitor
              batchName="Column Profiling Jobs"
              items={[
                { id: "c1", name: "revenue_usd — numeric profiling", status: "completed", progress: 100 },
                { id: "c2", name: "region — categorical profiling", status: "completed", progress: 100 },
                { id: "c3", name: "transaction_date — temporal profiling", status: "completed", progress: 100 },
                { id: "c4", name: "customer_id — PII scan + unique count", status: "running", progress: 72 },
                { id: "c5", name: "product_sku — cardinality analysis", status: "running", progress: 44 },
                { id: "c6", name: "discount_pct — outlier detection", status: "queued" },
                { id: "c7", name: "payment_method — distribution check", status: "queued" },
              ]}
            />
            <DataQualityBadge
              layout="column"
              issues={[
                { level: "medium", label: "Missing region codes", count: 312 },
                { level: "low", label: "Duplicate transaction IDs", count: 14 },
                { level: "low", label: "Future-dated transactions", count: 3 },
              ]}
            />
          </div>
        </div>
      </div>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: "Pipeline at step 3. Three columns are profiled; 4 more jobs are running or queued. Only low/medium quality issues so far — the pipeline is on track to complete without a halt.",
      },
      source: {
        code: `import { DataSummaryCard, ColumnStatsCard, DataQualityBadge, WorkflowStepList, BatchMonitor } from "@kitelus/fly-ui";

<DataSummaryCard title="Sales Q3" stats={summaryStats} insights={aiInsights} source="sales.parquet" />
<WorkflowStepList steps={pipelineSteps} />
{profiledColumns.map((col) => <ColumnStatsCard key={col.columnName} {...col} />)}
<BatchMonitor batchName="Column Profiling" items={profilingJobs} />
<DataQualityBadge issues={qualityIssues} layout="column" />`,
      },
    },
  },
};

export const QualityIssues: Story = {
  render: () => (
    <div style={APP}>
      <TopBar statusLabel="✕ Halted · Step 4 failed" statusColor="#ef4444" />
      <LeftNav active="Active Runs" />
      <div style={MAIN}>
        <div style={PAGE_HEADER}>
          <div style={{ flex: 1 }}>
            <div style={BREADCRUMB}>
              <span>Pipelines</span><span>›</span><span>Active Runs</span><span>›</span>
              <span style={{ color: "#0f172a", fontWeight: 500 }}>sales_q3_ingest_20250930</span>
            </div>
            <p style={PAGE_TITLE}>Sales Transactions — Q3 2025</p>
            <p style={PAGE_META}>Pipeline halted — 2 critical quality rules failed · Warehouse load blocked</p>
          </div>
          <span style={STATUS_PILL("#ef4444", "#ef444415")}>✕ Halted</span>
          <span style={{ fontSize: 12, color: "#94a3b8" }}>Failed 18 s ago</span>
        </div>
        <div style={CONTENT}>
          <div style={ROW2}>
            <DataSummaryCard
              title="Sales Transactions — Q3 2025"
              stats={[
                { label: "Rows", value: "248 450" },
                { label: "Columns", value: 24 },
                { label: "Missing", value: "8.7%" },
                { label: "Duplicates", value: "1 842" },
              ]}
              insights={[
                "Critical: 1 842 duplicate primary keys — likely ETL double-write issue from the staging job",
                "High: customer_id has 18% null rate, violating the non-nullable schema contract",
              ]}
              source="sales_q3_2025.parquet"
              lastUpdated="Just now"
            />
            <WorkflowStepList
              steps={[
                { id: "1", label: "Ingest Parquet file → staging", status: "completed", durationMs: 820 },
                { id: "2", label: "Schema validation (24 columns)", status: "completed", durationMs: 140 },
                { id: "3", label: "Column profiling (24 columns)", status: "completed", durationMs: 18_400 },
                { id: "4", label: "Quality rule evaluation (18 rules)", status: "failed", errorMessage: "2 critical rules failed: duplicate primary keys (1 842) and non-nullable field customer_id has 18% NULLs. Pipeline halted to prevent bad data reaching the warehouse." },
                { id: "5", label: "ML anomaly detection", status: "skipped" },
                { id: "6", label: "Load to data warehouse", status: "skipped" },
              ]}
            />
          </div>
          <div style={ROW3}>
            <ColumnStatsCard
              columnName="transaction_id"
              dataType="string"
              totalCount={248_450}
              missingCount={0}
              uniqueCount={246_608}
              topBins={[{ label: "Unique", count: 246_608 }, { label: "Duplicate", count: 1_842 }]}
            />
            <ColumnStatsCard
              columnName="customer_id"
              dataType="string"
              totalCount={248_450}
              missingCount={44_721}
              uniqueCount={183_200}
              topBins={[{ label: "Present", count: 203_729 }, { label: "NULL", count: 44_721 }]}
            />
            <ColumnStatsCard
              columnName="discount_pct"
              dataType="number"
              totalCount={248_450}
              missingCount={1_200}
              min={0}
              max={142}
              mean={12.4}
              median={10}
              topBins={[
                { label: "0%", count: 88_400 },
                { label: "5–15%", count: 112_000 },
                { label: "15–25%", count: 42_100 },
                { label: ">25% (outlier)", count: 5_750 },
              ]}
            />
          </div>
          <div style={ROW2}>
            <BatchMonitor
              batchName="Column Profiling Jobs"
              items={[
                { id: "c1", name: "transaction_id — duplicate key detection", status: "completed", progress: 100 },
                { id: "c2", name: "customer_id — null rate check", status: "completed", progress: 100 },
                { id: "c3", name: "discount_pct — outlier detection", status: "completed", progress: 100 },
                { id: "c4", name: "revenue_usd — range validation", status: "completed", progress: 100 },
                { id: "c5", name: "transaction_date — future-date check", status: "failed" },
              ]}
              onRetryFailed={() => {}}
            />
            <DataQualityBadge
              layout="column"
              issues={[
                { level: "critical", label: "Duplicate primary keys", count: 1_842 },
                { level: "high", label: "NULL in non-nullable customer_id", count: 44_721 },
                { level: "medium", label: "Discount > 100% (impossible value)", count: 23 },
                { level: "low", label: "Future-dated transactions", count: 3 },
              ]}
            />
          </div>
        </div>
      </div>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: "Pipeline halted at step 4 after two critical quality rules failed. WorkflowStepList shows the detailed failure message; steps 5 and 6 are skipped. DataQualityBadge lists issues across all four severity levels. BatchMonitor shows the failed profiling job with a retry button.",
      },
    },
  },
};
