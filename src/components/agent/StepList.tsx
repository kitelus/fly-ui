import {
  createContext,
  forwardRef,
  useContext,
  type HTMLAttributes,
  type OlHTMLAttributes,
} from "react";

import { cls } from "./primitives/cls";
import "./styles/kite-fu-agent-ui.css";

export type StepStatus = "pending" | "running" | "done" | "error" | "skipped";

type Orientation = "vertical" | "horizontal";

const StepListContext = createContext<{ orientation: Orientation }>({
  orientation: "vertical",
});

export interface StepListRootProps extends OlHTMLAttributes<HTMLOListElement> {
  orientation?: Orientation;
}

const StepListRoot = forwardRef<HTMLOListElement, StepListRootProps>(
  ({ className, orientation = "vertical", ...props }, ref) => (
    <StepListContext.Provider value={{ orientation }}>
      <ol
        ref={ref}
        className={cls("kite-fu-agent-step-list-root", className)}
        data-orientation={orientation}
        {...props}
      />
    </StepListContext.Provider>
  ),
);

StepListRoot.displayName = "StepList.Root";

export interface StepListItemProps extends HTMLAttributes<HTMLLIElement> {
  status?: StepStatus;
  isLast?: boolean;
}

const StepListItem = forwardRef<HTMLLIElement, StepListItemProps>(
  ({ className, status = "pending", isLast = false, ...props }, ref) => {
    const { orientation } = useContext(StepListContext);

    return (
      <li
        ref={ref}
        className={cls("kite-fu-agent-step-list-item", className)}
        data-status={status}
        data-last={isLast ? "true" : "false"}
        data-orientation={orientation}
        {...props}
      />
    );
  },
);

StepListItem.displayName = "StepList.Item";

export type StepListIconProps = HTMLAttributes<HTMLDivElement>;

const StepListIcon = forwardRef<HTMLDivElement, StepListIconProps>(
  ({ className, ...props }, ref) => (
    <div
      ref={ref}
      className={cls("kite-fu-agent-step-list-icon", className)}
      {...props}
    />
  ),
);

StepListIcon.displayName = "StepList.Icon";

export type StepListLabelProps = HTMLAttributes<HTMLDivElement>;

const StepListLabel = forwardRef<HTMLDivElement, StepListLabelProps>(
  ({ className, ...props }, ref) => (
    <div
      ref={ref}
      className={cls("kite-fu-agent-step-list-label", className)}
      {...props}
    />
  ),
);

StepListLabel.displayName = "StepList.Label";

export type StepListMetaProps = HTMLAttributes<HTMLDivElement>;

const StepListMeta = forwardRef<HTMLDivElement, StepListMetaProps>(
  ({ className, ...props }, ref) => (
    <div
      ref={ref}
      className={cls("kite-fu-agent-step-list-meta", className)}
      {...props}
    />
  ),
);

StepListMeta.displayName = "StepList.Meta";

export type StepListConnectorProps = HTMLAttributes<HTMLDivElement>;

const StepListConnector = forwardRef<HTMLDivElement, StepListConnectorProps>(
  ({ className, ...props }, ref) => (
    <div
      ref={ref}
      className={cls("kite-fu-agent-step-list-connector", className)}
      {...props}
    />
  ),
);

StepListConnector.displayName = "StepList.Connector";

export const StepList = Object.assign(StepListRoot, {
  Root: StepListRoot,
  Item: StepListItem,
  Icon: StepListIcon,
  Label: StepListLabel,
  Meta: StepListMeta,
  Connector: StepListConnector,
});
