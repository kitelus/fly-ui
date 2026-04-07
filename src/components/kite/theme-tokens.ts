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
  // Primary — violet/indigo
  primary: "#6366f1",
  primaryHover: "#4f46e5",
  primaryActive: "#4338ca",
  primarySubtle: "#eef2ff",
  // Text — zinc
  foreground: "#18181b",
  muted: "#71717a",
  disabled: "#d4d4d8",
  // Background
  background: "#ffffff",
  surface: "#fafafa",
  // Border
  border: "#e4e4e7",
  radius: "8px",
  // Semantic
  success: "#16a34a",
  warning: "#d97706",
  danger: "#dc2626",
  // Typography
  fontFamily: '"Inter Variable", Inter, ui-sans-serif, system-ui, sans-serif',
  // Elevation
  shadowSm: "0 1px 3px 0 rgb(0 0 0 / 0.08), 0 1px 2px -1px rgb(0 0 0 / 0.06)",
  shadowMd: "0 4px 8px -2px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.06)",
  // Overlay
  overlayBackground: "rgba(255, 255, 255, 0.85)",
  overlayBlur: "4px",
};

/**
 * Default dark-mode values. Applied automatically via
 * `@media (prefers-color-scheme: dark)` in CSS. Export allows apps that manage
 * their own colour-scheme toggle to apply dark tokens explicitly.
 */
export const darkTheme: Required<KiteTheme> = {
  // Primary — lighter indigo for dark bg contrast
  primary: "#818cf8",
  primaryHover: "#a5b4fc",
  primaryActive: "#6366f1",
  primarySubtle: "#1e1b4b",
  // Text — zinc
  foreground: "#fafafa",
  muted: "#a1a1aa",
  disabled: "#52525b",
  // Background — near-black zinc
  background: "#09090b",
  surface: "#18181b",
  // Border
  border: "#27272a",
  radius: "8px",
  // Semantic
  success: "#4ade80",
  warning: "#fbbf24",
  danger: "#f87171",
  // Typography
  fontFamily: '"Inter Variable", Inter, ui-sans-serif, system-ui, sans-serif',
  // Elevation
  shadowSm: "0 1px 3px 0 rgb(0 0 0 / 0.5), 0 1px 2px -1px rgb(0 0 0 / 0.4)",
  shadowMd: "0 4px 8px -2px rgb(0 0 0 / 0.5), 0 2px 4px -2px rgb(0 0 0 / 0.4)",
  // Overlay
  overlayBackground: "rgba(9, 9, 11, 0.90)",
  overlayBlur: "6px",
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
