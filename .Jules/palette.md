## 2025-02-18 - [Accessibility on Dashboards]
**Learning:** Inputs like product searches must have an explicit `aria-label` attribute even if they have placeholders to ensure that screen reader users can identify the input field and its exact context properly.
**Action:** Always add `aria-label="..."` on search inputs.

## 2025-02-18 - [Dashboard Keyboard Shortcuts]
**Learning:** For dashboard heavy interfaces, global keyboard shortcuts (like `/` to focus search) drastically improve efficiency. However, the event handler must explicitly ignore typing when the user is inside an input or textarea element to avoid focus disruption.
**Action:** Verify that `document.activeElement` is not an input or textarea in keydown handlers.
