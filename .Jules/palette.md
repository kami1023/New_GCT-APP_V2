# Palette's Journal - Critical UX & Accessibility Learnings

## 2025-05-18 - Hover-Only Actions & Accessible ARIA Labels in Card Components
**Learning:** Icon buttons hidden via `opacity-0 group-hover:opacity-100` are completely inaccessible to keyboard-only users unless focus-within or focus-visible styling is explicitly applied (`group-focus-within:opacity-100 focus-visible:opacity-100`). Furthermore, generic `title` or missing `aria-label` attributes on card action buttons make screen reader navigation contextless.
**Action:** Always include `group-focus-within:opacity-100 focus-visible:opacity-100` alongside `group-hover:opacity-100` on hover-revealed card controls, and provide dynamic `aria-label` strings incorporating item details (e.g. `aria-label={`Delete ${product.name}`}`).
