## 2025-05-14 - [Declarative Search & Keyboard Accessibility]
**Learning:** Replacing imperative DOM-based search with declarative React state allows for seamless "No results" empty states and robust focus management. Also, hover-only actions (like Delete buttons) must be made visible on focus using `focus-visible:opacity-100` to be accessible to keyboard users.
**Action:** Always prefer declarative state for UI filtering and ensure all hover-triggered actions have corresponding `focus-visible` states.
