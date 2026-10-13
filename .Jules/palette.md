# Palette's Journal - UX & Accessibility Learnings

## 2025-05-18 - Hover Actions and Low Contrast Icons in Dark Mode
**Learning:** Icon buttons hidden by hover (`opacity-0 group-hover:opacity-100`) and low contrast colors (`text-zinc-700` on dark background) render delete actions completely inaccessible to keyboard and screen reader users.
**Action:** Always add `group-focus-within:opacity-100` / `focus-visible:opacity-100`, improve base contrast (e.g. `text-zinc-400`), and provide descriptive `aria-label`s specifying the target object name.
