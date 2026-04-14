## 2026-04-14 - Accessible and Safe Confirm Dialogs
**Learning:** For destructive actions, a confirm dialog should not only be accessible via screen readers (using `role="alertdialog"`) but also safe for keyboard users by auto-focusing the non-destructive action (Cancel) and providing an easy way to exit via the `Escape` key.
**Action:** Always implement `role="alertdialog"`, `aria-modal="true"`, `autoFocus` on the cancel button, and an `Escape` key listener in modal confirmation components.

## 2026-04-14 - Scope Management in UX Enhancements
**Learning:** Micro-UX enhancements should strictly exclude backend fixes, environment-specific dependency changes, or accidental file additions (like local databases) to maintain a small, verifiable scope and avoid polluting the PR.
**Action:** Before submitting, verify that no unrelated infrastructure or backend files are staged for commit.
