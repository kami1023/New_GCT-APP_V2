# Palette's Journal - Critical Learnings Only

## 2025-05-14 - [Tab-Switching Keyboard Shortcuts]
**Learning:** When implementing a global keyboard shortcut (like '/') that may require switching active tabs (e.g., from 'Billing' to 'Inventory') before focusing an input, use `setTimeout(() => input.focus(), 0)` to allow React to finish the render cycle for the new tab before attempting to focus the element.
**Action:** Always wrap programmatic focus calls in `setTimeout` if they depend on state-driven visibility changes.
