import type { Meta, StoryObj } from "@storybook/react-vite";

import { ColumnStatsCard } from "./ColumnStatsCard";
import { DataQualityBadge } from "./DataQualityBadge";
import { DataSummaryCard } from "./DataSummaryCard";

const themeArgType = {
  description:
    "Optional per-component theme override. Use `FlyUIThemeProvider` for app-wide theming.",
  control: "object",
  table: {
    type: {
      summary: "KiteTheme",
      detail:
        "{\n  primary?: string;\n  primaryHover?: string;\n  primaryActive?: string;\n  primarySubtle?: string;\n  foreground?: string;\n  muted?: string;\n  disabled?: string;\n  background?: string;\n  surface?: string;\n  border?: string;\n  radius?: string;\n  success?: string;\n  warning?: string;\n  danger?: string;\n  fontFamily?: string;\n  shadowSm?: string;\n  shadowMd?: string;\n  overlayBackground?: string;\n  overlayBlur?: string;\n}",
    },
    defaultValue: { summary: "undefined" },
  },
};

const meta = {
  title: "Components/Data",
  component: DataSummaryCard,
  subcomponents: { ColumnStatsCard, DataQualityBadge },
  tags: ["autodocs"],
  args: {
    title: "Sales Dataset Overview",
    stats: [
      { label: "Rows", value: "12,450" },
      { label: "Columns", value: 18 },
      { label: "Missing", value: "2.3%" },
      { label: "Duplicates", value: 0 },
    ],
    source: "sales_data_q3.csv",
    lastUpdated: "2 min ago",
  },
  argTypes: {
    title: {
      description: "Card heading shown above the stats grid.",
      control: "text",
      table: { defaultValue: { summary: "undefined" } },
    },
    stats: {
      description:
        "Array of `DataStat` objects displayed in the summary grid. Each stat: `{ label, value, id?, unit?, description? }`. `id` is used as the click key for `onStatClick`.",
      control: "object",
      table: { defaultValue: { summary: "[]" } },
    },
    insights: {
      description:
        "Array of insight strings rendered as highlighted callout rows below the stats grid.",
      control: "object",
      table: { defaultValue: { summary: "undefined" } },
    },
    source: {
      description:
        "Data source identifier shown in the top-right corner (e.g. filename or table name).",
      control: "text",
      table: { defaultValue: { summary: "undefined" } },
    },
    lastUpdated: {
      description:
        "Timestamp or relative time shown alongside the source label.",
      control: "text",
      table: { defaultValue: { summary: "undefined" } },
    },
    onStatClick: {
      description:
        "Called with `(id, stat)` when a stat card is clicked. The `id` is `stat.id` if provided, otherwise `stat.label`. Makes stat cards interactive.",
      control: false,
    },
    onRefresh: {
      description:
        "Callback — shows a Refresh button in the header when provided.",
      control: false,
    },
    refreshLabel: {
      description: "Label for the Refresh button.",
      control: "text",
      table: { defaultValue: { summary: '"Refresh"' } },
    },
    refreshing: {
      description:
        "When `true`, disables the Refresh button and shows a loading indicator.",
      control: "boolean",
      table: { defaultValue: { summary: "false" } },
    },
    renderStat: {
      description:
        "Custom render function for a single stat — receives the `DataStat` object and returns a ReactNode.",
      control: false,
    },
    headerSlot: {
      description: "ReactNode rendered in the card header alongside the title.",
      control: false,
      table: { category: "Slots" },
    },
    footerSlot: {
      description: "ReactNode rendered at the bottom of the card.",
      control: false,
      table: { category: "Slots" },
    },
    theme: themeArgType,
    className: { table: { category: "Styling" } },
    style: { table: { category: "Styling" } },
  },
  parameters: {
    docs: {
      description: {
        component: `
Data inspection components for surfacing dataset statistics, column profiles, and quality issues in AI data pipelines.

      > Availability: These components are available in '@kitelus/fly-ui' version '0.1.5-rc.0' and later.

---

## Install

\`\`\`bash
npm install @kitelus/fly-ui
\`\`\`

## Import

\`\`\`tsx
import { DataSummaryCard, ColumnStatsCard, DataQualityBadge } from "@kitelus/fly-ui";
\`\`\`

## Components

| Component | Description |
|---|---|
| \`DataSummaryCard\` | High-level dataset overview with a KPI stats grid, optional insight callouts, and refresh action |
| \`ColumnStatsCard\` | Per-column profile showing type, missing %, unique count, min/max/mean/median, and a mini bar chart |
| \`DataQualityBadge\` | Colour-coded issue chips for \`critical\`, \`high\`, \`medium\`, and \`low\` quality problems |

---

## Quick start

\`\`\`tsx
import { DataSummaryCard, ColumnStatsCard, DataQualityBadge } from "@kitelus/fly-ui";

// Dataset overview
<DataSummaryCard
  title="Sales Dataset"
  stats={[
    { id: "rows",    label: "Rows",    value: "12,450" },
    { id: "cols",    label: "Columns", value: 18 },
    { id: "missing", label: "Missing", value: "2.3%", unit: "of rows" },
  ]}
  insights={["Widget Pro drives 34% of total revenue"]}
  source="sales_q3.csv"
  onStatClick={(id, stat) => openStatDetail(id)}
  onRefresh={() => reloadDataset()}
/>

// Column profile
<ColumnStatsCard
  columnName="revenue"
  dataType="number"
  totalCount={12450}
  missingCount={12}
  min={0}
  max={142000}
  mean={8420.5}
  topBins={[
    { label: "0–5k",   count: 5200 },
    { label: "5k–20k", count: 4800 },
  ]}
  onSelect={(col) => setSelectedColumn(col)}
/>

// Quality issues
<DataQualityBadge
  issues={[
    { level: "critical", label: "Duplicate primary keys", count: 14 },
    { level: "high",     label: "Missing required fields", count: 512 },
  ]}
  onIssueClick={(id, issue) => openIssueDetail(issue)}
/>
\`\`\`
        `,
      },
    },
  },
} satisfies Meta<typeof DataSummaryCard>;

