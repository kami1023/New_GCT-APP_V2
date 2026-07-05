## 2025-07-05 - [Declarative Search & Focus Management]
**Learning:** Transitioning search logic from imperative DOM manipulation (e.g., querySelectorAll and style.display) to declarative React state enables more robust UX features such as 'No results' empty states and programmatic focus management while keeping the codebase concise and type-safe.
**Action:** Always prefer declarative state for filtering lists. Use a 'searchQuery' state and a 'useRef' to target the input element for programmatic focusing after tab switches or clear-action triggers.
