## 2025-02-15 - [Keyboard Focus and Accessibility in Hover Action Cards]
**Learning:** Actions revealed only on hover (e.g., 'Delete' buttons in inventory cards) are completely inaccessible to keyboard users and screen readers unless they are also made visible on focus and focus-within, and clearly announced.
**Action:** Enhance hover-revealed card actions by:
- Adding focus rings and `group-focus-within:opacity-100` / `focus:opacity-100` / `focus-visible:opacity-100` classes to make hover-only elements visible to keyboard navigation.
- Providing friendly, descriptive `aria-label`s (e.g., specifying `product.name`) instead of technical/ID strings so they are pleasant and readable for screen reader announcements.