export default meta;

type Story = StoryObj<typeof meta>;

// ─── DataSummaryCard stories ──────────────────────────────────────────────────

export const Playground: Story = {
  parameters: {
    docs: {
      description: {
        story:
          "Interactive playground — edit `stats`, add `insights`, and change `source` using the controls panel.",
      },
    },
  },
};

export const WithInsights: Story = {
  args: {
    title: "Customer Churn Dataset",
    stats: [
      { label: "Rows", value: "45,200" },
      { label: "Columns", value: 23 },
      { label: "Missing", value: "4.1%" },
      { label: "Churn Rate", value: "12.4%" },
    ],
    insights: [
      "Customers with < 3 interactions in 60 days are 3× more likely to churn",
      "Enterprise tier shows 97.2% retention — strongest segment",
      "APAC region has the highest growth rate at 41% YoY",
    ],
    source: "churn_model_v2.parquet",
    lastUpdated: "Just now",
  },
  parameters: {
    docs: {
      description: {
        story:
          "Pass the `insights` array to render highlighted callout rows below the stats grid — useful for surfacing AI-generated findings.",
      },
    },
  },
};

export const WithRefreshAndClick: Story = {
  args: {
    title: "Sales Dataset Overview",
    stats: [
      { id: "rows", label: "Rows", value: "12,450" },
      { id: "cols", label: "Columns", value: 18, unit: "fields" },
      {
        id: "missing",
        label: "Missing",
        value: "2.3%",
        description: "Primarily in the age column",
      },
      { id: "dupes", label: "Duplicates", value: 0 },
    ],
    onStatClick: () => {},
    onRefresh: () => {},
    refreshLabel: "Reload",
  },
  parameters: {
    docs: {
      description: {
        story:
          "Pass `onStatClick(id, stat)` to make stat cards interactive. Pass `onRefresh` to show a Refresh button — `refreshLabel` overrides the label. Stats support `unit` (shown after the value) and `description` (a subtitle below the label).",
      },
      source: {
        code: `<DataSummaryCard
  title="Sales Dataset Overview"
  stats={[
    { id: "rows",    label: "Rows",      value: "12,450" },
    { id: "cols",    label: "Columns",   value: 18, unit: "fields" },
    { id: "missing", label: "Missing",   value: "2.3%", description: "Primarily in the age column" },
    { id: "dupes",   label: "Duplicates", value: 0 },
  ]}
  source="sales_data_q3.csv"
  onStatClick={(id, stat) => openStatDetail(id)}
  onRefresh={() => reloadDataset()}
  refreshLabel="Reload"
/>`,
      },
    },
  },
};

