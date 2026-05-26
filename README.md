# allig8or — AI Office Suite

Prompt in → **Website, PPTX, XLSX, DOCX, PDF** out.

- **Landing:** `/`
- **Generator app:** `/app`
- **Payments:** [Lemon Squeezy](https://lemonsqueezy.com) (not Stripe)

## Quick start

```bash
cd allig8or
cp .env.example .env.local
# Add ANTHROPIC_API_KEY at minimum
npm install
npm run dev
```

Open http://localhost:3000

## GitHub

| Item | Value |
|------|-------|
| Owner (target) | **christoughr** |
| Repo | https://github.com/christoughr/allig8or (after transfer accept) |
| Was | dearzumi/allig8or — transfer pending your email accept |

After accepting transfer:

```bash
git remote set-url origin git@github.com:christoughr/allig8or.git
gh auth login   # log in as christoughr on this Mac
```

## Lemon Squeezy setup

1. [app.lemonsqueezy.com](https://app.lemonsqueezy.com) → Store → Products  
   - **Pro** $29/mo → copy **Variant ID**  
   - **Team** $79/mo → copy **Variant ID**
2. Settings → API → create API key → `LEMONSQUEEZY_API_KEY`
3. Settings → Webhooks → URL: `https://allig8or.com/api/webhooks/lemonsqueezy`  
   Events: `subscription_*` → copy signing secret → `LEMONSQUEEZY_WEBHOOK_SECRET`
4. Put store slug + variant IDs in `.env.local` / Vercel env

## Supabase

Run `supabase_schema.sql` in SQL Editor, then add Supabase env vars.

## Deploy (Vercel)

```bash
npx vercel login
npx vercel link
npx vercel --prod
```

Add all vars from `.env.example` in Vercel → Settings → Environment Variables.

## Code review

Paste `CLAUDE_REVIEW_PROMPT.md` into Claude for a structured review pass.
