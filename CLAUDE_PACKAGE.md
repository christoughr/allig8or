# Claude에게 줄 것 — allig8or 전체 패키지

> **전체 흐름(한국어):** `CLAUDE_넘기기_가이드.md` ← **여기부터 읽기**  
> **한 번에 넘기기:** ZIP + Session A/B 커버 메시지 (가이드 안에 있음)  
> ZIP 만들 때: `node_modules`, `.next`, `.git`, `.env.local` 제외

---

## 링크

| | URL |
|---|-----|
| 사이트 | https://allig8or.com |
| 앱 | https://allig8or.com/app |
| GitHub | https://github.com/christoughr/allig8or |
| Vercel | https://vercel.com/onlyus/allig8or |

---

## 프로젝트 한 줄

**allig8or** — AI Office Suite. 프롬프트 → 웹사이트·PPTX·XLSX·DOCX·PDF. 결제는 **Lemon Squeezy only** (Stripe X).

---

## 현재 진행 상황 (2026-05-26)

| Step | 상태 |
|------|------|
| 1 DNS | ✅ allig8or.com live |
| 2 LS allig8or 스토어 activate | ⏳ 제출함, 승인 대기 1–3일 |
| 3 LS 상품 + webhook + Vercel env | **지금** (test mode 가능, live는 승인 후) |
| Supabase SQL | 아직 |
| Auth UI | 아직 |

---

## 핵심 파일 (리뷰 우선순위)

```
app/page.tsx
app/app/page.tsx
app/api/generate/*/route.ts
app/api/checkout/route.ts
app/api/webhooks/lemonsqueezy/route.ts
lib/claude.ts
lib/lemonsqueezy.ts
lib/rateLimit.ts
lib/stripHtml.ts
lib/generators/*
components/landing/*
components/generator/*
supabase_schema.sql
types/index.ts
```

---

## repo 안 가이드 문서

| 파일 | 용도 |
|------|------|
| `CLAUDE_RELEASE_READY_PROMPT.md` | **지금 추천** — 프리뷰 프레임·아이콘·Mac chrome·출력 품질 릴리스급 |
| `CLAUDE_FULL_REVIEW_PROMPT.md` | **풀 리뷰** (점수, critical, roadmap) |
| `CLAUDE_DESIGN_REFINEMENT_PROMPT.md` | 디자인만 깊게 |
| `CLAUDE_REVIEW_PROMPT.md` | 보안/코드 체크리스트 |
| `CLAUDE_HANDOFF.md` | 아키텍처·env·로드맵 |
| `STEP_BY_STEP.md` | 1·2·3 런치 단계 |
| `CURSOR_MASTER_PROMPT.md` | 원본 빌드 스펙 |
| `SETUP_CHECKLIST.md` | env 체크리스트 |

---

## Claude에 붙일 메인 프롬프트 (복붙)

```
You are the lead engineer + product reviewer for allig8or.com.

Links:
- Live: https://allig8or.com and https://allig8or.com/app
- Repo: https://github.com/christoughr/allig8or

Stack: Next.js 16, React 19, Tailwind 4, Syne+DM Sans, Claude API (claude-sonnet-4-5-20250929), pptxgenjs/exceljs/docx, Lemon Squeezy (NOT Stripe), Supabase schema only (no auth UI yet), Vercel team "onlyus".

Business: Single legal entity. Lemon Squeezy stores: mnemonic (approved), allig8or (activation submitted, pending). Same 사업자등록증 for both stores.

Do TWO passes:

PASS 1 — Full review per CLAUDE_FULL_REVIEW_PROMPT.md format:
Executive summary, Scorecard 1-10, Critical, High, Nice to have, Suggested diffs (minimal), Roadmap, Competitor positioning.

PASS 2 — Launch blockers for paid users:
What must ship before charging $29/mo Pro? Auth? Usage limits? Supabase Storage instead of base64?

Rules:
- Never suggest Stripe
- Reference real file paths
- Small actionable diffs only
- Korean context OK for business entity / LS multi-store

I'm attaching the repo ZIP (or use GitHub). Read CLAUDE_PACKAGE.md and CLAUDE_FULL_REVIEW_PROMPT.md first.
```

---

## ZIP에 넣을 폴더

```
allig8or/          ← /Users/zumi/allig8or 전체
  (제외: node_modules, .next, .git, .env.local)
```

---

## env 템플릿 (비밀값은 비워둠)

See `.env.example` in repo.
