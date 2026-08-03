## 2025-02-18 - Hover Action Discovery via Focus
**Learning:** Revelatory micro-interactions that trigger actions only on hover are completely inaccessible to screen reader and keyboard-only users unless they are also explicitly paired with visual focus state indicators like `group-focus-within` and `focus-visible`.
**Action:** When designing cards with contextual actions (like Delete), always ensure utility buttons are discoverable via key navigation by tying their visibility to the card's focus states and equipping them with corresponding `aria-label` elements.
