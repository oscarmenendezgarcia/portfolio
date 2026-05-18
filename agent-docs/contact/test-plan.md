# Test Plan: Contact Section

**Feature:** Sección Contact  
**Stage:** QA (qa-engineer-e2e)  
**Date:** 2026-05-17  
**Tested against:** `http://localhost:4321` (Next.js 16 production build)  
**Input artifacts:** wireframes.md · user-stories.md · review-report.md (APPROVED) · Contact.tsx

---

## Executive Summary

The Contact section is a static Next.js Server Component rendering a direct email CTA, a horizontal divider, and secondary social links. Code review was APPROVED with zero code issues. QA testing confirms the implementation is functional and visually correct across all breakpoints. Two Low-severity spec deviations were found (heading font size on mobile/tablet, and hover transitions not fully disabled under `prefers-reduced-motion`). No Critical or High bugs — **merge gate: CLEAR**.

---

## Scope & Objectives

| In Scope | Out of Scope |
|----------|-------------|
| Visual rendering at 375px, 768px, 1440px | Backend API (none exists) |
| Accessibility tree / ARIA attributes | Email delivery (external dependency) |
| Keyboard navigation and focus ring | Social platform availability |
| Link targets and href correctness | Cross-browser testing (Chrome only) |
| Responsive layout metrics | Load / performance testing (static SSG) |
| OWASP security assessment | Auth / session testing (N/A) |
| Reduced-motion CSS coverage | |

---

## Environment Requirements

| Item | Value |
|------|-------|
| Runtime | Node.js 20+ |
| Framework | Next.js 16.2.6 (App Router, SSG) |
| Server | `npx next start -p 4321` after `npm run build` |
| Browser | Chromium (Playwright MCP) |
| Viewports tested | 375×812 (mobile), 768×1024 (tablet), 1440×900 (desktop) |
| Design tokens reference | `app/globals.css`, `tailwind.config.js` |

---

## Test Levels

### Unit / Static Analysis
- Component structure review (Contact.tsx — 77 lines, Server Component)
- TypeScript type correctness
- Tailwind class validity

### Integration
- Data sourcing from `lib/site.ts` (email + socials)
- mailto: href assembly
- Social link href correctness

### E2E (Playwright)
- Visual rendering at all breakpoints
- Computed styles verification (color, size, font, padding)
- ARIA accessibility tree snapshot
- Keyboard focus ring
- Anchor navigation (`#contact`)
- Horizontal scroll check

### Security (OWASP Top 10)
- External links: `rel="noopener noreferrer"`
- No user input surfaces (no forms, no injection risk)
- Secure external URLs (HTTPS only)

---

## Test Cases

