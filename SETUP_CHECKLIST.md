# allig8or — 30분 셋업 체크리스트

## 현재 상태

| 항목 | 상태 |
|------|------|
| 코드 P0 | ✅ |
| GitHub | https://github.com/christoughr/allig8or |
| Vercel 배포 | https://allig8or.vercel.app |
| Vercel env | ⚠️ 비어 있음 → generator 안 돌아감 |
| 로컬 `.env.local` | Anthropic + Supabase 있음 / Lemon Squeezy 없음 / Stripe 키 잔여 |

---

## 1. Vercel env (5분) — 최우선

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
