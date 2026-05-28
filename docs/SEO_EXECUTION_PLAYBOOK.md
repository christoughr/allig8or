# allig8tor SEO Execution Playbook

This is the execution plan to maximize rankings across technical SEO, on-page SEO, content SEO, and authority building.

## What is already implemented in code

- Canonical metadata + OG/Twitter metadata
- Dynamic sitemap and robots
- JSON-LD structured data
- RSS feed at `/feed.xml`
- Internal linking between blog and use-case pages
- Noindex on workspace routes to focus crawl/indexing on marketing pages

## Steps only you can do (in order)

1. **Google Search Console setup**
   - Add domain property for `allig8tor.com`
   - Verify via DNS TXT at your registrar
   - Submit `https://www.allig8tor.com/sitemap.xml`
   - Request indexing for `/`, `/pricing` section page, `/use-cases`, `/blog`

2. **Bing Webmaster setup**
   - Add site property
   - Verify via DNS/CNAME or meta
   - Submit sitemap
   - Use URL submission for top pages

3. **Set canonical production domain in Vercel**
   - Ensure `www.allig8tor.com` is primary
   - Redirect alternate domains to primary (301/308)
   - Confirm `NEXT_PUBLIC_APP_URL=https://www.allig8tor.com`

4. **Publish cadence**
   - Publish at least 2 blog posts/week for 8 weeks
   - Publish at least 1 use-case page/week for 8 weeks
   - Link each new blog post to at least 1 use case and 1 related blog post

5. **Authority / backlinks**
   - Create founder profile on LinkedIn and GitHub with consistent branding
   - Submit product to relevant directories (launch platforms, AI tool directories)
   - Publish 1-2 guest posts/month linking back to core pages
   - Get 5-15 relevant backlinks before expecting major ranking jumps

6. **Performance and UX monitoring**
   - Enable Vercel Web Analytics + Speed Insights
   - Monitor Core Web Vitals in Search Console
   - Keep CLS, INP, LCP in “Good” thresholds

7. **Indexing hygiene**
   - Re-submit sitemap after every significant content batch
   - Inspect URL in GSC before/after publishing
   - Fix coverage issues quickly (soft 404, canonical mismatch, crawl anomaly)

## Priority keywords to target

### Commercial intent (money pages)
- ai office suite
- ai document generator
- ai presentation maker
- ai spreadsheet generator
- ai website builder
- ai pdf generator

### Long-tail intent (blog/use-case)
- ai proposal generator for agencies
- ai invoice generator for freelancers
- ai client reporting workflow
- prompt to powerpoint best practices
- ai document automation roi

## 30-day KPI targets

- Indexed pages: +20 to +40
- Impressions: steady week-over-week increase
- Avg. position: improving trend on target keywords
- Click-through rate: improve titles/meta for pages under 2% CTR

## Notes

- Ranking #1 is not guaranteed by technical changes alone.
- Technical SEO is now in good shape; authority + consistent publishing drives the largest gains next.
