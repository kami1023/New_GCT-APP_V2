## 2025-05-15 - [Confirmation Dialog Focus]
**Learning:** Confirmation dialogs for destructive actions should apply 'autoFocus' to the non-destructive (Cancel) button to ensure user safety and keyboard accessibility.
**Action:** Always include 'autoFocus' on the safe option in destructive confirmation modals.

## 2025-05-15 - [Opaque Inline Modals]
**Learning:** The 'glass-panel' effect can cause visual overlap and readability issues when rendered inline over complex content.
**Action:** Use a solid background color (e.g., 'bg-zinc-900') for inline modals even if using backdrop filters elsewhere.
