import type { CSSProperties, ReactNode } from "react";

export function FadeInView({
  children,
  className = "",
  delay = 0,
  direction = "up",
}: {
  children: ReactNode;
  className?: string;
  delay?: number;
  direction?: "up" | "down" | "left" | "right" | "none";
}) {
  const dirClass = {
    up: "reveal-up",
    down: "reveal-down",
    left: "reveal-left",
    right: "reveal-right",
    none: "reveal-none",
  };

  return (
    <div
      className={`reveal ${dirClass[direction]} ${className}`.trim()}
      style={{ animationDelay: `${delay}s` }}
    >
      {children}
    </div>
  );
}

export function StaggerContainer({
  children,
  className = "",
  staggerDelay = 0.1,
}: {
  children: ReactNode;
  className?: string;
  staggerDelay?: number;
}) {
  return (
    <div
      style={
        {
          "--stagger-delay": `${staggerDelay}s`,
        } as CSSProperties
      }
      className={className}
    >
      {children}
    </div>
  );
}

export function StaggerItem({
  children,
  className = "",
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <div className={`reveal reveal-up ${className}`.trim()}>{children}</div>
  );
}
