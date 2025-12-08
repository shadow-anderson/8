# JWT Authentication Flow Diagram

## Complete Authentication Flow

```
┌─────────────┐                                    ┌─────────────┐
│   Frontend  │                                    │   Backend   │
│  (Browser)  │                                    │   (Server)  │
└──────┬──────┘                                    └──────┬──────┘
       │                                                  │
       │                                                  │
       │ ════════════════════════════════════════════════╪═════════════
       │           STEP 1: USER LOGIN                    │
       │ ════════════════════════════════════════════════╪═════════════
       │                                                  │
       │  POST /api/users/login                          │
       │  { email, password }                            │
       ├─────────────────────────────────────────────────>│
       │                                                  │
       │                                        ┌─────────▼────────┐
       │                                        │ Validate email   │
       │                                        │ & password       │
       │                                        └─────────┬────────┘
       │                                                  │
       │                                        ┌─────────▼────────┐
       │                                        │ Generate JWT     │
       │                                        │ Token with:      │
       │                                        │ - userId         │
       │                                        │ - email          │
       │                                        │ - role           │
       │                                        │ - exp (7 days)   │
       │                                        └─────────┬────────┘
       │                                                  │
       │  200 OK                                         │
       │  { token, user }                                │
       │<─────────────────────────────────────────────────┤
       │                                                  │
┌──────▼──────┐                                          │
│ Store token │                                          │
│ in          │                                          │
│ localStorage│                                          │
└──────┬──────┘                                          │
       │                                                  │
       │ ════════════════════════════════════════════════╪═════════════
       │      STEP 2: ACCESS PROTECTED ENDPOINT          │
       │ ════════════════════════════════════════════════╪═════════════
       │                                                  │
       │  GET /api/manager/teams                         │
       │  Authorization: Bearer <token>                  │
       ├─────────────────────────────────────────────────>│
       │                                                  │
       │                                        ┌─────────▼────────┐
       │                                        │ Extract token    │
       │                                        │ from header      │
       │                                        └─────────┬────────┘
       │                                                  │
       │                                        ┌─────────▼────────┐
       │                                        │ Verify JWT       │
       │                                        │ signature        │
       │                                        └─────────┬────────┘
       │                                                  │
       │                                        ┌─────────▼────────┐
       │                                        │ Check expiration │
       │                                        └─────────┬────────┘
       │                                                  │
       │                                        ┌─────────▼────────┐
       │                                        │ Fetch user from  │
       │                                        │ database         │
       │                                        └─────────┬────────┘
       │                                                  │
       │                                        ┌─────────▼────────┐
       │                                        │ Check user role  │
       │                                        │ vs required role │
       │                                        │ (manager/hq)     │
       │                                        └─────────┬────────┘
       │                                                  │
       │                                        ┌─────────▼────────┐
       │                                        │ Attach user to   │
       │                                        │ req.user         │
       │                                        └─────────┬────────┘
       │                                                  │
       │                                        ┌─────────▼────────┐
       │                                        │ Execute route    │
       │                                        │ handler          │
       │                                        └─────────┬────────┘
       │                                                  │
       │  200 OK                                         │
       │  { teams: [...] }                               │
       │<─────────────────────────────────────────────────┤
       │                                                  │
       │                                                  │
```

## Error Scenarios

### Scenario A: No Token Provided
```
Frontend                                    Backend
   │                                           │
   │  GET /api/manager/teams                  │
   │  (No Authorization header)               │
   ├──────────────────────────────────────────>│
   │                                           │
   │                                  ┌────────▼────────┐
   │                                  │ authenticate()  │
   │                                  │ middleware      │
   │                                  │ - No token!     │
   │                                  └────────┬────────┘
   │                                           │
   │  401 Unauthorized                        │
   │  { error: "Authentication required" }    │
   │<──────────────────────────────────────────┤
   │                                           │
```

### Scenario B: Invalid/Expired Token
```
Frontend                                    Backend
   │                                           │
   │  GET /api/manager/teams                  │
   │  Authorization: Bearer <expired_token>   │
   ├──────────────────────────────────────────>│
   │                                           │
   │                                  ┌────────▼────────┐
   │                                  │ jwt.verify()    │
   │                                  │ - Token expired!│
   │                                  └────────┬────────┘
   │                                           │
   │  401 Unauthorized                        │
   │  { error: "Token expired" }              │
   │<──────────────────────────────────────────┤
   │                                           │
   │ Redirect to login page                   │
   │                                           │
```

