## 2025-05-15 - [Accessible Visibility for Hover-Only Actions]
**Learning:** Actions that are only revealed on hover (like 'Delete' buttons in inventory cards) are inaccessible to keyboard and screen reader users if they remain hidden. Using `focus-visible:opacity-100` alongside `group-hover:opacity-100` ensures these actions are discoverable during tab navigation.
**Action:** Always pair hover-based visibility with `focus-visible` or `focus-within` states and provide a clear focus ring to ensure accessibility.
