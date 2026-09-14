## 2025-05-18 - Keyboard Discoverability and Contrast for Card Actions
**Learning:** Actions in cards hidden behind hover (e.g., delete button) become invisible to keyboard users and low contrast icons (`text-zinc-700` on dark background) fail contrast requirements.
**Action:** Use `focus-visible:opacity-100` alongside `group-hover:opacity-100`, explicit focus rings, `text-zinc-400`, and descriptive `aria-label` including item names (`product.name`).
