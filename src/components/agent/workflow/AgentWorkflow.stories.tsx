import type { Meta, StoryObj } from "@storybook/react-vite";

import { WorkflowParameterForm } from "./WorkflowParameterForm";
import { WorkflowStepList } from "./WorkflowStepList";
import { WorkflowTemplateCard } from "./WorkflowTemplateCard";

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

const DEMO_STEPS = [
  { id: "1", label: "Validate input schema", status: "completed" as const, durationMs: 42 },
  { id: "2", label: "Fetch external data sources", status: "completed" as const, durationMs: 820 },
  { id: "3", label: "Run ML classification model", status: "running" as const, description: "Classifying 1 240 records…" },
  { id: "4", label: "Generate summary report", status: "pending" as const },
  { id: "5", label: "Send Slack notification", status: "pending" as const },
];

const meta = {
  title: "Components/Workflow",
  component: WorkflowStepList,
  subcomponents: { WorkflowParameterForm, WorkflowTemplateCard },
  tags: ["autodocs"],
  args: {
    steps: DEMO_STEPS,
  },
  argTypes: {
    steps: {
      description:
        "Array of workflow steps. Each step has `id`, `label`, `status` (`pending` | `running` | `completed` | `failed` | `skipped`), and optional `description`, `durationMs`, `errorMessage`, and `icon`.",
      control: "object",
      table: { defaultValue: { summary: "[]" } },
    },
    onStepClick: {
      description: "Callback fired when a step row is clicked. When provided the row becomes a focusable button.",
      control: false,
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
Workflow configuration and visualisation components — step lists, parameter forms, and template cards.

---

## Import

\`\`\`tsx
import { WorkflowStepList, WorkflowParameterForm, WorkflowTemplateCard } from "@kitelus/fly-ui";
\`\`\`

## Components

| Component | Description |
|---|---|
| \`WorkflowStepList\` | Vertical step list with status icons (pending / running / completed / failed / skipped) and a connector line |
| \`WorkflowParameterForm\` | Dynamic form for workflow parameters supporting string, number, boolean, and select types with validation |
| \`WorkflowTemplateCard\` | Template card with name, description, tags, complexity badge, and call-to-action buttons |

## Usage

\`\`\`tsx
import { WorkflowStepList, WorkflowParameterForm, WorkflowTemplateCard } from "@kitelus/fly-ui";

<WorkflowStepList steps={workflowSteps} onStepClick={(id) => openStepDetail(id)} />

<WorkflowParameterForm
  parameters={schema}
  values={formValues}
  onChange={(key, value) => setFormValues(prev => ({ ...prev, [key]: value }))}
/>
\`\`\`
        `,
      },
    },
  },
} satisfies Meta<typeof WorkflowStepList>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Playground: Story = {
  parameters: {
    docs: {
      description: {
        story:
          "Interactive playground — edit the `steps` array in the controls panel to experiment with different step statuses.",
      },
    },
  },
};

export const AllStatuses: Story = {
  args: {
    steps: [
      { id: "1", label: "Completed step", status: "completed", durationMs: 1200 },
      { id: "2", label: "Currently running", status: "running", description: "Processing records…" },
      { id: "3", label: "Failed step", status: "failed", errorMessage: "Connection refused on port 5432." },
      { id: "4", label: "Pending step", status: "pending" },
      { id: "5", label: "Skipped step", status: "skipped" },
    ],
  },
  parameters: {
    docs: {
      description: {
        story: "All five step statuses side by side — the connector line runs between them.",
      },
    },
  },
};

export const RunningWorkflow: Story = {
  args: { steps: DEMO_STEPS, onStepClick: () => {} },
  parameters: {
    docs: {
      description: {
        story:
          "A typical mid-execution state — two completed steps, one running (pulsing icon), two pending. Pass `onStepClick` to make steps interactive.",
      },
    },
  },
};

export const WithErrors: Story = {
  args: {
    steps: [
      { id: "1", label: "Load dataset", status: "completed", durationMs: 230 },
      { id: "2", label: "Normalise columns", status: "failed", errorMessage: "Column 'revenue' contains non-numeric values.", durationMs: 140 },
      { id: "3", label: "Train model", status: "pending" },
      { id: "4", label: "Evaluate accuracy", status: "pending" },
    ],
  },
  parameters: {
    docs: { description: { story: "A workflow halted at a failed step — the error message is shown inline." } },
  },
};

export const Themed: Story = {
  args: {
    steps: DEMO_STEPS,
    theme: { primary: "#f97316", success: "#16a34a", danger: "#dc2626" },
  },
  parameters: {
    docs: { description: { story: "Per-component colour override via the `theme` prop." } },
  },
};

