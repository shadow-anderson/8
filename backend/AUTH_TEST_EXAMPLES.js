/**
 * Authentication Testing Examples
 * Use these with tools like Postman, curl, or your frontend
 */

// ============================================
// Example 1: Login Request (Public)
// ============================================

// Request
// POST http://localhost:5000/api/users/login
// Content-Type: application/json

{
  "email": "manager@example.com",
  "password": "password123"
}

// Expected Response (200 OK)
{
  "message": "Login successful",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI2NTc4OTBhYmNkZWYxMjM0NTY3ODkwIiwiZW1wX2NvZGUiOiJFTVAwMDEiLCJlbWFpbCI6Im1hbmFnZXJAZXhhbXBsZS5jb20iLCJyb2xlIjoibWFuYWdlciIsImlhdCI6MTcwMjkwNTYwMCwiZXhwIjoxNzAzNTEwNDAwfQ.XYZ123ABC...",
  "user": {
    "_id": "657890abcdef1234567890",
    "emp_code": "EMP001",
    "name": "John Manager",
    "email": "manager@example.com",
    "role": "manager",
    "designation": "Project Manager",
    "division": "Design"
  }
}

// ============================================
// Example 2: Access Manager Endpoint (Protected)
// ============================================

// Request - WITH TOKEN
GET http://localhost:5000/api/manager/teams
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
Content-Type: application/json

// Expected Response (200 OK)
{
  "teams": [...]
}

// Request - WITHOUT TOKEN
GET http://localhost:5000/api/manager/teams
Content-Type: application/json

// Expected Response (401 Unauthorized)
{
  "error": "Authentication required",
  "message": "No token provided or invalid format. Use: Authorization: Bearer <token>"
}

// ============================================
// Example 3: Access Admin Endpoint (Protected)
// ============================================

// Request - WITH MANAGER TOKEN (Insufficient Role)
POST http://localhost:5000/api/admin/register
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...[manager_token]
Content-Type: application/json

{
  "email": "newuser@example.com",
  "name": "New User",
  "password": "password123",
  "role": "field",
  "emp_code": "EMP999"
}

// Expected Response (403 Forbidden)
{
  "error": "Access denied",
  "message": "This resource requires one of the following roles: hq. Your role: manager"
}

// Request - WITH HQ/ADMIN TOKEN (Correct Role)
POST http://localhost:5000/api/admin/register
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...[admin_token]
Content-Type: application/json

{
  "email": "newuser@example.com",
  "name": "New User",
  "password": "password123",
  "role": "field",
  "emp_code": "EMP999"
}

// Expected Response (201 Created)
{
  "message": "User registered successfully",
  "user": {...}
}

// ============================================
// CURL Examples
// ============================================

// 1. Login
curl -X POST http://localhost:5000/api/users/login \
  -H "Content-Type: application/json" \
  -d '{"email":"manager@example.com","password":"password123"}'

// 2. Access protected endpoint
curl -X GET http://localhost:5000/api/manager/teams \
  -H "Authorization: Bearer YOUR_TOKEN_HERE" \
  -H "Content-Type: application/json"

// 3. Create team (manager endpoint)
curl -X POST http://localhost:5000/api/manager/teams \
  -H "Authorization: Bearer YOUR_TOKEN_HERE" \
  -H "Content-Type: application/json" \
  -d '{
    "teamName": "Development Team A",
    "teamLeaderEmail": "leader@example.com",
    "teamMemberEmails": ["member1@example.com", "member2@example.com"],
    "division": "Development"
  }'

// ============================================
// JavaScript/Fetch Examples
// ============================================

// 1. Login and store token
async function login(email, password) {
  try {
    const response = await fetch('http://localhost:5000/api/users/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ email, password })
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Login failed');
    }

    const data = await response.json();
    
    // Store token
    localStorage.setItem('authToken', data.token);
    localStorage.setItem('user', JSON.stringify(data.user));
    
    console.log('Login successful:', data.user.name);
    return data;
  } catch (error) {
    console.error('Login error:', error.message);
    throw error;
  }
}

// 2. Make authenticated request
async function getTeams() {
  const token = localStorage.getItem('authToken');
  
  if (!token) {
    throw new Error('Not authenticated');
  }

  try {
    const response = await fetch('http://localhost:5000/api/manager/teams', {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });

    if (response.status === 401) {
      // Token expired or invalid
      localStorage.removeItem('authToken');
      localStorage.removeItem('user');
      throw new Error('Session expired. Please login again.');
    }

    if (response.status === 403) {
      throw new Error('You do not have permission to access this resource');
    }

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Request failed');
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching teams:', error.message);
    throw error;
  }
}

// 3. Logout
function logout() {
  localStorage.removeItem('authToken');
  localStorage.removeItem('user');
  window.location.href = '/login';
}

// ============================================
// Testing Checklist
// ============================================

/*
✓ Test 1: Login with valid credentials
✓ Test 2: Login with invalid credentials
✓ Test 3: Access manager endpoint without token (should fail)
✓ Test 4: Access manager endpoint with valid manager token (should succeed)
✓ Test 5: Access manager endpoint with valid hq token (should succeed)
✓ Test 6: Access manager endpoint with field user token (should fail)
✓ Test 7: Access admin endpoint with manager token (should fail)
✓ Test 8: Access admin endpoint with hq token (should succeed)
✓ Test 9: Use expired token (should fail)
✓ Test 10: Use invalid/malformed token (should fail)
*/
