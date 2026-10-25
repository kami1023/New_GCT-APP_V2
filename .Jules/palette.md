## 2025-05-20 - Card Action Accessibility & Keyboard Focus Visibility
**Learning:** Icon buttons revealed strictly on card hover (e.g. `opacity-0 group-hover:opacity-100`) are inaccessible to keyboard-only users unless explicitly configured with focus-visible visibility (`focus-visible:opacity-100`). Additionally, icon-only buttons require descriptive `aria-label`s specifying the target object (e.g. product name) rather than generic actions.
**Action:** Always combine `focus-visible:opacity-100` and `focus-visible:ring-2` with product-specific `aria-label`s on hover-revealed card actions.
