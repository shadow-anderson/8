# Authentication Test Examples

## 1. Login (Public Endpoint)

```bash
# Request
curl -X POST http://localhost:5000/api/users/login \
  -H "Content-Type: application/json" \
  -d '{"email":"user@example.com","password":"password123"}'

# Response (200 OK)
{
  "message": "Login successful",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "_id": "...",
    "emp_code": "EMP001",
    "name": "John Doe",
    "email": "user@example.com",
    "role": "manager"
  }
}
```

## 2. Access Manager Endpoint (Protected)

```bash
# With valid token (Success)
curl -X GET http://localhost:5000/api/manager/teams \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"

# Without token (401 Error)
curl -X GET http://localhost:5000/api/manager/teams

# Response
{
  "error": "Authentication required",
  "message": "No token provided or invalid format..."
}
```

## 3. Access Admin Endpoint (Protected)

```bash
# With HQ/Admin token (Success)
curl -X POST http://localhost:5000/api/admin/register \
  -H "Authorization: Bearer YOUR_ADMIN_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "email":"newuser@example.com",
    "name":"New User",
    "password":"password123",
    "role":"field",
    "emp_code":"EMP999"
  }'

# With Manager token (403 Error)
# Response
{
  "error": "Access denied",
  "message": "This resource requires one of the following roles: hq. Your role: manager"
}
```

## 4. Frontend JavaScript Example

```javascript
// Login
async function login(email, password) {
  const response = await fetch('/api/users/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password })
  });
  
  const data = await response.json();
  localStorage.setItem('authToken', data.token);
  return data;
}

// Authenticated Request
async function getTeams() {
  const token = localStorage.getItem('authToken');
  
  const response = await fetch('/api/manager/teams', {
    headers: { 'Authorization': `Bearer ${token}` }
  });
  
  if (response.status === 401) {
    // Token expired - redirect to login
    localStorage.removeItem('authToken');
    window.location.href = '/login';
    return;
  }
  
  return await response.json();
}
```

## Role Access Matrix

| Endpoint | Public | Field | Manager | HQ (Admin) |
|----------|--------|-------|---------|------------|
| `POST /users/login` | ✅ | ✅ | ✅ | ✅ |
| `GET /manager/teams` | ❌ | ❌ | ✅ | ✅ |
| `POST /admin/register` | ❌ | ❌ | ❌ | ✅ |

## Common Errors

- **401 Unauthorized** - Missing or invalid token
- **403 Forbidden** - Insufficient role/permissions
- **Token expired** - User needs to login again
