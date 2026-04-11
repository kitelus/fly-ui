import type { Meta, StoryObj } from "@storybook/react-vite";

import { ApprovalCard } from "./ApprovalCard";
import { AuditLog } from "./AuditLog";
import { ConfidenceScore } from "./ConfidenceScore";
import { DiffViewer } from "./DiffViewer";
import { MultiStageApproval } from "./MultiStageApproval";

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
  title: "Components/Approval",
  component: ApprovalCard,
  subcomponents: { ConfidenceScore, MultiStageApproval, AuditLog, DiffViewer },
  tags: ["autodocs"],
  args: {
    title: "Deploy to Production",
    description:
      "Agent has prepared a deployment package for the Q3 reporting service. Human approval is required before the action is executed.",
    actionDescription:
      "Run `kubectl apply -f deploy/prod/reporting-v2.yaml` on the production cluster.",
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
      description:
        "Exact action that will be executed if approved — displayed in a highlighted monospace box.",
      control: "text",
      table: { defaultValue: { summary: "undefined" } },
    },
    requesterName: {
      description: "Name of the agent or user requesting approval.",
      control: "text",
      table: { defaultValue: { summary: "undefined" } },
    },
    requesterAvatar: {
      description:
        "Avatar URL for the requester. When provided, shows a small avatar image next to the requester name.",
      control: "text",
      table: { defaultValue: { summary: "undefined" } },
    },
    requestedAt: {
      description: "Time string shown next to the requester name.",
      control: "text",
      table: { defaultValue: { summary: "undefined" } },
    },
    expiresAt: {
      description:
        "Expiry time shown in the requester row — prompts urgency for the approver.",
      control: "text",
      table: { defaultValue: { summary: "undefined" } },
    },
    status: {
      description:
        "Approval lifecycle state. `pending` shows the comment textarea and action buttons. `approved`, `rejected`, and `expired` render a resolved banner.",
      options: ["pending", "approved", "rejected", "expired"],
      control: { type: "inline-radio" },
      table: { defaultValue: { summary: "pending" } },
    },
    resolvedBy: {
      description:
        "Name of the person who resolved the request — shown in the resolved banner.",
      control: "text",
      table: { defaultValue: { summary: "undefined" } },
    },
    resolvedAt: {
      description:
        "Time the request was resolved — shown in the resolved banner.",
      control: "text",
      table: { defaultValue: { summary: "undefined" } },
    },
    resolvedComment: {
      description:
        "Comment left at resolution time — shown in the resolved banner.",
      control: "text",
      table: { defaultValue: { summary: "undefined" } },
    },
    disabled: {
      description:
        "Disables the comment textarea and action buttons — useful while the approval is being submitted.",
      control: "boolean",
      table: { defaultValue: { summary: "false" } },
    },
    commentPlaceholder: {
      description: "Placeholder text for the comment textarea.",
      control: "text",
      table: { defaultValue: { summary: '"Add a comment (optional)…"' } },
    },
    commentMaxLength: {
      description: "Maximum character length for the comment textarea.",
      control: { type: "number", min: 0 },
      table: { defaultValue: { summary: "undefined" } },
    },
    approveLabel: {
      description: "Label for the Approve button.",
      control: "text",
      table: { defaultValue: { summary: '"Approve"' } },
    },
    rejectLabel: {
      description: "Label for the Reject button.",
      control: "text",
      table: { defaultValue: { summary: '"Reject"' } },
    },
    resolvedLabels: {
      description:
        "Override the icon and/or label shown in the resolved banner per status. `{ approved?: { icon?, label? }, rejected?: { icon?, label? }, expired?: { icon?, label? } }`.",
      control: "object",
      table: { defaultValue: { summary: "undefined" } },
    },
    onApprove: {
      description:
        "Called with the comment string when **Approve** is clicked.",
      control: false,
    },
    onReject: {
      description: "Called with the comment string when **Reject** is clicked.",
      control: false,
    },
    bodySlot: {
      description:
        "ReactNode rendered between the action description and the comment textarea. Use for risk warnings, attached diffs, or custom context.",
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
Human-in-the-loop (HITL) approval components for AI agent workflows that require explicit human sign-off before taking high-stakes actions.

      > Availability: These components are available in '@kitelus/fly-ui' version '0.1.5-rc.0' and later.

---

## Install

\`\`\`bash
npm install @kitelus/fly-ui
\`\`\`

## Import

\`\`\`tsx
import {
  ApprovalCard,
  ConfidenceScore,
  MultiStageApproval,
  AuditLog,
  DiffViewer,
} from "@kitelus/fly-ui";
\`\`\`

## Components

| Component | Description |
|---|---|
| \`ApprovalCard\` | Primary approval UI — shows the request context, a comment textarea, and Approve / Reject buttons |
| \`ConfidenceScore\` | Visual confidence meter (0–100) with colour-coded bar and optional "Request Human Verification" button |
| \`MultiStageApproval\` | Multi-reviewer pipeline showing stage status, per-approver decisions, and required approval counts |
| \`AuditLog\` | Searchable, filterable chronological list of approval lifecycle events |
| \`DiffViewer\` | Before/after diff viewer with unified and split modes, line numbers, and copy support |

---

## Quick start

\`\`\`tsx
import { ApprovalCard, ConfidenceScore, DiffViewer } from "@kitelus/fly-ui";

// Approval request card
<ApprovalCard
  title="Send customer email"
  actionDescription="Send the drafted email to 1 240 customers in the APAC segment."
  requesterName="Marketing Agent"
  status="pending"
  onApprove={(comment) => approve(requestId, comment)}
  onReject={(comment) => reject(requestId, comment)}
/>

// Confidence score — show verification button when below threshold
<ConfidenceScore
  score={72}
  label="Classification confidence"
  reason="Ambiguous phrasing in input — recommend human review."
  threshold={80}
  onRequestVerification={() => flagForReview(itemId)}
/>

// Diff viewer — review AI-proposed text changes
<DiffViewer
  title="Prompt change — v2 → v3"
  beforeLabel="v2 (current)"
  afterLabel="v3 (proposed)"
  before={currentPrompt}
  after={proposedPrompt}
  showLineNumbers
  onCopy={(content) => navigator.clipboard.writeText(content)}
/>
\`\`\`
        `,
      },
    },
  },
} satisfies Meta<typeof ApprovalCard>;

