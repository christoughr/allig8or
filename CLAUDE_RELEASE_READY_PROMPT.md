# Claude — allig8or Release-Ready Polish (UI + Output Quality)

**How to use:** Attach this file + project ZIP (exclude `node_modules`, `.next`, `.git`) or paste into Claude with `@codebase`.  
**Live:** https://allig8or.com · **App:** https://allig8or.com/app · **Repo:** https://github.com/christoughr/allig8or

---

## Your role

You are a **senior product designer + staff front-end engineer + AI prompt engineer** shipping **allig8or** to real paying users. The product **works end-to-end** (5 generators, Lemon Squeezy, Vercel). Your job is to raise **perceived quality** and **output quality** from “decent MVP” to **credible premium SaaS ready for production marketing**.

Be opinionated. Ship concrete code, not wireframes.

---

## Founder feedback (treat as requirements)

| Area | Feedback |
|------|----------|
| **Desktop / Mobile preview** | Feels empty; sizes and dimensions feel wrong. Device toggle doesn’t feel like real viewport framing. |
| **Mac window chrome** | Red/amber/green dots look like macOS window controls but **don’t work** — confusing or cheap. Either fix the pattern or replace it. |
| **Tool icons** | **Dislikes** current icons: emoji in `ToolSelector` (🌐📊📈📝📄) and ASCII in empty states (⬡▤⊞). Replace with a cohesive icon system. |
| **Generated outputs** | “무난해” — acceptable but **not release-ready**. Websites/slides/docs need to feel client-deliverable, not demo-tier. |
| **Marketing site** | Still feels a bit sparse compared to the ambition of the product. |

---

## Tech stack (do not change unless noted)

- Next.js 16 App Router, React 19, Tailwind 4, shadcn/ui
- Fonts: **Syne** (display) + **DM Sans** (body) via `app/layout.tsx`
- Brand: dark `#070b09`, emerald `#10b981` / `#34d399`, zinc text
- Icons: **`lucide-react` already installed** — use it, no new icon npm packages
- Billing: **Lemon Squeezy only** — do not add Stripe
- Mascot: subtle 🐊 OK in logo area only — **not** as tool icons

---

## Part A — Generator UI (`/app`)

### A1. Preview panel — real device framing

**Files:** `components/generator/PreviewPanel.tsx`, optionally extract `components/generator/DeviceFrame.tsx`

**Problem today:**
- Desktop mode: iframe is `w-full h-full` inside a flex child with **no explicit viewport** → preview feels like a floating white box, not a monitor/phone.
- Mobile mode: `w-[390px]` but **same `h-full`** → aspect ratio wrong, lots of dead gray space.
- Empty state: `hidden md:flex` — mobile users never see preview area until after generate.

**Implement this spec:**

| Mode | Frame size (CSS) | Notes |
|------|------------------|-------|
| **Desktop** | Outer frame **max-w-[1280px]**, inner viewport **16:10** (e.g. `aspect-video` or `aspect-[16/10]`), min-height **480px**, max-height **calc(100vh - header - chrome)** | Center frame in panel; subtle shadow + 1px border; optional thin “chin” below (like a monitor stand), not macOS traffic lights |
| **Mobile** | Device width **390px**, viewport **390 × 844** (`aspect-[390/844]`), rounded **[2.5rem]** outer bezel, **12px** inner safe-area padding on frame | Show dynamic island or notch **only as static SVG/CSS** (decorative), not interactive |
| **Scale-to-fit** | If viewport taller than available height, scale frame with `transform: scale(...)` from center OR use `max-h` + `overflow-auto` inside iframe wrapper | User must always see full width of mobile frame without horizontal scroll on the *chrome* |

**Iframe:**
- Set explicit height on wrapper (not `h-full` on an unconstrained parent).
- Consider `min-h-[600px]` on desktop inner viewport so short pages don’t look like a sliver.

**After generation on mobile:**
- Show preview **below** chat (already `flex-col` on small screens) — remove `hidden` on empty state for mobile OR show collapsed “Preview” expander. At minimum: when `preview` exists, preview must be visible on mobile.

### A2. Mac chrome — decision required (pick ONE approach)

**Current:** Red/amber/green circles in `PreviewPanel.tsx` and `AppPreview.tsx` mimic macOS close/minimize/zoom but are **non-functional**.

**Recommended (pick this unless you have a better idea):**  
Replace with a **neutral “browser bar”** that does not impersonate OS window controls:

```
[ allig8or preview ]  [ Desktop | Mobile ]     [ Open in new tab ↗ ]  [ Download ]
```

- Use a **fake URL** field: `preview.allig8or.local` (read-only, decorative)
- **No** red/yellow/green dots anywhere in the app
- Add `aria-hidden` + `title="Decorative preview chrome"` if any purely visual element remains
- **Do not** add click handlers that look like window controls unless they actually work

