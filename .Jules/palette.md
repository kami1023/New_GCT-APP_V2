## 2025-05-22 - Search UX & Shortcut Pattern

**Learning:** Search interfaces in this repository benefit from a declarative React state-driven filtering approach rather than imperative DOM manipulation. Adding a global '/' shortcut improves power-user efficiency, but requires checking that the user isn't already in an input field to avoid focus hijacking.

**Action:** When implementing search, use a `useRef` to focus the input after tab switches or shortcut triggers. Always include a "Clear Search" icon button with an ARIA label for better accessibility. Ensure "No results found" empty states provide a clear call-to-action (like a 'Clear Search' button) to reset the state.