export default meta;

type Story = StoryObj<typeof meta>;

// ─── ApprovalCard stories ─────────────────────────────────────────────────────

export const Playground: Story = {
  args: {
    onApprove: () => {},
    onReject: () => {},
  },
  parameters: {
    docs: {
      description: {
        story:
          "Interactive playground — change `status`, toggle `disabled`, customise labels, and wire up `onApprove` / `onReject` using the controls panel.",
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
          "Default pending state — shows the action context, a comment textarea, and Approve / Reject buttons. Both `onApprove` and `onReject` must be provided to enable the buttons.",
      },
      source: {
        code: `<ApprovalCard
  title="Deploy to Production"
  description="Agent has prepared a deployment package..."
  actionDescription="Run kubectl apply -f deploy/prod/reporting-v2.yaml"
  requesterName="Research Agent"
  requestedAt="10:42 AM"
  expiresAt="11:42 AM"
  status="pending"
  onApprove={(comment) => approve(requestId, comment)}
  onReject={(comment) => reject(requestId, comment)}
/>`,
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
    docs: {
      description: {
        story:
          "Approved state — shows a green resolved banner with the approver name, time, and comment.",
      },
    },
  },
};

export const Rejected: Story = {
  args: {
    status: "rejected",
    resolvedBy: "Bob Smith",
    resolvedAt: "10:45 AM",
    resolvedComment:
      "Not enough test coverage — revert and add integration tests first.",
  },
  parameters: {
    docs: {
      description: {
        story:
          "Rejected state — shows a red resolved banner with a left accent border.",
      },
    },
  },
};

export const Expired: Story = {
  args: {
    status: "expired",
    expiresAt: "10:42 AM",
  },
  parameters: {
    docs: {
      description: {
        story:
          "Expired state — shown when no decision was made within the expiry window.",
      },
    },
  },
};

export const CustomLabels: Story = {
  args: {
    status: "pending",
    approveLabel: "Authorise",
    rejectLabel: "Deny",
    commentPlaceholder: "Reason for your decision…",
    commentMaxLength: 500,
    onApprove: () => {},
    onReject: () => {},
  },
  parameters: {
    docs: {
      description: {
        story:
          "Override `approveLabel` and `rejectLabel` for domain-specific terminology. Use `commentPlaceholder` to guide reviewers, and `commentMaxLength` to limit comment length.",
      },
      source: {
        code: `<ApprovalCard
  title="Send customer email"
  status="pending"
  approveLabel="Authorise"
  rejectLabel="Deny"
  commentPlaceholder="Reason for your decision…"
  commentMaxLength={500}
  onApprove={(comment) => authorise(requestId, comment)}
  onReject={(comment) => deny(requestId, comment)}
/>`,
      },
    },
  },
};

export const CustomResolvedLabels: Story = {
  args: {
    status: "approved",
    resolvedBy: "Alice Chen",
    resolvedAt: "10:48 AM",
    resolvedComment: "LGTM.",
    resolvedLabels: {
      approved: { label: "Authorised" },
      rejected: { label: "Denied" },
      expired: { label: "Timed out" },
    },
  },
  parameters: {
    docs: {
      description: {
        story:
          "Use `resolvedLabels` to override the text shown in the resolved banner per status — useful for i18n or domain-specific terminology.",
      },
      source: {
        code: `<ApprovalCard
  title="Deploy to Production"
  status="approved"
  resolvedBy="Alice Chen"
  resolvedAt="10:48 AM"
  resolvedComment="LGTM."
  resolvedLabels={{
    approved: { label: "Authorised" },
    rejected: { label: "Denied" },
    expired:  { label: "Timed out" },
  }}
/>`,
      },
    },
  },
};

export const WithBodySlot: Story = {
  args: {
    status: "pending",
    onApprove: () => {},
    onReject: () => {},
    bodySlot: (
      <div
        style={{
          padding: "8px 12px",
          borderRadius: 6,
          background: "var(--kite-warning-subtle)",
          border:
            "1px solid color-mix(in srgb, var(--kite-warning) 40%, transparent)",
          fontSize: 12,
          color: "var(--kite-warning)",
        }}
      >
        This action will affect 1 240 customers in the APAC segment.
      </div>
    ),
  },
  parameters: {
    docs: {
      description: {
        story:
          "Use `bodySlot` to inject additional context between the action description and the comment textarea — for example a risk warning, confidence score, or an embedded diff.",
      },
      source: {
        code: `<ApprovalCard
  title="Send customer email"
  actionDescription="Send the drafted email to 1 240 customers."
  status="pending"
  onApprove={(comment) => approve(requestId, comment)}
  onReject={(comment) => reject(requestId, comment)}
  bodySlot={
    <ConfidenceScore
      score={72}
      label="Classification confidence"
      reason="Ambiguous phrasing detected."
      threshold={80}
    />
  }
/>`,
      },
    },
  },
};

export const Themed: Story = {
  args: {
    status: "pending",
    theme: {
      primary: "#7c3aed",
      primarySubtle: "#ede9fe",
      border: "#ddd6fe",
      success: "#16a34a",
      danger: "#dc2626",
    },
    onApprove: () => {},
    onReject: () => {},
  },
  parameters: {
    docs: {
      description: {
        story: "Per-component colour override via the `theme` prop.",
      },
    },
  },
};

// ─── ConfidenceScore showcase ─────────────────────────────────────────────────

export const ConfidenceScoreShowcase: Story = {
  render: () => (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        gap: 16,
        maxWidth: 420,
      }}
    >
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
        verifyLabel="Request human review"
      />
      <ConfidenceScore
        score={38}
        label="Entity extraction"
        reason="Multiple conflicting entity candidates; context window too short."
        threshold={70}
        onRequestVerification={() => {}}
        verifyLabel="Request human review"
        levelThresholds={{ highMin: 80, mediumMin: 55 }}
      />
      <ConfidenceScore
        score={88}
        label="Always-show verify"
        reason="High confidence, but human verification is always offered."
        threshold={80}
        onRequestVerification={() => {}}
        alwaysShowVerify
        verifyLabel="Verify anyway"
      >
        <div style={{ marginTop: 6, fontSize: 11, color: "#64748b" }}>
          Verified by: Rule-based classifier v2
        </div>
      </ConfidenceScore>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: `
\`ConfidenceScore\` — visual confidence meter with a colour-coded progress bar.

**Colour mapping:**
- Green: score ≥ \`levelThresholds.highMin\` (default 80)
- Amber: score ≥ \`levelThresholds.mediumMin\` (default ~56)
- Red: score below medium threshold

**Key features:**
- \`threshold\` is the cut-off below which the "Request Human Verification" button appears (when \`onRequestVerification\` is provided)
- \`alwaysShowVerify\` shows the verification button regardless of the score level
- \`verifyLabel\` overrides the button text
- \`levelThresholds\` allows customising the green/amber thresholds independently
- \`children\` renders additional content below the progress bar (e.g. attribution info)
        `,
      },
      source: {
        code: `// High confidence — no verification button
<ConfidenceScore
  score={94}
  label="Classification confidence"
  reason="Strong lexical match across all 3 evaluation criteria."
  threshold={80}
/>

// Medium confidence — verification button shown below threshold
<ConfidenceScore
  score={72}
  label="Sentiment analysis"
  reason="Ambiguous phrasing detected — borderline positive/neutral."
  threshold={80}
  onRequestVerification={() => flagForReview(itemId)}
  verifyLabel="Request human review"
/>

// Custom thresholds
<ConfidenceScore
  score={38}
  label="Entity extraction"
  reason="Multiple conflicting entity candidates."
  threshold={70}
  onRequestVerification={() => flagForReview(itemId)}
  levelThresholds={{ highMin: 80, mediumMin: 55 }}
/>

// Always show verify button + children slot
<ConfidenceScore
  score={88}
  label="Always-show verify"
  threshold={80}
  onRequestVerification={() => flagForReview(itemId)}
  alwaysShowVerify
  verifyLabel="Verify anyway"
>
  <span>Verified by: Rule-based classifier v2</span>
</ConfidenceScore>`,
      },
    },
  },
};

