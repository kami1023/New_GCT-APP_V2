## 2025-05-22 - Search UX Modernization
**Learning:** Replacing legacy imperative DOM manipulation with declarative React state allows for robust empty states and auxiliary controls (like clear buttons) without manual DOM sync issues. Global keyboard shortcuts like '/' significantly improve efficiency for power users but must be guarded against focus hijacking in inputs/textareas.
**Action:** Always prioritize controlled components for search inputs to enable features like "Clear search" and keyboard shortcuts. Ensure global listeners check `document.activeElement` before firing.
