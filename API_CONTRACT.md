# Khidmat NGO Management System — API Contract

**Base URL (local dev):** `http://localhost:8000/api`
**Base URL (deployed dev, Render):** https://khidmat-backend-3wia.onrender.com/api

**Auth:** All protected routes require a header:
```
Authorization: Bearer <jwt_token>
```
Get a token from `/auth/signup` or `/auth/login`.

**Roles:** `donor`, `volunteer`, `admin`. Some routes are restricted to `admin` only — noted per endpoint.

**Standard error format** (all endpoints):
```json
{ "error": "Human-readable message" }
```

---

## Auth

### POST /auth/signup
Create a new user account. No auth required.

**Request body:**
```json
{
  "name": "Test User",
  "email": "test@example.com",
  "password": "password123",
  "role": "donor",       // optional, defaults to "donor". One of: donor, volunteer, admin
  "phone": "03001234567" // optional
}
```

**Response `201`:**
```json
{
  "user": {
    "id": "uuid",
    "name": "Test User",
    "email": "test@example.com",
    "role": "donor",
    "phone": "03001234567",
    "created_at": "2026-09-05T08:35:11.017Z"
  },
  "token": "eyJhbGci..."
}
```

**Errors:** `400` missing fields, `409` email already exists.

---

### POST /auth/login
Log in an existing user. No auth required.

**Request body:**
```json
{
  "email": "test@example.com",
  "password": "password123"
}
```

**Response `200`:**
```json
{
  "user": {
    "id": "uuid",
    "name": "Test User",
    "email": "test@example.com",
    "role": "donor",
    "phone": null
  },
  "token": "eyJhbGci..."
}
```

**Errors:** `400` missing fields, `401` invalid email or password.

---

### GET /auth/me
Get the logged-in user's profile. **Requires auth.**

**Response `200`:**
```json
{
  "user": {
    "id": "uuid",
    "name": "Test User",
    "email": "test@example.com",
    "role": "donor",
    "phone": null,
    "created_at": "2026-09-05T08:35:11.017Z"
  }
}
```

**Errors:** `401` missing/invalid/expired token, `404` user not found.

---

## Causes

### GET /causes
List all causes. **Requires auth** (any role).

**Response `200`:**
```json
{
  "causes": [
    {
      "id": "uuid",
      "title": "Clean Water for Thar",
      "description": "...",
      "category": "health",
      "target_amount": 500000,
      "raised_amount": 120000,
      "zakat_eligible": true,
      "status": "active",
      "created_at": "2026-09-01T00:00:00Z"
    }
  ]
}
```

### GET /causes/:id
Get a single cause by ID. **Requires auth.**

**Response `200`:** same shape as one item above.
**Errors:** `404` cause not found.

### POST /causes
Create a new cause. **Requires auth, admin only.**

**Request body:**
```json
{
  "title": "Clean Water for Thar",
  "description": "...",
  "category": "health",
  "target_amount": 500000,
  "zakat_eligible": true
}
```

**Response `201`:** the created cause object.
**Errors:** `400` missing fields, `403` not admin.

### PUT /causes/:id
Update a cause. **Requires auth, admin only.** Same body shape as POST (partial updates allowed).

**Response `200`:** the updated cause object.
**Errors:** `403` not admin, `404` not found.

### DELETE /causes/:id
Delete a cause. **Requires auth, admin only.**

**Response `200`:**
```json
{ "message": "Cause deleted" }
```
**Errors:** `403` not admin, `404` not found.

---

## Events

### GET /events
List all events. **Requires auth.**

**Response `200`:**
```json
{
  "events": [
    {
      "id": "uuid",
      "title": "Ramadan Food Drive",
      "description": "...",
      "cause_id": "uuid | null",
      "location": "Karachi",
      "event_date": "2026-09-20T14:00:00Z",
      "status": "upcoming"
    }
  ]
}
```

### GET /events/:id
Get a single event. **Requires auth.**
**Errors:** `404` not found.

### POST /events
Create an event. **Requires auth, admin only.**

**Request body:**
```json
{
  "title": "Ramadan Food Drive",
  "description": "...",
  "cause_id": "uuid",     // optional
  "location": "Karachi",
  "event_date": "2026-09-20T14:00:00Z"
}
```
**Response `201`:** the created event object.

### PUT /events/:id
Update an event. **Requires auth, admin only.** Same body shape as POST (partial updates allowed).

### DELETE /events/:id
Delete an event. **Requires auth, admin only.**
**Response `200`:** `{ "message": "Event deleted" }`

---

## Donations

### POST /donations
Create a one-time donation. **Requires auth** (donor or admin).

**Request body:**
```json
{
  "cause_id": "uuid",
  "amount": 5000,
  "type": "one_time"   // one_time | zakat | recurring (Sprint 1: use one_time)
}
```

**Response `201`:**
```json
{
  "donation": {
    "id": "uuid",
    "user_id": "uuid",
    "cause_id": "uuid",
    "amount": 5000,
    "type": "one_time",
    "status": "completed",
    "created_at": "2026-09-05T09:00:00Z"
  }
}
```
**Errors:** `400` missing/invalid amount, `404` cause not found.

### GET /donations/me
List donations made by the logged-in user. **Requires auth.**

**Response `200`:**
```json
{
  "donations": [
    {
      "id": "uuid",
      "cause_id": "uuid",
      "cause_title": "Clean Water for Thar",
      "amount": 5000,
      "type": "one_time",
      "status": "completed",
      "created_at": "2026-09-05T09:00:00Z"
    }
  ]
}
```

### GET /donations/cause/:causeId
List all donations made to a specific cause. **Requires auth, admin only.**

**Response `200`:** same array shape as above, without `cause_title`.

### GET /donations
List all donations (admin dashboard view). **Requires auth, admin only.**

**Response `200`:**
```json
{
  "donations": [
    {
      "id": "uuid",
      "donor_name": "Test User",
      "cause_title": "Clean Water for Thar",
      "amount": 5000,
      "type": "one_time",
      "status": "completed",
      "created_at": "2026-09-05T09:00:00Z"
    }
  ]
}
```

---

## Status codes used across the API

| Code | Meaning |
|---|---|
| 200 | Success |
| 201 | Resource created |
| 400 | Bad request / missing fields |
| 401 | Not authenticated (missing/invalid/expired token) |
| 403 | Authenticated but not authorized (wrong role) |
| 404 | Resource not found |
| 409 | Conflict (e.g. duplicate email) |
| 500 | Server error |

---

## Notes for B (Web Admin) and C (Mobile)
- Store the JWT securely after login/signup — `expo-secure-store` on mobile, and something like an httpOnly-safe approach or at minimum a non-XSS-exposed store on web.
- Attach the token to every protected request as `Authorization: Bearer <token>`.
- `/causes`, `/events`, and the `GET` donation endpoints are implemented incrementally — check with Person A on which are live before integrating. This doc will be updated as endpoints ship.
- Dates are ISO 8601 strings in UTC — format them client-side for display.
