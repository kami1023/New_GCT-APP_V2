## 2026-03-27 - [Accessibility: Icon-only buttons and Keyboard Visibility]
**Learning:** Icon-only buttons (Trash, Download, Eye, X) must always have an `aria-label` to be accessible to screen readers. Elements that use `group-hover:opacity-100` should also include `focus-visible:opacity-100` to ensure they are accessible to keyboard-only users.
**Action:** Always check for `aria-label` on icon-only buttons and ensure interactive elements that rely on hover are also reachable via focus-visible styles.

## 2026-03-27 - [Accessibility: Destructive Actions and autoFocus]
**Learning:** Confirmation dialogs for destructive actions should apply `autoFocus` to the non-destructive (Cancel) button to ensure user safety and keyboard accessibility, preventing accidental confirmation.
**Action:** In `ConfirmDialog` or similar components, default the focus to the safest action.
