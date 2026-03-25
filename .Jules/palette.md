## 2025-05-22 - [Accessibility & Keyboard Navigation]
**Learning:** Interactive elements that are only visible on hover (using `opacity-0 group-hover:opacity-100`) are completely inaccessible to keyboard users unless they also include `focus-visible:opacity-100`.
**Action:** Always pair `group-hover:opacity-100` with `focus-visible:opacity-100` or `group-focus-within:opacity-100` to ensure element visibility for keyboard users.

## 2025-05-22 - [Safe Destructive Actions]
**Learning:** For destructive confirmation dialogs, applying `autoFocus` to the non-destructive (Cancel) button provides a safer experience for keyboard users by preventing accidental confirmation.
**Action:** Set `autoFocus` on the Cancel/No button in confirmation modals.
