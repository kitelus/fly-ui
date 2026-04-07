import type { Meta, StoryObj } from "@storybook/react-vite";

import { ContentPreview } from "./ContentPreview";
import { PromptEditor } from "./PromptEditor";
import { VariantComparison } from "./VariantComparison";

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

const SAMPLE_PROMPT = `You are a professional business analyst. Your task is to analyse the provided {{data_source}} and identify the top {{num_insights}} key insights.

Format your response as a structured JSON object with the following fields:
- summary: A one-sentence executive summary
- insights: Array of insight objects with "title" and "description" fields
- recommendations: Array of actionable next steps`;

const meta = {
  title: "Components/Content",
  component: PromptEditor,
  subcomponents: { ContentPreview, VariantComparison },
  tags: ["autodocs"],
  args: {
    value: SAMPLE_PROMPT,
    label: "System Prompt",
    estimatedTokens: 89,
    maxTokens: 4096,
  },
  argTypes: {
    value: {
      description: "Current prompt text (controlled).",
      control: "text",
      table: { defaultValue: { summary: '""' } },
    },
    label: {
      description: "Label shown in the toolbar above the editor.",
      control: "text",
      table: { defaultValue: { summary: "undefined" } },
    },
    placeholder: {
      description: "Textarea placeholder shown when the prompt is empty.",
      control: "text",
      table: { defaultValue: { summary: '"Enter your prompt…"' } },
    },
    estimatedTokens: {
      description: "Estimated token count shown in the toolbar. Turns amber when above 90% of `maxTokens`.",
      control: { type: "number", min: 0 },
      table: { defaultValue: { summary: "undefined" } },
    },
    maxTokens: {
      description: "Token limit — shown alongside `estimatedTokens` as `n / max`.",
      control: { type: "number", min: 0 },
      table: { defaultValue: { summary: "undefined" } },
    },
    readOnly: {
      description: "Disables editing — useful for showing a prompt without allowing changes.",
      control: "boolean",
      table: { defaultValue: { summary: "false" } },
    },
    variables: {
      description:
        "Array of `{ name, description }` objects. Renders clickable chips that insert `{{name}}` placeholders via `onVariableInsert`.",
      control: "object",
      table: { defaultValue: { summary: "undefined" } },
    },
    onChange: {
      description: "Controlled change callback — receives the updated text string.",
      control: false,
    },
    onVariableInsert: {
      description: "Called with the variable name when a chip is clicked.",
      control: false,
    },
    theme: themeArgType,
    className: { table: { category: "Styling" } },
    style: { table: { category: "Styling" } },
  },
  parameters: {
    docs: {
      description: {
        component: `
Content generation components — prompt editing, output preview, and variant comparison for AI-generated content workflows.

---

## Import

\`\`\`tsx
import { PromptEditor, ContentPreview, VariantComparison } from "@kitelus/fly-ui";
\`\`\`

## Components

| Component | Description |
|---|---|
| \`PromptEditor\` | Monospace textarea with token counter, variable chips (for template placeholders), and read-only mode |
| \`ContentPreview\` | Rendered content preview with word count, reading time, and quality score |
| \`VariantComparison\` | Side-by-side grid to compare multiple generated content variants and select the best one |

## Usage

\`\`\`tsx
import { PromptEditor, ContentPreview, VariantComparison } from "@kitelus/fly-ui";

<PromptEditor
  value={prompt}
  label="System Prompt"
  estimatedTokens={estimatedTokens}
  maxTokens={4096}
  variables={[{ name: "data_source" }, { name: "num_insights" }]}
  onChange={setPrompt}
  onVariableInsert={(name) => setPrompt(p => p + \`{{\${name}}}\`)}
/>
\`\`\`
        `,
      },
    },
  },
} satisfies Meta<typeof PromptEditor>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Playground: Story = {
  parameters: {
    docs: {
      description: {
        story:
          "Interactive playground — edit the prompt, adjust `estimatedTokens`, toggle `readOnly`, and add variables via the controls panel.",
      },
    },
  },
};

export const WithVariables: Story = {
  args: {
    value: "Analyse the {{data_source}} and summarise the top {{num_insights}} findings in a {{output_format}} format.",
    label: "Prompt Template",
    variables: [
      { name: "data_source", description: "Source dataset or document" },
      { name: "num_insights", description: "Number of key insights to extract" },
      { name: "output_format", description: "Response format: JSON, markdown, or plain text" },
    ],
    estimatedTokens: 32,
    onVariableInsert: () => {},
  },
  parameters: {
    docs: {
      description: {
        story:
          "Template mode — variable chips are rendered below the editor. Clicking a chip calls `onVariableInsert(name)`, allowing you to insert `{{variable}}` placeholders at the cursor position.",
      },
    },
  },
};

