import { forwardRef, useState, type CSSProperties, type ComponentPropsWithoutRef } from "react";
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
      theme,
      style,
      ...rest
    },
    ref,
  ) {
    const contextTheme = useFlyUITheme();
    const themeStyle = buildKiteThemeStyle(mergeKiteTheme(contextTheme, theme));
    const [comment, setComment] = useState("");

    return (
      <div
        ref={ref}
        className="kite-flyui-host kite-flyui-agentCard kite-flyui-approvalCard"
        style={{ ...themeStyle, ...style } as CSSProperties}
        {...rest}
      >
        <div className="kite-flyui-approvalCard__header">
          <p className="kite-flyui-approvalCard__title">{title}</p>
          <span className={`kite-flyui-agentBadge kite-flyui-agentBadge--${status === "approved" ? "completed" : status === "rejected" ? "error" : status === "expired" ? "idle" : "thinking"}`}>
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
              <span className="kite-flyui-approvalCard__expiry" style={{ marginLeft: "auto" }}>
                Expires: {expiresAt}
              </span>
            )}
          </div>
        )}
        {status === "pending" ? (
          <>
            <textarea
              className="kite-flyui-approvalCard__comment"
              placeholder="Add a comment (optional)…"
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              disabled={disabled}
              aria-label="Approval comment"
            />
            <div className="kite-flyui-approvalCard__btns">
              <button
                className="kite-flyui-approvalCard__approve"
                onClick={() => onApprove?.(comment)}
                disabled={disabled || !onApprove}
                type="button"
              >
                Approve
              </button>
              <button
                className="kite-flyui-approvalCard__reject"
                onClick={() => onReject?.(comment)}
                disabled={disabled || !onReject}
                type="button"
              >
                Reject
              </button>
            </div>
          </>
        ) : (
          <div className={`kite-flyui-approvalCard__resolved kite-flyui-approvalCard__resolved--${status}`} role="status">
            <span aria-hidden="true">{status === "approved" ? "✓" : status === "rejected" ? "✗" : "⏱"}</span>
            <span>{status === "approved" ? "Approved" : status === "rejected" ? "Rejected" : "Expired"}</span>
            {resolvedBy && <span>by {resolvedBy}</span>}
            {resolvedAt && <span>· {resolvedAt}</span>}
            {resolvedComment && <span>· "{resolvedComment}"</span>}
          </div>
        )}
      </div>
    );
  },
);
