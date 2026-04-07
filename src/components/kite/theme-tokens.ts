// ─── Token interfaces ─────────────────────────────────────────────────────────

/**
 * Core colour and typography tokens shared by all FlyUI components.
 *
 * Inspired by the token hierarchies of Ant Design, MUI and Radix:
 * - `primary*`    — brand/accent colour scale
 * - `foreground*` — text colour scale
 * - `background*` — surface colour scale
 * - `border*`     — border colour and radius
 * - `success/warning/danger` — semantic status colours
 * - `fontFamily`  — typeface
 * - `shadow*`     — elevation
 */
export interface KiteBaseTokens {
  // ── Primary (brand / accent) ─────────────────────────────────────────────
  /** Main accent colour — kite icon, dots, active highlights. */
  primary?: string;
  /** Hover state of the primary colour (slightly lighter/darker). */
  primaryHover?: string;
  /** Active / pressed state of the primary colour. */
  primaryActive?: string;
  /** Very light tint of primary used for backgrounds (e.g. selected row). */
  primarySubtle?: string;

  // ── Text ─────────────────────────────────────────────────────────────────
  /** Primary text colour. */
  foreground?: string;
  /** Secondary / subdued text and decorative elements. */
  muted?: string;
  /** Disabled text colour. */
  disabled?: string;

  // ── Background ───────────────────────────────────────────────────────────
  /** Default page / component background. */
  background?: string;
  /** Slightly elevated surface (cards, panels). */
  surface?: string;

  // ── Border ───────────────────────────────────────────────────────────────
  /** Default border colour. */
  border?: string;
  /** Border radius applied to components, e.g. `"8px"` or `"0.5rem"`. */
  radius?: string;

  // ── Semantic status ───────────────────────────────────────────────────────
  /** Success / positive state colour. */
  success?: string;
  /** Warning state colour. */
  warning?: string;
  /** Danger / error / destructive state colour. */
  danger?: string;

  // ── Typography ────────────────────────────────────────────────────────────
  /** Font family stack, e.g. `'"Inter Variable", Inter, sans-serif'`. */
  fontFamily?: string;

  // ── Elevation ────────────────────────────────────────────────────────────
  /** Box-shadow for low-elevation surfaces (e.g. dropdowns). */
  shadowSm?: string;
  /** Box-shadow for medium-elevation surfaces (e.g. modals). */
  shadowMd?: string;
}

/**
 * Overlay-specific tokens — consumed only by `KitePageLoader` in overlay mode.
 */
export interface KiteOverlayTokens {
  /** Background of the overlay panel (supports rgba for transparency). */
  overlayBackground?: string;
  /** CSS backdrop-filter blur amount, e.g. `"4px"`. */
  overlayBlur?: string;
}

/**
 * Full FlyUI theme shape. All fields are optional — pass only the tokens you
 * want to override; everything else falls back to the built-in CSS defaults.
 */
export interface KiteTheme extends KiteBaseTokens, KiteOverlayTokens {}

// ─── Built-in presets ─────────────────────────────────────────────────────────

/**
 * Default light-mode values. These mirror the CSS fallbacks declared in
 * `.kite-flyui-host` and are the single source of truth for defaults.
 */
export const lightTheme: Required<KiteTheme> = {
  // Primary
  primary: "#0ea5e9",
  primaryHover: "#38bdf8",
  primaryActive: "#0284c7",
  primarySubtle: "#e0f2fe",
  // Text
  foreground: "#0f172a",
  muted: "#64748b",
  disabled: "#cbd5e1",
  // Background
  background: "#ffffff",
  surface: "#f8fafc",
  // Border
  border: "#e2e8f0",
  radius: "8px",
  // Semantic
  success: "#22c55e",
  warning: "#f59e0b",
  danger: "#ef4444",
  // Typography
  fontFamily: '"Inter Variable", Inter, ui-sans-serif, system-ui, sans-serif',
  // Elevation
  shadowSm: "0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1)",
  shadowMd: "0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)",
  // Overlay
  overlayBackground: "rgba(255, 255, 255, 0.82)",
  overlayBlur: "2px",
};

