import { forwardRef, type CSSProperties, type ComponentPropsWithoutRef, type ReactNode } from "react";
import { buildKiteThemeStyle, mergeKiteTheme, type KiteTheme } from "../../kite/theme";
import { useFlyUITheme } from "../../kite/theme";
import "../agent.css";

export type MemoryType = "short_term" | "long_term" | "episodic" | string;

export interface MemoryEntry {
  id: string;
  type: MemoryType;
  content: string;
  createdAt?: string;
  /** Extra metadata to display alongside the entry. */
  meta?: string;
}

export interface AgentMemoryPanelProps extends ComponentPropsWithoutRef<"div"> {
  entries: MemoryEntry[];
  maxTokens?: number;
  usedTokens?: number;
  onDelete?: (id: string, entry: MemoryEntry) => void;
  onEdit?: (id: string, entry: MemoryEntry) => void;
  onAdd?: () => void;
  /** Override the "Context window" label. @default "Context window" */
  contextWindowLabel?: string;
  /** Override the delete button label/icon. @default "✕" */
  deleteLabel?: ReactNode;
  /** Override the edit button label/icon. @default "✎" */
  editLabel?: ReactNode;
  /** Label for the Add Entry button. @default "+ Add Entry" */
  addLabel?: ReactNode;
  /** Text shown when there are no entries. @default "No memory entries" */
  emptyText?: string;
  /** Custom render for a single entry row. */
  renderEntry?: (entry: MemoryEntry) => ReactNode;
  /** Custom render for empty state. */
  renderEmpty?: () => ReactNode;
  /** Warning threshold percentage (0-100). @default 70 */
  warnThreshold?: number;
  /** Danger threshold percentage (0-100). @default 90 */
  dangerThreshold?: number;
  /** Override type labels for display. */
  typeLabels?: Partial<Record<string, string>>;
  /** Slot rendered in the header (above the progress bar). */
  headerSlot?: ReactNode;
  /** Slot rendered below the entry list. */
  footerSlot?: ReactNode;
  theme?: KiteTheme;
}

export const AgentMemoryPanel = forwardRef<HTMLDivElement, AgentMemoryPanelProps>(
  function AgentMemoryPanel(
    {
      entries,
      maxTokens,
      usedTokens,
      onDelete,
      onEdit,
      onAdd,
      contextWindowLabel = "Context window",
      deleteLabel = "Delete",
      editLabel = "Edit",
      addLabel = "+ Add Entry",
      emptyText = "No memory entries",
      renderEntry,
      renderEmpty,
      warnThreshold = 70,
      dangerThreshold = 90,
      typeLabels,
      headerSlot,
      footerSlot,
      theme,
      style,
      ...rest
    },
    ref,
  ) {
    const contextTheme = useFlyUITheme();
    const themeStyle = buildKiteThemeStyle(mergeKiteTheme(contextTheme, theme));

    const pct = maxTokens && usedTokens !== undefined ? (usedTokens / maxTokens) * 100 : undefined;
    const fillClass =
      pct !== undefined && pct > dangerThreshold
        ? "kite-flyui-progressBar__fill--danger"
        : pct !== undefined && pct > warnThreshold
          ? "kite-flyui-progressBar__fill--warning"
          : "";

    const resolveTypeLabel = (type: MemoryType) =>
      typeLabels?.[type] ?? type.replace("_", " ");

    return (
      <div
        ref={ref}
        className="kite-flyui-host kite-flyui-agentCard kite-flyui-agentMemory"
        style={{ ...themeStyle, ...style } as CSSProperties}
        {...rest}
      >
        {headerSlot}

        {maxTokens !== undefined && usedTokens !== undefined && (
          <>
            <div className="kite-flyui-agentMemory__usageRow">
              <span className="kite-flyui-agentMemory__usageLabel">{contextWindowLabel}</span>
              <span className="kite-flyui-agentMemory__usageCount">
                {usedTokens.toLocaleString()} / {maxTokens.toLocaleString()} tokens
              </span>
            </div>
            <div
              className="kite-flyui-progressBar"
              role="progressbar"
              aria-valuenow={usedTokens}
              aria-valuemin={0}
              aria-valuemax={maxTokens}
              aria-label={`${contextWindowLabel}: ${usedTokens.toLocaleString()} of ${maxTokens.toLocaleString()} tokens used`}
            >
              <div
                className={`kite-flyui-progressBar__fill ${fillClass}`}
                style={{ width: `${Math.min(pct ?? 0, 100)}%` }}
              />
            </div>
          </>
        )}

        {onAdd && (
          <div className="kite-flyui-agentMemory__addRow">
            <button
              type="button"
              className="kite-flyui-agentBtn kite-flyui-agentBtn--primary"
              onClick={onAdd}
            >
              {addLabel}
            </button>
          </div>
        )}

        <div className="kite-flyui-agentMemory__list">
          {entries.length === 0 ? (
            renderEmpty
              ? renderEmpty()
              : <div className="kite-flyui-agentMemory__empty">{emptyText}</div>
          ) : (
            entries.map((entry) =>
              renderEntry ? (
                <div key={entry.id}>{renderEntry(entry)}</div>
              ) : (
                <div key={entry.id} className="kite-flyui-agentMemory__item">
                  <span className={`kite-flyui-agentMemory__itemType kite-flyui-agentMemory__itemType--${entry.type}`}>
                    {resolveTypeLabel(entry.type)}
                  </span>
                  <span className="kite-flyui-agentMemory__itemContent">{entry.content}</span>
                  {(entry.createdAt || entry.meta) && (
                    <span className="kite-flyui-agentMemory__itemTimestamp">
                      {entry.createdAt}{entry.meta && entry.createdAt ? ` · ${entry.meta}` : entry.meta}
                    </span>
                  )}
                  {(onDelete || onEdit) && (
                    <div className="kite-flyui-agentMemory__itemActions">
                      {onEdit && (
                        <button
                          className="kite-flyui-agentMemory__editBtn"
                          onClick={() => onEdit(entry.id, entry)}
                          aria-label={`Edit memory: ${entry.content.slice(0, 30)}`}
                          type="button"
                        >
                          {editLabel}
                        </button>
                      )}
                      {onDelete && (
                        <button
                          className="kite-flyui-agentMemory__deleteBtn"
                          onClick={() => onDelete(entry.id, entry)}
                          aria-label={`Delete memory: ${entry.content.slice(0, 30)}`}
                          type="button"
                        >
                          {deleteLabel}
                        </button>
                      )}
                    </div>
                  )}
                </div>
              )
            )
          )}
        </div>

        {footerSlot}
      </div>
    );
  },
);
