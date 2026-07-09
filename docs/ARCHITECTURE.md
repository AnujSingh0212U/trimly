# Trimly — System Architecture

> **Product:** Trimly — Production-ready URL Shortener SaaS  
> **Version:** 1.0.0  
> **Status:** Step 1 — Architecture Design

---

## 1. Executive Summary

Trimly is a multi-tenant URL shortening SaaS platform designed for scale (10k+ concurrent users, millions of redirects/day). The architecture follows **Clean Architecture** principles with clear separation between presentation, application, domain, and infrastructure layers.

**Deployment target:** Vercel (app) + Railway/Supabase (PostgreSQL)

---

## 2. Technology Decisions

| Layer | Choice | Rationale |
|-------|--------|-----------|
| Framework | **Next.js 15 (App Router)** | Unified full-stack, RSC for performance, Vercel-native |
| API | **Next.js Route Handlers** | Co-located with frontend, edge-ready redirect handler |
| Database | **PostgreSQL** | ACID, JSON support, proven at scale |
| ORM | **Prisma** | Type-safe queries, migrations, excellent DX |
| Auth | **Clerk** | SaaS-ready auth, social login, session management, webhooks for user sync |
| Validation | **Zod** | Runtime + compile-time safety, shared schemas |
| Server State | **TanStack React Query v5** | Caching, optimistic updates, pagination |
| Client State | **Zustand** | Theme, UI preferences, ephemeral state |
| Charts | **Recharts** | Composable, React-native charting |
| Animation | **Framer Motion** | Micro-interactions, page transitions |
| UI | **Shadcn UI + Tailwind CSS v4** | Accessible, customizable, glassmorphism-ready |
| Icons | **Lucide React** | Consistent icon set |
| QR Codes | **qrcode** (node) + **react-qr-code** (client preview) |
| Geo IP | **@maxmind/geoip2-node** or **Vercel geo headers** (edge) | Country/city from IP |
| User Agent | **ua-parser-js** | Browser, OS, device parsing |
| Rate Limiting | **@upstash/ratelimit** + Redis | Distributed rate limits on Vercel |
| Password Hash | **bcryptjs** | Link password protection |
| Testing | **Vitest** (unit/integration) + **Playwright** (E2E) |
| Linting | **ESLint 9** + **Prettier** + **TypeScript strict** |

---

## 3. High-Level Architecture

```
┌─────────────────────────────────────────────────────────────────────────┐
│                           CLIENTS                                        │
│  Browser (Guest) │ Authenticated User │ Admin │ API Consumers (API Key) │
└────────────┬────────────────────┬──────────────────┬────────────────────┘
             │                    │                  │
             ▼                    ▼                  ▼
┌─────────────────────────────────────────────────────────────────────────┐
│                     NEXT.JS 15 APPLICATION (Vercel)                      │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐  ┌─────────────┐ │
│  │ App Router   │  │ API Routes   │  │ Middleware   │  │ Edge Fn     │ │
│  │ (RSC + CSR)  │  │ /api/*       │  │ Auth, CORS,  │  │ /[slug]     │ │
│  │              │  │              │  │ Rate Limit   │  │ redirect    │ │
│  └──────┬───────┘  └──────┬───────┘  └──────┬───────┘  └──────┬──────┘ │
│         │                 │                 │                  │        │
│  ┌──────┴─────────────────┴─────────────────┴──────────────────┴──────┐ │
│  │                        SERVICE LAYER                                  │ │
│  │  UrlService │ AnalyticsService │ AuthService │ AdminService        │ │
│  │  QrService  │ AuditService     │ ApiKeyService                      │ │
│  └──────┬───────────────────────────────────────────────────────────────┘ │
│         │                                                                  │
│  ┌──────┴───────────────────────────────────────────────────────────────┐ │
│  │                     REPOSITORY LAYER (Prisma)                          │ │
│  │  UserRepo │ UrlRepo │ ClickRepo │ SessionRepo │ AuditRepo │ ApiKeyRepo│ │
│  └──────┬───────────────────────────────────────────────────────────────┘ │
└─────────┼────────────────────────────────────────────────────────────────┘
          │
          ▼
┌─────────────────┐    ┌──────────────┐    ┌─────────────────┐
│   PostgreSQL    │    │  Upstash     │    │  Clerk          │
│   (Railway/     │    │  Redis       │    │  (Auth +        │
│   Supabase)     │    │  (Rate Limit │    │   Webhooks)     │
│                 │    │   + Cache)   │    │                 │
└─────────────────┘    └──────────────┘    └─────────────────┘
```

