# Bugs: Contact Section

**QA Engineer:** qa-engineer-e2e  
**Date:** 2026-05-17  
**Status:** 0 Critical · 0 High · 0 Medium · 3 Low  
**Merge gate:** ✅ CLEAR (no unresolved Critical/High bugs)

---

## Summary Table

| ID | Severity | Type | Component | Status |
|----|----------|------|-----------|--------|
| BUG-001 | Low | UX / Accessibility | `app/globals.css` + `Contact.tsx` | Open |
| BUG-002 | Low | UX / Design Fidelity | `components/sections/Contact.tsx` | Open |
| BUG-003 | Low | UX / Design Fidelity | `components/sections/Contact.tsx` | Open |

---

## BUG-001: Hover transitions not disabled under `prefers-reduced-motion: reduce`

- **Severity:** Low
- **Type:** UX / Accessibility
- **Component:** `app/globals.css`, `components/sections/Contact.tsx`
- **Test Case:** TC-009

### Reproduction Steps

1. Enable "Reduce Motion" in OS settings (macOS: System Settings → Accessibility → Display → Reduce Motion).
2. Navigate to `http://localhost:4321/#contact`.
3. Hover over the email link (`oscarmdzgarcia@gmail.com`) or any social link.
4. Observe: the `color 0.2s` transition still animates.

### Expected Behavior

Per wireframe spec (Animation & Motion section) and user-stories.md (US4, AC point 10): "Section respects `prefers-reduced-motion: reduce` media query (animations disabled)." Link hover transitions should be instant (0 duration) when reduced motion is enabled.

### Actual Behavior

The `@media (prefers-reduced-motion: reduce)` block in `globals.css` only disables `scroll-behavior` on `html`. The `transition-colors duration-200` applied to both the email link and social links still fire at full 200ms duration regardless of OS preference.

Verified by enumerating CSS rules: only one reduced-motion media query found:
```css
@media (prefers-reduced-motion: reduce) {
  html { scroll-behavior: auto; }
}
```

### Root Cause Analysis

`globals.css` was written to handle the scroll-behavior case but does not include a blanket transition override. Tailwind's `transition-*` utilities do not automatically respect `prefers-reduced-motion` without an explicit `motion-reduce:` modifier.

### Proposed Fix

**Option A** — Add `motion-reduce:` Tailwind modifiers directly to Contact.tsx links (narrowly scoped):

```tsx
// Email link className addition:
"motion-reduce:transition-none"

// Social link className addition:
"motion-reduce:transition-none"
```

**Option B** — Add a global CSS rule in `globals.css` (affects entire site consistently, recommended if other sections also animate):

```css
@media (prefers-reduced-motion: reduce) {
  html { scroll-behavior: auto; }
  *, *::before, *::after {
    transition-duration: 0.01ms !important;
    animation-duration: 0.01ms !important;
  }
}
```

Option B is preferred as it provides consistent coverage across all portfolio sections and aligns with the WCAG 2.1 AAA guideline for motion sensitivity.

---

## BUG-002: Mobile heading renders at 24px instead of wireframe-specified 28px

- **Severity:** Low
- **Type:** UX / Design Fidelity
- **Component:** `components/sections/Contact.tsx` (line 29)
- **Test Case:** TC-005, TC-010

### Reproduction Steps

1. Open browser DevTools, set viewport to 375×812 (iPhone SE).
2. Navigate to `http://localhost:4321/#contact`.
3. Inspect the `<h2 id="contact-heading">` computed `font-size`.
4. Observe: `24px`.

### Expected Behavior

Wireframe (`wireframes.md`, Mobile Layout section) specifies: "font: Inter, **28px** semibold".  
User-stories.md (US3, AC): "Heading font size is **28px** on mobile".

### Actual Behavior

`text-2xl` in Tailwind CSS v4 maps to `1.5rem = 24px` (at the default 16px root font size). The heading renders 4px smaller than the spec.

### Root Cause Analysis

The developer chose `text-2xl` as the mobile heading class, likely targeting readability rather than the exact pixel value. `text-2xl` (24px) vs the spec's 28px is a 14% size reduction. The wireframe's 28px would correspond to `text-[28px]` as an arbitrary value or `text-3xl` (1.875rem = 30px, slightly over spec).

### Proposed Fix

Replace `text-2xl` with `text-[28px]` to exactly match the wireframe spec:

```tsx
// Before:
className="text-2xl lg:text-4xl font-semibold text-text-primary mb-6"

// After:
className="text-[28px] lg:text-4xl font-semibold text-text-primary mb-6"
```

**Note:** This is cosmetic. The heading at 24px is readable and the section functions correctly. Prioritise only if pixel-perfect fidelity is required for the portfolio.

---

## BUG-003: Desktop layout styles apply at 1024px (`lg:`) instead of wireframe-specified 600px

- **Severity:** Low
- **Type:** UX / Design Fidelity
- **Component:** `components/sections/Contact.tsx` (lines 25, 31, 37)
- **Test Case:** TC-011

### Reproduction Steps

1. Open DevTools, set viewport to 768×1024 (tablet).
2. Navigate to `http://localhost:4321/#contact`.
3. Inspect the computed `padding-top` on `<section id="contact">` and `font-size` on the heading.
4. Observe: `padding-top: 80px` (mobile value), `font-size: 24px` (mobile value).

### Expected Behavior

Wireframe (`wireframes.md`): "Tablet/Desktop Layout (600px+)" specifies 36px heading, 40px horizontal padding, 128px vertical padding at screens ≥600px.  
User-stories.md (US3): "Contact section renders correctly on 600px width (tablet) with adjusted spacing."

### Actual Behavior

All `lg:` prefixed classes (`lg:py-32`, `lg:text-4xl`, `lg:px-10`) use Tailwind's default `lg` breakpoint: **1024px**. Between 600px and 1023px, the section renders with mobile-sized layout (24px heading, 80px padding, 24px side padding).

Verified at 768px: `headingFontSize: 24px`, `sectionPaddingTop: 80px`, `wrapperPaddingLeft: 24px`.

### Root Cause Analysis

The developer used standard Tailwind `lg:` prefix (1024px) for "desktop" styles. The wireframe's threshold of "600px" aligns more closely with Tailwind's `sm:` (640px) or `md:` (768px) breakpoints.

### Proposed Fix

Change `lg:` to `md:` (≥768px) or `sm:` (≥640px) depending on which breakpoint better matches the design intent:

```tsx
// Option A: Use md: (768px) — closest standard breakpoint to wireframe's 600px
className="py-20 md:py-32 md:text-4xl md:px-10"

// Option B: Use sm: (640px) — closest to wireframe's 600px spec
className="py-20 sm:py-32 sm:text-4xl sm:px-10"
```

The wrapper `max-w-[900px]` remains unchanged — it constrains content width at all sizes.

**Note:** The current layout at 768px is readable and functional. This is a spec fidelity issue, not a functional regression. At 768px, a potential collaborator viewing on an iPad would see the compact layout, which is acceptable but not optimal.
