# Palette's Journal - Ganesh Cleantech

## 2025-02-17 - Ambiguous Accessible Names in Playwright
**Learning:** Having an inline clear button and a main empty state button with the same accessible name ("Clear Search") is great for a11y, but triggers Playwright strict mode violations.
**Action:** Use unique locator selectors (e.g. `get_by_label` or `has-text`) in tests to distinguish elements with shared accessible names.
