## 2025-05-15 - Declarative Search UX
**Learning:** Replacing imperative DOM-based search logic with declarative React state filtering ensures predictable rendering and enables clean integration of empty state UI and "Clear Search" actions.
**Action:** Always favor state-driven filtering for lists to support accessible empty states and interactive search controls.

## 2025-05-15 - Scope Management & Environment
**Learning:** Committing binary database files or redundant lockfiles (pnpm vs npm) bloats the repository and can cause merge conflicts.
**Action:** Strictly exclude local artifacts like `.db` files and lockfile changes from PRs unless specifically requested or required for the fix.
