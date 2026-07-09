param(
    [string]$Root = $PSScriptRoot + "\.."
)

Set-Location $Root

function Commit-Files {
    param([string]$Message, [string[]]$Files)
    foreach ($f in $Files) {
        if (Test-Path $f) { git add $f }
    }
    git commit -m $Message
}

Commit-Files "chore: initialize trimly project with package.json" @("package.json")
Commit-Files "chore: add typescript and next.js configuration" @("tsconfig.json", "next.config.ts", "next-env.d.ts")
Commit-Files "chore: configure tailwind css and postcss" @("postcss.config.mjs", "app/globals.css")
Commit-Files "chore: add eslint and prettier tooling" @("eslint.config.mjs", ".prettierrc")
Commit-Files "chore: add environment template and gitignore" @(".env.example", ".gitignore")
Commit-Files "feat(db): add core prisma schema for users and urls" @("prisma/schema.prisma")
Commit-Files "feat(db): add prisma client singleton" @("lib/prisma.ts", "lib/constants.ts")
Commit-Files "feat(lib): add utility helpers and api error types" @("lib/utils.ts", "lib/api/errors.ts", "lib/api/response.ts")
Commit-Files "feat(lib): add zod validation schemas" @("lib/validators/url.schema.ts", "types/url.ts")
Commit-Files "feat(lib): add slug generation and reserved words" @("lib/slug/generator.ts", "lib/slug/reserved.ts")
Commit-Files "feat(lib): add security sanitization and password hashing" @("lib/security/sanitize.ts", "lib/security/hash.ts")
Commit-Files "feat(lib): add analytics parsing and redis rate limiting" @("lib/analytics/parser.ts", "lib/redis.ts")
Commit-Files "feat(repo): add user and url repositories" @("repositories/user.repository.ts", "repositories/url.repository.ts")
Commit-Files "feat(repo): add click and audit repositories" @("repositories/click.repository.ts", "repositories/audit.repository.ts")
Commit-Files "feat(services): add url shortening service" @("services/url.service.ts")
Commit-Files "feat(services): add analytics and dashboard services" @("services/analytics.service.ts", "services/dashboard.service.ts")
Commit-Files "feat(services): add admin, auth, and qr services" @("services/admin.service.ts", "services/auth.service.ts", "services/qr.service.ts", "lib/auth.ts")
Commit-Files "feat(api): add shorten and health endpoints" @("app/api/shorten/route.ts", "app/api/health/route.ts")
Commit-Files "feat(api): add url crud and search endpoints" @("app/api/url/route.ts", "app/api/url/[id]/route.ts", "app/api/search/route.ts")
Commit-Files "feat(api): add analytics dashboard and profile endpoints" @("app/api/analytics/[id]/route.ts", "app/api/dashboard/route.ts", "app/api/profile/route.ts")
Commit-Files "feat(api): add admin endpoints and clerk webhooks" @("app/api/admin/route.ts", "app/api/admin/list/route.ts", "app/api/admin/users/[id]/route.ts", "app/api/admin/urls/[id]/route.ts", "app/api/webhooks/clerk/route.ts")
Commit-Files "feat(api): add redirect handler and qr code endpoint" @("app/[slug]/route.ts", "app/api/qr/[id]/route.ts", "middleware.ts")
Commit-Files "feat(ui): add shadcn ui primitives" @("components/ui/button.tsx", "components/ui/input.tsx", "components/ui/label.tsx", "components/ui/card.tsx")
Commit-Files "feat(ui): add app providers for theme, query, and toast" @("components/providers/theme-provider.tsx", "components/providers/query-provider.tsx", "components/providers/toast-provider.tsx")
Commit-Files "feat(ui): add shared components and trimly logo" @("components/shared/logo.tsx", "components/shared/theme-toggle.tsx", "components/shared/copy-button.tsx", "components/shared/loading-skeleton.tsx", "components/shared/empty-state.tsx", "public/logo.svg")
Commit-Files "feat(ui): add layout and marketing components" @("components/layout/header.tsx", "components/layout/sidebar.tsx", "components/marketing/shorten-form.tsx")
Commit-Files "feat(ui): add dashboard components and charts" @("components/dashboard/stats-cards.tsx", "components/dashboard/url-table.tsx", "components/dashboard/analytics-chart.tsx")
Commit-Files "feat(hooks): add react query hooks for data fetching" @("hooks/use-dashboard.ts", "hooks/use-urls.ts", "hooks/use-analytics.ts", "hooks/use-admin.ts", "hooks/use-debounce.ts")
Commit-Files "feat(pages): add root layout and landing page" @("app/layout.tsx", "app/page.tsx")
Commit-Files "feat(pages): add pricing about and seo routes" @("app/pricing/page.tsx", "app/about/page.tsx", "app/sitemap.ts", "app/robots.ts")
Commit-Files "feat(pages): add dashboard layout and link management" @("app/(dashboard)/layout.tsx", "app/(dashboard)/dashboard/page.tsx", "app/(dashboard)/dashboard/create/page.tsx", "app/(dashboard)/dashboard/[id]/page.tsx")
Commit-Files "feat(pages): add analytics profile and settings pages" @("app/(dashboard)/dashboard/[id]/analytics/page.tsx", "app/(dashboard)/dashboard/analytics/page.tsx", "app/(dashboard)/profile/page.tsx", "app/(dashboard)/settings/page.tsx")
Commit-Files "feat(pages): add admin panel pages" @("app/(admin)/layout.tsx", "app/(admin)/admin/page.tsx", "app/(admin)/admin/users/page.tsx", "app/(admin)/admin/urls/page.tsx")
Commit-Files "feat(pages): add auth error and password gate pages" @("app/sign-in/[[...sign-in]]/page.tsx", "app/sign-up/[[...sign-up]]/page.tsx", "app/not-found.tsx", "app/error.tsx", "app/gone/page.tsx", "app/gate/[slug]/page.tsx", "app/gate/[slug]/gate-content.tsx")
Commit-Files "test: add vitest and playwright configuration" @("vitest.config.ts", "playwright.config.ts", "tests/unit/slug.test.ts", "tests/e2e/landing.spec.ts")
Commit-Files "chore: add prisma seed and package lock" @("prisma/seed.ts", "package-lock.json")
Commit-Files "docs: add architecture and api documentation" @("docs/ARCHITECTURE.md", "docs/API.md", "CONTRIBUTING.md", "LICENSE")
Commit-Files "chore: add screenshot capture script" @("scripts/capture-screenshots.js")
Commit-Files "docs: add readme with screenshots and deployment guide" @("README.md", "public/screenshots/landing.png", "public/screenshots/dashboard.png", "public/screenshots/analytics.png", "public/screenshots/pricing.png")

Write-Host "Total commits: $(git rev-list --count HEAD)"
