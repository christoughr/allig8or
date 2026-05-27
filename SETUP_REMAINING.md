# allig8or — 남은 설정 (집에서 Windows로 이어하기)

## ✅ 코드에서 완료된 것

- Favicon + Apple icon (`app/icon.tsx`, `app/apple-icon.tsx`)
- 랜딩 AppPreview: Desktop / Mobile / Open **클릭 동작**
- `/app`: 도구 탭 5종 + `?tool=slides` 딥링크
- Preview: Open / Download / Desktop·Mobile 토글 동작
- Hero 폰트: extrabold → **semibold/medium** (덜 뚱뚱함)
- Auth, 플랜 한도, projects 저장, Privacy/Terms
- Session B 보안 헤더 (`next.config.ts`)

---

## 1. Supabase (필수, 5분)

**아래 파일 전체 복사 → Supabase SQL Editor → Run:**

`SUPABASE_COPY_PASTE.sql`

**Auth → URL Configuration:**

| | URL |
|---|-----|
| Site URL | `https://allig8or.com` |
| Redirect URLs | `https://allig8or.com/auth/callback` |
| | `http://localhost:3000/auth/callback` |

**Vercel env (3개):**

```
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=
```

---

## 1b. Supabase Storage (권장 — 큰 PPTX/XLSX용)

SQL Editor에서 `supabase_storage.sql` 실행.

Vercel env 추가:

```
SUPABASE_STORAGE_BUCKET=generated-files
```

(끄려면 `SUPABASE_STORAGE_BUCKET=disabled` — data URL 폴백)

로그인 사용자 생성물은 Storage + signed URL로 저장됩니다.

---

## ⭐ 2. Lemon Squeezy — **나중에 (지금 스킵)**

스토어 승인 후 진행. Windows에서 할 때 이 섹션만 열면 됨.

| | |
|---|---|
| Webhook | `https://allig8or.com/api/webhooks/lemonsqueezy` |
| Events | subscription_created, updated, resumed, payment_success, cancelled, expired |
| Pro | $29/mo → `NEXT_PUBLIC_LEMONSQUEEZY_VARIANT_PRO` |
| Team | $79/mo → `NEXT_PUBLIC_LEMONSQUEEZY_VARIANT_TEAM` |

```
LEMONSQUEEZY_API_KEY=
LEMONSQUEEZY_WEBHOOK_SECRET=
NEXT_PUBLIC_LEMONSQUEEZY_STORE_ID=allig8or
NEXT_PUBLIC_LEMONSQUEEZY_VARIANT_PRO=
NEXT_PUBLIC_LEMONSQUEEZY_VARIANT_TEAM=
```

승인 전 임시: `STORE_ID=mnemonic`

---

## 3. Windows에서 clone & run

```bash
git clone https://github.com/christoughr/allig8or.git
cd allig8or
npm install
cp .env.example .env.local
# .env.local 채우기 (Supabase + ANTHROPIC_API_KEY)
npm run dev
```

---

## 4. QA 체크리스트

- [ ] `/` — Hero 글자 덜 굵음, output pill 클릭 → `/app?tool=`
- [ ] `/` — AppPreview Desktop/Mobile/Open 클릭 동작
- [ ] `/app` — 5 tool 탭 전환, 생성, Open + Download (파일도 Open)
- [ ] `/projects` — 로그인 후 최근 프로젝트, Open → `/app?project=`
- [ ] `npm run smoke` — 배포 전 API 스모크 (로컬 또는 `BASE_URL=`)
- [ ] `/login` — 가입/로그인
- [ ] `/privacy` `/terms`
- [ ] Favicon 탭에 emerald **a8** 보임

---

## 링크

| | |
|---|---|
| Live | https://allig8or.com |
| App | https://allig8or.com/app |
| GitHub | https://github.com/christoughr/allig8or |
| Vercel | https://vercel.com/onlyus/allig8or |
