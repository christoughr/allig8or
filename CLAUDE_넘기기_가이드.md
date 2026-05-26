# allig8or — Claude 넘기기 + 그 다음 할 일 (전체 로드맵)

> 이 파일 하나로 **Claude에 뭘 주는지**, **어떤 프롬프트를 붙이는지**, **답 받은 뒤 뭘 하는지** 전부 정리.

---

## 전체 순서 (한눈에)

```
[1] Claude Session A — 릴리스 UI + 출력 품질 (필수)
         ↓
[2] Cursor — Claude 코드 적용 + npm run build
         ↓
[3] Git push + Vercel 배포
         ↓
[4] 직접 QA — /app 5종 생성 + 모바일 프리뷰 확인
         ↓
[5] Claude Session B — 풀 리뷰/보안 (권장, 병행 가능)
         ↓
[6] Lemon Squeezy Step 3 — 상품·webhook·Vercel env
         ↓
[7] Supabase — SQL + env
         ↓
[8] Auth + 유료 한도 (유료 오픈 전)
         ↓
[9] 마케팅 오픈 ($29 Pro)
```

---

## Part 1 — Claude에게 넘기기 (Session A, 필수)

### 1a. ZIP 만들기 (Mac 터미널)

```bash
cd /Users/zumi
zip -r allig8or-for-claude.zip allig8or \
  -x "allig8or/node_modules/*" \
  -x "allig8or/.next/*" \
  -x "allig8or/.git/*" \
  -x "allig8or/.env.local" \
  -x "allig8or/.env"
```

또는 GitHub만 줄 경우: https://github.com/christoughr/allig8or

### 1b. 절대 Claude/ZIP에 넣지 말 것

| 제외 | 이유 |
|------|------|
| `.env.local`, `.env` | API 키 유출 |
| `node_modules`, `.next` | 용량·불필요 |

### 1c. Claude에 첨부할 것 (체크리스트)

- [ ] ZIP **또는** GitHub 링크
- [ ] 아래 **Session A 커버 메시지** (복붙)
- [ ] `CLAUDE_RELEASE_READY_PROMPT.md` 내용 (파일 통째로 또는 ZIP 안에 포함됨)
- [ ] (선택) `CLAUDE_PACKAGE.md` — 링크·진행상황 맥락

### 1d. Session A — 커버 메시지 (Claude 채팅 첫 메시지에 복붙)

```
You are shipping allig8or.com to production quality.

Live: https://allig8or.com | App: https://allig8or.com/app
Repo: https://github.com/christoughr/allig8or

Stack: Next.js 16, React 19, Tailwind 4, Syne+DM Sans, Claude API (claude-sonnet-4-5-20250929), pptxgenjs/exceljs/docx, Lemon Squeezy only (NO Stripe), Vercel team "onlyus".

Founder feedback:
- Desktop/Mobile preview dimensions feel wrong and empty
- Mac traffic-light chrome is misleading (non-functional) — replace it
- Hate emoji tool icons (🌐📊) — use lucide-react
- Generated outputs are "okay" but NOT client-ready / release-ready yet

Read CLAUDE_RELEASE_READY_PROMPT.md in the ZIP and implement EVERYTHING in Parts A–D.
Deliver: full updated files, summary, Mac chrome decision, device spec table, QA checklist.

Rules:
- npm run build must pass
- No Stripe, no new deps unless essential
- Complete files, not fragments
```

### 1e. Session A에서 Claude가 건드려야 할 핵심 파일

| 우선순위 | 파일 |
|----------|------|
| 1 | `components/generator/PreviewPanel.tsx` |
| 2 | `components/generator/ToolSelector.tsx` |
| 3 | `lib/claude.ts` (5종 system prompt) |
| 4 | `components/landing/AppPreview.tsx` |
| 5 | `lib/generators/*.ts` (선택) |
| 6 | `components/landing/Hero.tsx` 등 |

상세 스펙은 **`CLAUDE_RELEASE_READY_PROMPT.md`** 안에 있음 (Device 390×844, Desktop 16:10, Lucide 아이콘 등).

---

## Part 2 — Claude 답 받은 뒤 (Cursor에서)

### 2a. 코드 적용

1. Claude가 준 **파일 전체**를 해당 경로에 덮어쓰기
2. 터미널:
   ```bash
   cd /Users/zumi/allig8or
   npm install          # Claude가 package.json 건드렸을 때만
   npm run build
   npm run dev          # localhost:3000/app 에서 눈으로 확인
   ```

### 2b. QA 체크리스트 (직접 15분)

| # | 확인 |
|---|------|
| 1 | `/app` — Website 짧은 프롬프트 → 30–40초 후 **데스크톱 프레임**에 미리보기 |
| 2 | Desktop / Mobile 토글 → **390×844** 폰 비율처럼 보이는지 |
| 3 | **빨강/노랑/초록** 창 버튼 없어졌는지 |
| 4 | 도구 탭 **이모지 없이** Lucide 아이콘인지 |
| 5 | Slides / Sheet / Doc / PDF 각 1회 생성 → 다운로드 |
| 6 | **모바일** (또는 DevTools) — 생성 후 프리뷰 보이는지 |
| 7 | `npm run build` 에러 없음 |

### 2c. Git + 배포

```bash
cd /Users/zumi/allig8or
git add -A
git status
git commit -m "Polish generator preview, icons, and AI output prompts for release"
git push origin main
```