// ─── SHOWCASES ──────────────────────────────────────────────────────────────────

export const ParameterFormShowcase: Story = {
  render: () => (
    <div style={{ maxWidth: 480 }}>
      <WorkflowParameterForm
        parameters={[
          { key: "source", label: "Data source", type: "select", required: true, description: "Choose the input data source for this workflow run.", options: [{ label: "Production DB", value: "prod" }, { label: "Staging DB", value: "staging" }, { label: "CSV Upload", value: "csv" }] },
          { key: "limit", label: "Record limit", type: "number", description: "Maximum number of records to process per batch.", placeholder: "e.g. 1000" },
          { key: "model", label: "Model", type: "string", description: "AI model to use for classification.", placeholder: "claude-opus-4" },
          { key: "notify", label: "Send Slack notification", type: "boolean", description: "Post a summary to #ai-reports when the workflow completes." },
          { key: "tag", label: "Experiment tag", type: "string", description: "Optional label for tracking runs.", validationError: "Tag cannot contain spaces." },
        ]}
        values={{ source: "prod", limit: 500, model: "claude-opus-4", notify: true, tag: "v2 test" }}
        onChange={() => {}}
      />
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story:
          "`WorkflowParameterForm` — a dynamic form driven by a parameter schema. Supports `string`, `number`, `boolean` (checkbox), and `select` (dropdown) types. Required fields are marked with `*`. Validation errors are shown inline.",
      },
      source: {
        code: `<WorkflowParameterForm
  parameters={[
    { key: "source", label: "Data source", type: "select", required: true, options: [{ label: "Production DB", value: "prod" }, { label: "Staging DB", value: "staging" }, { label: "CSV Upload", value: "csv" }] },
    { key: "limit", label: "Record limit", type: "number", placeholder: "e.g. 1000" },
    { key: "model", label: "Model", type: "string", placeholder: "claude-opus-4" },
    { key: "notify", label: "Send Slack notification", type: "boolean" },
    { key: "tag", label: "Experiment tag", type: "string", validationError: "Tag cannot contain spaces." },
  ]}
  values={{ source: "prod", limit: 500, model: "claude-opus-4", notify: true, tag: "v2 test" }}
  onChange={(key, value) => setFormValues(prev => ({ ...prev, [key]: value }))}
/>`,
      },
    },
  },
};

export const TemplateCardShowcase: Story = {
  render: () => (
    <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))", gap: 16, maxWidth: 640 }}>
      <WorkflowTemplateCard
        name="Data Quality Check"
        description="Scans a dataset for missing values, type mismatches, and statistical outliers. Generates a detailed report."
        tags={["data", "validation", "reporting"]}
        complexity="simple"
        stepCount={4}
        author="Platform Team"
        onPreview={() => {}}
        onUse={() => {}}
      />
      <WorkflowTemplateCard
        name="Multi-Agent Research"
        description="Orchestrates a researcher, analyst, and writer agent to produce a fully cited research report from a topic."
        tags={["multi-agent", "research", "report"]}
        complexity="complex"
        stepCount={12}
        author="AI Team"
        onPreview={() => {}}
        onUse={() => {}}
      />
      <WorkflowTemplateCard
        name="Document Summarisation"
        description="Extracts key points from uploaded PDFs or URLs and delivers a structured executive summary."
        tags={["NLP", "summarisation"]}
        complexity="medium"
        stepCount={6}
        author="Community"
        onUse={() => {}}
      />
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story:
          "`WorkflowTemplateCard` — a clickable card for selecting workflow templates. Complexity is colour-coded: `simple` green, `medium` amber, `complex` red. Pass `onPreview` and `onUse` to show action buttons.",
      },
      source: {
        code: `<WorkflowTemplateCard
  name="Data Quality Check"
  description="Scans a dataset for missing values, type mismatches, and statistical outliers."
  tags={["data", "validation", "reporting"]}
  complexity="simple"
  stepCount={4}
  author="Platform Team"
  onPreview={() => previewTemplate(id)}
  onUse={() => startWorkflow(id)}
/>

<WorkflowTemplateCard
  name="Multi-Agent Research"
  description="Orchestrates a researcher, analyst, and writer agent to produce a research report."
  tags={["multi-agent", "research", "report"]}
  complexity="complex"
  stepCount={12}
  author="AI Team"
  onPreview={() => previewTemplate(id)}
  onUse={() => startWorkflow(id)}
/>

<WorkflowTemplateCard
  name="Document Summarisation"
  description="Extracts key points from uploaded PDFs or URLs and delivers an executive summary."
  tags={["NLP", "summarisation"]}
  complexity="medium"
  stepCount={6}
  author="Community"
  onUse={() => startWorkflow(id)}
/>`,
      },
    },
  },
};
