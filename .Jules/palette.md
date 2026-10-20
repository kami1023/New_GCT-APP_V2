## 2025-05-18 - Declarative Search & Keyboard Accessibility
**Learning:** Declarative state filtering allows immediate empty states with recovery actions (like 'Clear Search'), while `/` key handling must exclude active inputs/textareas to avoid typing disruptions.
**Action:** Always check `document.activeElement` before firing global single-key shortcuts, and pair search inputs with explicit clear actions and focus restoration via `useRef`.
