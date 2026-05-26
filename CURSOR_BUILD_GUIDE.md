# 🐊 allig8or — Cursor Step-by-Step Build Guide

## STEP 1: Project Setup (5 min)

Open terminal and run:

```bash
npx create-next-app@latest allig8or --typescript --tailwind --app --no-src-dir --import-alias "@/*"
cd allig8or
npm install @anthropic-ai/sdk pptxgenjs exceljs docx @supabase/supabase-js @supabase/ssr lucide-react
npx shadcn@latest init -d
npx shadcn@latest add button input textarea card badge
cp .env.example .env.local
```

Fill in `.env.local` with your keys.

---

## STEP 2: Open in Cursor

```bash
cursor .
```

Then open Cursor AI chat and paste this:

---

## STEP 3: Cursor Prompt (Paste this EXACTLY)

```
I'm building allig8or.com — an AI office suite where users type a prompt and get 
Websites, PowerPoint slides, Excel spreadsheets, and Word documents instantly.

I have a CURSOR_MASTER_PROMPT.md file with the full spec. Please read it with @CURSOR_MASTER_PROMPT.md

Build everything in this exact order:

1. First create /lib/claude.ts (Claude API client with system prompts for each tool)
2. Then /lib/generators/presentation.ts (pptxgenjs PPTX generator)
3. Then /lib/generators/spreadsheet.ts (exceljs XLSX generator)
4. Then /lib/generators/document.ts (docx DOCX generator)
5. Then all API routes in /app/api/generate/[tool]/route.ts
6. Then the UI components: GeneratorLayout, ToolSelector, ChatPanel, PreviewPanel
7. Then wire everything together in /app/(dashboard)/page.tsx
8. Finally create the landing page at /app/page.tsx

Make it look clean and modern. The main layout is:
- Left panel (420px): chat interface with message history
- Right panel (flex-1): iframe for website preview, or download button for files
- Top: tool selector tabs (Website | Slides | Spreadsheet | Document | PDF)

Use the exact code from the spec file. Don't skip anything.
```

---

## STEP 4: Supabase Setup (10 min)

1. Go to supabase.com → New project
2. Go to SQL Editor → Paste contents of `supabase_schema.sql` → Run
3. Go to Authentication → Providers → Enable Google
4. Add your app URL to allowed redirect URLs: `https://allig8or.com/auth/callback`
5. Copy project URL and keys to `.env.local`

---

## STEP 5: Test Locally

```bash
npm run dev
```

Open http://localhost:3000

Test each generator:
- Type "Create a landing page for a coffee shop" → should see HTML preview
- Type "Make a 5-slide pitch deck for a food delivery app" → should download .pptx
- Type "Build a monthly budget tracker" → should download .xlsx
- Type "Write a business proposal for an app" → should download .docx

---

## STEP 6: Deploy to Vercel

```bash
npm install -g vercel
vercel login
vercel --prod
```

Then in Vercel dashboard:
1. Add all environment variables from `.env.local`
2. Connect your `allig8or.com` domain
3. Set up Vercel Serverless Functions (already handled by Next.js)

---

## STEP 7: Connect Domain

In your domain registrar (where you bought allig8or.com):
- Add CNAME record: `www` → `cname.vercel-dns.com`
- Add A record: `@` → `76.76.21.21`

Wait 24-48h for DNS propagation.

---

## Common Issues & Fixes

**Claude returns markdown not JSON:**
```typescript
const clean = response.replace(/```json\n?|\n?```/g, '').trim();
const data = JSON.parse(clean);
```

**PPTX download not working:**
- Check the base64 data URL format
- Make sure Content-Type header is correct

**iframe shows blank:**
- Add `sandbox="allow-scripts allow-same-origin"` to iframe
- Check for CSP headers blocking content

**Supabase auth redirect loop:**
- Make sure callback URL matches exactly in Supabase settings
- Check `NEXT_PUBLIC_APP_URL` in env

---

## File Checklist

Before shipping, make sure these exist:
- [ ] `/lib/claude.ts`
- [ ] `/lib/generators/presentation.ts`
- [ ] `/lib/generators/spreadsheet.ts`  
- [ ] `/lib/generators/document.ts`
- [ ] `/app/api/generate/website/route.ts`
- [ ] `/app/api/generate/presentation/route.ts`
- [ ] `/app/api/generate/spreadsheet/route.ts`
- [ ] `/app/api/generate/document/route.ts`
- [ ] `/components/generator/GeneratorLayout.tsx`
- [ ] `/components/generator/ToolSelector.tsx`
- [ ] `/components/generator/ChatPanel.tsx`
- [ ] `/components/generator/PreviewPanel.tsx`
- [ ] `/app/page.tsx` (landing)
- [ ] `/app/(dashboard)/page.tsx` (main app)
- [ ] `.env.local` (all keys filled)
- [ ] Supabase schema applied
- [ ] Vercel deployed
- [ ] Domain connected
