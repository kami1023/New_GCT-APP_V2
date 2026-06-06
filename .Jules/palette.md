## 2025-05-15 - Declarative Search & Global Shortcuts
**Learning:** Refactoring imperative DOM-based filtering to declarative React state enables more robust UX patterns like "No Results" empty states and "Clear Search" actions without brittle direct manipulation. Global keyboard shortcuts (e.g., '/') must be guarded against current focus on 'INPUT' or 'TEXTAREA' to prevent focus hijacking during typing.
**Action:** Always prefer declarative filtering in React; use `useRef` for focus management; implement global shortcut listeners with `document.activeElement` checks.