---

## 4. Layered Architecture

### 4.1 Presentation Layer (`app/`, `components/`)

- **Server Components** for initial data fetch (dashboard stats, SEO pages)
- **Client Components** for interactivity (forms, charts, modals)
- **Route Groups:**
  - `(marketing)` — landing, pricing, about
  - `(auth)` — sign-in, sign-up (Clerk-hosted or embedded)
  - `(dashboard)` — authenticated user area
  - `(admin)` — admin panel (role-gated)
  - `api/` — REST API route handlers

### 4.2 Application Layer (`services/`)

Business logic isolated from HTTP and database concerns.

| Service | Responsibility |
|---------|----------------|
| `UrlService` | Shorten, resolve, edit, delete, collision retry, reserved words |
| `AnalyticsService` | Record clicks, aggregate stats, UTM parsing, unique visitors |
| `QrService` | Generate QR code PNG/SVG for URLs |
| `AuthService` | Sync Clerk users, profile updates, role checks |
| `AdminService` | User management, site settings, platform analytics |
| `ApiKeyService` | CRUD API keys, validate requests |
| `AuditService` | Log admin actions and sensitive operations |

### 4.3 Domain Layer (`types/`, `lib/validators/`)

- Zod schemas as single source of truth for validation
- Domain types derived from Zod (`z.infer<>`)
- Reserved slug list, URL validation rules, plan limits

### 4.4 Infrastructure Layer (`repositories/`, `lib/`)

- Prisma repositories implement data access interfaces
- External integrations (Clerk webhooks, GeoIP, Redis)
- Utility functions (slug generation, sanitization, hashing)

---

## 5. Folder Structure