export const NearTokenLimit: Story = {
  args: {
    label: "System Prompt",
    estimatedTokens: 3_900,
    maxTokens: 4_096,
    value: SAMPLE_PROMPT + "\n\n// Additional instructions...",
  },
  parameters: {
    docs: {
      description: {
        story:
          "When `estimatedTokens` exceeds 90% of `maxTokens`, the counter turns amber to warn the author.",
      },
    },
  },
};

export const ReadOnly: Story = {
  args: { readOnly: true, label: "Active Prompt (read-only)" },
  parameters: {
    docs: { description: { story: "Pass `readOnly` to display the prompt without allowing edits." } },
  },
};

export const Themed: Story = {
  args: {
    theme: { primary: "#7c3aed", border: "#ddd6fe", background: "#fafafa" },
  },
  parameters: {
    docs: { description: { story: "Per-component colour override via the `theme` prop." } },
  },
};

// ─── SHOWCASES ──────────────────────────────────────────────────────────────────

export const ContentPreviewShowcase: Story = {
  render: () => (
    <div style={{ display: "flex", flexDirection: "column", gap: 20, maxWidth: 600 }}>
      <ContentPreview
        title="Generated Executive Summary"
        content="Q3 2025 revenue reached $4.2M, representing 23% year-over-year growth. The enterprise segment was the primary driver, contributing 61% of total revenue. Customer retention improved to 97.2%, the highest recorded level. Key wins include three Fortune 500 expansions and entry into the APAC market."
        format="text"
        wordCount={52}
        readingTimeMin={1}
        qualityScore={88}
        onCopy={() => {}}
        onEdit={() => {}}
      />
      <ContentPreview
        title="Product Description Draft"
        content={`# FlyUI Component Library\n\nA modern, accessible React component library designed for AI-powered enterprise applications. Built with CSS custom properties for seamless theming and full TypeScript support.\n\n## Features\n- 30+ production-ready components\n- Automatic dark mode\n- Full keyboard navigation`}
        format="markdown"
        wordCount={38}
        readingTimeMin={1}
        qualityScore={92}
        onCopy={() => {}}
      />
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story:
          "`ContentPreview` — renders generated text with metadata (word count, reading time, quality score). Pass `onCopy` and `onEdit` to show toolbar action buttons. The `format` label (`text`, `markdown`, `html`) is shown in the toolbar.",
      },
      source: {
        code: `<ContentPreview
  title="Generated Summary"
  content={generatedText}
  format="markdown"
  wordCount={wordCount}
  qualityScore={qualityScore}
  onCopy={(text) => navigator.clipboard.writeText(text)}
  onEdit={() => openEditor()}
/>`,
      },
    },
  },
};

export const VariantComparisonShowcase: Story = {
  render: () => (
    <div style={{ maxWidth: 700 }}>
      <VariantComparison
        variants={[
          {
            id: "v1",
            label: "Variant A — Formal",
            content:
              "Our Q3 financial results demonstrate robust growth across all business segments, with total revenue increasing 23% year-over-year to $4.2 million.",
            score: 74,
            tags: ["formal", "concise"],
          },
          {
            id: "v2",
            label: "Variant B — Conversational",
            content:
              "Great news: Q3 was our best quarter yet! Revenue hit $4.2M — that's 23% more than last year — and every part of the business grew.",
            score: 82,
            tags: ["conversational", "engaging"],
          },
          {
            id: "v3",
            label: "Variant C — Data-first",
            content:
              "Q3 2025: $4.2M revenue (+23% YoY). Enterprise: 61% share. Retention: 97.2%. APAC expansion: complete.",
            score: 68,
            tags: ["data-dense", "brief"],
          },
        ]}
        selectedId="v2"
        onSelect={() => {}}
        onCopy={() => {}}
      />
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story:
          "`VariantComparison` — side-by-side grid for comparing AI-generated content variants. Each card shows a label, optional quality score, and Copy button. Click **Select** to highlight the preferred variant (controlled via `selectedId`).",
      },
      source: {
        code: `<VariantComparison
  variants={generatedVariants}
  selectedId={selectedVariantId}
  onSelect={(id) => setSelectedVariantId(id)}
  onCopy={(content) => navigator.clipboard.writeText(content)}
/>`,
      },
    },
  },
};
