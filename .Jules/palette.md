# Palette's Journal 🎨

## 2025-03-30 - [Accessibility & Safety in Confirm Dialogs]
**Learning:** Confirmation dialogs for destructive actions should apply 'autoFocus' to the non-destructive (Cancel) button to ensure user safety and keyboard accessibility. This prevents users from accidentally confirming a dangerous action (like a deletion) with an unintended press of the 'Enter' key.
**Action:** Always ensure 'autoFocus' is on the 'Cancel' button in destructive confirmation dialogs and use appropriate ARIA attributes (`role="alertdialog"`, `aria-modal`, `aria-labelledby`, `aria-describedby`) to make the dialog accessible to screen readers.
