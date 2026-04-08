import {
  forwardRef,
  useCallback,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
  type CSSProperties,
  type ComponentPropsWithoutRef,
  type PointerEvent,
  type ReactNode,
} from "react";
import { buildKiteThemeStyle, mergeKiteTheme, type KiteTheme } from "../../kite/theme";
import { useFlyUITheme } from "../../kite/theme";
import { type AgentStatus } from "./AgentStatusCard";
import "../agent.css";

// ─── Types ────────────────────────────────────────────────────────────────────

export interface AgentNode {
  id: string;
  label: string;
  status: AgentStatus;
  role?: string;
  /** Accent colour for this node — overrides status colour */
  color?: string;
  /** Custom icon/badge shown above the label */
  icon?: ReactNode;
  /** Initial position (px). Auto-layout is used when omitted. */
  x?: number;
  y?: number;
}

export interface AgentEdge {
  from: string;
  to: string;
  label?: string;
  /** Animate the edge stroke (dashes flowing) */
  animated?: boolean;
  /** Override edge stroke colour */
  color?: string;
}

export interface MultiAgentDiagramProps extends ComponentPropsWithoutRef<"div"> {
  nodes: AgentNode[];
  edges?: AgentEdge[];
  selectedId?: string;
  onSelectNode?: (id: string | null) => void;
  /** Selected edge key = `${from}->${to}` */
  selectedEdgeId?: string;
  onSelectEdge?: (id: string | null) => void;
  /** Completely replace node rendering */
  renderNode?: (node: AgentNode, selected: boolean) => ReactNode;
  /** Canvas min-height in px */
  canvasHeight?: number;
  theme?: KiteTheme;
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

const STATUS_COLOR_VAR: Record<AgentStatus, string> = {
  idle:      "var(--kite-border)",
  running:   "var(--kite-primary)",
  thinking:  "var(--kite-primary)",
  acting:    "var(--kite-primary-active)",
  completed: "var(--kite-success)",
  error:     "var(--kite-danger)",
};

/** Compute topological levels for auto-layout */
function computeLevels(nodes: AgentNode[], edges: AgentEdge[]): Map<string, number> {
  const inDeg = new Map<string, number>(nodes.map((n) => [n.id, 0]));
  const children = new Map<string, string[]>(nodes.map((n) => [n.id, []]));

  for (const e of edges ?? []) {
    inDeg.set(e.to, (inDeg.get(e.to) ?? 0) + 1);
    children.get(e.from)?.push(e.to);
  }

  const levels = new Map<string, number>();
  const queue = [...inDeg.entries()].filter(([, d]) => d === 0).map(([id]) => id);
  for (const id of queue) levels.set(id, 0);

  let head = 0;
  while (head < queue.length) {
    const id = queue[head++];
    const level = levels.get(id) ?? 0;
    for (const child of children.get(id) ?? []) {
      const next = Math.max(levels.get(child) ?? 0, level + 1);
      levels.set(child, next);
      queue.push(child);
    }
  }
  // Any remaining disconnected nodes
  for (const n of nodes) {
    if (!levels.has(n.id)) levels.set(n.id, 0);
  }
  return levels;
}

const NODE_W = 130;
const NODE_H = 80;
const H_GAP  = 60;
const V_GAP  = 48;

function autoLayout(nodes: AgentNode[], edges: AgentEdge[]): Map<string, { x: number; y: number }> {
  const levels = computeLevels(nodes, edges);
  const byLevel = new Map<number, string[]>();
  for (const [id, lv] of levels) {
    if (!byLevel.has(lv)) byLevel.set(lv, []);
    byLevel.get(lv)!.push(id);
  }

  const pos = new Map<string, { x: number; y: number }>();
  const maxCols = Math.max(...[...byLevel.values()].map((a) => a.length));

  for (const [lv, ids] of byLevel) {
    const rowWidth = ids.length * NODE_W + (ids.length - 1) * H_GAP;
    const totalWidth = maxCols * NODE_W + (maxCols - 1) * H_GAP;
    const startX = (totalWidth - rowWidth) / 2;
    ids.forEach((id, i) => {
      pos.set(id, {
        x: startX + i * (NODE_W + H_GAP),
        y: lv * (NODE_H + V_GAP),
      });
    });
  }
  return pos;
}

/** Cubic bezier SVG path between two center points */
function curvePath(x1: number, y1: number, x2: number, y2: number): string {
  const dx = Math.abs(x2 - x1) * 0.5;
  return `M ${x1} ${y1} C ${x1 + dx} ${y1}, ${x2 - dx} ${y2}, ${x2} ${y2}`;
}

// ─── Component ────────────────────────────────────────────────────────────────

export const MultiAgentDiagram = forwardRef<HTMLDivElement, MultiAgentDiagramProps>(
  function MultiAgentDiagram(
    {
      nodes,
      edges = [],
      selectedId,
      onSelectNode,
      selectedEdgeId,
      onSelectEdge,
      renderNode,
      canvasHeight,
      theme,
      style,
      ...rest
    },
    ref,
  ) {
    const contextTheme = useFlyUITheme();
    const themeStyle = buildKiteThemeStyle(mergeKiteTheme(contextTheme, theme));

    // ── Positions state (px from canvas top-left) ──
    const [positions, setPositions] = useState<Map<string, { x: number; y: number }>>(() => {
      const manual = new Map<string, { x: number; y: number }>();
      let hasAll = true;
      for (const n of nodes) {
        if (n.x !== undefined && n.y !== undefined) manual.set(n.id, { x: n.x, y: n.y });
        else hasAll = false;
      }
      return hasAll ? manual : autoLayout(nodes, edges);
    });

    // Re-run auto-layout if nodes/edges change and positions don't cover them
    useEffect(() => {
      const missing = nodes.some((n) => !positions.has(n.id));
      if (missing) {
        setPositions(autoLayout(nodes, edges));
      }
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [nodes, edges]);

    // ── SVG connector recalc ──
    // We measure each node DOM element's center relative to the canvas.
    const canvasRef = useRef<HTMLDivElement>(null);
    const nodeRefs = useRef<Map<string, HTMLDivElement>>(new Map());
    const [connectors, setConnectors] = useState<
      Array<{ key: string; x1: number; y1: number; x2: number; y2: number; edge: AgentEdge }>
    >([]);

    const recalcConnectors = useCallback(() => {
      const canvas = canvasRef.current;
      if (!canvas) return;
      const cr = canvas.getBoundingClientRect();
      const lines: typeof connectors = [];
      for (const edge of edges) {
        const fromEl = nodeRefs.current.get(edge.from);
        const toEl   = nodeRefs.current.get(edge.to);
        if (!fromEl || !toEl) continue;
        const fr = fromEl.getBoundingClientRect();
        const tr = toEl.getBoundingClientRect();
        lines.push({
          key: `${edge.from}->${edge.to}`,
          x1: fr.left - cr.left + fr.width  / 2,
          y1: fr.top  - cr.top  + fr.height / 2,
          x2: tr.left - cr.left + tr.width  / 2,
          y2: tr.top  - cr.top  + tr.height / 2,
          edge,
        });
      }
      setConnectors(lines);
    }, [edges]);

    useLayoutEffect(() => {
      recalcConnectors();
    }, [positions, recalcConnectors]);

    // ── Drag ──
    const dragging = useRef<{ id: string; ox: number; oy: number; px: number; py: number } | null>(null);

    const onNodePointerDown = useCallback(
      (e: PointerEvent<HTMLDivElement>, id: string) => {
        e.currentTarget.setPointerCapture(e.pointerId);
        const pos = positions.get(id) ?? { x: 0, y: 0 };
        dragging.current = { id, ox: e.clientX, oy: e.clientY, px: pos.x, py: pos.y };
      },
      [positions],
    );

    const onCanvasPointerMove = useCallback(
      (e: PointerEvent<HTMLDivElement>) => {
        if (!dragging.current) return;
        const { id, ox, oy, px, py } = dragging.current;
        setPositions((prev) => {
          const next = new Map(prev);
          next.set(id, { x: px + e.clientX - ox, y: py + e.clientY - oy });
          return next;
        });
      },
      [],
    );

    const onCanvasPointerUp = useCallback(() => {
      dragging.current = null;
      recalcConnectors();
    }, [recalcConnectors]);

    // ── Canvas size ──
    const maxY = Math.max(
      ...[...positions.values()].map((p) => p.y + NODE_H),
      160,
    );
    const maxX = Math.max(
      ...[...positions.values()].map((p) => p.x + NODE_W),
      300,
    );
    const svgH = canvasHeight ?? maxY + V_GAP;
    const svgW = maxX + H_GAP;

    // ── Click on canvas background to deselect ──
    const onCanvasClick = useCallback(
      (e: React.MouseEvent<HTMLDivElement>) => {
        if (e.target === canvasRef.current || (e.target as Element).classList.contains("kite-flyui-multiAgent__svg")) {
          onSelectNode?.(null);
          onSelectEdge?.(null);
        }
      },
      [onSelectNode, onSelectEdge],
    );

    return (
      <div
        ref={ref}
        className="kite-flyui-host kite-flyui-agentCard kite-flyui-multiAgent"
        style={{ ...themeStyle, ...style } as CSSProperties}
        {...rest}
      >
        <div
          ref={canvasRef}
          className="kite-flyui-multiAgent__canvas"
          style={{ height: svgH, minHeight: 160 } as CSSProperties}
          onPointerMove={onCanvasPointerMove}
          onPointerUp={onCanvasPointerUp}
          onPointerLeave={onCanvasPointerUp}
          onClick={onCanvasClick}
          role="group"
          aria-label="Agent diagram"
        >
          {/* ── SVG connector layer ── */}
          <svg
            className="kite-flyui-multiAgent__svg"
            style={{ width: svgW, height: svgH } as CSSProperties}
            aria-hidden="true"
          >
            <defs>
              <marker id="arrow" markerWidth="8" markerHeight="8" refX="6" refY="3" orient="auto">
                <path d="M0,0 L0,6 L8,3 z" className="kite-flyui-multiAgent__arrowhead" />
              </marker>
              <marker id="arrow-active" markerWidth="8" markerHeight="8" refX="6" refY="3" orient="auto">
                <path d="M0,0 L0,6 L8,3 z" className="kite-flyui-multiAgent__arrowhead kite-flyui-multiAgent__arrowhead--active" />
              </marker>
            </defs>

            {connectors.map((c) => {
              const edgeKey = `${c.edge.from}->${c.edge.to}`;
              const isSelected = selectedEdgeId === edgeKey;
              const isAnimated = c.edge.animated;
              return (
                <g
                  key={c.key}
                  className="kite-flyui-multiAgent__edgeGroup"
                  onClick={(e) => {
                    e.stopPropagation();
                    onSelectEdge?.(isSelected ? null : edgeKey);
                  }}
                >
                  {/* Wider invisible hit area */}
                  <path
                    d={curvePath(c.x1, c.y1, c.x2, c.y2)}
                    stroke="transparent"
                    strokeWidth={12}
                    fill="none"
                  />
                  <path
                    d={curvePath(c.x1, c.y1, c.x2, c.y2)}
                    className={[
                      "kite-flyui-multiAgent__connector",
                      isSelected  ? "kite-flyui-multiAgent__connector--selected"  : "",
                      isAnimated  ? "kite-flyui-multiAgent__connector--animated"  : "",
                    ].join(" ")}
                    style={c.edge.color ? { stroke: c.edge.color } : undefined}
                    fill="none"
                    markerEnd={isSelected ? "url(#arrow-active)" : "url(#arrow)"}
                  />
                  {c.edge.label && (
                    <text
                      x={(c.x1 + c.x2) / 2}
                      y={(c.y1 + c.y2) / 2 - 6}
                      className="kite-flyui-multiAgent__edgeLabel"
                      textAnchor="middle"
                    >
                      {c.edge.label}
                    </text>
                  )}
                </g>
              );
            })}
          </svg>

          {/* ── Nodes ── */}
          {nodes.map((node) => {
            const pos = positions.get(node.id) ?? { x: 0, y: 0 };
            const isSelected = selectedId === node.id;
            const accent = node.color ?? STATUS_COLOR_VAR[node.status];

            return (
              <div
                key={node.id}
                ref={(el) => {
                  if (el) nodeRefs.current.set(node.id, el);
                  else nodeRefs.current.delete(node.id);
                }}
                className={[
                  "kite-flyui-multiAgent__node",
                  isSelected ? "kite-flyui-multiAgent__node--selected" : "",
                ].join(" ")}
                style={{
                  position: "absolute",
                  left: pos.x,
                  top: pos.y,
                  ...(node.color ? {
                    borderColor: `color-mix(in srgb, ${accent} 40%, var(--kite-border))`,
                    background: `color-mix(in srgb, ${accent} 8%, var(--kite-surface))`,
                  } : {}),
                  ...(isSelected && node.color ? {
                    boxShadow: `0 0 0 3px color-mix(in srgb, ${accent} 20%, transparent), var(--kite-shadow-sm)`,
                    borderColor: accent,
                  } : {}),
                } as CSSProperties}
                onPointerDown={(e) => onNodePointerDown(e, node.id)}
                onClick={(e) => {
                  e.stopPropagation();
                  onSelectNode?.(isSelected ? null : node.id);
                }}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    e.preventDefault();
                    onSelectNode?.(isSelected ? null : node.id);
                  }
                }}
                role="button"
                tabIndex={0}
                aria-pressed={isSelected}
                aria-label={`Agent: ${node.label}, status: ${node.status}`}
              >
                {renderNode ? (
                  renderNode(node, isSelected)
                ) : (
                  <>
                    {node.icon ? (
                      <span className="kite-flyui-multiAgent__nodeIcon" aria-hidden="true">{node.icon}</span>
                    ) : (
                      <span
                        className={`kite-flyui-agentDot kite-flyui-agentDot--${node.status} kite-flyui-multiAgent__nodeDot`}
                        style={node.color ? { background: accent } : undefined}
                        aria-hidden="true"
                      />
                    )}
                    <span className="kite-flyui-multiAgent__nodeLabel">{node.label}</span>
                    {node.role && (
                      <span className="kite-flyui-multiAgent__nodeRole">{node.role}</span>
                    )}
                    <span
                      className={`kite-flyui-agentBadge kite-flyui-agentBadge--${node.status} kite-flyui-multiAgent__nodeBadge`}
                      style={node.color ? {
                        background: `color-mix(in srgb, ${accent} 14%, transparent)`,
                        color: accent,
                        borderColor: `color-mix(in srgb, ${accent} 40%, transparent)`,
                      } : undefined}
                    >
                      {node.status}
                    </span>
                  </>
                )}
              </div>
            );
          })}
        </div>
      </div>
    );
  },
);
