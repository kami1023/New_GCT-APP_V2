## 2026-04-04 - [Accessible and Safe Confirm Dialog]
**Learning:** Confirmation dialogs for destructive actions should follow WAI-ARIA alertdialog patterns and apply 'autoFocus' to the non-destructive (Cancel) button to prevent accidental confirmation by keyboard users. Also, semi-transparent overlays can suffer from readability issues if the background isn't solid enough.
**Action:** Use 'useId' for linking ARIA attributes and apply 'bg-zinc-900' (or similar solid background) to modal containers to ensure readability against dynamic backgrounds.
