# Claude — allig8or Design Refinement Prompt

Copy everything below into Claude with the project ZIP or `@codebase`.

---

You are a **senior product designer + front-end engineer** refining **allig8or.com** — an AI Office Suite (Next.js 16, Tailwind 4, dark emerald brand).

## Brand (keep this direction)

- **Vibe:** Premium, fast, trustworthy — like Linear meets Notion, with a subtle crocodile (🐊) mascot
- **Colors:** Background `#070b09`, accent emerald `#10b981` / `#34d399`, text zinc-200–500
- **Avoid:** Generic blue SaaS, excessive emoji, Lorem ipsum, cluttered layouts

## Files to focus on

```
app/page.tsx
components/landing/Header.tsx, Hero.tsx, AppPreview.tsx, DemoSection.tsx, Pricing.tsx, Footer.tsx
components/generator/GeneratorLayout.tsx, ChatPanel.tsx, PreviewPanel.tsx, ToolSelector.tsx
app/globals.css
app/layout.tsx (typography)
```

## Your tasks

### 1. Landing page polish
- Improve visual hierarchy, spacing rhythm (8px grid), and mobile responsiveness
- Add one **social proof** strip (logos or stats — can be placeholder text styled well)
- Add a **“How it works”** 3-step section (Prompt → Generate → Download)
- Refine `AppPreview` mock — make it feel more realistic without images
- Ensure all CTAs point to `/app` and contrast passes WCAG AA on dark bg

### 2. Generator app polish
- Empty states, error states, rate-limit message (429) user-friendly copy
- Tool switch: optionally clear preview or show confirm — your call, document in comments
- Mobile: stack chat above preview below `md` breakpoint
- Subtle transitions (no heavy animation libraries)

### 3. Typography
- Suggest and implement one distinctive font pairing via `next/font/google` (e.g. DM Sans + optional display font for headlines)
- Do not use Inter, Roboto, or Arial as primary

### 4. Micro-copy
- Rewrite button labels and hero subcopy to be sharper, less generic
- Keep tone: confident, founder-friendly, not corporate-boring

## Constraints

- **Do not** change API routes, `lib/claude.ts` system prompts, or Lemon Squeezy logic unless fixing a UI bug
- **Do not** add Stripe
- **Do not** add new npm dependencies unless essential (prefer Tailwind only)
- Keep file count reasonable — edit existing components, don’t duplicate

## Deliverables

1. **Summary** — what changed and why (5–8 bullets)
2. **Before/after** — list files touched
3. **Code** — full updated files or minimal diffs per file
4. **Optional** — 2 alternative hero headline options in comments

Be opinionated. Make it feel like a premium product on day one.
