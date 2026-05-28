# allig8or — 1·2·3 단계 (천천히)

## Step 1 — DNS ✅ 완료

- `allig8or.com` → `76.76.21.21` ✅
- `www.allig8or.com` → `76.76.21.21` ✅
- https://allig8or.com → **200 OK** ✅

확인: 브라우저에서 랜딩 + `/app` 열리면 끝.

---

## Step 2 — Lemon Squeezy activate ✅ 제출함

승인 대기 (1–3 영업일). **승인 전에도 Step 3 일부 가능** (test mode 상품·webhook 설정).

---

## Step 3 — Lemon Squeezy (지금)

> 스토어가 아직 Test mode면 상품/webhook만 설정. **Live 결제**는 승인 후.

### 3a. Products (allig8or 스토어)

| Product | Price | Billing | → Vercel env |
|---------|-------|---------|--------------|
| allig8or Starter | $149 | Monthly subscription | `NEXT_PUBLIC_LEMONSQUEEZY_VARIANT_STARTER` |
| allig8or Pro | $399 | Monthly subscription | `NEXT_PUBLIC_LEMONSQUEEZY_VARIANT_PRO` |
| allig8or Team | $999 | Monthly subscription | `NEXT_PUBLIC_LEMONSQUEEZY_VARIANT_TEAM` |

각 상품 → Variants → **Variant ID** (UUID) 복사

### 3b. Webhook — URL + 체크할 이벤트

**Callback URL:**
```
https://allig8or.com/api/webhooks/lemonsqueezy
```

**Signing secret** 복사 → `LEMONSQUEEZY_WEBHOOK_SECRET`

#### ✅ 반드시 켜야 할 이벤트 (우리 코드가 처리함)

| Event | 왜 |
|-------|-----|
| `subscription_created` | 신규 구독 → DB sync |
| `subscription_updated` | 플랜 변경 |
| `subscription_resumed` | 재개 |
| `subscription_payment_success` | 결제 성공 갱신 |
| `subscription_cancelled` | 취소 (기간 끝까지 유지) |
| `subscription_expired` | 만료 → free |

#### 권장 추가 (지금 코드는 무시하지만 로그/알림용 — 켜도 OK)

| Event | 비고 |
|-------|------|
| `subscription_payment_failed` | 나중에 이메일 알림용 |
| `subscription_payment_recovered` | |
| `subscription_paused` | |
| `subscription_unpaused` | |

#### ❌ 안 켜도 됨 (구독 SaaS에 불필요)

- `order_*` (일회성 주문)
- `license_key_*`
- `affiliate_*`

**UI에 "All subscription events" 있으면 그걸로 한 번에 선택해도 됨.**

### 3c. API key

- Settings → API → `LEMONSQUEEZY_API_KEY`

### 3d. Vercel env (onlyus/allig8or)

```
LEMONSQUEEZY_API_KEY=...
LEMONSQUEEZY_WEBHOOK_SECRET=...
NEXT_PUBLIC_LEMONSQUEEZY_STORE_ID=allig8or
NEXT_PUBLIC_LEMONSQUEEZY_VARIANT_STARTER=...
NEXT_PUBLIC_LEMONSQUEEZY_VARIANT_PRO=...
NEXT_PUBLIC_LEMONSQUEEZY_VARIANT_TEAM=...
```

Redeploy → Pricing **Subscribe** → checkout 열리면 ✅

---

## Step 4 — Claude 리뷰 (병행 가능)

`CLAUDE_FULL_REVIEW_PROMPT.md` 통째로 Claude에 붙여넣기 + GitHub/ZIP 첨부.

---

## Links

| | URL |
|---|-----|
| Site | https://allig8or.com |
| App | https://allig8or.com/app |
| Vercel | https://vercel.com/onlyus/allig8or |
| GitHub | https://github.com/christoughr/allig8or |
| LS | https://app.lemonsqueezy.com |