// ─── MultiStageApproval showcase ──────────────────────────────────────────────

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
              {
                id: "a1",
                name: "Alice Chen",
                status: "approved",
                comment: "LGTM — tests pass.",
                decidedAt: "09:15",
              },
            ],
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
        onStageAction={() => {}}
      />
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: `
\`MultiStageApproval\` — multi-reviewer sequential pipeline.

**Key features:**
- Stages flow from top to bottom; completed stages show their approvers' decisions inline
- Each stage shows \`requiredCount\` approvals needed and the list of \`approvers\`
- Per-stage \`dueAt\` shows a deadline
- \`onStageAction(stageId, action)\` fires with \`"complete"\`, \`"reject"\`, or \`"skip"\` — use to drive stage transitions
- \`stageIcons\` overrides the default stage status indicators by status key (\`"pending"\`, \`"in_progress"\`, \`"completed"\`, \`"rejected"\`, \`"skipped"\`)
- \`renderStage(stage)\` fully replaces a single stage row
        `,
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
  onStageAction={(stageId, action) => handleStageAction(stageId, action)}
  stageIcons={{ completed: <CheckIcon />, in_progress: <SpinnerIcon /> }}
/>`,
      },
    },
  },
};

// ─── AuditLog showcase ────────────────────────────────────────────────────────

export const AuditLogShowcase: Story = {
  render: () => (
    <div style={{ maxWidth: 560 }}>
      <AuditLog
        entries={[
          {
            id: "e1",
            action: "created",
            actor: "Research Agent",
            timestamp: "10:41 AM",
            details: "Approval request created for production deployment.",
          },
          {
            id: "e2",
            action: "commented",
            actor: "Alice Chen",
            timestamp: "10:43 AM",
            details: 'Added comment: "Need to check the rollback plan first."',
          },
          {
            id: "e3",
            action: "approved",
            actor: "Alice Chen",
            timestamp: "10:45 AM",
            details: "Stage 1 (Engineering) approved.",
          },
          {
            id: "e4",
            action: "modified",
            actor: "Research Agent",
            timestamp: "10:46 AM",
            details: "Updated expiry window from 30 min to 60 min.",
          },
          {
            id: "e5",
            action: "rejected",
            actor: "David Lee",
            timestamp: "10:52 AM",
            details:
              "Stage 2 (Security) rejected — firewall rules not updated.",
          },
        ]}
        searchPlaceholder="Search audit events…"
        onExport={() => {}}
        onClear={() => {}}
      />
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: `
\`AuditLog\` — chronological list of approval lifecycle events.

**Key features:**
- Each entry shows an action badge (colour-coded by action type), actor, timestamp, and optional detail text
- Free-text search: \`searchValue\` + \`onSearchChange\`
- Action filter dropdown: \`actionFilter\` + \`onActionFilterChange\`
- \`searchPlaceholder\` overrides the search input placeholder
- \`onExport\` shows an Export button
- \`onClear\` shows a Clear button
- \`renderEntry(entry, isExpanded, toggle)\` fully replaces a single row
        `,
      },
      source: {
        code: `<AuditLog
  entries={auditEntries}
  searchValue={search}
  onSearchChange={setSearch}
  searchPlaceholder="Search audit events…"
  actionFilter={actionFilter}
  onActionFilterChange={setActionFilter}
  onExport={() => downloadCsv(auditEntries)}
  onClear={() => clearAuditLog()}
/>`,
      },
    },
  },
};

