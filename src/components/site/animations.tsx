"use client";

import type { CSSProperties, ReactNode } from "react";

export function FadeInView({
  children,
  className = "",
  delay = 0,
}: {
  children: ReactNode;
  className?: string;
  delay?: number;
  direction?: "up" | "down" | "left" | "right" | "none";
  amount?: number;
  once?: boolean;
}) {
  return (
    <div
      data-reveal-base-delay={delay}
      style={{ "--reveal-delay": `${delay}s` } as CSSProperties}
      className={className}
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
  amount?: number;
  once?: boolean;
}) {
  return (
    <div data-reveal-group={staggerDelay} className={className}>
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
  return <div className={className}>{children}</div>;
}
