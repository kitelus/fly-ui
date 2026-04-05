import {
  createContext,
  forwardRef,
  useContext,
  useId,
  useState,
  type ButtonHTMLAttributes,
  type HTMLAttributes,
} from "react";

import { cls } from "./primitives/cls";
import "./styles/kite-fu-agent-ui.css";

interface ContextPanelContextValue {
  open: boolean;
  setOpen: (open: boolean) => void;
  contentId: string;
}

const ContextPanelContext = createContext<ContextPanelContextValue | null>(
  null,
);

function useContextPanel() {
  const value = useContext(ContextPanelContext);
  if (!value) {
    throw new Error(
      "ContextPanel components must be used inside ContextPanel.Root",
    );
  }
  return value;
}

export interface ContextPanelRootProps extends HTMLAttributes<HTMLDivElement> {
  defaultOpen?: boolean;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
}

const ContextPanelRoot = forwardRef<HTMLDivElement, ContextPanelRootProps>(
  (
    { className, defaultOpen = false, open, onOpenChange, children, ...props },
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

    const value = { open: resolvedOpen, setOpen, contentId };

    return (
      <ContextPanelContext.Provider value={value}>
        <div
          ref={ref}
          className={cls("kite-fu-agent-context-panel-root", className)}
          data-state={resolvedOpen ? "open" : "closed"}
          {...props}
        >
          {children}
        </div>
      </ContextPanelContext.Provider>
    );
  },
);

ContextPanelRoot.displayName = "ContextPanel.Root";

export type ContextPanelTriggerProps = ButtonHTMLAttributes<HTMLButtonElement>;

const ContextPanelTrigger = forwardRef<
  HTMLButtonElement,
  ContextPanelTriggerProps
>(({ className, onClick, ...props }, ref) => {
  const { open, setOpen, contentId } = useContextPanel();

  return (
    <button
      ref={ref}
      type="button"
      className={cls("kite-fu-agent-context-panel-trigger", className)}
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
});

ContextPanelTrigger.displayName = "ContextPanel.Trigger";

export interface ContextPanelContentProps extends HTMLAttributes<HTMLDivElement> {
  forceMount?: boolean;
}

const ContextPanelContent = forwardRef<
  HTMLDivElement,
  ContextPanelContentProps
>(({ className, forceMount = false, children, ...props }, ref) => {
  const { open, contentId } = useContextPanel();

  if (!open && !forceMount) {
    return null;
  }

  return (
    <div
      ref={ref}
      id={contentId}
      className={cls("kite-fu-agent-context-panel-content", className)}
      {...props}
    >
      {children}
    </div>
  );
});

ContextPanelContent.displayName = "ContextPanel.Content";

export type ContextPanelSectionProps = HTMLAttributes<HTMLDivElement>;

const ContextPanelSection = forwardRef<
  HTMLDivElement,
  ContextPanelSectionProps
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cls("kite-fu-agent-context-panel-section", className)}
    {...props}
  />
));

ContextPanelSection.displayName = "ContextPanel.Section";

export type ContextPanelItemProps = HTMLAttributes<HTMLDivElement>;

const ContextPanelItem = forwardRef<HTMLDivElement, ContextPanelItemProps>(
  ({ className, ...props }, ref) => (
    <div
      ref={ref}
      className={cls("kite-fu-agent-context-panel-item", className)}
      {...props}
    />
  ),
);

ContextPanelItem.displayName = "ContextPanel.Item";

export const ContextPanel = Object.assign(ContextPanelRoot, {
  Root: ContextPanelRoot,
  Trigger: ContextPanelTrigger,
  Content: ContextPanelContent,
  Section: ContextPanelSection,
  Item: ContextPanelItem,
});
