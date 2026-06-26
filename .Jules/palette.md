## 2025-05-14 - Global Search Shortcut in Multi-Tab Dashboards
**Learning:** In applications with tabbed navigation, a global search keyboard shortcut (e.g., '/') is most effective when it programmatically navigates the user to the search-capable tab before applying focus. This ensures the shortcut is functional regardless of the user's current view.
**Action:** Always verify if the search input is globally available or tab-specific. If tab-specific, ensure the shortcut handler triggers the necessary state change to reveal the input before calling `.focus()`.

## 2025-05-14 - Declarative vs Imperative Search Filtering
**Learning:** Imperative search filtering using direct DOM manipulation (e.g., `querySelectorAll` and `element.style.display`) is brittle and makes implementing "No Results" empty states extremely difficult. Declarative state-based filtering in React enables robust empty states and better accessibility synchronization.
**Action:** Prioritize refactoring legacy imperative search logic to declarative React state to support modern UX features like "Clear Search" buttons and descriptive empty states.
