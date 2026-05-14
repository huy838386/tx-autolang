"use client";

import { useEffect } from "react";

/**
 * Hook to apply i18n translations to data-i18n and data-i18n-placeholder attributes
 * Call this when modal opens to ensure translations are applied
 */
export function useI18n(isActive: boolean) {
  useEffect(() => {
    if (!isActive) return;

    const applyI18n = () => {
      // Apply text translations
      const htmlElements = document.querySelectorAll("[data-i18n]");
      for (let i = 0; i < htmlElements.length; i++) {
        const el = htmlElements[i] as HTMLElement;
        const key = el.getAttribute("data-i18n");
        if (key && window.__i18n_t) {
          const text = window.__i18n_t(key);
          if (text) el.textContent = text;
        }
      }

      // Apply placeholder translations
      const placeholderElements = document.querySelectorAll("[data-i18n-placeholder]");
      for (let i = 0; i < placeholderElements.length; i++) {
        const el = placeholderElements[i] as HTMLInputElement;
        const key = el.getAttribute("data-i18n-placeholder");
        if (key && window.__i18n_t) {
          const text = window.__i18n_t(key);
          if (text) el.placeholder = text;
        }
      }
    };

    // Apply immediately and with a small delay
    applyI18n();
    const timeout = setTimeout(applyI18n, 150);
    return () => clearTimeout(timeout);
  }, [isActive]);
}
