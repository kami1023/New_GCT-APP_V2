## 2025-05-18 - Hover-Only Actions Keyboard Discoverability
**Learning:** Hover-only action buttons (such as delete actions in inventory cards) are hidden from keyboard users unless `focus-visible:opacity-100` and explicit focus ring indicators are applied.
**Action:** Always include `focus-visible:opacity-100` and explicit `focus-visible:ring-2` styles whenever card actions rely on hover triggers (`group-hover:opacity-100`).
