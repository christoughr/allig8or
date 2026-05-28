# Claude — Full Project Review (allig8or.com)

**Paste this entire file + attach repo ZIP or link:** https://github.com/christoughr/allig8or  
**Live:** https://allig8or.com · https://allig8or.com/app

---

## What to review

**allig8or** — AI Office Suite. User prompts → Website (HTML preview), PPTX, XLSX, DOCX, PDF-ready HTML.

| Layer | Stack |
|-------|--------|
| Frontend | Next.js 16, React 19, Tailwind 4, shadcn/ui |
| Fonts | Syne (headings) + DM Sans (body) |
| AI | Anthropic `claude-sonnet-4-5-20250929` |
| Files | pptxgenjs, exceljs, docx |
| Payments | **Lemon Squeezy** (NOT Stripe) — mnemonic store temp, allig8or store activating |
| Auth/DB | Supabase schema only — **no auth UI yet** |
| Deploy | Vercel team `onlyus`, domain allig8or.com |

---

## File map (priority)

```
app/page.tsx, app/app/page.tsx
app/api/generate/{website,presentation,spreadsheet,document,pdf}/route.ts
app/api/checkout/route.ts
app/api/webhooks/lemonsqueezy/route.ts
lib/claude.ts, lib/rateLimit.ts, lib/lemonsqueezy.ts, lib/stripHtml.ts
lib/generators/*
components/landing/*
components/generator/*
supabase_schema.sql
types/index.ts
```

---

## Review dimensions

### A. Product & UX
- Landing: conversion, clarity, trust, mobile
- Generator: empty/error/rate-limit states, tool switching, preview UX
- Copy: headline, CTAs, pricing clarity
- Does it feel worth premium monthly pricing?

### B. Engineering
- API security (unauthenticated generate routes, rate limit in-memory)
- Claude JSON/HTML parsing edge cases
- base64 file responses vs Vercel 4.5MB limit
- iframe sandbox XSS (`allow-scripts` only)
- Webhook signature + Supabase sync
- Model ID, error handling

### C. Business / launch readiness
- Lemon Squeezy: mnemonic vs allig8or store strategy
- Missing: auth, project save, usage limits per plan, Supabase Storage
- DNS, env vars, webhook URL on production domain

### D. Design
- Typography, spacing, brand consistency (emerald dark theme)
- Accessibility (contrast, focus states)
- Suggestions for next design iteration (no full rewrite unless critical)

---

## Output format (required)

### 1. Executive summary
Ship-ready for beta? What's blocking paid launch?

### 2. Scorecard (1–10)
Product UX | Visual design | Code quality | Security | Monetization readiness

### 3. Critical (must fix before charging money)
Numbered, with file paths + minimal fix

### 4. High priority (first week post-launch)
Numbered

### 5. Nice to have

### 6. Suggested diffs
Only for critical/high — minimal patches

### 7. Roadmap recommendation
Order: Auth → Usage limits → Storage → Templates → ...

### 8. Competitor positioning
One paragraph: how this compares to Gamma, Tome, v0, Copilot — what's the wedge?

---

## Rules
- **Never suggest Stripe** — Lemon Squeezy only
- Same legal entity can run multiple LS stores — allig8or activation pending
- Be specific with file paths
- Korean business context OK (single 사업자, US MoR via LS)

---

## Current known issues (verify in code)

- [ ] Generate APIs public — no auth
- [ ] IP rate limit 10/hr resets on cold start
- [ ] HTML sometimes wrapped in markdown fences (stripHtml.ts added)
- [ ] Supabase not wired to UI
- [ ] Checkout needs LS env vars
- [ ] `usage` table RLS insert may be too open

---

*Last updated: 2026-05-26 — post design refinement, DNS live on allig8or.com*
