import type { CSSProperties, Key, ReactNode } from "react";

export const FadeInView = ({
  children,
  className = "",
  delay = 0,
  direction = "up",
}: {
  children: ReactNode;
  className?: string;
  delay?: number;
  direction?: "up" | "down" | "left" | "right" | "none";
}) => {
  const dirClass = {
    up: "reveal-up",
    down: "reveal-down",
    left: "reveal-left",
    right: "reveal-right",
    none: "reveal-none",
  };

  return (
    <div
      style={{ animationDelay: `${delay}s` }}
      className={`reveal ${dirClass[direction]} ${className}`.trim()}
    >
      {children}
    </div>
  );
};

export const StaggerContainer = ({
  children,
  className = "",
  staggerDelay = 0.1,
}: {
  children: ReactNode;
  className?: string;
  staggerDelay?: number;
}) => {
  return (
    <div
      style={{ "--stagger-delay": `${staggerDelay}s` } as CSSProperties}
      className={className}
    >
      {children}
    </div>
  );
};

export const StaggerItem = ({
  children,
  className = "",
}: {
  children: ReactNode;
  className?: string;
  key?: Key;
}) => <div className={`reveal reveal-up ${className}`.trim()}>{children}</div>;
