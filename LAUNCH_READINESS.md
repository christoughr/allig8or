# allig8tor — Launch readiness

**Live:** https://www.allig8tor.com · **Repo:** https://github.com/christoughr/allig8or

---

## Done (this release)

- [x] Domain **allig8tor.com** on Vercel (www primary)
- [x] **308** redirect old domain **allig8or.com** → new (Vercel + `next.config.ts`)
- [x] `NEXT_PUBLIC_APP_URL` → `https://www.allig8tor.com`
- [x] Technical SEO: `sitemap.xml`, `robots.txt`, `manifest`, RSS `/feed.xml`, `llms.txt`
- [x] JSON-LD: Organization, WebSite, SoftwareApplication, FAQPage
- [x] Open Graph image, Twitter cards, canonical URLs, keywords
- [x] FAQ section on landing (content + schema)
- [x] Pricing shows **Coming soon** until Lemon Squeezy store is approved
- [x] Webhook returns clear **503** / GET health when billing not configured
- [x] Privacy + Terms pages
- [x] Custom 404

---

## You must do manually (cannot automate from code)

### Supabase → Authentication → URL Configuration

| Field | Value |
|-------|--------|
| Site URL | `https://www.allig8tor.com` |
| Redirect URLs | `https://www.allig8tor.com/auth/callback` |
| | `https://www.allig8tor.com/**` |
| | `https://allig8tor.com/**` (apex, during transition) |
| | `https://allig8or.com/**` (old domain, temporary) |

### Google Search Console (critical for “page 1” over time)

1. https://search.google.com/search-console → Add property **https://www.allig8tor.com**
2. Verify via HTML tag → copy code into Vercel env `NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION` → redeploy
3. Submit sitemap: `https://www.allig8tor.com/sitemap.xml`
4. Request indexing for `/` and `/app`

### Bing Webmaster

1. https://www.bing.com/webmasters → add site → `NEXT_PUBLIC_BING_SITE_VERIFICATION` on Vercel

### Lemon Squeezy (when store approved)

1. Vercel env: `LEMONSQUEEZY_*` + variant IDs (see `.env.example`)
2. Webhook URL: `https://www.allig8tor.com/api/webhooks/lemonsqueezy`
3. Test: `GET https://www.allig8tor.com/api/webhooks/lemonsqueezy` → `"billing":"configured"`

### Email

- Forward **hello@allig8tor.com** at Name.com (or Google Workspace)

### Analytics (recommended)

- Add [Vercel Analytics](https://vercel.com/docs/analytics) or Plausible/Posthog for conversion tracking

---

## SEO reality check

Technical SEO is implemented, but **ranking on page 1** takes weeks–months and depends on:

- Backlinks, content volume, brand searches, competition
- Regular blog/changelog posts (RSS is ready — add `/blog` later for biggest lift)
- Search Console impressions/clicks data

**High-intent keywords we target:** AI presentation maker, AI spreadsheet generator, AI document generator, AI website builder, AI office suite.

---

## Product gaps before “full” public launch

| Area | Status | Notes |
|------|--------|--------|
| Core generator (5 tools) | ✅ | Ship |
| Auth (email/password) | ✅ | Confirm Supabase URLs |
| Google OAuth | ⚠️ | Enable in Supabase + Google Cloud if desired |
| Paid billing | ⏳ | Lemon Squeezy store approval |
| Rate limits / abuse | ✅ | generationLimits |
| Error monitoring | ❌ | Add Sentry optional |
| Status page | ❌ | Optional |
| Blog / content marketing | ❌ | Biggest SEO lever long-term |
| Social proof (testimonials) | ❌ | Add to landing when available |
| Support docs / help center | ❌ | Optional |

**Verdict:** Safe to launch **free tier** publicly once Supabase auth URLs + Search Console sitemap are set. Turn on paid plans after Lemon Squeezy approval.

---

## Vercel link (Windows)

```powershell
cd C:\path\to\allig8or
powershell -ExecutionPolicy Bypass -File scripts\link-vercel.ps1
```

Or one line:

```powershell
cd $env:TEMP\allig8or; vercel link --yes --project allig8or --scope onlyus
```
