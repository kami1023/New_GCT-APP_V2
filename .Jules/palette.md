## 2025-05-15 - Focus Visibility for Hidden Elements
**Learning:** Interactive elements hidden by `opacity-0` and revealed via `group-hover:opacity-100` are inaccessible to keyboard users unless `focus-visible:opacity-100` is also applied.
**Action:** Always pair `group-hover:opacity-100` with `focus-visible:opacity-100` and a clear focus ring for hidden action buttons.
