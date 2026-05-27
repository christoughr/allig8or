# Run from repo root: powershell -ExecutionPolicy Bypass -File scripts/link-vercel.ps1
Set-Location $PSScriptRoot\..

Write-Host "Linking to Vercel team onlyus / project allig8or..." -ForegroundColor Cyan
vercel link --yes --project allig8or --scope onlyus

if ($LASTEXITCODE -eq 0) {
  Write-Host "Done. Project linked." -ForegroundColor Green
  Write-Host "Deploy: vercel --prod --yes"
} else {
  Write-Host "Link failed. Run: vercel login" -ForegroundColor Red
  exit 1
}
