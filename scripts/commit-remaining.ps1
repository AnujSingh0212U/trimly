param([string]$Root = (Split-Path $PSScriptRoot -Parent))
Set-Location $Root

$commits = @(
  @{ msg = "feat(api): add single url get, update, and delete endpoint"; files = @("app/api/url/[id]/route.ts") },
  @{ msg = "feat(api): add per-url analytics endpoint"; files = @("app/api/analytics/[id]/route.ts") },
  @{ msg = "feat(api): add admin user and url management endpoints"; files = @("app/api/admin/users/[id]/route.ts", "app/api/admin/urls/[id]/route.ts") },
  @{ msg = "feat(api): add slug redirect and qr image generation"; files = @("app/api/qr/[id]/route.ts", "app/[slug]/route.ts") },
  @{ msg = "feat(pages): add link edit and per-link analytics pages"; files = @("app/(dashboard)/dashboard/[id]/analytics/page.tsx", "app/(dashboard)/dashboard/[id]/page.tsx") },
  @{ msg = "feat(pages): add clerk sign-in and sign-up pages"; files = @("app/sign-in/[[...sign-in]]/page.tsx", "app/sign-up/[[...sign-up]]/page.tsx") },
  @{ msg = "feat(pages): add password-protected link gate"; files = @("app/gate/[slug]/gate-content.tsx", "app/gate/[slug]/page.tsx") },
  @{ msg = "chore: add commit history script for development"; files = @("scripts/make-commits.ps1") }
)

foreach ($c in $commits) {
  foreach ($f in $c.files) { git add -f -- "$f" }
  git commit -m $c.msg
}

Write-Host "Done. Commits: $(git rev-list --count HEAD)"
