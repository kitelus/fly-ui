import { cn } from "../../lib/cn";

import styles from "../kite/kite-animations.module.css";

export interface LoadingProps {
  className?: string;
  label?: string;
}

export function Loading({ className, label }: LoadingProps) {
  return (
    <div
      className={cn(styles["kite-fu-host"], className)}
      role="status"
      aria-label={label ?? "Loading"}
    >
      <div className={styles["kite-fu-loadingDots"]}>
        <span className={styles["kite-fu-loadingDot"]} />
        <span
          className={cn(
            styles["kite-fu-loadingDot"],
            styles["kite-fu-loadingDot1"],
          )}
        />
        <span
          className={cn(
            styles["kite-fu-loadingDot"],
            styles["kite-fu-loadingDot2"],
          )}
        />
      </div>
    </div>
  );
}
