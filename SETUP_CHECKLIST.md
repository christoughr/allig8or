# allig8or — 단계별 셋업 (천천히)

> **계정 정리:** GitHub = `christoughr` · Vercel 팀 = **`onlyus`** (christoughr 계정)  
> 대시보드: https://vercel.com/onlyus/allig8or  
> 프로덕션 URL: https://allig8or-lovat.vercel.app

## 현재 상태

| 항목 | 상태 |
|------|------|
| 코드 P0 | ✅ |
| GitHub | https://github.com/christoughr/allig8or |
| Vercel | **onlyus/allig8or** — GitHub `christoughr/allig8or` 연결됨 ✅ |
| 프로덕션 URL | https://allig8or-lovat.vercel.app |
| Vercel env | `ANTHROPIC_API_KEY` 아직 없으면 generator 안 돌아감 |

---

## Step 1 — Vercel 프로젝트 ✅ (완료)

CLI에서 **onlyus/allig8or** 생성 + `christoughr/allig8or` Git 연결 + 배포 완료.

브라우저에서 확인:
1. https://vercel.com/onlyus/allig8or
2. 팀이 **onlyus**인지 확인 (christoughr 계정)

**다음:** Step 2 — `ANTHROPIC_API_KEY`만 추가 (본인이 Vercel UI에서)

---

## Step 2 — Vercel env: Anthropic만 (다음 단계, Step 1 후)

**목표:** 생성기만 돌아가게 — 키 1개만.

1. Vercel → allig8or → **Settings → Environment Variables**
2. Add:
   - Name: `ANTHROPIC_API_KEY`
   - Value: `sk-ant-...` (console.anthropic.com)
   - Environments: Production + Preview
3. **Deployments** → 최신 → **Redeploy**
4. https://allig8or.vercel.app/app → 짧은 프롬프트 테스트

---

## Step 3 — Lemon Squeezy (Step 2 성공 후)

(상세는 Step 2 끝난 뒤 진행)

---

## Step 4 — Supabase (Step 3 또는 병행 가능)

(상세는 Step 2 끝난 뒤 진행)

---

<!-- 아래는 참고용 전체 목록 -->

## 1. Vercel env (전체 — 나중에)

**최소 1개만 있어도 generator 동작:**
```
ANTHROPIC_API_KEY=sk-ant-...
```

**권장 전체 목록** (`.env.example` 기준):

```
ANTHROPIC_API_KEY
NEXT_PUBLIC_SUPABASE_URL
NEXT_PUBLIC_SUPABASE_ANON_KEY
SUPABASE_SERVICE_ROLE_KEY
NEXT_PUBLIC_APP_URL=https://allig8or.vercel.app
LEMONSQUEEZY_API_KEY
LEMONSQUEEZY_WEBHOOK_SECRET
NEXT_PUBLIC_LEMONSQUEEZY_STORE_ID
NEXT_PUBLIC_LEMONSQUEEZY_VARIANT_PRO
NEXT_PUBLIC_LEMONSQUEEZY_VARIANT_TEAM
```

**방법 A — 대시보드**
1. https://vercel.com/dearzumis-projects/allig8or/settings/environment-variables
2. Add → Production + Preview + Development
3. Deployments → Redeploy (latest)

**방법 B — CLI (로컬 키에서 복사)**
```bash
cd /Users/zumi/allig8or
./scripts/sync-env-to-vercel.sh
npx vercel --prod
```

---

## 2. Lemon Squeezy (15분)

1. https://app.lemonsqueezy.com
2. **Products** → Pro $29/mo → Variant ID 복사
3. **Products** → Team $79/mo → Variant ID 복사
4. **Settings → API** → API key
5. **Settings → Webhooks** → Add:
   - URL: `https://allig8or.vercel.app/api/webhooks/lemonsqueezy`
   - Events: all `subscription_*`
   - Signing secret 복사
6. Store slug 확인 (URL에 표시됨, 예: `yourstore`)
7. Vercel env에 5개 추가 후 Redeploy

**테스트:** Pricing 페이지 → Subscribe → Lemon Squeezy checkout 열리면 OK

---

## 3. Supabase (10분)

1. https://supabase.com → New project
2. SQL Editor → `supabase_schema.sql` 전체 붙여넣기 → Run
3. Settings → API → URL + anon key + service_role key → Vercel env
4. (P1) Authentication → Google provider 활성화

---

## 4. 로컬 `.env.local` 정리

Stripe 키 3개는 **삭제**하고 Lemon Squeezy 변수로 교체:

```bash
# 삭제할 것 (더 이상 사용 안 함)
STRIPE_SECRET_KEY
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY
STRIPE_WEBHOOK_SECRET
```

---

## 5. 동작 확인

```bash
# 로컬
npm run dev
# http://localhost:3000/app → "Create a simple landing page for a coffee shop"

# 프로덕션
# https://allig8or.vercel.app/app
```

성공: 오른쪽에 HTML preview 또는 다운로드 버튼  
실패 500: Vercel 로그에서 `ANTHROPIC_API_KEY` 확인  
실패 429: rate limit (10/hr/IP) — 1시간 후 또는 다른 IP

---

## 끝나면 → P1

- [ ] Supabase Auth UI (`/login`, Google OAuth)
- [ ] Middleware: `/app` 보호
- [ ] `projects` 테이블에 저장/불러오기
- [ ] 플랜별 usage limit
