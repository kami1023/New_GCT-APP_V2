## 2026-03-19 - [Hover-Only Destructive Actions & Keyboard Discoverability]
**Learning:** Actions revealed only on hover (such as Delete buttons in product cards) are completely inaccessible to keyboard users unless they are also shown on focus (using Tailwind classes like `focus-visible:opacity-100`) and styled with clear focus indicators. Adding an explicit `aria-label` specifying the item ID ensures screen reader users have proper context.
**Action:** Always pair hover-only triggers with `focus-visible:opacity-100`, focus ring styling, and explicit context-specific ARIA labels.
