## 2025-02-18 - Keyboard Discoverability for Hover-Only Actions

**Learning:** Hover-only interactions (like delete buttons that only show on card hover) are completely invisible to keyboard-only and screen reader users unless we explicitly wire up focus indicators. Ensuring these elements become visible on focus/focus-within ensures that keyboard navigators do not miss critical interface controls.

**Action:** Always add Tailwind classes such as `focus-visible:opacity-100 group-focus-within:opacity-100` alongside hover classes like `group-hover:opacity-100` to allow hidden interactive elements to gracefully reveal themselves upon tab-navigation focus.
