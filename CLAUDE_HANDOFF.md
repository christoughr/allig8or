# Claude Handoff — allig8or.com (full context)

> **Paste this entire file into Claude** (or Cursor with `@CLAUDE_HANDOFF.md` + `@codebase`).  
> Use `CLAUDE_REVIEW_PROMPT.md` for a structured code-review pass only.

---

## 1. Product vision

**allig8or.com** — AI Office Suite. Users type a prompt → get:

| Tool | Output |
|------|--------|
| Website | HTML preview in iframe |
| Slides | `.pptx` download |
| Spreadsheet | `.xlsx` download |
| Document | `.docx` download |
| PDF | HTML designed for print (preview + download) |

Positioning: *"AI replaces Microsoft 365 + Google Workspace. Prompt in → file out."*

---

## 2. Current status (as of 2026-05-26)

### Done (MVP)

- [x] Next.js 16 App Router + Tailwind 4 + shadcn/ui
- [x] Claude API (`claude-sonnet-4-20250514`) with per-tool system prompts
- [x] File generators: pptxgenjs, exceljs, docx
- [x] API routes: `/api/generate/{website,presentation,spreadsheet,document,pdf}`
- [x] Generator UI: chat (420px) + preview panel + tool tabs
- [x] Landing page: Hero, tools, pricing
- [x] **Lemon Squeezy** (NOT Stripe): checkout redirect + webhook
- [x] Supabase SQL schema (projects, usage, subscriptions)
- [x] GitHub repo + Vercel production deploy

### Not done yet

- [ ] Supabase Auth UI (login/signup, Google OAuth)
- [ ] Save projects to DB / load history
- [ ] Usage limits (free 10/day, pro 200/day)
- [ ] Rate limiting on generate APIs
- [ ] Auth gate on `/app` in production
- [ ] Real PDF export (currently HTML-for-print; no puppeteer/jspdf)
- [ ] Supabase Storage for large files (currently base64 data URLs in JSON)
- [ ] Custom domain `allig8or.com` on Vercel
- [ ] Lemon Squeezy products + env vars in Vercel
- [ ] Vercel env vars for `ANTHROPIC_API_KEY` (generators fail without it)

---

## 3. Accounts & URLs

| Service | Account / URL | Notes |
|---------|---------------|-------|
| GitHub (target owner) | **christoughr** | Repo transfer initiated from `dearzumi` — **accept email** |
| GitHub (was) | dearzumi/allig8or | Redirects after transfer accept |
| Vercel | dearzumis-projects | https://allig8or.vercel.app |
| Local path | `/Users/zumi/allig8or` | |
| Email | christoughr@gmail.com | |

### After repo transfer accept

```bash
cd /Users/zumi/allig8or
git remote set-url origin git@github.com:christoughr/allig8or.git
git fetch origin
```

Vercel: Project Settings → Git → reconnect to `christoughr/allig8or` if needed.

---

## 4. Project file map

```
allig8or/
├── app/
│   ├── page.tsx                    # Landing (/)
│   ├── layout.tsx                  # Root layout + metadata
│   ├── globals.css                 # Tailwind + shadcn theme
│   ├── app/page.tsx                # Generator (/app)
│   └── api/
│       ├── checkout/route.ts       # GET → Lemon Squeezy checkout
│       ├── webhooks/lemonsqueezy/route.ts
│       └── generate/
│           ├── website/route.ts
│           ├── presentation/route.ts
│           ├── spreadsheet/route.ts
│           ├── document/route.ts
│           └── pdf/route.ts
├── components/
│   ├── generator/
│   │   ├── GeneratorLayout.tsx     # Main app shell + fetch logic
│   │   ├── ChatPanel.tsx
│   │   ├── PreviewPanel.tsx
│   │   └── ToolSelector.tsx
│   ├── landing/
│   │   ├── Hero.tsx
│   │   ├── DemoSection.tsx
│   │   └── Pricing.tsx             # Links to /api/checkout
│   └── ui/                         # shadcn: button, card, input, etc.
├── lib/
│   ├── claude.ts                   # Anthropic client + system prompts
│   ├── lemonsqueezy.ts             # PLANS + getCheckoutUrl()
│   ├── supabase.ts                 # Client helper (minimal)
│   ├── utils.ts                    # shadcn cn()
│   └── generators/
│       ├── presentation.ts         # PPTX
│       ├── spreadsheet.ts          # XLSX
│       └── document.ts             # DOCX
├── types/index.ts
├── supabase_schema.sql
├── .env.example                    # Committed template
├── .env.local                      # NOT in git — secrets here
├── CLAUDE_HANDOFF.md               # This file
├── CLAUDE_REVIEW_PROMPT.md         # Code review checklist
├── CURSOR_MASTER_PROMPT.md         # Original full build spec
├── CURSOR_BUILD_GUIDE.md           # Step-by-step checklist
├── README.md
├── package.json
└── components.json                 # shadcn config
```

