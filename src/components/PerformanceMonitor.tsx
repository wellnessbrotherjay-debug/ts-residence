"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";

import { reportPerformanceMetric } from "@/lib/performance";

export function PerformanceMonitor() {
  const pathname = usePathname();

  useEffect(() => {
    if (typeof window === "undefined" || typeof PerformanceObserver === "undefined") {
      return;
    }

    let lcpEntry: LargestContentfulPaint | null = null;
    let clsValue = 0;

    const lcpObserver = new PerformanceObserver((entryList) => {
      const entries = entryList.getEntries();
      const candidate = entries[entries.length - 1];
      if (candidate) {
        lcpEntry = candidate as LargestContentfulPaint;
      }
    });

    const paintObserver = new PerformanceObserver((entryList) => {
      entryList.getEntries().forEach((entry) => {
        if (entry.name !== "first-contentful-paint") return;
        reportPerformanceMetric("fcp", entry.startTime, { page_path: pathname });
      });
    });

    const clsObserver = new PerformanceObserver((entryList) => {
      entryList.getEntries().forEach((entry) => {
        const layoutShift = entry as LayoutShift;
        if (layoutShift.hadRecentInput) return;
        clsValue += layoutShift.value;
      });
    });

    const flushMetrics = () => {
      if (lcpEntry) {
        reportPerformanceMetric("lcp", lcpEntry.startTime, { page_path: pathname });
      }

      reportPerformanceMetric("cls", clsValue, { page_path: pathname });
    };

    const handleVisibilityChange = () => {
      if (document.visibilityState === "hidden") {
        flushMetrics();
      }
    };

    try {
      lcpObserver.observe({ type: "largest-contentful-paint", buffered: true });
      paintObserver.observe({ type: "paint", buffered: true });
      clsObserver.observe({ type: "layout-shift", buffered: true });
    } catch {
      return;
    }

    document.addEventListener("visibilitychange", handleVisibilityChange);

    return () => {
      flushMetrics();
      lcpObserver.disconnect();
      paintObserver.disconnect();
      clsObserver.disconnect();
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, [pathname]);

  return null;
}