/**
 * Default dark-mode values. Applied automatically via
 * `@media (prefers-color-scheme: dark)` in CSS. Export allows apps that manage
 * their own colour-scheme toggle to apply dark tokens explicitly.
 */
export const darkTheme: Required<KiteTheme> = {
  // Primary
  primary: "#38bdf8",
  primaryHover: "#7dd3fc",
  primaryActive: "#0ea5e9",
  primarySubtle: "#0c4a6e",
  // Text
  foreground: "#f1f5f9",
  muted: "#94a3b8",
  disabled: "#475569",
  // Background
  background: "#0f172a",
  surface: "#1e293b",
  // Border
  border: "#334155",
  radius: "8px",
  // Semantic
  success: "#4ade80",
  warning: "#fbbf24",
  danger: "#f87171",
  // Typography
  fontFamily: '"Inter Variable", Inter, ui-sans-serif, system-ui, sans-serif',
  // Elevation
  shadowSm: "0 1px 3px 0 rgb(0 0 0 / 0.4), 0 1px 2px -1px rgb(0 0 0 / 0.4)",
  shadowMd: "0 4px 6px -1px rgb(0 0 0 / 0.4), 0 2px 4px -2px rgb(0 0 0 / 0.4)",
  // Overlay
  overlayBackground: "rgba(15, 23, 42, 0.88)",
  overlayBlur: "4px",
};

// ─── createTheme utility ──────────────────────────────────────────────────────

/**
 * Merge partial token overrides on top of the light-mode defaults.
 * Returns a complete `Required<KiteTheme>` with every token filled in.
 *
 * @example
 * const brandTheme = createTheme({ primary: "#16a34a", muted: "#4ade80" });
 *
 * // Extend the dark preset:
 * const darkBrand = createTheme({ ...darkTheme, primary: "#facc15" });
 */
export function createTheme(overrides?: KiteTheme): Required<KiteTheme> {
  return { ...lightTheme, ...overrides };
}

// ─── Internal utilities ───────────────────────────────────────────────────────

/**
 * Merge global (provider) theme with a component-level override.
 * Component fields win; `undefined` fields fall back to the global theme.
 * Returns `undefined` when both inputs are absent.
 */
export function mergeKiteTheme(
  globalTheme?: KiteTheme,
  componentTheme?: KiteTheme,
): KiteTheme | undefined {
  if (!globalTheme && !componentTheme) return undefined;
  return { ...globalTheme, ...componentTheme };
}

/** CSS variable name mapping for every KiteTheme token. */
const TOKEN_VAR_MAP: Record<keyof KiteTheme, string> = {
  primary: "--kite-primary",
  primaryHover: "--kite-primary-hover",
  primaryActive: "--kite-primary-active",
  primarySubtle: "--kite-primary-subtle",
  foreground: "--kite-foreground",
  muted: "--kite-muted",
  disabled: "--kite-disabled",
  background: "--kite-background",
  surface: "--kite-surface",
  border: "--kite-border",
  radius: "--kite-radius",
  success: "--kite-success",
  warning: "--kite-warning",
  danger: "--kite-danger",
  fontFamily: "--kite-font-family",
  shadowSm: "--kite-shadow-sm",
  shadowMd: "--kite-shadow-md",
  overlayBackground: "--kite-overlay-background",
  overlayBlur: "--kite-overlay-blur",
};

/**
 * Convert a `KiteTheme` into a plain CSS-variable record suitable for
 * spreading into a `style` prop.
 *
 * Only tokens that are explicitly set (not `undefined`) are emitted so that
 * CSS defaults in `.kite-flyui-host` remain as fallback, preserving automatic
 * dark-mode behaviour.
 */
export function buildKiteThemeStyle(theme?: KiteTheme): Record<string, string> {
  if (!theme) return {};

  const vars: Record<string, string> = {};
  for (const key of Object.keys(TOKEN_VAR_MAP) as Array<keyof KiteTheme>) {
    const value = theme[key];
    if (value !== undefined) {
      vars[TOKEN_VAR_MAP[key]] = value;
    }
  }
  return vars;
}
