## 2026-03-26 - [Accessibility and Focus Patterns]
**Learning:** Interactive elements that rely on `group-hover` for visibility are inaccessible to keyboard users unless they also have `focus-visible` visibility. Confirmation dialogs should prioritize safety by auto-focusing the non-destructive action.
**Action:** Always pair `group-hover:opacity-100` with `focus-visible:opacity-100` and ensure icon-only buttons have `aria-label`. Apply `autoFocus` to 'Cancel' or 'Close' buttons in modals.
