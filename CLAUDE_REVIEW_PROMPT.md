# Claude Code Review — allig8or.com

Copy everything below this line into Claude (or Cursor chat) with `@codebase` or attach the repo.

---

You are a senior full-stack engineer reviewing **allig8or** — an AI office suite (Next.js 16 App Router) that generates websites, PPTX, XLSX, DOCX, and PDF-ready HTML via the Claude API. Billing uses **Lemon Squeezy** (not Stripe). Auth/DB is **Supabase** (optional for MVP).

## Your job

1. **Security audit** — API routes, webhook signature verification, env leaks, iframe sandbox, prompt injection risks
2. **Correctness** — Claude JSON parsing, file generators (pptxgenjs, exceljs, docx), error handling
3. **Production readiness** — missing auth gates, rate limits, usage tracking, RLS policies
4. **UX** — generator layout, loading states, download flows, mobile
5. **Lemon Squeezy** — checkout URL format, webhook → Supabase sync, plan mapping

## Review checklist

### API (`app/api/generate/*`)
- [ ] Validates `prompt` and handles malformed Claude responses
- [ ] `parseJsonResponse` strips markdown fences reliably
- [ ] Large base64 data URLs in JSON responses — should use blob URLs or Storage instead?
- [ ] Rate limiting / auth before burning API credits

### Claude (`lib/claude.ts`)
- [ ] Model ID still valid
- [ ] System prompts produce parseable JSON for presentation/spreadsheet/document
- [ ] Website/HTML responses — XSS if rendered in iframe with `allow-scripts`?

### Generators (`lib/generators/*`)
- [ ] pptxgenjs v4 API usage (`pptx.ShapeType` vs static import)
- [ ] Excel header colors — argb format (`FF` prefix)
- [ ] DOCX edge cases — empty sections, missing tables

### Lemon Squeezy
- [ ] `lib/lemonsqueezy.ts` checkout URL matches current LS docs
- [ ] Webhook `timingSafeEqual` buffer length handling
- [ ] `syncSubscription` when `userId` missing — is admin listUsers paginated?
- [ ] Env vars documented in `.env.example`

### Supabase (`supabase_schema.sql`)
- [ ] RLS on `usage` insert policy (`with check (true)`) — too permissive?
- [ ] `subscriptions` columns match webhook upsert
- [ ] Trigger `handle_new_user` idempotent

### Frontend
- [ ] `/app` should require auth in production?
- [ ] Chat history grows unbounded — trim or persist?
- [ ] Tool switch clears preview/messages?

## Deliverables (format your response exactly like this)

### Executive summary
2–3 sentences: ship/no-ship for localhost MVP vs production.

### Critical (must fix before prod)
Numbered list with file paths and suggested fix.

### High priority
Numbered list.

### Nice to have
Bullets.

### Suggested edits
For each critical/high item, provide a **minimal diff** or code snippet (not full file rewrites unless necessary).

### Missing features for v1 launch
What’s not built yet (auth UI, project save, usage limits, Lemon Squeezy customer portal, etc.).

---

**Stack:** Next.js 16, React 19, Tailwind 4, shadcn/ui, Anthropic SDK, pptxgenjs, exceljs, docx, Supabase, Lemon Squeezy.

**Do not** suggest migrating back to Stripe. **Do** suggest Lemon Squeezy best practices.

Be specific. Reference real file paths. Prefer small, actionable patches over vague advice.
