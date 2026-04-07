import type { Meta, StoryObj } from "@storybook/react-vite";

import { ColumnStatsCard } from "./ColumnStatsCard";
import { DataQualityBadge } from "./DataQualityBadge";
import { DataSummaryCard } from "./DataSummaryCard";

const themeArgType = {
  description: "Optional per-component theme override. Use `FlyUIThemeProvider` for app-wide theming.",
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
        "Array of `{ label, value }` objects displayed in the summary grid. Values can be strings or numbers.",
      control: "object",
      table: { defaultValue: { summary: "[]" } },
    },
    insights: {
      description: "Array of insight strings rendered as highlighted callout rows below the stats grid.",
      control: "object",
      table: { defaultValue: { summary: "undefined" } },
    },
    source: {
      description: "Data source identifier shown in the top-right corner (e.g. filename or table name).",
      control: "text",
      table: { defaultValue: { summary: "undefined" } },
    },
    lastUpdated: {
      description: "Timestamp or relative time shown alongside the source label.",
      control: "text",
      table: { defaultValue: { summary: "undefined" } },
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

---

## Import

\`\`\`tsx
import { DataSummaryCard, ColumnStatsCard, DataQualityBadge } from "@kitelus/fly-ui";
\`\`\`

## Components

| Component | Description |
|---|---|
| \`DataSummaryCard\` | High-level dataset overview with a KPI stats grid and optional insight callouts |
| \`ColumnStatsCard\` | Per-column profile showing type, missing %, unique count, min/max/mean/median, and a mini bar chart |
| \`DataQualityBadge\` | Colour-coded issue badges for \`critical\`, \`high\`, \`medium\`, and \`low\` quality problems |

## Usage

\`\`\`tsx
import { DataSummaryCard, ColumnStatsCard, DataQualityBadge } from "@kitelus/fly-ui";

<DataSummaryCard
  title="Sales Dataset"
  stats={[
    { label: "Rows", value: "12,450" },
    { label: "Columns", value: 18 },
    { label: "Missing", value: "2.3%" },
  ]}
  insights={["Widget Pro drives 34% of total revenue"]}
  source="sales_q3.csv"
/>

<ColumnStatsCard
  columnName="revenue"
  dataType="number"
  totalCount={12450}
  missingCount={12}
  min={0}
  max={142000}
  mean={8420.5}
  topBins={[
    { label: "0–5k", count: 5200 },
    { label: "5k–20k", count: 4800 },
  ]}
/>
\`\`\`
        `,
      },
    },
  },
} satisfies Meta<typeof DataSummaryCard>;

export default meta;

type Story = StoryObj<typeof meta>;

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
          "Pass the `insights` array to render highlighted callout rows below the stats grid — useful for surfacing AI-generated findings about the dataset.",
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
        story: "Minimal usage — just `stats` with no title, source, or insights.",
      },
    },
  },
};

export const Themed: Story = {
  args: {
    theme: { primary: "#0d9488", surface: "#f0fdfa", border: "#99f6e4" },
  },
  parameters: {
    docs: { description: { story: "Per-component colour override via the `theme` prop." } },
  },
};

// ─── SHOWCASES ──────────────────────────────────────────────────────────────────

export const ColumnStatsShowcase: Story = {
  render: () => (
    <div style={{ display: "flex", flexDirection: "column", gap: 16, maxWidth: 520 }}>
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
          { label: "0 – 2 k", count: 3200 },
          { label: "2 k – 5 k", count: 4100 },
          { label: "5 k – 20 k", count: 3600 },
          { label: "20 k – 50 k", count: 1200 },
          { label: "50 k+", count: 350 },
        ]}
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
        story:
          "`ColumnStatsCard` — detailed profile for an individual column. Numeric columns show min/max/mean/median; all columns show a mini bar chart of top values. Missing values are highlighted in amber when > 0.",
      },
      source: {
        code: `<ColumnStatsCard
  columnName="revenue"
  dataType="number"
  totalCount={12450}
  missingCount={12}
  min={0}
  max={142000}
  mean={8420.5}
  topBins={[
    { label: "0–5k", count: 5200 },
    { label: "5k–20k", count: 4800 },
    { label: "20k+", count: 2450 },
  ]}
/>`,
      },
    },
  },
};

export const DataQualityShowcase: Story = {
  render: () => (
    <div style={{ display: "flex", flexDirection: "column", gap: 16, maxWidth: 520 }}>
      <DataQualityBadge
        layout="column"
        issues={[
          { level: "critical", label: "Duplicate primary keys", count: 14 },
          { level: "high", label: "Missing required fields", count: 512 },
          { level: "medium", label: "Outlier values detected", count: 89 },
          { level: "low", label: "Inconsistent date formats", count: 23 },
        ]}
      />
      <DataQualityBadge
        layout="row"
        issues={[
          { level: "high", label: "Null in non-nullable column" },
          { level: "medium", label: "Schema drift detected" },
          { level: "low", label: "Soft deprecation warning" },
        ]}
      />
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story:
          "`DataQualityBadge` — colour-coded issue chips for data validation results. Severity levels: `critical` red, `high` orange, `medium` amber, `low` muted. Use `layout=\"column\"` for a stacked list or `layout=\"row\"` for inline chips. Hover to see the occurrence count.",
      },
      source: {
        code: `<DataQualityBadge
  issues={[
    { level: "critical", label: "Duplicate primary keys", count: 14 },
    { level: "high", label: "Missing required fields", count: 512 },
    { level: "medium", label: "Outlier values detected" },
  ]}
/>`,
      },
    },
  },
};
