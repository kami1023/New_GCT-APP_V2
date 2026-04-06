## 2025-05-14 - Accessible Confirmation Dialogs
**Learning:** For truly accessible modal dialogs (role='alertdialog'), it's not enough to just add ARIA attributes. Safety-critical UI should default focus to the 'Cancel' action (autoFocus) and support the 'Escape' key for dismissal to ensure keyboard parity and prevent accidental destructive actions.
**Action:** Always implement 'autoFocus' on non-destructive buttons and an 'Escape' key listener in modal components.
