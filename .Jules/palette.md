## 2025-05-15 - [Accessible Hover Actions]
**Learning:** Icon buttons that are hidden by default (e.g., `opacity-0`) and only shown on hover are completely inaccessible to keyboard users unless they also respond to focus. Screen readers might find them, but sighted keyboard users won't know where they are or what they do.
**Action:** Always pair `hover:opacity-100` with `focus-visible:opacity-100` and provide a clear focus indicator like a ring or outline to ensure keyboard-driven discoverability.
