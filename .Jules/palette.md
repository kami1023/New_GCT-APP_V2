## 2025-02-15 - [Accessible Actions Revealed on Hover]
**Learning:** Actions revealed only on hover (like the product 'Delete' icon-only button) are invisible and unreachable for keyboard users unless they are also explicitly made visible on focus using Tailwind's `focus-visible` or similar classes, and have descriptive ARIA labels.
**Action:** Always ensure any hover-only interactive action has a corresponding focus state (e.g. `focus-visible:opacity-100`) and includes an `aria-label` specifying the item being deleted/altered to provide context to screen readers.
