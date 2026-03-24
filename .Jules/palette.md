## 2025-05-15 - [Accessibility: Hover vs Keyboard Focus]
**Learning:** Interactive elements that use `group-hover:opacity-100` to become visible are inaccessible to keyboard users because they remain hidden until a mouse hovers over the container.
**Action:** Always pair `group-hover:opacity-100` with `focus-visible:opacity-100` and ensure proper focus indicators are present.