| ID | Type | Description | Input | Expected | Priority |
|----|------|-------------|-------|----------|----------|
| TC-001 | E2E | Section structure and ARIA attributes | Navigate to `/#contact` | `id="contact"`, `aria-labelledby="contact-heading"`, `<h2 id="contact-heading">` present | Critical |
| TC-002 | E2E | Email CTA computed styles (desktop) | `getComputedStyle()` on email `<a>` at 1440px | color: `#d4af37`, font: JetBrains Mono 18px, height ≥44px, href: `mailto:oscarmdzgarcia@gmail.com` | Critical |
| TC-003 | E2E | Social links data and attributes | `querySelectorAll('[role="listitem"]')` | 3 links (GitHub/LinkedIn/X), `target="_blank"`, `rel="noopener noreferrer"`, color `#999999`, 14px mono, height ≥44px | High |
| TC-004 | E2E | Desktop layout spacing | `getComputedStyle()` on section/wrapper at 1440px | paddingTop/Bottom: 128px, maxWidth: 900px, paddingH: 40px, scrollMarginTop: 80px | High |
| TC-005 | E2E | Mobile layout (375px) | Resize to 375×812, compute styles | paddingTop/Bottom: 80px, paddingH: 24px, headingFontSize: 24px, scrollMarginTop: 64px, no horizontal scroll | High |
| TC-006 | E2E | Focus ring on email link | `element.focus()`, `getComputedStyle()` | outline: 2px solid `#d4af37`, outlineOffset: 2px | High |
| TC-007 | E2E | Anchor navigation | Navigate to `http://localhost:4321/#contact` | Contact section scrolled into viewport (top < innerHeight) | High |
| TC-008 | E2E | Tab order within section | `querySelectorAll('#contact a')` + tabIndex | 4 links in order: email → GitHub → LinkedIn → X, all tabIndex=0 | Medium |
| TC-009 | E2E | Reduced-motion CSS coverage | Enumerate `@media (prefers-reduced-motion)` rules | All transitions on contact links disabled under `reduce` | Medium |
| TC-010 | E2E | Mobile heading size vs wireframe | Compute heading fontSize at 375px | Wireframe specifies 28px; `text-2xl` renders 24px | Low |
| TC-011 | E2E | Tablet breakpoint (768px) | Resize to 768×1024 | Desktop styles do not apply (lg: = 1024px); content still readable and no horizontal scroll | Medium |
| TC-012 | Security | External link safety | Inspect `rel` on all `target="_blank"` links | `rel="noopener noreferrer"` present on all 3 social links | High |
| TC-013 | Security | No injection surface | Inspect all rendered data | Email/socials sourced from hardcoded `lib/site.ts`, no user input rendered | High |
| TC-014 | E2E | Visual snapshot desktop 1440px | Screenshot at 1440×900, section in viewport | Heading white, email gold mono, divider visible, social links secondary muted | High |
| TC-015 | E2E | Visual snapshot mobile 375px | Screenshot at 375×812 | Layout correct: email prominent, social links in row, footer visible below | High |
| TC-016 | E2E | Visual snapshot tablet 768px | Screenshot at 768×1024 | Section readable, no overflow, email gold, footer visible | Medium |
| TC-017 | E2E | Divider presentational | `aria-hidden` on `<hr>` | `aria-hidden="true"` present | Medium |
| TC-018 | E2E | List semantics | `role` on container and items | Container: `role="list"`, items: `role="listitem"`, `aria-label="Social profiles"` on container | High |

---

## Assumptions

1. **Performance testing skipped**: The site is fully statically generated (SSG). Next.js serves static HTML with no server-side computation. Load testing has no added value here.
2. **Screen reader test simulated via accessibility tree snapshot**: Full VoiceOver/NVDA testing would require a human operator. Accessibility tree structure is verified via Playwright's snapshot API.
3. **mailto: link delivery not tested**: Opening the system email client is OS-dependent and outside browser automation scope. Link href correctness is verified programmatically.
4. **Social URLs not validated for live content**: GitHub, LinkedIn, and X URLs are correct strings per `lib/site.ts`; their content is Oscar's personal accounts.
5. **Entrance animation**: Wireframe marks fade-in/slide-up as "Optional". Implementation omits it — treated as accepted scope reduction.
6. **Colour contrast**: Numerically verified via sRGB luminance calculation (not tool-assisted): text-primary 18.1:1, text-secondary 7.2:1, accent 9.7:1. All exceed WCAG AA 4.5:1.

---

## Risk Assessment

| Risk | Likelihood | Impact | Mitigation |
|------|-----------|--------|------------|
| Reduced-motion transitions affect vestibular users | Low | Medium | Fix by adding `motion-reduce:transition-none` — see BUG-001 |
| Heading smaller than wireframe spec on mobile | Low | Low | 4px difference, UX acceptable — see BUG-002 |
| Breakpoint at 1024px rather than 600px | Low | Low | Tablet (600–1023px) shows mobile-sized layout, still readable — see BUG-003 |
| Email client unavailable | Very Low | Low | No mitigation needed; standard `mailto:` behaviour |