Vercel이 `christoughr/allig8or`에 연결돼 있으면 자동 배포. 아니면:

```bash
npx vercel --prod --scope onlyus --yes
```

배포 후 https://allig8or.com/app 에서 다시 QA.

---

## Part 3 — Claude Session B (권장, Session A 배포 후)

디자인/출력 말고 **보안·아키텍처·유료 오픈 전 막힌 것** 리뷰.

### 3a. 첨부

- 최신 ZIP (Session A 반영 후 다시 zip)
- `CLAUDE_FULL_REVIEW_PROMPT.md` 통째로 또는 아래 커버 메시지

### 3b. Session B — 커버 메시지 (복붙)

```
You are the lead engineer + product reviewer for allig8or.com.

Links:
- Live: https://allig8or.com and https://allig8or.com/app
- Repo: https://github.com/christoughr/allig8or

Stack: Next.js 16, React 19, Tailwind 4, Claude API, Lemon Squeezy (NOT Stripe), Supabase schema only (no auth UI yet), Vercel "onlyus".

Business: Lemon Squeezy allig8or store activation pending (1–3 days). mnemonic store approved — can use temporarily.

Do TWO passes:

PASS 1 — Full review per CLAUDE_FULL_REVIEW_PROMPT.md:
Executive summary, Scorecard 1-10, Critical, High, Nice to have, Suggested diffs (minimal), Roadmap, Competitor positioning.

PASS 2 — Launch blockers before charging $29/mo Pro:
What MUST ship? Auth? Usage limits tied to plan? Supabase Storage vs base64? Rate limit bypass risks?

Rules:
- Never suggest Stripe
- Real file paths
- Small actionable diffs only
- Korean OK for LS multi-store / 사업자 context

Read CLAUDE_PACKAGE.md and CLAUDE_FULL_REVIEW_PROMPT.md. ZIP attached.
```

### 3c. Session B 후 할 일

- **Critical** 항목만 Cursor에서 고치기 (한 번에 다 하지 말고 P0부터)
- **Roadmap**은 GitHub Issue 또는 `STEP_BY_STEP.md` 아래에 메모

---

## Part 4 — 비즈니스/인프라 (Claude와 별개, 직접)

상세는 **`STEP_BY_STEP.md`**.

### Step 3 — Lemon Squeezy (지금 가능, Live는 스토어 승인 후)

| 항목 | 값 |
|------|-----|
| Webhook URL | `https://allig8or.com/api/webhooks/lemonsqueezy` |
| 이벤트 | `subscription_created`, `updated`, `resumed`, `payment_success`, `cancelled`, `expired` (또는 All subscription events) |
| Vercel env | `LEMONSQUEEZY_API_KEY`, `LEMONSQUEEZY_WEBHOOK_SECRET`, `NEXT_PUBLIC_LEMONSQUEEZY_STORE_ID`, `VARIANT_PRO`, `VARIANT_TEAM` |
| 승인 전 | `STORE_ID=mnemonic` + mnemonic 스토어에 Pro/Team 상품 만들어도 됨 |

템플릿: `.env.example`

### Step 4 — Supabase

1. https://supabase.com → 새 프로젝트
2. SQL Editor → `supabase_schema.sql` 실행
3. Vercel에 추가:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `SUPABASE_SERVICE_ROLE_KEY`
4. Redeploy

### Step 5 — 유료 오픈 전 (Claude Session B + 로드맵)

| 기능 | 왜 |
|------|-----|
| Auth (Supabase) | 누가 Pro인지 |
| `/app` 보호 | 무한 무료 생성 방지 |
| 플랜별 한도 | IP 10/hr → Pro 200/day |
| base64 → Storage | 큰 PPTX/XLSX URL 안정화 |
| Webhook → DB | 구독 상태 반영 |

---

## Part 5 — repo 안 문서 맵 (뭘 언제 쓰나)

| 파일 | 언제 |
|------|------|
| **`CLAUDE_넘기기_가이드.md`** | **지금 이 파일** — 전체 흐름 |
| `CLAUDE_RELEASE_READY_PROMPT.md` | Session A — Claude가 읽고 구현할 스펙 |
| `CLAUDE_PACKAGE.md` | Session B 맥락 + 링크 |
| `CLAUDE_FULL_REVIEW_PROMPT.md` | Session B — 리뷰 형식 |
| `CLAUDE_HANDOFF.md` | 아키텍처·env 상세 |
| `STEP_BY_STEP.md` | LS / DNS 단계별 |
| `SETUP_CHECKLIST.md` | env 체크 |

---

## Part 6 — 최종 “출시 선언” 체크리스트

모두 ✅일 때 마케팅/유료 오픈:

- [ ] Session A UI/출력 반영 + 프로덕션 QA
- [ ] Session B Critical 0건 (또는 문서화된 accept risk)
- [ ] Lemon Squeezy checkout 실제 결제 테스트 (test → live)
- [ ] Webhook 200 + DB sync 확인
- [ ] Auth + 플랜 한도 (최소 Pro)
- [ ] Anthropic API 키 로테이션 (채팅에 노출했었다면)
- [ ] Privacy / Terms 페이지 (최소 링크)

---

## 빠른 링크

| | |
|---|---|
| 사이트 | https://allig8or.com |
| 앱 | https://allig8or.com/app |
| GitHub | https://github.com/christoughr/allig8or |
| Vercel | https://vercel.com/onlyus/allig8or |
| Lemon Squeezy | https://app.lemonsqueezy.com |