**Alternative (acceptable):** Full **device mockup** (iPhone / browser window illustration) where the whole frame is clearly non-interactive chrome — still no fake traffic lights.

**Landing `AppPreview.tsx`:** Apply the same chrome language as `/app` so marketing matches product.

### A3. Tool icons — replace emoji/ASCII

**Files:** `components/generator/ToolSelector.tsx`, `PreviewPanel.tsx` empty states, `components/landing/AppPreview.tsx` if it shows tools

| Tool | Lucide suggestion (or equivalent) |
|------|-----------------------------------|
| Website | `Globe` or `LayoutTemplate` |
| Slides | `Presentation` |
| Sheet | `Sheet` or `Table2` |
| Doc | `FileText` |
| PDF | `FileType` |

- **20px** icons in tool tabs, stroke width 1.75, inactive `text-zinc-500`, active `text-[#070b09]` on emerald pill
- Empty states: same icon at **32px** in a rounded square with `bg-emerald-500/10 ring-1 ring-emerald-500/20`
- Logo: consider SVG crocodile mark or `Sparkles` + wordmark — reduce reliance on 🐊 emoji in chrome

### A4. Generator layout polish

**Files:** `GeneratorLayout.tsx`, `ChatPanel.tsx`, `ToolSelector.tsx`

- Chat column: fixed **400px** on `lg+`, full width on mobile; ensure `min-h-0` + `overflow-hidden` on flex children so scroll works
- Rate limit / error banners: match new visual system
- Loading state: keep “10–40 seconds” hint; add subtle progress shimmer on preview panel border while generating
- Tool switch: keep clearing messages/preview; add **one-line** toast or inline note “Switched to Slides — chat reset”

### A5. File download preview (PPTX/XLSX/DOCX)

**File:** `PreviewPanel.tsx` — file branch

Today: small card in empty space. **Upgrade to:**
- Tool-specific illustration (icon + file type + size estimate if possible)
- Secondary actions: “Download again”, “Generate another”
- For **presentation**: optional static slide strip mock (3 thumbnail placeholders) from metadata if easy; otherwise stronger empty-success layout

---

## Part B — Landing page (`/`)

**Files:** `components/landing/*`, `app/page.tsx`

Raise density and trust without clutter:

1. **Hero** — sharper headline; subcopy that names all 5 outputs; primary CTA `Start building →` /app
2. **AppPreview** — must mirror **real** `/app` chrome (Part A2/A3); show believable desktop **and** mobile frames side-by-side or toggle
3. **Social proof** — upgrade placeholders to believable structure (logo row or metric cards with “Trusted by teams at…” style — can stay generic until real logos)
4. **Comparison strip** — one row: “Not another chatbot — real files you can send to clients”
5. **Pricing** — visual parity with generator; ensure Lemon Squeezy CTA states “Test mode” if store pending
6. **Footer** — links: App, Pricing, GitHub, Contact placeholder

**Do not** use Inter/Roboto/Arial as primary (already using Syne + DM Sans).

---

## Part C — Raise AI output quality (release bar)

**Primary file:** `lib/claude.ts` (`systemPrompts` for all 5 types)

Outputs today are **generic Tailwind landing pages** and **safe corporate decks**. Raise the bar:

### C1. Global rules (prepend to every system prompt)

```
QUALITY BAR — PRODUCTION / CLIENT-READY:
- Outputs must be good enough to send to a paying client without embarrassment.
- No "Lorem ipsum", no "[Company Name]", no "Your tagline here", no placeholder team photos.
- Use specific, plausible copy derived from the user's prompt (names, metrics, dates, locations).
- Strong visual hierarchy, generous whitespace, consistent 8px spacing rhythm.
- Accessibility: semantic HTML, sufficient contrast, focus states on interactive elements.
- One clear primary CTA per page/section; no more than 2 font families in websites.
```

### C2. Website (`website` type) — specific upgrades

- **Stop** over-relying on Font Awesome + rainbow gradients (reads as “AI slop”).
- Prefer: Tailwind CDN + **Google Fonts link** for one distinctive pairing (e.g. Fraunces + Source Sans 3, or Outfit + Literata) chosen to match industry in prompt.
- Required sections for landing-page prompts: hero, social proof, features, testimonial or quote, FAQ or pricing teaser, footer with links.
- Include `prefers-reduced-motion` respect for animations.
- Mobile: test logical order; tap targets ≥ 44px.
- Add `<meta name="viewport">` and meaningful `<title>`.
- **Optional quality checklist** in HTML comment at bottom: `<!-- allig8or: sections=hero,features,cta,footer -->`

### C3. Presentation (`presentation` JSON)

- Minimum **8 slides** for business decks unless user asks for fewer.
- Enforce theme contrast (text readable on backgrounds).
- Slide 1: title; slide 2: agenda or problem; middle: proof/data; last: CTA/contact.
- `notes` on every slide for speaker notes.
- Ban walls of 8+ bullets — max 5 bullets, max 12 words per bullet.

