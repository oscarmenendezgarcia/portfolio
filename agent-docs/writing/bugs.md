# Bug Report: Portfolio Writing Section

**Date:** 2026-05-17  
**QA Agent:** qa-engineer-e2e  
**Total bugs found:** 1 (Low)  
**Merge gate:** ✅ CLEAR — Zero Critical, High, or Medium bugs.

---

## BUG-001: Placeholder `#` hrefs on all article links

- **Severity:** Low
- **Type:** Functional / Content
- **Component:** `components/sections/Writing.tsx` — `ARTICLES` constant, `href` field
- **Status:** Advisory — expected for development prototype

### Reproduction Steps

1. Open portfolio at `http://localhost:3003`
2. Navigate to the Writing section
3. Click any "Read more →" link
4. Observe: page scrolls to top (navigates to `#`) instead of opening an external article

### Expected Behavior

Each "Read more →" link should open the corresponding published article in a new browser tab at the real external URL (LinkedIn post, X thread, or blog post).

### Actual Behavior

All three links have `href="#"`. Clicking them does not navigate to any external content. The link still opens with `target="_blank"` which causes a new tab to open to the same page.

### Root Cause Analysis

Placeholder `#` values are hardcoded in the `ARTICLES` array in `Writing.tsx`. This is intentional for the development phase — the developer and code-reviewer both documented this assumption. No real article URLs have been authored yet.

### Proposed Fix

Replace each `href: "#"` in the `ARTICLES` constant with the real external URL of the published article. Ensure all URLs use `https://` (no mixed-content). Example:

```
href: "https://linkedin.com/posts/your-actual-post-id"
href: "https://x.com/yourhandle/status/your-tweet-id"
href: "https://yourblog.com/your-slug"
```

### OWASP Reference

N/A — not a security issue. `rel="noopener noreferrer"` is already in place; the placeholder `#` does not create a security vulnerability.

### Notes

- This bug does not block merge — it is a content gap, not a code defect.
- The `target="_blank"` and `rel="noopener noreferrer"` are correctly set; only the destination URL is missing.
- Should be resolved before public launch of the portfolio.

---

*No additional bugs found. All 27 test cases passed.*
