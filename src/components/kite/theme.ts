import {
  createElement,
  createContext,
  type CSSProperties,
  type ReactNode,
  useContext,
} from "react";

export interface KiteTheme {
  primary?: string;
  foreground?: string;
  muted?: string;
  overlayBackground?: string;
  overlayBlur?: string;
}

interface FlyUIThemeProviderProps {
  theme?: KiteTheme;
  children: ReactNode;
}

const FlyUIThemeContext = createContext<KiteTheme | undefined>(undefined);

export function FlyUIThemeProvider({
  theme,
  children,
}: FlyUIThemeProviderProps) {
  return createElement(FlyUIThemeContext.Provider, { value: theme }, children);
}

export function useFlyUITheme() {
  return useContext(FlyUIThemeContext);
}

export function mergeKiteTheme(
  globalTheme?: KiteTheme,
  componentTheme?: KiteTheme,
) {
  return { ...globalTheme, ...componentTheme };
}

export function buildKiteThemeStyle(theme?: KiteTheme): CSSProperties {
  if (!theme) {
    return {};
  }

  return {
    ...(theme.primary ? { ["--kite-primary" as string]: theme.primary } : {}),
    ...(theme.foreground
      ? { ["--kite-foreground" as string]: theme.foreground }
      : {}),
    ...(theme.muted ? { ["--kite-muted" as string]: theme.muted } : {}),
    ...(theme.overlayBackground
      ? { ["--kite-overlay-background" as string]: theme.overlayBackground }
      : {}),
    ...(theme.overlayBlur
      ? { ["--kite-overlay-blur" as string]: theme.overlayBlur }
      : {}),
  } as CSSProperties;
}
