## 2025-05-22 - Accessible Search with Keyboard Shortcuts

**Learning:** Implementing a global '/' keyboard shortcut significantly improves power-user efficiency in dashboard interfaces. However, it requires careful management of focus hijacking (checking `activeElement`) and ensuring the target view is rendered before focusing. Adding a hint like `[/]` in the placeholder improves discoverability for this hidden feature.

**Action:** Always include a discoverability hint when adding keyboard shortcuts to inputs, and use `setTimeout` to ensure DOM readiness when switching views before focusing.

## 2025-05-22 - Declarative vs Imperative Search

**Learning:** Imperative search logic (direct DOM manipulation) is brittle in React and doesn't scale well for complex UI states like "No results found". Refactoring to declarative state-driven filtering simplifies the code and makes features like 'Clear Search' much easier to implement reliably.

**Action:** Prioritize declarative state for UI filtering to ensure consistency and support for empty states.
