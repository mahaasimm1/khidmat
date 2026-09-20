# Mobile integration notes

This app is implemented against the repository’s real backend contract from the Khidmat project.

## API base URL
- Production/dev backend: https://khidmat-backend-3wia.onrender.com/api
- Local backend: http://localhost:5000/api
- Public config entry: EXPO_PUBLIC_API_URL

## Authentication contract
- Signup: POST /api/auth/signup
- Login: POST /api/auth/login
- Protected routes require: Authorization: Bearer <token>
- JWT payload contains: { id, role }
- Role values: donor, volunteer, admin
- Authenticated user fetch: GET /api/auth/me

## Auth request/response shapes
### Signup body
{
  name: string,
  email: string,
  password: string,
  role?: 'donor' | 'volunteer' | 'admin',
  phone?: string
}

### Signup response
{
  user: { id, name, email, role, phone, created_at },
  token: string
}

### Login body
{
  email: string,
  password: string
}

### Login response
{
  user: { id, name, email, role, phone },
  token: string
}

## Causes contract
- GET /api/causes returns { causes: [...] }
- GET /api/causes/:id returns { cause: {...} }
- Cause fields: id, title, description, category, target_amount, raised_amount, zakat_eligible, status, created_at
- Requires auth for all donors.

## Donations contract
### Create donation
POST /api/donations
Body:
{
  cause_id: string,
  amount: number,
  type?: 'one_time' | 'zakat' | 'recurring'
}

Response:
{
  donation: {
    id,
    user_id,
    cause_id,
    amount,
    type,
    status,
    created_at
  }
}

### My donations
GET /api/donations/me
Response:
{
  donations: [
    {
      id,
      cause_id,
      cause_title,
      amount,
      type,
      status,
      created_at
    }
  ]
}

## Validation and errors
- Signup requires name, email, and password.
- Login requires email and password.
- Donation requires cause_id and amount.
- amount must be a positive number.
- Backend returns { error: 'message' } for failures.
- Common status codes: 400, 401, 403, 404, 409, 500.
- Authorization header format is exactly: Authorization: Bearer <token>

## Security notes
- Store JWT using expo-secure-store.
- Do not expose token in logs or commit secrets.
- The mobile app is a public client; do not include service-role credentials.
