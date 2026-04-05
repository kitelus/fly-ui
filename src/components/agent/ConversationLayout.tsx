import {
  createContext,
  forwardRef,
  useContext,
  useMemo,
  type HTMLAttributes,
  type ReactNode,
} from "react";

import { cls } from "./primitives/cls";
import "./styles/kite-fu-agent-ui.css";

interface ConversationLayoutContextValue {
  open: boolean;
}

const ConversationLayoutContext = createContext<ConversationLayoutContextValue>(
  {
    open: true,
  },
);

export interface ConversationLayoutRootProps extends HTMLAttributes<HTMLDivElement> {
  sidebarOpen?: boolean;
  defaultSidebarOpen?: boolean;
  onSidebarChange?: (open: boolean) => void;
  sidebar?: ReactNode;
  header?: ReactNode;
  main?: ReactNode;
  footer?: ReactNode;
}

const ConversationLayoutRoot = forwardRef<
  HTMLDivElement,
  ConversationLayoutRootProps
>(
  (
    {
      className,
      sidebarOpen,
      defaultSidebarOpen = true,
      sidebar,
      header,
      main,
      footer,
      children,
      ...props
    },
    ref,
  ) => {
    const isControlled = sidebarOpen !== undefined;
    const open = isControlled ? sidebarOpen : defaultSidebarOpen;

    const value = useMemo(() => ({ open }), [open]);

    return (
      <ConversationLayoutContext.Provider value={value}>
        <div
          ref={ref}
          className={cls("kite-fu-agent-conversation-layout-root", className)}
          data-sidebar={open ? "open" : "closed"}
          {...props}
        >
          {children === undefined || children === null ? (
            <>
              {sidebar !== undefined ? (
                <ConversationLayoutSidebar>{sidebar}</ConversationLayoutSidebar>
              ) : null}
              <ConversationLayoutMain>
                {header !== undefined ? (
                  <ConversationLayoutHeader>{header}</ConversationLayoutHeader>
                ) : null}
                {main}
                {footer !== undefined ? (
                  <ConversationLayoutFooter>{footer}</ConversationLayoutFooter>
                ) : null}
              </ConversationLayoutMain>
            </>
          ) : (
            children
          )}
        </div>
      </ConversationLayoutContext.Provider>
    );
  },
);

ConversationLayoutRoot.displayName = "ConversationLayout.Root";

export type ConversationLayoutSidebarProps = HTMLAttributes<HTMLDivElement>;

const ConversationLayoutSidebar = forwardRef<
  HTMLDivElement,
  ConversationLayoutSidebarProps
>(({ className, ...props }, ref) => {
  const { open } = useContext(ConversationLayoutContext);
  return (
    <div
      ref={ref}
      className={cls("kite-fu-agent-conversation-layout-sidebar", className)}
      data-open={open ? "true" : "false"}
      {...props}
    />
  );
});

ConversationLayoutSidebar.displayName = "ConversationLayout.Sidebar";

export type ConversationLayoutMainProps = HTMLAttributes<HTMLDivElement>;

const ConversationLayoutMain = forwardRef<
  HTMLDivElement,
  ConversationLayoutMainProps
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cls("kite-fu-agent-conversation-layout-main", className)}
    {...props}
  />
));

ConversationLayoutMain.displayName = "ConversationLayout.Main";

export type ConversationLayoutHeaderProps = HTMLAttributes<HTMLDivElement>;

const ConversationLayoutHeader = forwardRef<
  HTMLDivElement,
  ConversationLayoutHeaderProps
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cls("kite-fu-agent-conversation-layout-header", className)}
    {...props}
  />
));

ConversationLayoutHeader.displayName = "ConversationLayout.Header";

export type ConversationLayoutFooterProps = HTMLAttributes<HTMLDivElement>;

const ConversationLayoutFooter = forwardRef<
  HTMLDivElement,
  ConversationLayoutFooterProps
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cls("kite-fu-agent-conversation-layout-footer", className)}
    {...props}
  />
));

ConversationLayoutFooter.displayName = "ConversationLayout.Footer";

export const ConversationLayout = Object.assign(ConversationLayoutRoot, {
  Root: ConversationLayoutRoot,
  Sidebar: ConversationLayoutSidebar,
  Main: ConversationLayoutMain,
  Header: ConversationLayoutHeader,
  Footer: ConversationLayoutFooter,
});