```
trimly/
├── app/
│   ├── (marketing)/
│   │   ├── page.tsx                    # Landing page
│   │   ├── pricing/page.tsx
│   │   └── layout.tsx
│   ├── (auth)/
│   │   ├── sign-in/[[...sign-in]]/page.tsx
│   │   └── sign-up/[[...sign-up]]/page.tsx
│   ├── (dashboard)/
│   │   ├── dashboard/
│   │   │   ├── page.tsx                # URL list + stats overview
│   │   │   ├── create/page.tsx
│   │   │   └── [id]/
│   │   │       ├── page.tsx            # URL detail + edit
│   │   │       └── analytics/page.tsx
│   │   ├── profile/page.tsx
│   │   ├── settings/page.tsx
│   │   └── layout.tsx                  # Sidebar + header shell
│   ├── (admin)/
│   │   ├── admin/
│   │   │   ├── page.tsx                # Admin dashboard
│   │   │   ├── users/page.tsx
│   │   │   ├── urls/page.tsx
│   │   │   ├── analytics/page.tsx
│   │   │   └── settings/page.tsx
│   │   └── layout.tsx                  # Admin shell (role guard)
│   ├── [slug]/route.ts                 # Edge redirect handler (GET /:slug)
│   ├── api/
│   │   ├── shorten/route.ts            # POST /api/shorten
│   │   ├── url/
│   │   │   ├── route.ts                # GET list
│   │   │   └── [id]/route.ts           # PUT, DELETE /api/url/:id
│   │   ├── analytics/[id]/route.ts     # GET /api/analytics/:id
│   │   ├── dashboard/route.ts          # GET /api/dashboard
│   │   ├── profile/route.ts            # GET, PUT /api/profile
│   │   ├── search/route.ts             # GET /api/search
│   │   ├── admin/
│   │   │   ├── route.ts                # GET /api/admin
│   │   │   ├── users/[id]/route.ts
│   │   │   └── urls/[id]/route.ts
│   │   ├── qr/[id]/route.ts            # GET QR code image
│   │   └── webhooks/
│   │       └── clerk/route.ts          # User sync webhook
│   ├── error.tsx                       # 500 page
│   ├── not-found.tsx                   # 404 page
│   ├── layout.tsx                      # Root layout (providers, theme)
│   ├── sitemap.ts
│   ├── robots.ts
│   └── globals.css
├── components/
│   ├── ui/                             # Shadcn primitives
│   ├── layout/
│   │   ├── header.tsx
│   │   ├── sidebar.tsx
│   │   ├── footer.tsx
│   │   └── mobile-nav.tsx
│   ├── dashboard/
│   │   ├── url-table.tsx
│   │   ├── url-form.tsx
│   │   ├── url-card.tsx
│   │   ├── analytics-chart.tsx
│   │   ├── click-map.tsx
│   │   └── stats-cards.tsx
│   ├── admin/
│   │   ├── user-table.tsx
│   │   └── platform-stats.tsx
│   ├── marketing/
│   │   ├── hero.tsx
│   │   ├── features.tsx
│   │   └── shorten-form.tsx            # Guest shorten on landing
│   ├── shared/
│   │   ├── logo.tsx                    # Trimly logo component
│   │   ├── theme-toggle.tsx
│   │   ├── copy-button.tsx
│   │   ├── qr-preview.tsx
│   │   ├── empty-state.tsx
│   │   ├── loading-skeleton.tsx
│   │   ├── pagination.tsx
│   │   ├── search-input.tsx
│   │   └── password-gate.tsx
│   └── providers/
│       ├── query-provider.tsx
│       ├── theme-provider.tsx
│       └── toast-provider.tsx
├── hooks/
│   ├── use-urls.ts
│   ├── use-analytics.ts
│   ├── use-dashboard.ts
│   ├── use-profile.ts
│   ├── use-search.ts
│   ├── use-admin.ts
│   ├── use-copy-to-clipboard.ts
│   ├── use-debounce.ts
│   └── use-media-query.ts
├── services/
│   ├── url.service.ts
│   ├── analytics.service.ts
│   ├── qr.service.ts
│   ├── auth.service.ts
│   ├── admin.service.ts
│   ├── api-key.service.ts
│   └── audit.service.ts
├── repositories/
│   ├── interfaces/
│   │   ├── user.repository.ts
│   │   ├── url.repository.ts
│   │   ├── click.repository.ts
│   │   └── ...
│   ├── user.repository.ts
│   ├── url.repository.ts
│   ├── click.repository.ts
│   ├── session.repository.ts
│   ├── api-key.repository.ts
│   └── audit.repository.ts
├── lib/
│   ├── prisma.ts                       # Prisma singleton
│   ├── clerk.ts                        # Clerk helpers
│   ├── redis.ts                        # Upstash Redis client
│   ├── api/
│   │   ├── response.ts                 # Standardized API responses
│   │   ├── errors.ts                   # AppError hierarchy
│   │   └── rate-limit.ts
│   ├── validators/
│   │   ├── url.schema.ts
│   │   ├── user.schema.ts
│   │   └── admin.schema.ts
│   ├── slug/
│   │   ├── generator.ts                # Random ID generation
│   │   ├── reserved.ts                 # Reserved words list
│   │   └── collision.ts                # Retry logic
│   ├── security/
│   │   ├── sanitize.ts
│   │   ├── hash.ts                     # bcrypt for link passwords
│   │   └── csrf.ts
│   ├── analytics/
│   │   ├── parser.ts                   # UA, UTM, referrer parsing
│   │   └── geo.ts                      # GeoIP lookup
│   └── constants.ts
├── types/
│   ├── url.ts
│   ├── analytics.ts
│   ├── user.ts
│   ├── api.ts
│   └── index.ts
├── middleware.ts                        # Clerk auth + rate limit + security headers
├── prisma/
│   ├── schema.prisma
│   ├── seed.ts
│   └── migrations/
├── public/
│   ├── logo.svg                        # Trimly logo
│   ├── logo-dark.svg
│   ├── og-image.png
│   └── favicon.ico
├── styles/
│   └── glass.css                       # Glassmorphism utilities
├── tests/
│   ├── unit/
│   ├── integration/
│   └── e2e/
├── docs/
│   ├── ARCHITECTURE.md                 # This file
│   ├── API.md
│   ├── DATABASE.md
│   └── DEPLOYMENT.md
├── .env.example
├── next.config.ts
├── tailwind.config.ts
├── tsconfig.json
├── vitest.config.ts
├── playwright.config.ts
└── package.json
```

