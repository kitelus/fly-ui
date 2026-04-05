import {
  forwardRef,
  isValidElement,
  type HTMLAttributes,
  type ImgHTMLAttributes,
  type ReactElement,
  type ReactNode,
} from "react";

import type { AgentStatusValue } from "./types";
import { Slot } from "./primitives/Slot";
import { cls } from "./primitives/cls";
import "./styles/kite-fu-agent-ui.css";

export interface AgentAvatarRootProps extends HTMLAttributes<HTMLDivElement> {
  asChild?: boolean;
  src?: string;
  alt?: string;
  fallback?: ReactNode;
  status?: AgentStatusValue;
  showStatusDot?: boolean;
  imageProps?: Omit<ImgHTMLAttributes<HTMLImageElement>, "src" | "alt">;
}

const AgentAvatarRoot = forwardRef<HTMLDivElement, AgentAvatarRootProps>(
  (
    {
      className,
      asChild,
      src,
      alt = "avatar",
      fallback,
      status,
      showStatusDot,
      imageProps,
      children,
      ...props
    },
    ref,
  ) => {
    if (asChild) {
      if (!isValidElement(children)) {
        return null;
      }

      return (
        <Slot
          ref={ref}
          className={cls("kite-fu-agent-agent-avatar-root", className)}
          {...props}
        >
          {children as ReactElement}
        </Slot>
      );
    }

    if (children !== undefined && children !== null) {
      return (
        <div
          ref={ref}
          className={cls("kite-fu-agent-agent-avatar-root", className)}
          {...props}
        >
          {children}
        </div>
      );
    }

    const shouldShowStatusDot = showStatusDot ?? status !== undefined;

    return (
      <div
        ref={ref}
        className={cls("kite-fu-agent-agent-avatar-root", className)}
        {...props}
      >
        {src ? (
          <AgentAvatarImage src={src} alt={alt} {...imageProps} />
        ) : (
          <AgentAvatarFallback>{fallback ?? "AI"}</AgentAvatarFallback>
        )}
        {shouldShowStatusDot ? (
          <AgentAvatarStatusDot status={status ?? "idle"} />
        ) : null}
      </div>
    );
  },
);

AgentAvatarRoot.displayName = "AgentAvatar.Root";

export type AgentAvatarImageProps = ImgHTMLAttributes<HTMLImageElement>;

const AgentAvatarImage = forwardRef<HTMLImageElement, AgentAvatarImageProps>(
  ({ className, ...props }, ref) => (
    <img
      ref={ref}
      className={cls("kite-fu-agent-agent-avatar-image", className)}
      {...props}
    />
  ),
);

AgentAvatarImage.displayName = "AgentAvatar.Image";

export type AgentAvatarFallbackProps = HTMLAttributes<HTMLSpanElement>;

const AgentAvatarFallback = forwardRef<
  HTMLSpanElement,
  AgentAvatarFallbackProps
>(({ className, ...props }, ref) => (
  <span
    ref={ref}
    className={cls("kite-fu-agent-agent-avatar-fallback", className)}
    {...props}
  />
));

AgentAvatarFallback.displayName = "AgentAvatar.Fallback";

export interface AgentAvatarStatusDotProps extends HTMLAttributes<HTMLSpanElement> {
  status?: AgentStatusValue;
}

const AgentAvatarStatusDot = forwardRef<
  HTMLSpanElement,
  AgentAvatarStatusDotProps
>(({ className, status = "idle", ...props }, ref) => (
  <span
    ref={ref}
    className={cls("kite-fu-agent-agent-avatar-status-dot", className)}
    data-status={status}
    {...props}
  />
));

AgentAvatarStatusDot.displayName = "AgentAvatar.StatusDot";

export const AgentAvatar = Object.assign(AgentAvatarRoot, {
  Root: AgentAvatarRoot,
  Image: AgentAvatarImage,
  Fallback: AgentAvatarFallback,
  StatusDot: AgentAvatarStatusDot,
});
