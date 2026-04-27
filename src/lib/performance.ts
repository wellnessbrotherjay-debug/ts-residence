import { buildDeviceType, trackEvent } from "@/lib/tracking";

declare global {
  interface Window {
    Sentry?: {
      captureMessage: (message: string, context?: Record<string, unknown>) => void;
    };
  }
}

const IMAGE_ALERT_THRESHOLD_MS = 2000;

export function reportPerformanceMetric(
  metricName: "lcp" | "fcp" | "cls",
  value: number,
  context: Record<string, unknown> = {},
) {
  trackEvent("performance_metric", {
    metric_name: metricName,
    metric_value: value,
    device_type: buildDeviceType(),
    ...context,
  });

  window.Sentry?.captureMessage?.(`web-vital:${metricName}`, {
    level: "info",
    extra: { value, ...context },
  });
}

export function beginImageLoadMeasure(measureId: string, imageSrc: string) {
  if (typeof window === "undefined" || typeof performance === "undefined") return;

  performance.clearMarks(`${measureId}:start`);
  performance.mark(`${measureId}:start`, {
    detail: { imageSrc },
  });
}

export function endImageLoadMeasure(
  measureId: string,
  context: Record<string, unknown> = {},
) {
  if (typeof window === "undefined" || typeof performance === "undefined") return;

  const startMark = `${measureId}:start`;
  const endMark = `${measureId}:end`;
  const measureName = `${measureId}:duration`;
  const hasStartMark = performance.getEntriesByName(startMark, "mark").length > 0;

  if (!hasStartMark) {
    return;
  }

  try {
    performance.mark(endMark);
    performance.measure(measureName, startMark, endMark);
    const entries = performance.getEntriesByName(measureName, "measure");
    const duration = entries[entries.length - 1]?.duration;

    if (typeof duration !== "number") return;

    trackEvent("image_load_time", {
      metric_name: "image_load_time",
      metric_value: duration,
      device_type: buildDeviceType(),
      ...context,
    });

    if (duration > IMAGE_ALERT_THRESHOLD_MS) {
      trackEvent("performance_alert", {
        metric_name: "image_load_time",
        metric_value: duration,
        threshold_ms: IMAGE_ALERT_THRESHOLD_MS,
        device_type: buildDeviceType(),
        ...context,
      });

      window.Sentry?.captureMessage?.("image-load-slower-than-threshold", {
        level: "warning",
        extra: {
          duration,
          threshold_ms: IMAGE_ALERT_THRESHOLD_MS,
          ...context,
        },
      });
    }
  } finally {
    performance.clearMarks(startMark);
    performance.clearMarks(endMark);
    performance.clearMeasures(measureName);
  }
}