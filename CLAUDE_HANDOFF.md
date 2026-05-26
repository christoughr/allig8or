# Claude Handoff — allig8or.com

> Paste this file + ZIP into Claude or Cursor to continue.

---

## Product

AI Office Suite. Users type a prompt → instant output:
- Website → HTML iframe preview
- Slides → .pptx download
- Spreadsheet → .xlsx download
- Document → .docx download
- PDF → HTML-for-print (preview + download)

---

## Status (2026-05-26 — after P0 fix pass)

### Done
- [x] Next.js 16 + Tailwind 4 + shadcn/ui
- [x] Claude API (claude-sonnet-4-20250514)
- [x] File generators: pptxgenjs, exceljs, docx
- [x] API routes: /api/generate/{website,presentation,spreadsheet,document,pdf}
- [x] Generator UI: ChatPanel + PreviewPanel + ToolSelector
- [x] Landing page: Hero + Pricing
- [x] Lemon Squeezy checkout + webhook
- [x] Supabase schema (projects, usage, subscriptions)
- [x] types/index.ts (ToolType etc.)
- [x] IP-based rate limit on all /api/generate/* (10/hour free)
- [x] XSS fix: iframe sandbox removes allow-same-origin
- [x] next.config.ts: serverExternalPackages + 10mb body limit
- [x] .env.example: Lemon Squeezy only (Stripe removed)
- [x] Webhook listUsers pagination fix

### P0 — Must do before going live
1. **Vercel env vars** — add all vars from .env.example, especially ANTHROPIC_API_KEY → redeploy
2. **Lemon Squeezy** — create Pro/Team products, copy variant IDs to Vercel env, set webhook URL
3. **Supabase** — run supabase_schema.sql, add Supabase env vars to Vercel

### P1 — Launch quality
4. Supabase Auth UI — login page + Google OAuth
5. Middleware — protect /app, redirect to login if not authed
6. Save/load projects in DB
7. Usage limits per plan (replace IP rate limit with DB-backed user limits)

### P2 — Growth
8. Real PDF export (puppeteer/jspdf)
9. Custom domain allig8or.com on Vercel
10. Template library, version history, collab

---

## Billing
Lemon Squeezy ONLY. No Stripe anywhere.
- Checkout: GET /api/checkout?plan=pro|team
- Webhook: POST /api/webhooks/lemonsqueezy
- Plans: lib/lemonsqueezy.ts

---

## Key files
```
lib/claude.ts               Claude API + system prompts
lib/lemonsqueezy.ts         Billing plans + checkout URL
lib/rateLimit.ts            IP rate limiter (10/hr free)
lib/generators/             presentation.ts / spreadsheet.ts / document.ts
app/api/generate/*/         5 API routes (all rate limited)
app/api/checkout/           Lemon Squeezy redirect
app/api/webhooks/           Subscription sync to Supabase
components/generator/       GeneratorLayout / ChatPanel / PreviewPanel / ToolSelector
types/index.ts              ToolType + shared interfaces
supabase_schema.sql         Run once in Supabase SQL editor
.env.example                All required env vars
```

---

## Env vars (Vercel → Settings → Environment Variables)

```
ANTHROPIC_API_KEY               (required — generators fail without this)
NEXT_PUBLIC_SUPABASE_URL
NEXT_PUBLIC_SUPABASE_ANON_KEY
SUPABASE_SERVICE_ROLE_KEY       (webhook needs this)
LEMONSQUEEZY_API_KEY
LEMONSQUEEZY_WEBHOOK_SECRET
NEXT_PUBLIC_LEMONSQUEEZY_STORE_ID
NEXT_PUBLIC_LEMONSQUEEZY_VARIANT_PRO
NEXT_PUBLIC_LEMONSQUEEZY_VARIANT_TEAM
NEXT_PUBLIC_APP_URL             https://allig8or.com
```

---

## Links
- GitHub: https://github.com/christoughr/allig8or
- Vercel: https://allig8or.vercel.app
- App: https://allig8or.vercel.app/app

---

## Known issues (non-blocking for MVP)
- base64 data URLs may hit 4.5MB Vercel limit on large files → P1: move to Supabase Storage
- In-memory rate limiter resets on cold start → P1: replace with Upstash Redis
- PDF is HTML-for-print only, not true PDF binary
- No auth on /app yet → anyone can use generator (rate limited by IP only)
