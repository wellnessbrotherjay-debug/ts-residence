"use client";

import { usePathname } from "next/navigation";
import { useEffect } from "react";

const TEXT_SELECTOR = [
  "h1",
  "h2",
  "h3",
  "h4",
  "h5",
  "h6",
  "p",
  "li",
  "label",
  "figcaption",
  "blockquote",
  "button",
  "a",
  ".label-caps",
  "span",
].join(", ");

const BLOCK_SELECTOR = "[data-reveal-block='true']";
const RULE_SELECTOR = "hr, .soft-divider, [data-reveal-rule='true']";
const COUNTER_SELECTOR = "[data-reveal-counter]";

type RevealProfile = "subtle" | "cinematic" | "hero";

export function GlobalTextReveal() {
  const pathname = usePathname();

  useEffect(() => {
    const roots = Array.from(
      document.querySelectorAll<HTMLElement>("main, footer"),
    );
    if (!roots.length) return;

    const imageGroupIndexes = new Map<HTMLElement, number>();
    const textGroupIndexes = new Map<HTMLElement, number>();
    const ruleGroupIndexes = new Map<HTMLElement, number>();
    const observedElements = new Set<HTMLElement>();
    const revealFallbacks = new Map<HTMLElement, number>();
    const splitElements = new Set<HTMLElement>();
    const originalMarkup = new WeakMap<HTMLElement, string>();
    const originalAriaLabel = new WeakMap<HTMLElement, string | null>();

    const getBaseDelay = (element: HTMLElement) => {
      const host = element.closest<HTMLElement>("[data-reveal-base-delay]");
      return Number(host?.dataset.revealBaseDelay ?? "0");
    };

    const getProfile = (element: HTMLElement): RevealProfile => {
      const profile =
        element
          .closest<HTMLElement>("[data-reveal-profile]")
          ?.dataset.revealProfile?.toLowerCase() ?? "cinematic";

      if (profile === "subtle" || profile === "hero") return profile;
      return "cinematic";
    };

    const runCounterAnimation = (element: HTMLElement) => {
      const rawValue = element.dataset.revealCounter;
      if (!rawValue) return;
      if (element.dataset.revealCounterDone === "true") return;

      const target = Number(rawValue);
      if (!Number.isFinite(target)) return;

      const duration = 1800;
      const start = performance.now();

      const tick = (now: number) => {
        const t = Math.min(1, (now - start) / duration);
        const eased = 1 - (1 - t) ** 3;
        const value = Math.round(target * eased);
        element.textContent = String(value);

        if (t < 1) {
          requestAnimationFrame(tick);
          return;
        }

        element.textContent = String(target);
        element.dataset.revealCounterDone = "true";
      };

      element.textContent = "0";
      requestAnimationFrame(tick);
    };

    const applyRevealProfileVariables = (
      element: HTMLElement,
      kind: "text" | "image" | "rule",
      profile: RevealProfile,
    ) => {
      if (kind === "text") {
        if (profile === "hero") {
          element.style.setProperty("--reveal-text-distance", "32px");
          element.style.setProperty("--reveal-text-blur-start", "6px");
          element.style.setProperty("--reveal-text-start-scale", "1.015");
          element.style.setProperty(
            "--reveal-text-duration",
            "var(--reveal-duration-hero)",
          );
        } else if (profile === "cinematic") {
          element.style.setProperty("--reveal-text-distance", "24px");
          element.style.setProperty("--reveal-text-blur-start", "2px");
          element.style.setProperty("--reveal-text-start-scale", "1");
          element.style.setProperty("--reveal-text-duration", "1000ms");
        } else {
          element.style.setProperty("--reveal-text-distance", "0px");
          element.style.setProperty("--reveal-text-blur-start", "0px");
          element.style.setProperty("--reveal-text-start-scale", "1");
          element.style.setProperty(
            "--reveal-text-duration",
            "var(--reveal-duration-fast)",
          );
        }

        return;
      }

      if (kind === "rule") {
        element.style.setProperty("--reveal-rule-duration", "800ms");
        return;
      }

      if (profile === "hero") {
        element.style.setProperty(
          "--reveal-image-duration",
          "var(--reveal-duration-hero)",
        );
        element.style.setProperty("--reveal-image-start-scale", "1.1");
        element.style.setProperty("--reveal-image-distance", "30px");
        element.style.setProperty("--reveal-image-blur-start", "6px");
        return;
      }

      if (profile === "subtle") {
        element.style.setProperty(
          "--reveal-image-duration",
          "var(--reveal-duration-slow)",
        );
        element.style.setProperty("--reveal-image-start-scale", "1.04");
        element.style.setProperty("--reveal-image-distance", "14px");
        element.style.setProperty("--reveal-image-blur-start", "3px");
        return;
      }

      element.style.setProperty(
        "--reveal-image-duration",
        "var(--reveal-duration-hero)",
      );
      element.style.setProperty(
        "--reveal-image-start-scale",
        "var(--scale-start)",
      );
      element.style.setProperty(
        "--reveal-image-distance",
        "var(--parallax-offset)",
      );
      element.style.setProperty("--reveal-image-blur-start", "4px");
    };

    const canSplitIntoWords = (element: HTMLElement) => {
      const elementChildren = Array.from(element.childNodes).filter(
        (node) => node.nodeType === Node.ELEMENT_NODE,
      ) as Element[];

      const hasUnsupportedChildren = elementChildren.some(
        (child) => child.tagName !== "BR",
      );

      if (hasUnsupportedChildren) return false;

      const text = element.textContent?.replace(/\s+/g, " ").trim();
      return Boolean(text);
    };

    const splitWords = (element: HTMLElement) => {
      if (!canSplitIntoWords(element)) return;
      if (element.dataset.revealWordsSplit === "true") return;

      if (!originalMarkup.has(element)) {
        originalMarkup.set(element, element.innerHTML);
        originalAriaLabel.set(element, element.getAttribute("aria-label"));
      }

      const fullText = element.textContent?.replace(/\s+/g, " ").trim();
      if (!fullText) return;

      element.setAttribute("aria-label", fullText);

      const fragment = document.createDocumentFragment();
      let wordIndex = 0;

      Array.from(element.childNodes).forEach((node) => {
        if (node.nodeType === Node.TEXT_NODE) {
          const text = node.textContent ?? "";
          const tokens = text.split(/(\s+)/);

          tokens.forEach((token) => {
            if (!token) return;

            if (/^\s+$/.test(token)) {
              fragment.appendChild(document.createTextNode(token));
              return;
            }

            const mask = document.createElement("span");
            mask.className = "reveal-word-mask";
            mask.setAttribute("aria-hidden", "true");

            const word = document.createElement("span");
            word.className = "reveal-word";
            word.style.setProperty("--word-index", String(wordIndex));
            word.textContent = token;

            mask.appendChild(word);
            fragment.appendChild(mask);
            wordIndex += 1;
          });
          return;
        }

        if (node.nodeType === Node.ELEMENT_NODE) {
          const child = node as Element;
          fragment.appendChild(child.cloneNode(true));
        }
      });

      element.replaceChildren(fragment);
      element.dataset.revealWordsSplit = "true";
      element.classList.add("scroll-reveal-words");
      splitElements.add(element);
    };

    const getGroupDelay = (
      element: HTMLElement,
      registry: Map<HTMLElement, number>,
    ) => {
      const group = element.closest<HTMLElement>("[data-reveal-group]");
      if (!group) return 0;

      const currentIndex = registry.get(group) ?? 0;
      registry.set(group, currentIndex + 1);

      const groupStep = Number(group.dataset.revealGroup ?? "0.1");
      return currentIndex * groupStep;
    };

    const getRoleDelay = (
      element: HTMLElement,
      kind: "text" | "image" | "rule",
    ) => {
      if (kind === "rule") return 1.0;
      if (kind === "image") return 0.12;

      if (element.matches(".label-caps, [data-reveal-role='eyebrow']"))
        return 0.2;
      if (element.matches("h1, h2, h3, [data-reveal-role='headline']"))
        return 0.4;
      if (element.matches("button, a, [data-reveal-role='cta']")) return 0.9;
      if (
        element.matches(
          "p, li, figcaption, blockquote, label, [data-reveal-role='body']",
        )
      ) {
        return 0;
      }

      return 0;
    };

    const isBodyTextTarget = (element: HTMLElement) =>
      element.matches(
        "p, li, figcaption, blockquote, label, [data-reveal-role='body']",
      );

    const shouldSplitWords = (element: HTMLElement, profile: RevealProfile) => {
      if (profile === "subtle") return false;

      return element.matches(
        "h1, h2, h3, .label-caps, [data-reveal-role='headline'], [data-reveal-role='eyebrow']",
      );
    };

    const isExcluded = (
      element: HTMLElement,
      kind: "text" | "image" | "rule",
    ) => {
      if (element.closest("script, style, svg, defs")) return true;

      const kindExclusion =
        kind === "image"
          ? "[data-no-image-reveal='true']"
          : "[data-no-text-reveal='true']";

      if (
        element.closest(
          `[data-no-global-reveal='true'], [data-no-reveal='true'], ${kindExclusion}`,
        )
      ) {
        return true;
      }

      return false;
    };

    const isBlockExcluded = (element: HTMLElement) => {
      if (element.closest("script, style, svg, defs")) return true;

      const blockedAncestor = element.parentElement?.closest(
        "[data-no-global-reveal='true'], [data-no-reveal='true'], [data-no-text-reveal='true'], [data-no-image-reveal='true']",
      );

      if (blockedAncestor) return true;
      if (
        element.closest(
          "[data-no-global-reveal='true'], [data-no-reveal='true']",
        )
      ) {
        return true;
      }

      return false;
    };

    const getTextTargets = (scope: ParentNode) => {
      const matches = Array.from(
        scope.querySelectorAll<HTMLElement>(TEXT_SELECTOR),
      );
      if (scope instanceof HTMLElement && scope.matches(TEXT_SELECTOR)) {
        matches.unshift(scope);
      }

      return matches.filter((element) => {
        if (isExcluded(element, "text")) return false;
        if (element.matches("span")) {
          if (
            element.closest(
              "button, a, h1, h2, h3, h4, h5, h6, p, li, label, figcaption, blockquote",
            )
          ) {
            return false;
          }
        }

        const text = element.textContent?.replace(/\s+/g, " ").trim();
        return Boolean(text);
      });
    };

    const getBlockTargets = (scope: ParentNode) => {
      const matches = Array.from(
        scope.querySelectorAll<HTMLElement>(BLOCK_SELECTOR),
      );
      if (scope instanceof HTMLElement && scope.matches(BLOCK_SELECTOR)) {
        matches.unshift(scope);
      }

      return matches.filter((element, index, all) => {
        if (isBlockExcluded(element)) return false;
        return all.indexOf(element) === index;
      });
    };

    const getBackgroundTargets = (scope: ParentNode) => {
      const nodes =
        scope instanceof HTMLElement
          ? [scope, ...Array.from(scope.querySelectorAll<HTMLElement>("*"))]
          : Array.from(scope.querySelectorAll<HTMLElement>("*"));

      return nodes.filter((element) => {
        if (isExcluded(element, "image")) return false;
        const backgroundImage =
          window.getComputedStyle(element).backgroundImage;
        return (
          backgroundImage.includes("url(") &&
          element.offsetWidth > 0 &&
          element.offsetHeight > 0
        );
      });
    };

    const getImageTargets = (scope: ParentNode) => {
      const imageNodes = Array.from(scope.querySelectorAll<HTMLElement>("img"));
      if (scope instanceof HTMLElement && scope.matches("img")) {
        imageNodes.unshift(scope);
      }

      return [...imageNodes, ...getBackgroundTargets(scope)].filter(
        (element, index, all) =>
          !isExcluded(element, "image") && all.indexOf(element) === index,
      );
    };

    const getRuleTargets = (scope: ParentNode) => {
      const matches = Array.from(
        scope.querySelectorAll<HTMLElement>(RULE_SELECTOR),
      );
      if (scope instanceof HTMLElement && scope.matches(RULE_SELECTOR)) {
        matches.unshift(scope);
      }

      return matches.filter(
        (element, index, all) =>
          !isExcluded(element, "rule") && all.indexOf(element) === index,
      );
    };

    const getCounterTargets = (scope: ParentNode) => {
      const matches = Array.from(
        scope.querySelectorAll<HTMLElement>(COUNTER_SELECTOR),
      );
      if (scope instanceof HTMLElement && scope.matches(COUNTER_SELECTOR)) {
        matches.unshift(scope);
      }

      return matches.filter(
        (element, index, all) =>
          !isExcluded(element, "text") && all.indexOf(element) === index,
      );
    };

    const filteredTextTargets = roots.flatMap((root) => getTextTargets(root));
    const filteredImageTargets = roots.flatMap((root) => getImageTargets(root));
    const filteredBlockTargets = roots.flatMap((root) => getBlockTargets(root));
    const filteredRuleTargets = roots.flatMap((root) => getRuleTargets(root));
    const filteredCounterTargets = roots.flatMap((root) =>
      getCounterTargets(root),
    );

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          const target = entry.target as HTMLElement;
          target.classList.add("is-visible");
          const fallbackId = revealFallbacks.get(target);
          if (fallbackId) {
            window.clearTimeout(fallbackId);
            revealFallbacks.delete(target);
          }
          if (target.matches(COUNTER_SELECTOR)) {
            runCounterAnimation(target);
          }
          observer.unobserve(entry.target);
        });
      },
      {
        threshold: 0.15,
        rootMargin: "-10% 0px",
      },
    );

    const registerElements = (
      elements: HTMLElement[],
      kind: "text" | "image" | "rule",
      registry: Map<HTMLElement, number>,
    ) => {
      elements.forEach((element) => {
        if (observedElements.has(element)) return;

        const profile = getProfile(element);
        const delaySeconds =
          getBaseDelay(element) +
          getGroupDelay(element, registry) +
          getRoleDelay(element, kind);
        const delay = `${Math.max(0, Math.round(delaySeconds * 1000))}ms`;

        applyRevealProfileVariables(element, kind, profile);

        if (kind === "text" && shouldSplitWords(element, profile)) {
          splitWords(element);
        }

        if (kind === "text") {
          element.classList.add(
            "scroll-reveal-text",
            `reveal-profile-${profile}`,
          );

          if (isBodyTextTarget(element)) {
            element.classList.add("reveal-body-copy");
          }
        } else if (kind === "image") {
          element.classList.add(
            "scroll-reveal-image",
            `reveal-profile-${profile}`,
          );
        } else {
          element.classList.add("scroll-reveal-rule");
        }

        element.style.setProperty("--reveal-delay", delay);
        observedElements.add(element);
        observer.observe(element);

        const fallbackId = window.setTimeout(() => {
          if (element.classList.contains("is-visible")) return;

          element.classList.add("is-visible");
          if (element.matches(COUNTER_SELECTOR)) {
            runCounterAnimation(element);
          }
          revealFallbacks.delete(element);
        }, 1500);

        revealFallbacks.set(element, fallbackId);
      });
    };

    registerElements(filteredTextTargets, "text", textGroupIndexes);
    registerElements(filteredImageTargets, "image", imageGroupIndexes);
    registerElements(filteredBlockTargets, "text", textGroupIndexes);
    registerElements(filteredRuleTargets, "rule", ruleGroupIndexes);
    registerElements(filteredCounterTargets, "text", textGroupIndexes);

    const mutationObservers = roots.map((root) => {
      const mutationObserver = new MutationObserver((mutations) => {
        mutations.forEach((mutation) => {
          mutation.addedNodes.forEach((node) => {
            if (!(node instanceof HTMLElement)) return;

            registerElements(getBlockTargets(node), "text", textGroupIndexes);
            registerElements(getTextTargets(node), "text", textGroupIndexes);
            registerElements(getImageTargets(node), "image", imageGroupIndexes);
            registerElements(getRuleTargets(node), "rule", ruleGroupIndexes);
            registerElements(getCounterTargets(node), "text", textGroupIndexes);
          });
        });
      });

      mutationObserver.observe(root, {
        childList: true,
        subtree: true,
      });

      return mutationObserver;
    });

    return () => {
      mutationObservers.forEach((mutationObserver) =>
        mutationObserver.disconnect(),
      );
      observer.disconnect();
      revealFallbacks.forEach((fallbackId) => window.clearTimeout(fallbackId));
      revealFallbacks.clear();
      observedElements.forEach((element) => {
        element.style.removeProperty("--reveal-delay");
        element.style.removeProperty("--reveal-rule-duration");
        element.style.removeProperty("--reveal-image-duration");
        element.style.removeProperty("--reveal-text-duration");
        element.style.removeProperty("--reveal-image-start-scale");
        element.style.removeProperty("--reveal-image-distance");
        element.style.removeProperty("--reveal-image-blur-start");
        element.style.removeProperty("--reveal-text-distance");
        element.style.removeProperty("--reveal-text-blur-start");
        element.style.removeProperty("--reveal-text-start-scale");
        element.classList.remove(
          "scroll-reveal-text",
          "scroll-reveal-image",
          "scroll-reveal-rule",
          "reveal-profile-subtle",
          "reveal-profile-cinematic",
          "reveal-profile-hero",
          "reveal-body-copy",
        );
        element.classList.remove("is-visible");
      });

      splitElements.forEach((element) => {
        const original = originalMarkup.get(element);
        if (original) {
          element.innerHTML = original;
        }

        const aria = originalAriaLabel.get(element);
        if (aria == null) {
          element.removeAttribute("aria-label");
        } else {
          element.setAttribute("aria-label", aria);
        }

        element.classList.remove("scroll-reveal-words");
        delete element.dataset.revealWordsSplit;
      });
    };
  }, [pathname]);

  return null;
}
