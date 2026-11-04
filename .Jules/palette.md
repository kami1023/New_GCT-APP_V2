## 2026-03-24 - Accessible Action Discovery in Glassmorphism Cards
**Learning:** Actions hidden until hover (e.g. Delete icons in product cards) are inaccessible to keyboard navigators unless paired with `focus-visible:opacity-100` and clear focus rings. Additionally, context-specific ARIA labels using entity names (e.g. `product.name`) rather than generic action terms or IDs prevent screen reader ambiguity.
**Action:** When designing cards with revealed-on-hover actions, always include `focus-visible:opacity-100`, focus indicator rings, and include the item's name in `aria-label`.