// ─── DiffViewer showcase ──────────────────────────────────────────────────────

export const DiffViewerShowcase: Story = {
  render: () => (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        gap: 24,
        maxWidth: 620,
      }}
    >
      <div>
        <p style={{ fontSize: 12, color: "#64748b", marginBottom: 8 }}>
          Unified mode — with line numbers and copy
        </p>
        <DiffViewer
          title="Prompt change — v2 → v3"
          beforeLabel="v2 (current)"
          afterLabel="v3 (proposed)"
          showLineNumbers
          before={`You are a helpful assistant.
Answer questions concisely and clearly.
Respond in plain text.
Do not use markdown formatting.`}
          after={`You are a helpful assistant specialised in business analysis.
Answer questions concisely and clearly.
Respond only with valid JSON.
Think step-by-step before answering.
Do not use markdown formatting.`}
          onCopy={() => {}}
          copyFeedbackLabel="Diff copied!"
          copyFeedbackDuration={2000}
        />
      </div>
      <div>
        <p style={{ fontSize: 12, color: "#64748b", marginBottom: 8 }}>
          Custom mode labels + toolbar slot
        </p>
        <DiffViewer
          beforeLabel="Original"
          afterLabel="Revised"
          modeLabels={{ unified: "Combined", split: "Side-by-side" }}
          before="The product is excellent."
          after="The product is excellent and highly recommended."
          toolbarSlot={
            <span
              style={{ fontSize: 11, color: "#64748b", marginLeft: "auto" }}
            >
              1 addition · 0 removals
            </span>
          }
          onCopy={() => {}}
        />
      </div>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: `
\`DiffViewer\` — before/after text diff for reviewing AI-proposed changes.

**Colour coding:** unchanged lines are muted grey; added lines are green with a + prefix; removed lines are red with a - prefix.

**Key features:**
- Toggle between **Unified** and **Split** view via the toolbar buttons
- \`mode\` + \`onModeChange\` gives full controlled mode state (default is \`"unified"\`)
- \`showLineNumbers\` adds line number gutters on both sides
- \`title\` renders a heading above the toolbar — accepts any ReactNode
- \`beforeLabel\` / \`afterLabel\` override the pane header labels
- \`onCopy(content)\` shows a Copy button in the toolbar
- \`copyFeedbackLabel\` / \`copyFeedbackDuration\` control the post-copy confirmation (set \`copyFeedbackLabel=null\` to disable)
- \`toolbarSlot\` injects custom content into the toolbar row
- \`modeLabels\` overrides the "Unified" / "Split" button text
- \`lines\` accepts a pre-computed \`DiffLine[]\` array if you want to diff on the server or use a custom algorithm
        `,
      },
      source: {
        code: `// Auto-diff from before/after strings
<DiffViewer
  title="Prompt change — v2 → v3"
  beforeLabel="v2 (current)"
  afterLabel="v3 (proposed)"
  before={currentPrompt}
  after={proposedPrompt}
  showLineNumbers
  onCopy={(content) => navigator.clipboard.writeText(content)}
  copyFeedbackLabel="Diff copied!"
  copyFeedbackDuration={2000}
/>

// Controlled mode (start in split view)
<DiffViewer
  before={before}
  after={after}
  mode={mode}
  onModeChange={setMode}
  modeLabels={{ unified: "Combined", split: "Side-by-side" }}
/>

// Pre-computed diff lines (e.g. from a server-side diff)
<DiffViewer
  lines={[
    { type: "unchanged", content: "You are a helpful assistant.", lineNumber: 1 },
    { type: "removed",   content: "Respond in plain text.",       lineNumber: 3 },
    { type: "added",     content: "Respond only with valid JSON." },
  ]}
  showLineNumbers
/>

// With toolbar slot showing diff stats
<DiffViewer
  before={before}
  after={after}
  toolbarSlot={<span>2 additions · 1 removal</span>}
  onCopy={(content) => navigator.clipboard.writeText(content)}
/>`,
      },
    },
  },
};
