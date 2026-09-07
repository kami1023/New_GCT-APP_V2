## 2025-05-18 - Hover-Only Actions Keyboard Accessibility
**Learning:** Icon-only buttons revealed strictly on hover (such as delete action buttons in card components) are invisible and inaccessible to keyboard-only users unless explicitly handled with focus states.
**Action:** Always combine `group-hover:opacity-100` with `focus-visible:opacity-100 focus-visible:ring-2` and descriptive `aria-label` attributes on hover-revealed card actions.
