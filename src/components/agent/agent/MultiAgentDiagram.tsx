import { forwardRef, type CSSProperties, type ComponentPropsWithoutRef } from "react";
import { buildKiteThemeStyle, mergeKiteTheme, type KiteTheme } from "../../kite/theme";
import { useFlyUITheme } from "../../kite/theme";
import { type AgentStatus } from "./AgentStatusCard";
import "../agent.css";

export interface AgentNode {
  id: string;
  label: string;
  status: AgentStatus;
  role?: string;
}

export interface AgentEdge {
  from: string;
  to: string;
  label?: string;
}

export interface MultiAgentDiagramProps extends ComponentPropsWithoutRef<"div"> {
  nodes: AgentNode[];
  edges?: AgentEdge[];
  selectedId?: string;
  onSelectNode?: (id: string) => void;
  theme?: KiteTheme;
}

export const MultiAgentDiagram = forwardRef<HTMLDivElement, MultiAgentDiagramProps>(
  function MultiAgentDiagram(
    { nodes, edges, selectedId, onSelectNode, theme, style, ...rest },
    ref,
  ) {
    const contextTheme = useFlyUITheme();
    const themeStyle = buildKiteThemeStyle(mergeKiteTheme(contextTheme, theme));

    return (
      <div
        ref={ref}
        className="kite-flyui-host kite-flyui-agentCard kite-flyui-multiAgent"
        style={{ ...themeStyle, ...style } as CSSProperties}
        {...rest}
      >
        <div className="kite-flyui-multiAgent__canvas" role="group" aria-label="Agent diagram">
          {nodes.map((node) => (
            <div
              key={node.id}
              className={`kite-flyui-multiAgent__node${selectedId === node.id ? " kite-flyui-multiAgent__node--selected" : ""}`}
              onClick={() => onSelectNode?.(node.id)}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                  e.preventDefault();
                  onSelectNode?.(node.id);
                }
              }}
              role="button"
              tabIndex={0}
              aria-pressed={selectedId === node.id}
              aria-label={`Agent: ${node.label}, status: ${node.status}`}
            >
              <span className={`kite-flyui-agentBadge kite-flyui-agentBadge--${node.status}`} style={{ marginBottom: 6 }}>
                <span className={`kite-flyui-agentDot kite-flyui-agentDot--${node.status}`} aria-hidden="true" />
                {node.status}
              </span>
              <span className="kite-flyui-multiAgent__nodeLabel">{node.label}</span>
              {node.role && (
                <span style={{ fontSize: 11, color: "var(--kite-muted)" }}>{node.role}</span>
              )}
            </div>
          ))}
        </div>
        {edges && edges.length > 0 && (
          <div className="kite-flyui-multiAgent__connections">
            {edges.map((edge, i) => {
              const fromNode = nodes.find((n) => n.id === edge.from);
              const toNode = nodes.find((n) => n.id === edge.to);
              return (
                <div key={i} className="kite-flyui-multiAgent__edge">
                  <span>{fromNode?.label ?? edge.from}</span>
                  <span className="kite-flyui-multiAgent__edgeArrow">→</span>
                  <span>{toNode?.label ?? edge.to}</span>
                  {edge.label && <span style={{ color: "var(--kite-muted)" }}>({edge.label})</span>}
                </div>
              );
            })}
          </div>
        )}
      </div>
    );
  },
);
