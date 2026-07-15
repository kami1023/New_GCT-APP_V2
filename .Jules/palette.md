## 2026-07-15 - [Revealing Hidden Actions on Focus]
**Learning:** Actions that are only visible on hover (e.g., using `group-hover:opacity-100`) are inaccessible to keyboard users unless they are also revealed on focus. Using Tailwind's `focus-visible:opacity-100` on the element itself or `group-focus-within:opacity-100` on a parent ensures discoverability for Tab users.
**Action:** Always pair hover-triggered visibility with focus-triggered visibility and a clear focus ring.
