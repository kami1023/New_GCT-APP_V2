## 2026-03-29 - [ConfirmDialog Safety & Accessibility]
**Learning:** Confirmation dialogs for destructive actions should apply 'autoFocus' to the non-destructive (Cancel) button to ensure user safety and keyboard accessibility. This prevents accidental deletions if a user hits "Enter" immediately upon the dialog opening.
**Action:** Always consider the default focus for modal dialogs, especially those that confirm irreversible actions.
