## 2025-05-10 - Card Action Accessibility & Contrast
**Learning:** Icon-only actions inside cards revealed on hover (like Delete) are inaccessible to keyboard users unless explicitly shown on focus (`focus-visible:opacity-100`). Also, low contrast classes like `text-zinc-700` on dark glass components fail WCAG contrast.
**Action:** Always include `focus-visible:opacity-100` and accessible `aria-label` with item names, and use `text-zinc-400` or lighter for dark themes.
