import {
  createContext,
  forwardRef,
  useContext,
  useEffect,
  useId,
  useState,
  type ButtonHTMLAttributes,
  type HTMLAttributes,
} from "react";

import { cls } from "./primitives/cls";
import "./styles/kite-fu-agent-ui.css";

interface ReasoningContextValue {
  open: boolean;
  setOpen: (open: boolean) => void;
  contentId: string;
}

const ReasoningContext = createContext<ReasoningContextValue | null>(null);

function useReasoningContext() {
  const value = useContext(ReasoningContext);
  if (!value) {
    throw new Error("Reasoning components must be used inside Reasoning.Root");
  }
  return value;
}

export interface ReasoningRootProps extends HTMLAttributes<HTMLDivElement> {
  defaultOpen?: boolean;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  isStreaming?: boolean;
}

const ReasoningRoot = forwardRef<HTMLDivElement, ReasoningRootProps>(
  (
    {
      className,
      defaultOpen = false,
      open,
      onOpenChange,
      isStreaming = false,
      children,
      ...props
    },
    ref,
  ) => {
    const [internalOpen, setInternalOpen] = useState(defaultOpen);
    const isControlled = open !== undefined;
    const resolvedOpen = isControlled ? open : internalOpen;
    const contentId = useId();

    const setOpen = (nextOpen: boolean) => {
      if (!isControlled) {
        setInternalOpen(nextOpen);
      }
      onOpenChange?.(nextOpen);
    };

    useEffect(() => {
      if (isStreaming) {
        setOpen(true);
      }
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [isStreaming]);

    const value = { open: resolvedOpen, setOpen, contentId };

    return (
      <ReasoningContext.Provider value={value}>
        <div
          ref={ref}
          className={cls("kite-fu-agent-reasoning-root", className)}
          data-state={resolvedOpen ? "open" : "closed"}
          data-streaming={isStreaming ? "true" : "false"}
          {...props}
        >
          {children}
        </div>
      </ReasoningContext.Provider>
    );
  },
);

ReasoningRoot.displayName = "Reasoning.Root";

export type ReasoningTriggerProps = ButtonHTMLAttributes<HTMLButtonElement>;

const ReasoningTrigger = forwardRef<HTMLButtonElement, ReasoningTriggerProps>(
  ({ className, onClick, ...props }, ref) => {
    const { open, setOpen, contentId } = useReasoningContext();

    return (
      <button
        ref={ref}
        type="button"
        className={cls("kite-fu-agent-reasoning-trigger", className)}
        aria-expanded={open}
        aria-controls={contentId}
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

ReasoningTrigger.displayName = "Reasoning.Trigger";

export interface ReasoningContentProps extends HTMLAttributes<HTMLDivElement> {
  forceMount?: boolean;
}

const ReasoningContent = forwardRef<HTMLDivElement, ReasoningContentProps>(
  ({ className, forceMount = false, children, ...props }, ref) => {
    const { open, contentId } = useReasoningContext();

    if (!open && !forceMount) {
      return null;
    }

    return (
      <div className="kite-fu-agent-reasoning-content-wrapper">
        <div
          ref={ref}
          id={contentId}
          className={cls("kite-fu-agent-reasoning-content", className)}
          {...props}
        >
          {children}
        </div>
      </div>
    );
  },
);

ReasoningContent.displayName = "Reasoning.Content";

export interface ReasoningSummaryProps extends HTMLAttributes<HTMLDivElement> {
  duration?: number;
}

const ReasoningSummary = forwardRef<HTMLDivElement, ReasoningSummaryProps>(
  ({ className, duration, children, ...props }, ref) => {
    const defaultText =
      duration === undefined
        ? "Thought process"
        : `Thought for ${(duration / 1000).toFixed(1)}s`;

    return (
      <div
        ref={ref}
        className={cls("kite-fu-agent-reasoning-summary", className)}
        {...props}
      >
        {children ?? defaultText}
      </div>
    );
  },
);

ReasoningSummary.displayName = "Reasoning.Summary";

export const Reasoning = Object.assign(ReasoningRoot, {
  Root: ReasoningRoot,
  Trigger: ReasoningTrigger,
  Content: ReasoningContent,
  Summary: ReasoningSummary,
});
