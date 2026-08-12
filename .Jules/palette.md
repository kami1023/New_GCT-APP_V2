## 2025-02-23 - Declarative Search & Focus Management
**Learning:** Transitioning search logic from imperative DOM queries to declarative React state enables more robust UX features such as 'No results' empty states and seamless keyboard accessibility, but requires careful focus management to prevent a broken focus loop when clearing search.
**Action:** When adding inline input actions (like a 'Clear' button), ensure the input has sufficient right padding (e.g., `pr-12`) to prevent text overlap, and programmatically return focus to the input via a React `useRef` upon trigger.

## 2025-02-23 - Search Flicker Prevention
**Learning:** Showing a 'No results' empty state immediately on load can cause a jarring flicker while products are still being fetched from the backend, confusing screen readers and keyboard users.
**Action:** Prevent search flicker by ensuring the 'No results' empty state is conditionally displayed only when the search query is non-empty, or when products are fully loaded and actually empty.
