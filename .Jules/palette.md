## 2025-05-15 - [Accessible & Safe Confirmation Dialogs]
**Learning:** Destructive action confirmations should use `role="alertdialog"`, `aria-labelledby`, and `aria-describedby` for screen reader accessibility. Additionally, applying `autoFocus` to the non-destructive (Cancel) button prevents accidental confirmations from keyboard users.
**Action:** Always use `useId` to generate stable ARIA IDs and ensure the "safe" action is focused by default in modals.
