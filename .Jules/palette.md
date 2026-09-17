## 2025-05-10 - Keyboard discoverability for hover-only actions on card components
**Learning:** Icon buttons hidden by default (`opacity-0 group-hover:opacity-100`) on inventory/dashboard cards are inaccessible to keyboard screen reader users Tabbing through the page.
**Action:** Always combine `group-hover:opacity-100` with `group-focus-within:opacity-100 focus-visible:opacity-100` and clear focus rings so action buttons reveal themselves when focused via keyboard.
