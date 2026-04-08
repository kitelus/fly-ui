import type { Meta, StoryObj } from "@storybook/react-vite";

import { ApprovalCard } from "./ApprovalCard";
import { AuditLog } from "./AuditLog";
import { ConfidenceScore } from "./ConfidenceScore";
import { DiffViewer } from "./DiffViewer";
import { MultiStageApproval } from "./MultiStageApproval";

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
  title: "Components/Approval",
  component: ApprovalCard,
  subcomponents: { ConfidenceScore, MultiStageApproval, AuditLog, DiffViewer },
  tags: ["autodocs"],
  args: {
    title: "Deploy to Production",
    description: "Agent has prepared a deployment package for the Q3 reporting service. Human approval is required before the action is executed.",
    actionDescription: "Run `kubectl apply -f deploy/prod/reporting-v2.yaml` on the production cluster.",
    requesterName: "Research Agent",
    requestedAt: "10:42 AM",
    expiresAt: "11:42 AM",
    status: "pending",
  },
  argTypes: {
    title: {
      description: "Short title describing the approval request.",
      control: "text",
      table: { defaultValue: { summary: "undefined" } },
    },
    description: {
      description: "Longer description giving context for the approver.",
      control: "text",
      table: { defaultValue: { summary: "undefined" } },
    },
    actionDescription: {
      description: "Exact action that will be executed if approved — shown in a highlighted box.",
      control: "text",
      table: { defaultValue: { summary: "undefined" } },
    },
    requesterName: {
      description: "Name of the agent or user requesting approval.",
      control: "text",
      table: { defaultValue: { summary: "undefined" } },
    },
    requestedAt: {
      description: "Time string shown next to the requester name.",
      control: "text",
      table: { defaultValue: { summary: "undefined" } },
    },
    expiresAt: {
      description: "Expiry time shown in the requester row — prompts urgency.",
      control: "text",
      table: { defaultValue: { summary: "undefined" } },
    },
    status: {
      description:
        "Approval lifecycle state. `pending` shows the comment box and action buttons. Other states render a resolved banner.",
      options: ["pending", "approved", "rejected", "expired"],
      control: { type: "inline-radio" },
      table: { defaultValue: { summary: "pending" } },
    },
    resolvedBy: {
      description: "Name of the person who resolved the request — shown in the resolved banner.",
      control: "text",
      table: { defaultValue: { summary: "undefined" } },
    },
    resolvedAt: {
      description: "Time the request was resolved — shown in the resolved banner.",
      control: "text",
      table: { defaultValue: { summary: "undefined" } },
    },
    resolvedComment: {
      description: "Comment left at resolution time — shown in the resolved banner.",
      control: "text",
      table: { defaultValue: { summary: "undefined" } },
    },
    disabled: {
      description: "Disables the textarea and action buttons — useful while submitting.",
      control: "boolean",
      table: { defaultValue: { summary: "false" } },
    },
    onApprove: {
      description: "Called with the comment string when **Approve** is clicked.",
      control: false,
    },
    onReject: {
      description: "Called with the comment string when **Reject** is clicked.",
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
Human-in-the-loop approval components for AI agent workflows that require explicit human sign-off before taking high-stakes actions.

---

## Import

\`\`\`tsx
import { ApprovalCard, ConfidenceScore, MultiStageApproval, AuditLog, DiffViewer } from "@kitelus/fly-ui";
\`\`\`

## Components

| Component | Description |
|---|---|
| \`ApprovalCard\` | Primary approval UI — shows the request context, a comment box, and Approve / Reject buttons |
| \`ConfidenceScore\` | Visual confidence meter (0–100) with colour-coded bar and optional "Request Verification" button |
| \`MultiStageApproval\` | Multi-reviewer pipeline showing stage status, per-approver decisions, and required approval counts |
| \`AuditLog\` | Searchable, filterable list of approval lifecycle events with timestamps and actor names |
| \`DiffViewer\` | Before/after diff viewer supporting unified and split modes — useful for reviewing proposed AI edits |

## Usage

\`\`\`tsx
import { ApprovalCard, ConfidenceScore, DiffViewer } from "@kitelus/fly-ui";

<ApprovalCard
  title="Send customer email"
  actionDescription="Send the drafted email to 1 240 customers in the APAC segment."
  requesterName="Marketing Agent"
  status="pending"
  onApprove={(comment) => approve(requestId, comment)}
  onReject={(comment) => reject(requestId, comment)}
/>

<ConfidenceScore
  score={72}
  label="Classification confidence"
  reason="Ambiguous phrasing in input — recommend human review."
  threshold={80}
  onRequestVerification={() => flagForReview(itemId)}
/>
\`\`\`
        `,
      },
    },
  },
} satisfies Meta<typeof ApprovalCard>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Playground: Story = {
  args: {
    onApprove: () => {},
    onReject: () => {},
  },
  parameters: {
    docs: {
      description: {
        story:
          "Interactive playground — change `status`, toggle `disabled`, and wire up `onApprove` / `onReject` using the controls panel.",
      },
    },
  },
};

