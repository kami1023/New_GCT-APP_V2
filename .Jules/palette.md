## 2025-05-14 - [Accessibility: Modal Dialog Safety]
**Learning:** For destructive actions (like deletion), applying 'autoFocus' to the non-destructive (Cancel) button prevents accidental confirmation if a user is fast-typing or accidentally hits 'Enter'.
**Action:** Always default focus to the safest action in confirmation dialogs.

## 2025-05-14 - [Accessibility: Semantic Dialogs]
**Learning:** Using 'role="alertdialog"' with 'aria-labelledby' and 'aria-describedby' ensures screen readers correctly announce the intent and content of a confirmation modal.
**Action:** Use 'useId' to generate stable IDs for these associations in React components.
