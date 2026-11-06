## 2026-11-06 - Declarative Search UX & Focus Recovery
**Learning:** Imperative DOM filtering leaves users stranded in empty states with no feedback or quick recovery path. Declarative state with `useMemo` enables clean empty-state affordances, accessible inline clear actions, and programmatic focus restoration.
**Action:** When adding search inputs, pair an inline clear action with programmatic focus return (`ref.current?.focus()`) and an explicit empty-state fallback to prevent blank grids.