---

## 6. Core Data Flows

### 6.1 Guest URL Shortening

```
Landing Page Form
    → POST /api/shorten (no auth required, rate-limited)
    → UrlService.create({ originalUrl, guestSessionId })
    → SlugGenerator → CollisionCheck → UrlRepository.create()
    → Return { shortUrl, slug, id }
```

### 6.2 Authenticated URL Shortening

```
Dashboard Create Form
    → POST /api/shorten (Clerk JWT)
    → UrlService.create({ ...options, userId })
    → Supports: customAlias, expiresAt, password, maxClicks
    → AuditLog (optional)
    → Return enriched URL object
```

### 6.3 Redirect + Click Tracking

```
GET /[slug]  (Edge Route Handler)
    → UrlRepository.findBySlug(slug)
    → Validate: not expired, not over click limit, not suspended
    → If password protected → render password gate page
    → AnalyticsService.recordClick({ urlId, request metadata })
        → Parse UA, GeoIP, UTM, referrer
        → Determine unique vs returning visitor (fingerprint hash)
        → ClickRepository.create() [async via waitUntil]
    → 302 Redirect to originalUrl
```

### 6.4 Analytics Dashboard

```
GET /api/analytics/:id
    → Auth check (owner or admin)
    → AnalyticsService.getStats(urlId, { dateRange, groupBy })
    → Aggregations: clicks over time, geo breakdown, devices, referrers, UTM
    → Return structured analytics payload
```

### 6.5 Clerk User Sync

```
Clerk Webhook (user.created | user.updated | user.deleted)
    → POST /api/webhooks/clerk
    → Verify Svix signature
    → AuthService.syncUser(clerkPayload)
    → UserRepository.upsert()
```

---

## 7. URL Shortening Engine

### 7.1 Slug Generation Strategy

| Mode | Algorithm | Length | Example |
|------|-----------|--------|---------|
| Random | `nanoid` (URL-safe alphabet) | 7 chars default | `aB3xK9m` |
| Custom | User-provided alias | 3–32 chars | `my-link` |

### 7.2 Collision Handling

1. Check reserved words list (~200 entries: `api`, `admin`, `dashboard`, etc.)
2. Query DB for existing slug (case-insensitive)
3. On collision with random slug → retry up to 5 times with new ID
4. On collision with custom alias → return `409 Conflict`

### 7.3 Reserved Words

Maintained in `lib/slug/reserved.ts` — synced with app route names to prevent routing conflicts.

---

## 8. Authentication & Authorization

### 8.1 Clerk Integration

- **Sign up / Sign in:** Clerk components (`<SignIn />`, `<SignUp />`)
- **Middleware:** `clerkMiddleware()` protects `/dashboard/*`, `/admin/*`, `/api/*` (except public endpoints)
- **User sync:** Webhook creates local `User` record with `clerkId`, `email`, `role`

### 8.2 Roles

| Role | Access |
|------|--------|
| `GUEST` | Shorten (rate-limited), view own guest links via session cookie |
| `USER` | Full dashboard, analytics, profile |
| `ADMIN` | Admin panel, manage users/URLs, site settings |

### 8.3 API Key Auth (Programmatic Access)

- Header: `X-API-Key: trimly_xxxx`
- Stored hashed in `ApiKey` table
- Scoped to user, rate-limited separately

---

## 9. Security Architecture

| Threat | Mitigation |
|--------|------------|
| SQL Injection | Prisma parameterized queries |
| XSS | React auto-escaping, `DOMPurify` for any rich text, CSP headers |
| CSRF | SameSite cookies, CSRF token on mutating forms |
| Rate Limiting | Upstash Redis — 10 req/min (guest), 60 req/min (auth), 100 req/min (API key) |
| Brute Force | Exponential backoff on password-protected links |
| Open Redirect | Validate `originalUrl` scheme (http/https only), block javascript: |
| SSRF | No server-side fetching of user URLs |
| Headers | `X-Frame-Options`, `X-Content-Type-Options`, `Referrer-Policy`, `Permissions-Policy` via `next.config.ts` + middleware |
| Secrets | All keys in env vars, `.env` gitignored |
| Password Links | bcrypt (cost 12), timing-safe compare |
| Audit Trail | All admin actions logged to `AuditLog` |