export const Refreshing: Story = {
  args: {
    title: "Sales Dataset Overview",
    stats: [
      { label: "Rows", value: "12,450" },
      { label: "Columns", value: 18 },
    ],
    onRefresh: () => {},
    refreshing: true,
    refreshLabel: "Refreshing…",
  },
  parameters: {
    docs: {
      description: {
        story:
          "Set `refreshing={true}` to show a loading indicator and disable the Refresh button while data is being reloaded.",
      },
      source: {
        code: `<DataSummaryCard
  title="Sales Dataset Overview"
  stats={stats}
  onRefresh={() => reloadDataset()}
  refreshing={isLoading}
  refreshLabel={isLoading ? "Refreshing…" : "Refresh"}
/>`,
      },
    },
  },
};

export const MinimalStats: Story = {
  args: {
    title: undefined,
    stats: [
      { label: "Total records", value: "1,200" },
      { label: "Fields", value: 8 },
    ],
    source: undefined,
    lastUpdated: undefined,
  },
  parameters: {
    docs: {
      description: {
        story:
          "Minimal usage — just `stats` with no title, source, or insights.",
      },
    },
  },
};

export const Themed: Story = {
  args: {
    theme: { primary: "#0d9488", surface: "#f0fdfa", border: "#99f6e4" },
  },
  parameters: {
    docs: {
      description: {
        story: "Per-component colour override via the `theme` prop.",
      },
    },
  },
};

// ─── ColumnStatsCard showcase ─────────────────────────────────────────────────

export const ColumnStatsShowcase: Story = {
  render: () => (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        gap: 16,
        maxWidth: 520,
      }}
    >
      <ColumnStatsCard
        columnName="revenue"
        dataType="number"
        totalCount={12450}
        missingCount={12}
        uniqueCount={9840}
        min={0}
        max={142000}
        mean={8420.5}
        median={4200}
        selected
        topBins={[
          { label: "0 – 2 k", count: 3200 },
          { label: "2 k – 5 k", count: 4100 },
          { label: "5 k – 20 k", count: 3600 },
          { label: "20 k – 50 k", count: 1200 },
          { label: "50 k+", count: 350 },
        ]}
        onSelect={() => {}}
        statLabels={{
          total: "Rows",
          unique: "Distinct",
          min: "Min",
          max: "Max",
          mean: "Average",
          median: "Median",
          missing: "Nulls",
        }}
      />
      <ColumnStatsCard
        columnName="region"
        dataType="string"
        totalCount={12450}
        missingCount={0}
        uniqueCount={6}
        topBins={[
          { label: "EMEA", count: 4800 },
          { label: "Americas", count: 4200 },
          { label: "APAC", count: 2100 },
          { label: "Other", count: 1350 },
        ]}
      />
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: `
\`ColumnStatsCard\` — detailed profile for an individual dataset column.

**Key features:**
- Numeric columns show min/max/mean/median in a stat grid
- All columns show a mini bar chart of top value bins (\`topBins\`)
- Missing value % is highlighted in amber when > 0
- \`onSelect(columnName)\` makes the card clickable; \`selected\` highlights it with a primary border ring
- \`statLabels\` overrides the built-in stat label text (Total, Unique, Min, Max, Mean, Median, Missing)
- \`renderBin(bin, pct)\` fully replaces a single bar chart row
- \`footerSlot\` injects content at the bottom of the card
        `,
      },
      source: {
        code: `// Numeric column — with clickable selection and custom stat labels
<ColumnStatsCard
  columnName="revenue"
  dataType="number"
  totalCount={12450}
  missingCount={12}
  uniqueCount={9840}
  min={0}
  max={142000}
  mean={8420.5}
  median={4200}
  topBins={[
    { label: "0 – 2 k",  count: 3200 },
    { label: "2 k – 5 k", count: 4100 },
    { label: "5 k+",      count: 5150 },
  ]}
  selected={selectedColumn === "revenue"}
  onSelect={(col) => setSelectedColumn(col)}
  statLabels={{ total: "Rows", unique: "Distinct", missing: "Nulls" }}
/>

// String/categorical column — no numeric stats
<ColumnStatsCard
  columnName="region"
  dataType="string"
  totalCount={12450}
  missingCount={0}
  uniqueCount={6}
  topBins={[
    { label: "EMEA",     count: 4800 },
    { label: "Americas", count: 4200 },
    { label: "APAC",     count: 2100 },
    { label: "Other",    count: 1350 },
  ]}
/>`,
      },
    },
  },
};

// ─── DataQualityBadge showcase ────────────────────────────────────────────────

