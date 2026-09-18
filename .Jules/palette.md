## 2025-05-18 - Card Action Accessibility and Contrast
**Learning:** Icon-only action buttons in dark glass-morphism card layouts often suffer from low color contrast (`text-zinc-700`) and stay hidden from keyboard users when using `group-hover:opacity-100`.
**Action:** Combine `focus-visible:opacity-100` with hover states, add `focus-visible:ring-2` focus rings, ensure higher contrast (`text-zinc-400`), and provide descriptive `aria-label` attributes using product names.
