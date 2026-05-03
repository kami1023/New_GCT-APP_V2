## 2025-05-15 - Global Keyboard Shortcut for Search
**Learning:** Users often expect a `/` keyboard shortcut to quickly access search functionality in data-heavy dashboards. Providing a visual hint like `[/]` in the placeholder improves discoverability without cluttering the UI.
**Action:** When implementing search inputs on primary dashboards, always include a global `/` key listener and a corresponding placeholder hint. Ensure the listener checks `document.activeElement` to avoid focus hijacking during active typing.