export const DataQualityShowcase: Story = {
  render: () => (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        gap: 24,
        maxWidth: 520,
      }}
    >
      <div>
        <p style={{ fontSize: 12, color: "#64748b", marginBottom: 8 }}>
          Column layout — with click handler and level icons
        </p>
        <DataQualityBadge
          layout="column"
          issues={[
            {
              id: "dupes",
              level: "critical",
              label: "Duplicate primary keys",
              count: 14,
              description: "14 rows share a non-unique primary key",
            },
            {
              id: "missing",
              level: "high",
              label: "Missing required fields",
              count: 512,
            },
            {
              id: "outlier",
              level: "medium",
              label: "Outlier values detected",
              count: 89,
            },
            {
              id: "format",
              level: "low",
              label: "Inconsistent date formats",
              count: 23,
            },
          ]}
          onIssueClick={() => {}}
          ariaLabel="Data quality summary"
        />
      </div>
      <div>
        <p style={{ fontSize: 12, color: "#64748b", marginBottom: 8 }}>
          Row layout — inline chips
        </p>
        <DataQualityBadge
          layout="row"
          issues={[
            { level: "high", label: "Null in non-nullable column" },
            { level: "medium", label: "Schema drift detected" },
            { level: "low", label: "Soft deprecation warning" },
          ]}
        />
      </div>
      <div>
        <p style={{ fontSize: 12, color: "#64748b", marginBottom: 8 }}>
          Custom level icons
        </p>
        <DataQualityBadge
          layout="column"
          issues={[
            {
              id: "c1",
              level: "critical",
              label: "Critical integrity issue",
              count: 3,
            },
            {
              id: "c2",
              level: "high",
              label: "High severity warning",
              count: 7,
            },
          ]}
          levelIcons={{
            critical: <span style={{ fontSize: 12 }}>🚨</span>,
            high: <span style={{ fontSize: 12 }}>⚠️</span>,
            medium: <span style={{ fontSize: 12 }}>ℹ️</span>,
            low: <span style={{ fontSize: 12 }}>💡</span>,
          }}
          onIssueClick={() => {}}
        />
      </div>
      <div>
        <p style={{ fontSize: 12, color: "#64748b", marginBottom: 8 }}>
          Empty state
        </p>
        <DataQualityBadge
          layout="column"
          issues={[]}
          emptyText="No quality issues detected."
        />
      </div>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: `
\`DataQualityBadge\` — colour-coded issue chips for data validation results.

**Severity colours:**
- \`critical\` → red
- \`high\` → orange
- \`medium\` → amber
- \`low\` → muted grey

**Layouts:**
- \`"column"\` — stacked list with full labels and counts
- \`"row"\` — inline chips

**Key features:**
- \`onIssueClick(id, issue)\` makes individual badges clickable (e.g. to drill into issue details)
- \`issue.count\` shows the number of affected records
- \`issue.description\` adds a tooltip/subtitle to the badge
- \`issue.id\` provides a stable React key and is passed to \`onIssueClick\`
- \`ariaLabel\` sets the accessible label for the outer container
- \`emptyText\` shown when \`issues\` is empty
- \`levelIcons\` overrides the default severity icon per level (accepts a partial map)
- \`renderIssue(issue)\` fully replaces a single badge
        `,
      },
      source: {
        code: `// Column layout with click handler
<DataQualityBadge
  layout="column"
  issues={[
    { id: "dupes",   level: "critical", label: "Duplicate primary keys",  count: 14,  description: "14 rows share a non-unique primary key" },
    { id: "missing", level: "high",     label: "Missing required fields",  count: 512 },
    { id: "outlier", level: "medium",   label: "Outlier values detected",  count: 89 },
    { id: "format",  level: "low",      label: "Inconsistent date formats", count: 23 },
  ]}
  onIssueClick={(id, issue) => openIssuePanel(issue.id)}
  ariaLabel="Data quality summary"
/>

// Inline chips
<DataQualityBadge
  layout="row"
  issues={[
    { level: "high",   label: "Null in non-nullable column" },
    { level: "medium", label: "Schema drift detected" },
    { level: "low",    label: "Soft deprecation warning" },
  ]}
/>

// Custom level icons
<DataQualityBadge
  layout="column"
  issues={issues}
  levelIcons={{
    critical: <AlertCircleIcon className="text-red-500" />,
    high:     <AlertTriangleIcon className="text-orange-500" />,
    medium:   <InfoIcon className="text-amber-500" />,
    low:      <MinusCircleIcon className="text-slate-400" />,
  }}
  onIssueClick={(id, issue) => openIssuePanel(id)}
/>

// Empty state
<DataQualityBadge
  layout="column"
  issues={[]}
  emptyText="No quality issues detected. ✓"
/>`,
      },
    },
  },
};
