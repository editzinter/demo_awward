## 2024-05-24 - [Footer Accessibility]
**Learning:** Adding labels to hidden input fields and proper ARIA labels to anchor wrappers of generic icon components greatly improves screen reader accessibility. Explicit focus-visible states ensure keyboard navigability without disrupting the clean, minimal aesthetic for mouse users.
**Action:** When creating new interactive elements, always ensure inputs have associated labels (even visually hidden ones) and icon-only interactive elements have clear ARIA labels. Implement `focus-visible` styling proactively.
