# allig8or — 1·2·3 단계 (천천히)

## Step 1 — DNS ✅ 완료

- `allig8or.com` → `76.76.21.21` ✅
- `www.allig8or.com` → `76.76.21.21` ✅
- https://allig8or.com → **200 OK** ✅

확인: 브라우저에서 랜딩 + `/app` 열리면 끝.

---

## Step 2 — Lemon Squeezy: allig8or 스토어 Activate (지금)

**사업자등록증 2개 필요 없음.** mnemonic 때와 **같은 사업자 정보**로 제출.

### 할 일 (브라우저)

1. https://app.lemonsqueezy.com 로그인
2. 좌측 스토어 드롭다운 → **+ New store** (또는 Create store)
3. Store name: `allig8or`
4. Subdomain: `allig8or` → `allig8or.lemonsqueezy.com`
5. **Activate your store** 클릭
6. 설문填写:
   - Business: **mnemonic과 동일한 법인/개인사업자**
   - Product type: **SaaS / software subscription**
   - Description: *AI office suite — users generate websites, slides, spreadsheets, documents via prompt*
   - Same tax ID / same owner as mnemonic
7. **Identity verification** — 신분증 (이미 했으면 빠를 수 있음)
8. Submit → **1–3 business days** 대기

### 승인 전에 할 수 있는 것

- Test mode에서 상품 만들어 보기
- **mnemonic** 스토어로 임시 결제 테스트 (브랜드는 mnemonic으로 보임)

### 승인 후

- Store slug = `allig8or` (env에 사용)
- **「Step 2 완료」** 알려주기 → Step 3 진행

---

## Step 3 — Lemon Squeezy: 상품 + Vercel env (Step 2 승인 후)

### 3a. Products (allig8or 스토어, Live mode)

| Product | Price | Copy variant ID |
|---------|-------|-----------------|
| allig8or Pro | $29/mo | → `NEXT_PUBLIC_LEMONSQUEEZY_VARIANT_PRO` |
| allig8or Team | $79/mo | → `NEXT_PUBLIC_LEMONSQUEEZY_VARIANT_TEAM` |

### 3b. Webhook

- URL: `https://allig8or.com/api/webhooks/lemonsqueezy`
- Events: all `subscription_*`
- Signing secret → `LEMONSQUEEZY_WEBHOOK_SECRET`

### 3c. API key

- Settings → API → `LEMONSQUEEZY_API_KEY`

### 3d. Vercel env (onlyus/allig8or)

```
LEMONSQUEEZY_API_KEY=...
LEMONSQUEEZY_WEBHOOK_SECRET=...
NEXT_PUBLIC_LEMONSQUEEZY_STORE_ID=allig8or
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