### C4. Spreadsheet (`spreadsheet` JSON)

- At least one sheet with **real formulas** (`SUM`, `AVERAGE`, `%` growth) when numeric data exists.
- Include a **Summary** or **Dashboard** sheet when appropriate.
- 10+ rows of realistic sample data, not 3 rows.
- Formatting: freeze header row concept via bold header + consistent number formats.

### C5. Document (`document` JSON)

- Minimum structure: cover title, executive summary, 3+ sections, conclusion.
- Use tables for comparisons; bullets for lists; short paragraphs (3–4 sentences max).

### C6. PDF (`pdf` HTML)

- Print CSS: `@page { margin: 20mm }`, proper heading hierarchy.
- Page numbers in footer via CSS if possible.
- Invoice/report templates: line items table, totals, payment terms.

### C7. Generator code (if needed for quality)

**Files:** `lib/generators/presentation.ts`, `spreadsheet.ts`, `document.ts`

- Map more layouts (e.g. `timeline`, `image-text` placeholders as text blocks).
- PPTX: title slide typography hierarchy; consistent margins.
- XLSX: auto column width from content; number formats for currency columns listed in `formatting.currency`.
- DOCX: page breaks between major sections.

**Do not** change API route contracts or rate limiting unless fixing a bug.

---

## Part D — Acceptance criteria (must pass before you’re done)

### UI
- [ ] Desktop preview shows a **clear 16:10 (or 16:9) viewport** centered in the panel — not a full-bleed white slab
- [ ] Mobile preview shows **390×844** framed device with rounded corners — not a narrow full-height column
- [ ] **No** fake macOS traffic-light buttons anywhere
- [ ] All 5 tools use **Lucide** icons, zero emoji in tool tabs
- [ ] Mobile users see preview after generation
- [ ] Landing `AppPreview` matches `/app` visual language

### Output quality (manual test prompts)

Run these mentally or describe expected improvements in prompts:

1. **Website:** “Landing page for a boutique law firm in Seoul specializing in startup IP” → must feel law-firm specific, restrained palette, not purple gradient SaaS template.
2. **Slides:** “8-slide seed pitch for a climate tech startup” → narrative arc, varied layouts, speaker notes.
3. **Sheet:** “12-month SaaS financial model with MRR, churn, CAC” → formulas, multiple sheets.
4. **Doc:** “2-page consulting proposal for CRM migration” → sections + table + timeline.
5. **PDF:** “Invoice for freelance design project, USD, net-15” → A4 layout, totals.

### Code
- [ ] `npm run build` passes
- [ ] No new Stripe code
- [ ] Minimal new dependencies (prefer zero)

---

## Files to touch (priority order)

```
components/generator/PreviewPanel.tsx      ← device frames, chrome, mobile visibility
components/generator/ToolSelector.tsx      ← Lucide icons
components/generator/ChatPanel.tsx         ← minor polish if needed
components/landing/AppPreview.tsx          ← align with real app chrome
components/landing/Hero.tsx                ← copy tighten
lib/claude.ts                              ← system prompts (critical)
lib/generators/presentation.ts             ← optional layout/typography
lib/generators/spreadsheet.ts              ← optional formatting
lib/generators/document.ts                 ← optional structure
app/globals.css                            ← only if needed for frames
```

**Avoid unless necessary:** `app/api/*`, `lib/lemonsqueezy.ts`, `supabase_schema.sql`

---

## Deliverables format

1. **Executive summary** (8–12 bullets): what changed, why it’s release-ready now
2. **Mac chrome decision** — one sentence explaining what you chose and why
3. **Device spec table** — final widths/heights you implemented
4. **Before/after** — file list
5. **Full code** for every changed file (complete files, not fragments)
6. **QA checklist** — copy Part D with checked boxes
7. **Optional:** 2 alternative hero headlines in HTML comments

---

## Reference — current implementation snippets

**Emoji tool icons (replace):**
```tsx
// components/generator/ToolSelector.tsx
{ id: 'website', label: 'Website', icon: '🌐' },
```

**Problematic Mac dots (remove):**
```tsx
// components/generator/PreviewPanel.tsx
<div className="h-2.5 w-2.5 rounded-full bg-red-500/60" />
```

**Weak iframe sizing (fix):**
```tsx
className={`h-full overflow-hidden ... ${device === 'mobile' ? 'w-[390px]' : 'w-full'}`}
```

**Website system prompt location:**
```ts
// lib/claude.ts → systemPrompts.website
```

---

## What “release-ready” means for allig8or

A new visitor should:
1. Land on `/`, understand all 5 tools in **5 seconds**
2. Open `/app`, trust the preview chrome as a **professional workshop**
3. Generate once and think: **“I could send this to a client”** — not “nice demo”

Ship like Linear/Gamma tier polish on a solo-founder budget: **clarity, restraint, specific copy, real dimensions.**
