import {
  createContext,
  forwardRef,
  useContext,
  useState,
  type ButtonHTMLAttributes,
  type HTMLAttributes,
  type ReactNode,
} from "react";

import type { ArtifactType } from "./types";
import { cls } from "./primitives/cls";
import "./styles/kite-fu-agent-ui.css";

interface ArtifactContextValue {
  open: boolean;
  setOpen: (open: boolean) => void;
  copied: boolean;
  setCopied: (copied: boolean) => void;
  valueForCopy: string;
}

const ArtifactContext = createContext<ArtifactContextValue | null>(null);

function useArtifactContext() {
  const value = useContext(ArtifactContext);
  if (!value) {
    throw new Error("Artifact components must be used inside Artifact.Root");
  }
  return value;
}

function toText(value: unknown): string {
  if (typeof value === "string") {
    return value;
  }
  if (value === undefined || value === null) {
    return "";
  }
  try {
    return JSON.stringify(value, null, 2);
  } catch {
    return String(value);
  }
}

export interface ArtifactRootProps extends HTMLAttributes<HTMLDivElement> {
  type?: ArtifactType;
  defaultOpen?: boolean;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  valueForCopy?: string;
}

const ArtifactRoot = forwardRef<HTMLDivElement, ArtifactRootProps>(
  (
    {
      className,
      type = "code",
      defaultOpen = true,
      open,
      onOpenChange,
      valueForCopy = "",
      children,
      ...props
    },
    ref,
  ) => {
    const [internalOpen, setInternalOpen] = useState(defaultOpen);
    const [copied, setCopied] = useState(false);
    const isControlled = open !== undefined;
    const resolvedOpen = isControlled ? open : internalOpen;

    const setOpen = (nextOpen: boolean) => {
      if (!isControlled) {
        setInternalOpen(nextOpen);
      }
      onOpenChange?.(nextOpen);
    };

    const contextValue = {
      open: resolvedOpen,
      setOpen,
      copied,
      setCopied,
      valueForCopy,
    };

    return (
      <ArtifactContext.Provider value={contextValue}>
        <div
          ref={ref}
          className={cls("kite-fu-agent-artifact-root", className)}
          data-type={type}
          data-state={resolvedOpen ? "open" : "closed"}
          {...props}
        >
          {children}
        </div>
      </ArtifactContext.Provider>
    );
  },
);

ArtifactRoot.displayName = "Artifact.Root";

export type ArtifactHeaderProps = HTMLAttributes<HTMLDivElement>;

const ArtifactHeader = forwardRef<HTMLDivElement, ArtifactHeaderProps>(
  ({ className, onClick, ...props }, ref) => {
    const { open, setOpen } = useArtifactContext();

    return (
      <div
        ref={ref}
        className={cls("kite-fu-agent-artifact-header", className)}
        onClick={(event) => {
          onClick?.(event);
          if (!event.defaultPrevented) {
            setOpen(!open);
          }
        }}
        {...props}
      />
    );
  },
);

ArtifactHeader.displayName = "Artifact.Header";

export type ArtifactTitleProps = HTMLAttributes<HTMLSpanElement>;

const ArtifactTitle = forwardRef<HTMLSpanElement, ArtifactTitleProps>(
  ({ className, ...props }, ref) => (
    <span
      ref={ref}
      className={cls("kite-fu-agent-artifact-title", className)}
      {...props}
    />
  ),
);

ArtifactTitle.displayName = "Artifact.Title";

export type ArtifactLanguageProps = HTMLAttributes<HTMLSpanElement>;

const ArtifactLanguage = forwardRef<HTMLSpanElement, ArtifactLanguageProps>(
  ({ className, ...props }, ref) => (
    <span
      ref={ref}
      className={cls("kite-fu-agent-artifact-language", className)}
      {...props}
    />
  ),
);

ArtifactLanguage.displayName = "Artifact.Language";

export type ArtifactActionsProps = HTMLAttributes<HTMLDivElement>;

const ArtifactActions = forwardRef<HTMLDivElement, ArtifactActionsProps>(
  ({ className, ...props }, ref) => (
    <div
      ref={ref}
      className={cls("kite-fu-agent-artifact-actions", className)}
      {...props}
    />
  ),
);

ArtifactActions.displayName = "Artifact.Actions";

export interface ArtifactContentProps extends HTMLAttributes<HTMLPreElement> {
  value?: string;
  children?: ReactNode;
}

const ArtifactContent = forwardRef<HTMLPreElement, ArtifactContentProps>(
  ({ className, value, children, ...props }, ref) => {
    const { open } = useArtifactContext();
    if (!open) {
      return null;
    }

    const text = value ?? (typeof children === "string" ? children : undefined);

    return (
      <pre
        ref={ref}
        className={cls("kite-fu-agent-artifact-content", className)}
        {...props}
      >
        {text ?? children}
      </pre>
    );
  },
);

ArtifactContent.displayName = "Artifact.Content";

export interface ArtifactCopyTriggerProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  copiedDuration?: number;
  value?: string;
  onCopyValue?: (value: string) => void;
}

const ArtifactCopyTrigger = forwardRef<
  HTMLButtonElement,
  ArtifactCopyTriggerProps
>(
  (
    {
      className,
      copiedDuration = 2000,
      value,
      onCopyValue,
      onClick,
      children = "Copy",
      ...props
    },
    ref,
  ) => {
    const { copied, setCopied, valueForCopy } = useArtifactContext();

    return (
      <button
        ref={ref}
        type="button"
        className={cls("kite-fu-agent-artifact-copy-trigger", className)}
        data-copied={copied ? "true" : "false"}
        onClick={async (event) => {
          onClick?.(event);
          if (event.defaultPrevented) {
            return;
          }

          const text = toText(value ?? valueForCopy);
          try {
            await navigator.clipboard.writeText(text);
            onCopyValue?.(text);
            setCopied(true);
            window.setTimeout(() => setCopied(false), copiedDuration);
          } catch {
            setCopied(false);
          }
        }}
        {...props}
      >
        {children}
      </button>
    );
  },
);

ArtifactCopyTrigger.displayName = "Artifact.CopyTrigger";

export const Artifact = Object.assign(ArtifactRoot, {
  Root: ArtifactRoot,
  Header: ArtifactHeader,
  Title: ArtifactTitle,
  Language: ArtifactLanguage,
  Actions: ArtifactActions,
  Content: ArtifactContent,
  CopyTrigger: ArtifactCopyTrigger,
});
