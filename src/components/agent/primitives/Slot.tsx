import {
  cloneElement,
  forwardRef,
  isValidElement,
  type CSSProperties,
  type HTMLAttributes,
  type ReactElement,
  type Ref,
} from "react";

type SlotChildProps = {
  className?: string;
  style?: CSSProperties;
  ref?: Ref<unknown>;
};

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

export interface SlotProps extends HTMLAttributes<HTMLElement> {
  children: ReactElement;
}

export const Slot = forwardRef<HTMLElement, SlotProps>(
  ({ children, className, style, ...rest }, forwardedRef) => {
    if (!isValidElement(children)) {
      return null;
    }

    const child = children as ReactElement<SlotChildProps>;
    const mergedClassName = [child.props.className, className]
      .filter(Boolean)
      .join(" ");

    return cloneElement(child, {
      ...rest,
      className: mergedClassName || undefined,
      style: {
        ...(child.props.style ?? {}),
        ...(style ?? {}),
      },
      ref: composeRefs(child.props.ref, forwardedRef),
    });
  },
);

Slot.displayName = "Slot";
