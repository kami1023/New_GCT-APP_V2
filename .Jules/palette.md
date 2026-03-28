# Palette's Journal - Critical Learnings

## 2025-05-23 - [Safety in Confirmation Dialogs]
**Learning:** For destructive actions, the "Cancel" or non-destructive button should receive `autoFocus`. This provides a safety net against accidental key presses (like hitting 'Enter' too quickly) and improves keyboard accessibility by providing a clear initial focus.
**Action:** Always check confirmation modals for `autoFocus` on the safe action.

## 2025-05-23 - [Icon-only Button Accessibility]
**Learning:** Icon-only buttons are invisible to screen readers if they lack `aria-label`. They also often lack `title` attributes for sighted users.
**Action:** Ensure all `lucide-react` icons within buttons are accompanied by descriptive `aria-label` or `title` on the button itself.

## 2025-05-23 - [Keyboard Visibility of Hover Actions]
**Learning:** Elements that only appear on `group-hover` (like a delete button on a card) are inaccessible to keyboard users unless they also respond to `focus-within` or `focus-visible`.
**Action:** Pair `group-hover:opacity-100` with `focus-visible:opacity-100` (or `group-focus-within:opacity-100`) to ensure interactive elements are discoverable by keyboard.