export const Pending: Story = {
  args: {
    status: "pending",
    onApprove: () => {},
    onReject: () => {},
  },
  parameters: {
    docs: {
      description: {
        story:
          "Default pending state — shows the action context, a comment textarea, and Approve / Reject buttons. Both callbacks must be provided to enable the buttons.",
      },
    },
  },
};

export const Approved: Story = {
  args: {
    status: "approved",
    resolvedBy: "Alice Chen",
    resolvedAt: "10:48 AM",
    resolvedComment: "Looks good — proceeding.",
  },
  parameters: {
    docs: { description: { story: "Approved state — shows a green resolved banner with the approver, time, and comment." } },
  },
};

export const Rejected: Story = {
  args: {
    status: "rejected",
    resolvedBy: "Bob Smith",
    resolvedAt: "10:45 AM",
    resolvedComment: "Not enough test coverage — revert and add integration tests first.",
  },
  parameters: {
    docs: { description: { story: "Rejected state — shows a red resolved banner. The approver's comment is included in the banner." } },
  },
};

export const Expired: Story = {
  args: {
    status: "expired",
    expiresAt: "10:42 AM",
  },
  parameters: {
    docs: { description: { story: "Expired state — shown when no decision was made within the expiry window." } },
  },
};

export const Themed: Story = {
  args: {
    status: "pending",
    theme: { primary: "#7c3aed", primarySubtle: "#ede9fe", border: "#ddd6fe", success: "#16a34a", danger: "#dc2626" },
    onApprove: () => {},
    onReject: () => {},
  },
  parameters: {
    docs: { description: { story: "Per-component colour override via the `theme` prop." } },
  },
};

// ─── SHOWCASES ──────────────────────────────────────────────────────────────────

export const ConfidenceScoreShowcase: Story = {
  render: () => (
    <div style={{ display: "flex", flexDirection: "column", gap: 16, maxWidth: 420 }}>
      <ConfidenceScore
        score={94}
        label="Classification confidence"
        reason="Strong lexical match across all 3 evaluation criteria."
        threshold={80}
      />
      <ConfidenceScore
        score={72}
        label="Sentiment analysis"
        reason="Ambiguous phrasing detected — borderline positive/neutral."
        threshold={80}
        onRequestVerification={() => {}}
      />
      <ConfidenceScore
        score={38}
        label="Entity extraction"
        reason="Multiple conflicting entity candidates; context window too short."
        threshold={70}
        onRequestVerification={() => {}}
      />
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story:
          "`ConfidenceScore` — visual confidence meter with a colour-coded progress bar. Green = high (≥ threshold), amber = medium, red = low. When score is below `threshold` and `onRequestVerification` is provided, a **Request Human Verification** button is shown.",
      },
      source: {
        code: `// High confidence (≥ threshold) — no verification button
<ConfidenceScore
  score={94}
  label="Classification confidence"
  reason="Strong lexical match across all 3 evaluation criteria."
  threshold={80}
/>

// Medium confidence (below threshold) — verification button shown
<ConfidenceScore
  score={72}
  label="Sentiment analysis"
  reason="Ambiguous phrasing detected — borderline positive/neutral."
  threshold={80}
  onRequestVerification={() => flagForReview(itemId)}
/>

// Low confidence
<ConfidenceScore
  score={38}
  label="Entity extraction"
  reason="Multiple conflicting entity candidates; context window too short."
  threshold={70}
  onRequestVerification={() => flagForReview(itemId)}
/>`,
      },
    },
  },
};

