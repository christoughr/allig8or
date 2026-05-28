# allig8tor — AI Office Suite

**Live:** https://www.allig8tor.com

Prompt in → **Website, PPTX, XLSX, DOCX, PDF** out.

## Docs

| File | 내용 |
|------|------|
| [docs/새-글-추가하기.md](docs/새-글-추가하기.md) | 블로그 글 추가 → commit → 배포 |
| [docs/진행-상황-체크리스트.md](docs/진행-상황-체크리스트.md) | 완료 / 미완료 |
| [docs/사이트맵-다시-제출.md](docs/사이트맵-다시-제출.md) | GSC·Bing 사이트맵 재제출 |
| [내가_할_일.md](내가_할_일.md) | Supabase, Vercel, GSC 단계별 |
| [BING_WEBMASTER.md](BING_WEBMASTER.md) | Bing 연결 (GSC 가져오기) |

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
   - **Starter** $149/mo → copy **Variant ID**  
   - **Pro** $399/mo → copy **Variant ID**  
   - **Team** $999/mo → copy **Variant ID**
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
