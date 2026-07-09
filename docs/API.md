# Trimly API Documentation

## Base URL

`https://your-domain.com/api`

## Authentication

Most endpoints require Clerk session authentication. Admin endpoints require `ADMIN` role.

API key authentication (header `X-API-Key`) is supported via the `ApiKey` model for programmatic access.

## Response Format

```json
{ "success": true, "data": {}, "meta": { "page": 1, "limit": 10, "total": 100 } }
```

```json
{ "success": false, "error": { "code": "VALIDATION_ERROR", "message": "..." } }
```

## Endpoints

### POST /api/shorten

Create a shortened URL. Guest access allowed (rate-limited).

**Body:** `{ originalUrl, customSlug?, title?, password?, expiresAt?, maxClicks? }`

### GET /api/url

List authenticated user's URLs. Query: `q`, `page`, `limit`, `sortBy`, `sortOrder`, `status`.

### PUT /api/url/:id

Update a URL.

### DELETE /api/url/:id

Delete a URL.

### GET /api/analytics/:id

Get analytics for a URL. Query: `from`, `to`, `groupBy`.

### GET /api/dashboard

Dashboard summary stats.

### GET /api/profile | PUT /api/profile

User profile.

### GET /api/admin

Platform admin stats (admin only).

### GET /api/qr/:id

QR code image (PNG default, `?format=svg` for SVG).

### GET /:slug

Redirect to original URL. Records click analytics.
