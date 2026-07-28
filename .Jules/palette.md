# Palette's Journal - Critical Learnings Only

## 2025-07-28 - Hover-only Actions & Keyboard Accessibility
**Learning:** Actions only revealed on hover (such as Delete buttons on inventory cards) are completely hidden and inaccessible to keyboard-only and screen reader users unless explicitly configured to appear on focus (`focus-visible:opacity-100` or `focus:opacity-100`). Additionally, they require a clear focus indicator and descriptive ARIA labels to ensure proper discoverability and interaction.
**Action:** Always make hover-only action elements visible when they receive focus, style their focus states clearly, and add distinct ARIA labels (e.g., `aria-label={\`Delete \${product.id}\`}`) to provide context.
