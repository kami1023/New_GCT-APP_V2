# Palette's Journal

## 2025-02-18 - [Accessibility on Destructive Actions]
**Learning:** For accessibility on destructive actions like 'Delete', icon-only buttons should include an `aria-label` that specifies the item being deleted (e.g., `aria-label="Delete product..."`) to provide context to screen reader users, and actions revealed only on hover must also be made visible on focus (e.g., using Tailwind's `focus-visible:opacity-100` or `group-focus-within:opacity-100`).
**Action:** Always provide explicit, item-specific `aria-label`s for destructive actions and ensure they are discoverable via keyboard focus.