export const MultiStageShowcase: Story = {
  render: () => (
    <div style={{ maxWidth: 520 }}>
      <MultiStageApproval
        title="Production Deployment — v2.4.1"
        stages={[
          {
            id: "s1",
            name: "Engineering Review",
            status: "completed",
            requiredCount: 1,
            approvers: [
              { id: "a1", name: "Alice Chen", status: "approved", comment: "LGTM — tests pass.", decidedAt: "09:15" },
            ],
          },
          {
            id: "s2",
            name: "Security Sign-off",
            status: "in_progress",
            requiredCount: 1,
            dueAt: "Today 11:00",
            approvers: [
              { id: "a2", name: "David Lee", status: "pending" },
            ],
          },
          {
            id: "s3",
            name: "VP Approval",
            status: "pending",
            requiredCount: 1,
            approvers: [
              { id: "a3", name: "Sarah Park", status: "pending" },
            ],
          },
        ]}
      />
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story:
          "`MultiStageApproval` — multi-reviewer pipeline with stage-level status tracking. Each stage shows required approval count, per-approver decisions, and optional due dates. Completed approvers show their comment inline.",
      },
      source: {
        code: `<MultiStageApproval
  title="Production Deployment — v2.4.1"
  stages={[
    {
      id: "s1",
      name: "Engineering Review",
      status: "completed",
      requiredCount: 1,
      approvers: [{ id: "a1", name: "Alice Chen", status: "approved", comment: "LGTM — tests pass.", decidedAt: "09:15" }],
    },
    {
      id: "s2",
      name: "Security Sign-off",
      status: "in_progress",
      requiredCount: 1,
      dueAt: "Today 11:00",
      approvers: [{ id: "a2", name: "David Lee", status: "pending" }],
    },
    {
      id: "s3",
      name: "VP Approval",
      status: "pending",
      requiredCount: 1,
      approvers: [{ id: "a3", name: "Sarah Park", status: "pending" }],
    },
  ]}
/>`,
      },
    },
  },
};

export const AuditLogShowcase: Story = {
  render: () => (
    <div style={{ maxWidth: 560 }}>
      <AuditLog
        entries={[
          { id: "e1", action: "created", actor: "Research Agent", timestamp: "10:41 AM", details: "Approval request created for production deployment." },
          { id: "e2", action: "commented", actor: "Alice Chen", timestamp: "10:43 AM", details: "Added comment: \"Need to check the rollback plan first.\"" },
          { id: "e3", action: "approved", actor: "Alice Chen", timestamp: "10:45 AM", details: "Stage 1 (Engineering) approved." },
          { id: "e4", action: "modified", actor: "Research Agent", timestamp: "10:46 AM", details: "Updated expiry window from 30 min to 60 min." },
          { id: "e5", action: "rejected", actor: "David Lee", timestamp: "10:52 AM", details: "Stage 2 (Security) rejected — firewall rules not updated." },
        ]}
        onExport={() => {}}
      />
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story:
          "`AuditLog` — chronological list of approval lifecycle events. Each entry shows an action badge, actor, timestamp, and optional detail. Use the search box to filter entries. Pass `onExport` to show an Export button.",
      },
      source: {
        code: `<AuditLog
  entries={auditEntries}
  searchValue={search}
  onSearchChange={setSearch}
  onExport={() => downloadCsv(auditEntries)}
/>`,
      },
    },
  },
};

export const DiffViewerShowcase: Story = {
  render: () => (
    <div style={{ maxWidth: 600 }}>
      <DiffViewer
        beforeLabel="v2 (current)"
        afterLabel="v3 (proposed)"
        before={`You are a helpful assistant.
Answer questions concisely and clearly.
Respond in plain text.
Do not use markdown formatting.`}
        after={`You are a helpful assistant specialised in business analysis.
Answer questions concisely and clearly.
Respond only with valid JSON.
Think step-by-step before answering.
Do not use markdown formatting.`}
      />
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story:
          "`DiffViewer` — before/after text diff for reviewing AI-proposed changes. Unchanged lines are shown in muted grey; added lines in green; removed lines in red. Toggle between **Unified** and **Split** view using the toolbar.",
      },
      source: {
        code: `<DiffViewer
  beforeLabel="v2 (current)"
  afterLabel="v3 (proposed)"
  before={currentPrompt}
  after={proposedPrompt}
/>`,
      },
    },
  },
};
