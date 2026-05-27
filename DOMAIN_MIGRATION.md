# Domain migration: allig8or.com → allig8tor.com

Account email for GitHub + Vercel: **christoughr@gmail.com**

| Resource | Link |
|----------|------|
| GitHub repo | https://github.com/christoughr/allig8or |
| Vercel project | https://vercel.com/onlyus/allig8or |
| Registrar | https://www.name.com (both domains) |

---

## Phase 0 — Log in with the right accounts

### GitHub

This machine’s CLI is logged in as **dearzumi**. Switch to **christoughr**:

```powershell
gh auth login
```

- Host: **GitHub.com**
- Protocol: **HTTPS** (or SSH if you prefer)
- Authenticate in the browser as **christoughr@gmail.com**

Verify:

```powershell
gh auth status
gh api user -q .login
```

Should print `christoughr`.

### Vercel

```powershell
vercel login
```

Use **christoughr@gmail.com** (or the Google account tied to it). Confirm team **onlyus** has access to project **allig8or**.

```powershell
vercel whoami
cd path\to\allig8or
vercel link
# Team: onlyus
# Project: allig8or
```

---

## Phase 1 — DNS on Name.com (allig8tor.com)

In Name.com → **allig8tor.com** → DNS:

| Type | Host | Value |
|------|------|--------|
| `A` | `@` | `76.76.21.21` |
| `CNAME` | `www` | `cname.vercel-dns.com` |

(Use the exact records Vercel shows after you add the domain — Settings → Domains may differ slightly.)

Wait for DNS propagation (often 5–30 minutes).

---

## Phase 2 — Vercel domains

1. Open https://vercel.com/onlyus/allig8or/settings/domains  
2. **Add** `allig8tor.com` and `www.allig8tor.com` → verify DNS until both show **Valid**.  
3. Set **allig8tor.com** as the **primary** production domain.  
4. For **allig8or.com** and **www.allig8or.com** (already on the project): choose **Redirect to allig8tor.com** → pick **308 Permanent Redirect** (not 307/302). SEO treats 308 like 301; 308 is correct for a permanent domain move.  
   - Vercel’s dashboard redirect is the main mechanism.  
   - The app also has `next.config.ts` host redirects as a backup when traffic still hits the old host on Vercel.

Keep old domains on the **same** Vercel project so SSL and redirects work.

---

## Phase 3 — Vercel environment variables

https://vercel.com/onlyus/allig8or/settings/environment-variables

Update **Production** (and Preview if you use custom URLs there):

| Variable | New value |
|----------|-----------|
| `NEXT_PUBLIC_APP_URL` | `https://allig8tor.com` |

Redeploy after saving (Deployments → ⋯ → Redeploy).

---

## Phase 4 — Supabase Auth URLs

Supabase Dashboard → your project → **Authentication** → **URL Configuration**:

| Field | Value |
|-------|--------|
| **Site URL** | `https://allig8tor.com` |
| **Redirect URLs** (add all; keep old during transition) | `https://allig8tor.com/auth/callback` |
| | `https://allig8tor.com/**` |
| | `https://allig8or.com/auth/callback` |
| | `https://allig8or.com/**` |

Keeping the old URLs for a few weeks avoids broken magic links for users who still have old links.

**Authentication → Providers → Google** (if enabled): add authorized redirect URI in Google Cloud Console:

- `https://<project-ref>.supabase.co/auth/v1/callback` (unchanged)
- No change to Supabase project URL — only Site URL / redirect allow list.

---

## Phase 5 — Lemon Squeezy webhook

https://app.lemonsqueezy.com → Settings → Webhooks

| Setting | Value |
|---------|--------|
| URL | `https://allig8tor.com/api/webhooks/lemonsqueezy` |

Test with a sandbox event after deploy.

---

## Phase 6 — Deploy code changes

Commit and push the repo changes (new domain in metadata, `next.config.ts` redirects, docs):

```powershell
git add next.config.ts app/layout.tsx app/terms/page.tsx app/privacy/page.tsx .env.example lib/lemonsqueezy.ts DOMAIN_MIGRATION.md
git commit -m "Migrate production domain from allig8or.com to allig8tor.com"
git push origin main
```

Vercel auto-deploys from `christoughr/allig8or`.

---

## Phase 7 — Optional Name.com forwarding (extra safety)

If you ever remove old domains from Vercel, set **URL Forwarding** on Name.com for **allig8or.com**:

- Forward `allig8or.com` → `https://allig8tor.com` (301 permanent)
- Forward `www.allig8or.com` → `https://allig8tor.com`

While both domains stay on Vercel, dashboard redirect + `next.config.ts` is enough.

---

## Phase 8 — Email (hello@)

Create **hello@allig8tor.com** in Name.com email forwarding (or Google Workspace) if you use contact addresses on the site.

---

## Verification checklist

- [ ] https://allig8tor.com loads (200)
- [ ] https://www.allig8tor.com → canonical host
- [ ] https://allig8or.com → redirects to https://allig8tor.com (same path)
- [ ] https://allig8or.com/app → https://allig8tor.com/app
- [ ] Sign up / sign in / email confirm works on new domain
- [ ] Lemon Squeezy webhook delivers (check Vercel logs)
- [ ] Open Graph / metadata shows `allig8tor.com` (view page source)

---

## What stays the same

- Brand and domain are now **allig8tor** / **allig8tor.com** (GitHub/Vercel project slug may still be `allig8or`)
- GitHub repo name `allig8or`, npm package name, Supabase project — no rename required
- `NEXT_PUBLIC_SUPABASE_URL` / keys — unchanged (same Supabase project)
