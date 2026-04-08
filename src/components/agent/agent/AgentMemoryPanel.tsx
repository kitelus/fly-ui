import { forwardRef, type CSSProperties, type ComponentPropsWithoutRef } from "react";
import { buildKiteThemeStyle, mergeKiteTheme, type KiteTheme } from "../../kite/theme";
import { useFlyUITheme } from "../../kite/theme";
import "../agent.css";

export type MemoryType = "short_term" | "long_term" | "episodic";

export interface MemoryEntry {
  id: string;
  type: MemoryType;
  content: string;
  createdAt?: string;
}

export interface AgentMemoryPanelProps extends ComponentPropsWithoutRef<"div"> {
  entries: MemoryEntry[];
  maxTokens?: number;
  usedTokens?: number;
  onDelete?: (id: string) => void;
  theme?: KiteTheme;
}

export const AgentMemoryPanel = forwardRef<HTMLDivElement, AgentMemoryPanelProps>(
  function AgentMemoryPanel(
    { entries, maxTokens, usedTokens, onDelete, theme, style, ...rest },
    ref,
  ) {
    const contextTheme = useFlyUITheme();
    const themeStyle = buildKiteThemeStyle(mergeKiteTheme(contextTheme, theme));

    const pct = maxTokens && usedTokens !== undefined ? (usedTokens / maxTokens) * 100 : undefined;
    const fillClass =
      pct !== undefined && pct > 90
        ? "kite-flyui-progressBar__fill--danger"
        : pct !== undefined && pct > 70
          ? "kite-flyui-progressBar__fill--warning"
          : "";

    return (
      <div
        ref={ref}
        className="kite-flyui-host kite-flyui-agentCard kite-flyui-agentMemory"
        style={{ ...themeStyle, ...style } as CSSProperties}
        {...rest}
      >
        {maxTokens !== undefined && usedTokens !== undefined && (
          <>
            <div className="kite-flyui-agentMemory__usageRow">
              <span className="kite-flyui-agentMemory__usageLabel">Context window</span>
              <span className="kite-flyui-agentMemory__usageCount">
                {usedTokens.toLocaleString()} / {maxTokens.toLocaleString()} tokens
              </span>
            </div>
            <div className="kite-flyui-progressBar" role="progressbar" aria-valuenow={usedTokens} aria-valuemin={0} aria-valuemax={maxTokens}>
              <div
                className={`kite-flyui-progressBar__fill ${fillClass}`}
                style={{ width: `${Math.min(pct ?? 0, 100)}%` }}
              />
            </div>
          </>
        )}
        <div className="kite-flyui-agentMemory__list">
          {entries.map((entry) => (
            <div key={entry.id} className="kite-flyui-agentMemory__item">
              <span className={`kite-flyui-agentMemory__itemType kite-flyui-agentMemory__itemType--${entry.type}`}>
                {entry.type.replace("_", " ")}
              </span>
              <span className="kite-flyui-agentMemory__itemContent">{entry.content}</span>
              {entry.createdAt && (
                <span className="kite-flyui-agentMemory__itemTimestamp">{entry.createdAt}</span>
              )}
              {onDelete && (
                <div className="kite-flyui-agentMemory__itemActions">
                  <button
                    className="kite-flyui-agentMemory__deleteBtn"
                    onClick={() => onDelete(entry.id)}
                    aria-label={`Delete memory: ${entry.content.slice(0, 30)}`}
                    type="button"
                  >
                    ✕
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    );
  },
);
