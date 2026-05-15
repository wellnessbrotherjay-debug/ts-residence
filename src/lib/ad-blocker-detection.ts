/**
 * Ad blocker detection utility
 * Helps identify if users have ad blockers enabled
 */

export function detectAdBlocker(): Promise<boolean> {
  return new Promise((resolve) => {
    // Try to load a known ad by creating a test element
    const testElement = document.createElement("div");
    testElement.innerHTML = '&nbsp;';
    testElement.className = "adsbyadsblocking";
    testElement.style.display = "none";
    document.body.appendChild(testElement);

    // Most ad blockers will not render ads with class names containing "ads"
    const isBlocked = testElement.offsetHeight === 0;

    // Cleanup
    document.body.removeChild(testElement);

    // Also test script loading
    if (!isBlocked) {
      const img = new Image();
      img.onload = () => resolve(false);
      img.onerror = () => resolve(true);
      img.src = "https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js";
      
      // Timeout fallback
      setTimeout(() => resolve(false), 2000);
    } else {
      resolve(true);
    }
  });
}

/**
 * Check if tracking requests are being blocked
 */
export function checkTrackingBlocked(): Promise<boolean> {
  return new Promise((resolve) => {
    const test = new Image();
    test.onload = () => resolve(false);
    test.onerror = () => resolve(true);
    // Test with a tracking domain
    test.src = "https://www.google-analytics.com/analytics.js";
    
    // Timeout fallback
    setTimeout(() => resolve(false), 2000);
  });
}

/**
 * Detect if user has enabled Do Not Track
 */
export function hasDoNotTrack(): boolean {
  if (typeof navigator === "undefined") return false;
  
  return (
    navigator.doNotTrack === "1" ||
    navigator.doNotTrack === "yes" ||
    // @ts-ignore - check old Safari implementation
    window.doNotTrack === "yes"
  );
}

/**
 * Log ad blocker detection for debugging
 */
export async function detectAndLogAdBlockers() {
  if (typeof window === "undefined") return;

  try {
    const hasAdBlocker = await detectAdBlocker();
    const trackingBlocked = await checkTrackingBlocked();
    const dnt = hasDoNotTrack();

    if (hasAdBlocker || trackingBlocked) {
      console.warn("[AdBlocker Detection]", {
        adBlockerDetected: hasAdBlocker,
        trackingBlocked,
        doNotTrack: dnt,
      });

      // Send detection to analytics for monitoring
      if (window.dataLayer) {
        window.dataLayer.push({
          event: "ad_blocker_detected",
          adBlockerDetected: hasAdBlocker,
          trackingBlocked,
          doNotTrack: dnt,
        });
      }
    }
  } catch (error) {
    console.debug("[AdBlocker Detection] Error:", error);
  }
}
