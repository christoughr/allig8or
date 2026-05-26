#!/usr/bin/env bash
# Sync .env.local → Vercel Production (skips Stripe, empty values, comments)
set -euo pipefail

ROOT="$(cd "$(dirname "$0")/.." && pwd)"
ENV_FILE="${1:-$ROOT/.env.local}"

if [[ ! -f "$ENV_FILE" ]]; then
  echo "Missing $ENV_FILE"
  exit 1
fi

cd "$ROOT"

SKIP_PREFIXES=(STRIPE_ NEXT_PUBLIC_STRIPE_)

should_skip() {
  local key="$1"
  for p in "${SKIP_PREFIXES[@]}"; do
    [[ "$key" == "$p"* ]] && return 0
  done
  return 1
}

echo "Syncing from $ENV_FILE to Vercel Production..."
echo "(Stripe vars skipped — use Lemon Squeezy instead)"
echo ""

while IFS= read -r line || [[ -n "$line" ]]; do
  [[ -z "$line" || "$line" =~ ^[[:space:]]*# ]] && continue
  [[ "$line" =~ ^[A-Za-z_][A-Za-z0-9_]*= ]] || continue

  key="${line%%=*}"
  value="${line#*=}"
  # trim quotes
  value="${value%\"}"
  value="${value#\"}"
  value="${value%\'}"
  value="${value#\'}"

  if should_skip "$key"; then
    echo "  skip $key (Stripe)"
    continue
  fi

  if [[ -z "$value" || "$value" == your_* || "$value" == sk-ant-... ]]; then
    echo "  skip $key (placeholder)"
    continue
  fi

  echo "  add $key"
  printf '%s' "$value" | npx vercel@latest env add "$key" production --force 2>/dev/null \
    || printf '%s' "$value" | npx vercel@latest env add "$key" production
done < "$ENV_FILE"

echo ""
echo "Done. Run: npx vercel --prod"