---

## 5. Environment variables

Copy `.env.example` → `.env.local`. Required for **local generation**:

```env
ANTHROPIC_API_KEY=sk-ant-...
```

Full production set:

```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=

# Claude
ANTHROPIC_API_KEY=

# App
NEXT_PUBLIC_APP_URL=https://allig8or.vercel.app

# Lemon Squeezy
LEMONSQUEEZY_API_KEY=
LEMONSQUEEZY_WEBHOOK_SECRET=
NEXT_PUBLIC_LEMONSQUEEZY_STORE_ID=     # store slug
NEXT_PUBLIC_LEMONSQUEEZY_VARIANT_PRO=
NEXT_PUBLIC_LEMONSQUEEZY_VARIANT_TEAM=
```

Webhook URL: `https://allig8or.vercel.app/api/webhooks/lemonsqueezy`

---

## 6. Architecture flow

```
User prompt (ChatPanel)
    → POST /api/generate/{tool} { prompt, history }
        → lib/claude.ts → Anthropic API
        → (if file) lib/generators/* → Buffer
        → base64 data URL in JSON (or raw HTML for website)
    → PreviewPanel (iframe or download link)
```

**Lemon Squeezy:**

```
Pricing "Subscribe" → GET /api/checkout?plan=pro|team
    → redirect to lemonsqueezy.com/checkout/buy/{variantId}
Webhook → POST /api/webhooks/lemonsqueezy
    → verify X-Signature → upsert subscriptions table (needs Supabase service role)
```

---

## 7. Tech stack

| Layer | Choice |
|-------|--------|
| Framework | Next.js 16.2, React 19 |
| Styling | Tailwind 4, shadcn/ui |
| AI | `@anthropic-ai/sdk`, model `claude-sonnet-4-20250514` |
| PPTX | pptxgenjs 4 |
| XLSX | exceljs |
| DOCX | docx |
| Auth/DB | Supabase (schema ready, UI not wired) |
| Payments | **Lemon Squeezy only** |
| Deploy | Vercel |

---

## 8. Roadmap (priority order)

### P0 — Production blockers

1. Add `ANTHROPIC_API_KEY` (+ others) to **Vercel env** → redeploy
2. Accept **GitHub repo transfer** → update `git remote`
3. Lemon Squeezy: create Pro/Team products, set variant IDs, webhook secret
4. Run `supabase_schema.sql`, configure Supabase env

### P1 — Launch quality

5. Supabase Auth: `/login`, `/signup`, Google OAuth, protect `/app`
6. Persist projects + messages to `projects` table
7. Usage tracking + enforce `generationsPerDay` from plan
8. API rate limiting (middleware or Upstash)
9. Move file outputs to Supabase Storage (avoid huge base64 JSON)

### P2 — Growth

10. Template library per tool
11. Real PDF generation (puppeteer or similar)
12. Custom domain allig8or.com on Vercel
13. Customer portal link (Lemon Squeezy)
14. Phase 2 from CURSOR_MASTER_PROMPT.md (collab, version history, API access)

---

## 9. Known issues / review focus

- **No auth** on generate APIs — anyone can burn API credits
- **base64 data URLs** — large files may hit response size limits
- **iframe sandbox** allows scripts — Claude-generated HTML could XSS
- **Webhook** `listUsers()` without pagination if matching by email
- **usage** table RLS `insert with check (true)` may be too open
- **Checkout URL** format — verify against latest Lemon Squeezy docs
- Git commit author on Mac may show `zumi@macbook...` not christoughr

---

## 10. Commands

```bash
cd /Users/zumi/allig8or
npm install
npm run dev          # http://localhost:3000
npm run build
npx vercel --prod    # deploy
```

---

## 11. What to ask Claude to do

Pick one mode:

**A) Full review** — attach `CLAUDE_REVIEW_PROMPT.md` + repo  
**B) Implement next feature** — e.g. "Add Supabase Google auth and protect /app"  
**C) Fix production** — e.g. "Add rate limiting and move downloads to Storage"  
**D) UX polish** — landing + generator mobile, empty states  

Always say: **Use Lemon Squeezy, not Stripe.** Reference files by path from section 4.

---

## 12. Links

- Production: https://allig8or.vercel.app
- App: https://allig8or.vercel.app/app
- GitHub (after transfer): https://github.com/christoughr/allig8or
- Lemon Squeezy: https://app.lemonsqueezy.com
- Supabase: https://supabase.com/dashboard
- Vercel: https://vercel.com/dearzumis-projects/allig8or

---

*Generated for handoff to Claude / christoughr. Update this file when major milestones ship.*
