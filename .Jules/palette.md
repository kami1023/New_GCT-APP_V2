## 2026-04-07 - [Accessible Confirm Dialogs]
**Learning:** Destructive confirmation dialogs require specific focus management and ARIA attributes (role="alertdialog") to be truly accessible. Providing a safe default (focusing Cancel) prevents accidental destructive actions via the Enter key.
**Action:** Always implement 'autoFocus' on the non-destructive action and include 'Escape' key support for all modal-like components.
