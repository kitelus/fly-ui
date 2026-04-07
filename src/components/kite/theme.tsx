import {
  createContext,
  type CSSProperties,
  type ReactNode,
  useContext,
} from "react";

import {
  type KiteTheme,
  buildKiteThemeStyle,
} from "./theme-tokens";

 
export type { KiteBaseTokens, KiteOverlayTokens, KiteTheme } from "./theme-tokens";
// eslint-disable-next-line react-refresh/only-export-components -- same reason as above
export { buildKiteThemeStyle, mergeKiteTheme, createTheme, lightTheme, darkTheme } from "./theme-tokens";

// ─── Context & provider ───────────────────────────────────────────────────────

interface FlyUIThemeProviderProps {
  /** Partial theme tokens to apply to all FlyUI components in the subtree. */
  theme?: KiteTheme;
  children: ReactNode;
}

const FlyUIThemeContext = createContext<KiteTheme | undefined>(undefined);
FlyUIThemeContext.displayName = "FlyUIThemeContext";

/**
 * Provides a theme to all FlyUI components in the subtree via React context.
 * Also injects CSS custom properties onto a wrapper `<div>` so that any CSS
 * in the subtree can consume `var(--kite-primary)` etc. directly without
 * needing a FlyUI component as the host.
 *
 * @example
 * <FlyUIThemeProvider theme={{ primary: "#16a34a" }}>
 *   <App />
 * </FlyUIThemeProvider>
 */
export function FlyUIThemeProvider({ theme, children }: FlyUIThemeProviderProps) {
  const vars = buildKiteThemeStyle(theme);
  const hasVars = Object.keys(vars).length > 0;

  return (
    <FlyUIThemeContext.Provider value={theme}>
      {hasVars ? (
        <div data-flyui-theme="" style={vars as CSSProperties}>
          {children}
        </div>
      ) : (
        children
      )}
    </FlyUIThemeContext.Provider>
  );
}

// ─── Hook ─────────────────────────────────────────────────────────────────────

/**
 * Read the nearest `FlyUIThemeProvider` theme from any component.
 * Returns `undefined` when no provider is present.
 */
// eslint-disable-next-line react-refresh/only-export-components -- hook is intentionally co-located with its provider
export function useFlyUITheme(): KiteTheme | undefined {
  return useContext(FlyUIThemeContext);
}