---

## 10. API Design

### Standard Response Envelope

```typescript
// Success
{ success: true, data: T, meta?: { page, limit, total } }

// Error
{ success: false, error: { code: string, message: string, details?: unknown } }
```

### Endpoints

| Method | Path | Auth | Description |
|--------|------|------|-------------|
| `POST` | `/api/shorten` | Optional | Create short URL |
| `GET` | `/[slug]` | None | Redirect |
| `GET` | `/api/url` | Required | List user's URLs (paginated) |
| `PUT` | `/api/url/:id` | Required | Update URL |
| `DELETE` | `/api/url/:id` | Required | Delete URL |
| `GET` | `/api/analytics/:id` | Required | URL analytics |
| `GET` | `/api/dashboard` | Required | Dashboard summary |
| `GET` | `/api/profile` | Required | User profile |
| `PUT` | `/api/profile` | Required | Update profile |
| `GET` | `/api/search` | Required | Search URLs |
| `GET` | `/api/admin` | Admin | Platform stats |
| `DELETE` | `/api/admin/users/:id` | Admin | Delete user |
| `PATCH` | `/api/admin/users/:id` | Admin | Suspend/unsuspend user |
| `DELETE` | `/api/admin/urls/:id` | Admin | Delete any URL |
| `GET` | `/api/qr/:id` | Required | QR code image |

### HTTP Status Codes

- `200` OK, `201` Created, `204` No Content
- `400` Validation error, `401` Unauthorized, `403` Forbidden
- `404` Not found, `409` Conflict (slug taken), `410` Gone (expired/deleted)
- `429` Rate limited, `500` Internal error

---

## 11. UI/UX Design System — "Trimly"

### 11.1 Brand Identity

- **Name:** Trimly — "Trim your links. Track everything."
- **Logo:** Minimal scissors + link chain icon, gradient teal-to-violet
- **Tagline:** Short links. Smart analytics. Built for teams.

### 11.2 Color Palette

| Token | Light | Dark |
|-------|-------|------|
| Primary | `#0D9488` (teal-600) | `#2DD4BF` (teal-400) |
| Accent | `#7C3AED` (violet-600) | `#A78BFA` (violet-400) |
| Background | `#F8FAFC` | `#0A0A0F` |
| Surface (glass) | `rgba(255,255,255,0.7)` | `rgba(255,255,255,0.05)` |
| Text | `#0F172A` | `#F1F5F9` |
| Muted | `#64748B` | `#94A3B8` |
| Destructive | `#EF4444` | `#F87171` |
| Success | `#22C55E` | `#4ADE80` |

### 11.3 Typography

- **Display / Headings:** `Inter` (variable, 600–800 weight)
- **Body:** `Inter` (400–500 weight)
- **Mono (URLs, slugs):** `JetBrains Mono`

### 11.4 Glassmorphism

```css
.glass {
  background: rgba(255, 255, 255, 0.08);
  backdrop-filter: blur(16px);
  border: 1px solid rgba(255, 255, 255, 0.12);
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.12);
}
```

### 11.5 Key UI Patterns

- **Landing:** Hero with inline shorten form, animated gradient mesh background, feature cards with hover lift
- **Dashboard:** Left sidebar (collapsible), stat cards row, URL table with inline actions, skeleton loaders
- **Analytics:** Tabbed charts (clicks, geo, devices, referrers), date range picker, export CSV
- **Animations:** Framer Motion page transitions, staggered list items, micro-interactions on copy/buttons
- **Accessibility:** Focus rings, ARIA labels, keyboard nav (Tab, Enter, Escape), skip links, reduced-motion support
- **Responsive:** Mobile-first, bottom nav on mobile, table → card layout on small screens

---

## 12. Performance Strategy

| Technique | Implementation |
|-----------|----------------|
| Server Components | Dashboard initial load, marketing pages |
| Edge Redirect | `/[slug]` on Vercel Edge for sub-50ms redirects |
| DB Indexes | `slug` (unique), `userId`, `createdAt`, `click.urlId + timestamp` |
| Caching | React Query staleTime, Redis cache for hot slugs |
| Pagination | Cursor-based for URLs, offset for admin |
| Image Opt | `next/image` for OG images, QR codes |
| Compression | Vercel automatic gzip/brotli |
| Async Click Logging | `waitUntil()` on edge — don't block redirect |