### Scenario C: Insufficient Role
```
Frontend                                    Backend
   │                                           │
   │  POST /api/admin/register                │
   │  Authorization: Bearer <manager_token>   │
   ├──────────────────────────────────────────>│
   │                                           │
   │                                  ┌────────▼────────┐
   │                                  │ authenticate()  │
   │                                  │ ✓ Token valid   │
   │                                  └────────┬────────┘
   │                                           │
   │                                  ┌────────▼────────┐
   │                                  │ authorize('hq') │
   │                                  │ User role:      │
   │                                  │ 'manager'       │
   │                                  │ Required: 'hq'  │
   │                                  │ ✗ Access denied │
   │                                  └────────┬────────┘
   │                                           │
   │  403 Forbidden                           │
   │  { error: "Access denied" }              │
   │<──────────────────────────────────────────┤
   │                                           │
```

## Role-Based Access Matrix

```
┌──────────────────────┬────────┬─────────┬────────┐
│      Endpoint        │   HQ   │ Manager │ Field  │
├──────────────────────┼────────┼─────────┼────────┤
│ POST /users/login    │   ✓    │    ✓    │   ✓    │ (Public)
├──────────────────────┼────────┼─────────┼────────┤
│ Admin Routes         │        │         │        │
│ ├─ POST /register    │   ✓    │    ✗    │   ✗    │
│ ├─ GET /users        │   ✓    │    ✗    │   ✗    │
│ ├─ PUT /users/:id    │   ✓    │    ✗    │   ✗    │
│ └─ DELETE /users/:id │   ✓    │    ✗    │   ✗    │
├──────────────────────┼────────┼─────────┼────────┤
│ Manager Routes       │        │         │        │
│ ├─ POST /teams       │   ✓    │    ✓    │   ✗    │
│ ├─ GET /teams        │   ✓    │    ✓    │   ✗    │
│ ├─ PUT /teams/:id    │   ✓    │    ✓    │   ✗    │
│ ├─ DELETE /teams/:id │   ✓    │    ✓    │   ✗    │
│ ├─ POST /tasks       │   ✓    │    ✓    │   ✗    │
│ └─ etc...            │   ✓    │    ✓    │   ✗    │
└──────────────────────┴────────┴─────────┴────────┘

Legend:
✓ = Access Granted
✗ = Access Denied
```

## Middleware Chain

```
Request Flow Through Middleware:

1. Request arrives at route
          │
          ▼
2. ┌──────────────────┐
   │  authenticate()  │  ← Validates JWT token
   │                  │  ← Fetches user from DB
   │  Sets req.user   │  ← Attaches user to request
   └────────┬─────────┘
            │
            ▼
3. ┌──────────────────┐
   │  authorize(...)  │  ← Checks user.role
   │                  │  ← Compares with required roles
   │  Role check      │  ← Grants or denies access
   └────────┬─────────┘
            │
            ▼
4. ┌──────────────────┐
   │  Route Handler   │  ← Your controller function
   │                  │  ← Has access to req.user
   │  Execute logic   │  ← Process the request
   └────────┬─────────┘
            │
            ▼
5.   Send Response
```

## Token Structure

```json
// JWT Header
{
  "alg": "HS256",
  "typ": "JWT"
}

// JWT Payload
{
  "userId": "657890abcdef1234567890",
  "emp_code": "EMP001",
  "email": "manager@example.com",
  "role": "manager",
  "iat": 1702905600,  // Issued at
  "exp": 1703510400   // Expires in 7 days
}

// JWT Signature
HMACSHA256(
  base64UrlEncode(header) + "." +
  base64UrlEncode(payload),
  JWT_SECRET
)
```

## Security Best Practices

```
1. ✓ Use HTTPS in production
   └─> Prevents token interception

2. ✓ Use strong JWT_SECRET
   └─> Prevents token forgery

3. ✓ Set appropriate token expiration
   └─> Limits damage if token is stolen

4. ✓ Validate token on every request
   └─> Ensures current user validity

5. ✓ Check user exists in database
   └─> Handles deleted/disabled users

6. ✓ Implement role-based access
   └─> Principle of least privilege

7. ⚠ TODO: Hash passwords with bcrypt
   └─> Currently using plain text

8. ⚠ TODO: Implement refresh tokens
   └─> Better user experience

9. ⚠ TODO: Token blacklist for logout
   └─> Proper session termination

10. ⚠ TODO: Rate limiting
    └─> Prevent brute force attacks
```
