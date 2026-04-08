import { forwardRef, useState, type CSSProperties, type ComponentPropsWithoutRef, type ReactNode } from "react";
import { buildKiteThemeStyle, mergeKiteTheme, type KiteTheme } from "../../kite/theme";
import { useFlyUITheme } from "../../kite/theme";
import "../agent.css";

export type ApprovalStatus = "pending" | "approved" | "rejected" | "expired";

export interface ApprovalCardProps extends ComponentPropsWithoutRef<"div"> {
  title: string;
  description?: string;
  actionDescription?: string;
  requesterName?: string;
  requesterAvatar?: string;
  requestedAt?: string;
  expiresAt?: string;
  status?: ApprovalStatus;
  resolvedBy?: string;
  resolvedAt?: string;
  resolvedComment?: string;
  onApprove?: (comment: string) => void;
  onReject?: (comment: string) => void;
  disabled?: boolean;
  /** Placeholder for the comment textarea. @default "Add a comment (optional)…" */
  commentPlaceholder?: string;
  /** Max character count for the comment. */
  commentMaxLength?: number;
  /** Override button labels. */
  approveLabel?: ReactNode;
  rejectLabel?: ReactNode;
  /** Override resolved status labels/icons. */
  resolvedLabels?: Partial<Record<ApprovalStatus, { icon?: ReactNode; label?: string }>>;
  /** Slot rendered below the action description, above the comment textarea. */
  bodySlot?: ReactNode;
  theme?: KiteTheme;
}

export const ApprovalCard = forwardRef<HTMLDivElement, ApprovalCardProps>(
  function ApprovalCard(
    {
      title,
      description,
      actionDescription,
      requesterName,
      requesterAvatar,
      requestedAt,
      expiresAt,
      status = "pending",
      resolvedBy,
      resolvedAt,
      resolvedComment,
      onApprove,
      onReject,
      disabled = false,
      commentPlaceholder = "Add a comment (optional)…",
      commentMaxLength,
      approveLabel = "Approve",
      rejectLabel = "Reject",
      resolvedLabels,
      bodySlot,
      theme,
      style,
      ...rest
    },
    ref,
  ) {
    const contextTheme = useFlyUITheme();
    const themeStyle = buildKiteThemeStyle(mergeKiteTheme(contextTheme, theme));
    const [comment, setComment] = useState("");

    const badgeVariant =
      status === "approved" ? "completed"
      : status === "rejected" ? "error"
      : status === "expired"  ? "idle"
      : "thinking";

    const defaultResolved: Record<ApprovalStatus, { icon: string; label: string }> = {
      approved: { icon: "", label: "Approved" },
      rejected: { icon: "", label: "Rejected" },
      expired:  { icon: "", label: "Expired" },
      pending:  { icon: "", label: "Pending" },
    };

    const resolvedConfig = {
      ...defaultResolved[status],
      ...resolvedLabels?.[status],
    };

    return (
      <div
        ref={ref}
        className="kite-flyui-host kite-flyui-agentCard kite-flyui-approvalCard"
        style={{ ...themeStyle, ...style } as CSSProperties}
        {...rest}
      >
        <div className="kite-flyui-approvalCard__header">
          <p className="kite-flyui-approvalCard__title">{title}</p>
          <span className={`kite-flyui-agentBadge kite-flyui-agentBadge--${badgeVariant}`}>
            {status}
          </span>
        </div>

        {description && <p className="kite-flyui-approvalCard__desc">{description}</p>}

        {actionDescription && (
          <div className="kite-flyui-approvalCard__action">
            <p className="kite-flyui-approvalCard__actionLabel">Requested Action</p>
            {actionDescription}
          </div>
        )}

        {(requesterName || requestedAt) && (
          <div className="kite-flyui-approvalCard__requester">
            <div className="kite-flyui-approvalCard__avatar" aria-hidden="true">
              {requesterAvatar ?? (requesterName ? requesterName[0].toUpperCase() : "?")}
            </div>
            {requesterName && <span>{requesterName}</span>}
            {requestedAt && <span>· {requestedAt}</span>}
            {expiresAt && (
              <span className="kite-flyui-approvalCard__expiry">
                Expires: {expiresAt}
              </span>
            )}
          </div>
        )}

        {bodySlot}

        {status === "pending" ? (
          <>
            <textarea
              className="kite-flyui-approvalCard__comment"
              placeholder={commentPlaceholder}
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              disabled={disabled}
              maxLength={commentMaxLength}
              aria-label="Approval comment"
            />
            {commentMaxLength && (
              <span className="kite-flyui-approvalCard__commentCount">
                {comment.length}/{commentMaxLength}
              </span>
            )}
            <div className="kite-flyui-approvalCard__btns">
              <button
                className="kite-flyui-approvalCard__approve"
                onClick={() => onApprove?.(comment)}
                disabled={disabled || !onApprove}
                type="button"
                aria-label="Approve"
              >
                {approveLabel}
              </button>
              <button
                className="kite-flyui-approvalCard__reject"
                onClick={() => onReject?.(comment)}
                disabled={disabled || !onReject}
                type="button"
                aria-label="Reject"
              >
                {rejectLabel}
              </button>
            </div>
          </>
        ) : (
          <div
            className={`kite-flyui-approvalCard__resolved kite-flyui-approvalCard__resolved--${status}`}
            role="status"
          >
            {resolvedConfig.icon && <span aria-hidden="true">{resolvedConfig.icon}</span>}
            <span>{resolvedConfig.label}</span>
            {resolvedBy      && <span>by {resolvedBy}</span>}
            {resolvedAt      && <span>· {resolvedAt}</span>}
            {resolvedComment && <span>· "{resolvedComment}"</span>}
          </div>
        )}
      </div>
    );
  },
);