---

## 13. SEO Strategy

- Dynamic `metadata` export on all pages
- OpenGraph + Twitter Card images (`/og-image.png`, per-URL optional)
- `sitemap.ts` — static pages
- `robots.ts` — disallow `/dashboard`, `/admin`, `/api`
- Canonical URLs via `metadata.alternates.canonical`
- Structured data (JSON-LD) on landing page

---

## 14. Testing Strategy

| Level | Tool | Coverage Target |
|-------|------|-----------------|
| Unit | Vitest | Services, validators, slug engine, utils — 80%+ |
| Integration | Vitest + test DB | Repositories, API routes — key flows |
| E2E | Playwright | Auth flow, shorten, redirect, dashboard, admin — critical paths |

### Critical E2E Scenarios

1. Guest shortens URL → redirect works
2. User signs up → creates custom URL → views analytics
3. Password-protected link → gate → success
4. Expired link → 410 page
5. Admin suspends user → user's links return 403

---

## 15. Deployment Architecture

```
┌──────────────┐     ┌──────────────┐     ┌──────────────┐
│   Vercel     │────▶│  PostgreSQL  │     │   Clerk      │
│   (Next.js)  │     │  (Railway /  │     │   (Auth)     │
│              │     │   Supabase)  │     │              │
│  - Preview   │     └──────────────┘     └──────────────┘
│  - Production│     ┌──────────────┐
│  - Edge Fn   │────▶│  Upstash     │
└──────────────┘     │  Redis       │
                     └──────────────┘
```

### Environment Variables

```
DATABASE_URL=
DIRECT_URL=
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=
CLERK_SECRET_KEY=
CLERK_WEBHOOK_SECRET=
UPSTASH_REDIS_REST_URL=
UPSTASH_REDIS_REST_TOKEN=
NEXT_PUBLIC_APP_URL=
BCRYPT_ROUNDS=12
```

---

## 16. Scalability Considerations

- **Read-heavy redirect path** isolated on Edge — no DB round-trip for cached slugs
- **Click writes** batched/async — won't slow redirects
- **Partition-ready** `Click` table by month (future)
- **Multi-region** ready via Vercel Edge + Supabase read replicas
- **Horizontal scaling** — stateless API, external session store (Clerk)

---

## 17. Implementation Roadmap

| Step | Deliverable | Status |
|------|-------------|--------|
| 1 | Architecture Design (this document) | ✅ Current |
| 2 | Database Schema (Prisma) | Pending |
| 3 | Folder Structure + Project Scaffold | Pending |
| 4 | Dependencies Installation | Pending |
| 5 | Authentication (Clerk) | Pending |
| 6 | Database Setup + Migrations | Pending |
| 7 | URL Shortening Engine | Pending |
| 8 | Analytics Engine | Pending |
| 9 | Dashboard UI | Pending |
| 10 | Admin Panel | Pending |
| 11 | Testing Suite | Pending |
| 12 | Performance Optimization | Pending |
| 13 | Deployment | Pending |

---

## 18. Architecture Decision Records (ADRs)

### ADR-001: Next.js API Routes over Express
**Decision:** Use Next.js Route Handlers.  
**Reason:** Single deploy unit on Vercel, shared types, edge runtime for redirects.

### ADR-002: Clerk over NextAuth
**Decision:** Clerk for authentication.  
**Reason:** Built-in user management UI, webhooks, MFA, lower maintenance for SaaS.

### ADR-003: Edge Redirect Handler
**Decision:** `/[slug]/route.ts` on Edge runtime.  
**Reason:** Sub-50ms redirects globally; async click logging via `waitUntil`.

### ADR-004: Repository Pattern
**Decision:** Interface + Prisma implementation per entity.  
**Reason:** Testability, swap data layer without touching services.

### ADR-005: React Query + Zustand
**Decision:** React Query for server state, Zustand for UI state.  
**Reason:** Clear separation; React Query handles caching/refetch; Zustand for theme/modals.

---

*End of Step 1 — Architecture Design*
