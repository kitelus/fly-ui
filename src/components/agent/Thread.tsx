import {
  forwardRef,
  useEffect,
  useRef,
  type HTMLAttributes,
  type ReactNode,
  type Ref,
  type UIEvent,
} from "react";

import { Slot } from "./primitives/Slot";
import { cls } from "./primitives/cls";
import "./styles/kite-fu-agent-ui.css";

function composeRefs<T>(...refs: Array<Ref<T> | undefined>) {
  return (node: T) => {
    refs.forEach((ref) => {
      if (!ref) {
        return;
      }
      if (typeof ref === "function") {
        ref(node);
        return;
      }
      (ref as { current: T | null }).current = node;
    });
  };
}

export interface ThreadRootProps extends HTMLAttributes<HTMLDivElement> {
  asChild?: boolean;
  autoScroll?: boolean;
  scrollBehavior?: "smooth" | "instant";
  onScrolledToTop?: () => void;
}

const ThreadRoot = forwardRef<HTMLDivElement, ThreadRootProps>(
  (
    {
      asChild,
      className,
      autoScroll = true,
      scrollBehavior = "smooth",
      onScrolledToTop,
      children,
      onScroll,
      ...props
    },
    forwardedRef,
  ) => {
    const localRef = useRef<HTMLDivElement | null>(null);

    useEffect(() => {
      const node = localRef.current;
      if (!node || !autoScroll) {
        return;
      }
      node.scrollTo({
        top: node.scrollHeight,
        behavior: scrollBehavior,
      });
    }, [children, autoScroll, scrollBehavior]);

    const handleScroll = (event: UIEvent<HTMLDivElement>) => {
      onScroll?.(event);
      if (event.currentTarget.scrollTop <= 0) {
        onScrolledToTop?.();
      }
    };

    if (asChild) {
      return (
        <Slot
          ref={composeRefs(localRef, forwardedRef) as never}
          className={cls("kite-fu-agent-thread-root", className)}
          onScroll={handleScroll as never}
          {...props}
        >
          {children as never}
        </Slot>
      );
    }

    return (
      <div
        ref={composeRefs(localRef, forwardedRef)}
        className={cls("kite-fu-agent-thread-root", className)}
        onScroll={handleScroll}
        {...props}
      >
        {children}
      </div>
    );
  },
);

ThreadRoot.displayName = "Thread.Root";

export interface ThreadListProps extends HTMLAttributes<HTMLUListElement> {
  asChild?: boolean;
}

const ThreadList = forwardRef<HTMLUListElement, ThreadListProps>(
  ({ asChild, className, children, ...props }, forwardedRef) => {
    if (asChild) {
      return (
        <Slot
          ref={forwardedRef as Ref<HTMLElement>}
          className={cls("kite-fu-agent-thread-list", className)}
          {...props}
        >
          {children as never}
        </Slot>
      );
    }

    return (
      <ul
        ref={forwardedRef}
        className={cls("kite-fu-agent-thread-list", className)}
        {...props}
      >
        {children}
      </ul>
    );
  },
);

ThreadList.displayName = "Thread.List";

export interface ThreadEmptyProps extends HTMLAttributes<HTMLDivElement> {
  asChild?: boolean;
  children?: ReactNode;
}

const ThreadEmpty = forwardRef<HTMLDivElement, ThreadEmptyProps>(
  ({ asChild, className, children, ...props }, forwardedRef) => {
    if (asChild) {
      return (
        <Slot
          ref={forwardedRef as Ref<HTMLElement>}
          className={cls("kite-fu-agent-thread-empty", className)}
          {...props}
        >
          {children as never}
        </Slot>
      );
    }

    return (
      <div
        ref={forwardedRef}
        className={cls("kite-fu-agent-thread-empty", className)}
        {...props}
      >
        {children}
      </div>
    );
  },
);

ThreadEmpty.displayName = "Thread.Empty";

export type ThreadScrollAnchorProps = HTMLAttributes<HTMLDivElement>;

const ThreadScrollAnchor = forwardRef<HTMLDivElement, ThreadScrollAnchorProps>(
  ({ className, ...props }, forwardedRef) => (
    <div
      ref={forwardedRef}
      className={cls("kite-fu-agent-thread-scroll-anchor", className)}
      {...props}
    />
  ),
);

ThreadScrollAnchor.displayName = "Thread.ScrollAnchor";

export const Thread = Object.assign(ThreadRoot, {
  Root: ThreadRoot,
  List: ThreadList,
  Empty: ThreadEmpty,
  ScrollAnchor: ThreadScrollAnchor,
});
