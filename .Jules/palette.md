## 2025-05-14 - Declarative Search & Global Shortcuts

**Learning:** The application was using imperative DOM manipulation for product filtering, which bypassed React's render cycle and led to inconsistent UI states (like missing empty states). Power users benefit significantly from discoverable keyboard shortcuts like '/' for search, especially when paired with a clear visual hint like ' [/] '.

**Action:** Always prefer declarative state-driven filtering in React for inventory/dashboard views. When adding global shortcuts, include visual hints in placeholders and ensure focus is managed correctly across tab/view transitions.
