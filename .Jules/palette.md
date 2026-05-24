## 2025-05-15 - [Search UX & Keyboard Accessibility]
**Learning:** Replacing imperative DOM-manipulation search logic with declarative React state filtering not only improves code maintainability but also enables seamless integration of secondary UX features like 'Clear Search' buttons and 'No results found' empty states.
**Action:** Always prefer declarative state-driven filtering for search interfaces to ensure UI consistency and accessibility.

## 2025-05-15 - [Keyboard Discoverability for Hover Actions]
**Learning:** Actions that are only visible on hover (e.g., a 'Delete' button on a card) are completely inaccessible to keyboard-only users. Using Tailwind's `group-focus-within` allows these actions to be revealed when any element inside the card receives focus.
**Action:** Ensure all hover-triggered actions have corresponding focus-triggered visibility states (e.g., `group-focus-within:opacity-100`) and clear ARIA labels.
