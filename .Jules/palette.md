## 2025-05-18 - Hover-only Actions and Low Contrast Icons in Dark Theme Cards
**Learning:** In dark-themed inventory cards, hover-only action buttons (e.g., delete) styled with `opacity-0 group-hover:opacity-100` and low-contrast icons like `text-zinc-700` are completely hidden from keyboard users navigating via Tab.
**Action:** Always combine `group-hover:opacity-100` with `group-focus-within:opacity-100 focus-visible:opacity-100` and clear focus rings (`focus-visible:ring-2`), and ensure icon colors on dark backgrounds use sufficient contrast (e.g. `text-zinc-400`).
