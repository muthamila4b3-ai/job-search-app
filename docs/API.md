# Job Search API Documentation

## Base URL
```
http://localhost:5000
```

## Authentication
All protected endpoints require a Bearer token in the `Authorization` header:
```
Authorization: Bearer <your_jwt_token>
```

---

## Endpoints

### 1. Health Check
**GET** `/api/health`
- **Description**: Check if the API is running
- **Auth**: Not required
- **Response**:
```json
{
  "status": "ok",
  "timestamp": "2024-04-16T10:30:00Z"
}
```

### 2. Register User
**POST** `/api/auth/register`
- **Description**: Create a new user account
- **Auth**: Not required
- **Request Body**:
```json
{
  "email": "user@example.com",
  "password": "SecurePassword123"
}
```
- **Response** (201):
```json
{
  "success": true,
  "message": "User registered successfully",
  "email": "user@example.com"
}
```
- **Validation**:
  - Email must be valid format
  - Email must not already exist (409 if duplicate)
  - Password must be 6-255 characters

### 3. Login
**POST** `/api/auth/login`
- **Description**: Authenticate and get JWT token
- **Auth**: Not required
- **Request Body**:
```json
{
  "email": "user@example.com",
  "password": "SecurePassword123"
}
```
- **Response** (200):
```json
{
  "success": true,
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "subscription_plan": "Silver"
}
```
- **Error** (401): Invalid credentials

### 4. Get User Profile
**GET** `/api/profile`
- **Description**: Get authenticated user's profile
- **Auth**: Required
- **Response** (200):
```json
{
  "id": 1,
  "email": "user@example.com",
  "subscription_plan": "Silver"
}
```

### 5. Get All Jobs
**GET** `/api/jobs`
- **Description**: List all available jobs
- **Auth**: Not required
- **Response** (200):
```json
[
  {
    "id": 1,
    "title": "Frontend Developer",
    "company": "Neon Labs",
    "location": "Remote",
    "description": "Build responsive UI...",
    "salary": "$70k - $90k",
    "remote": true,
    "created_at": "2024-04-16T10:00:00Z"
  }
]
```

### 6. Apply for Job
**POST** `/api/jobs/:jobId/apply`
- **Description**: Apply for a specific job
- **Auth**: Required
- **URL Parameters**:
  - `jobId` (number): ID of the job
- **Response** (201):
```json
{
  "success": true,
  "message": "Applied successfully",
  "jobId": 1
}
```
- **Errors**:
  - 400: Invalid job ID
  - 409: Already applied for this job
  - 401: Not authenticated

### 7. Get Subscriptions
**GET** `/api/subscriptions`
- **Description**: Get available subscription plans
- **Auth**: Not required
- **Response** (200):
```json
[
  {
    "id": 1,
    "name": "Silver",
    "price": "$9.99/mo",
    "benefits": "Basic job alerts, Standard applications"
  }
]
```

### 8. Subscribe to Plan
**POST** `/api/subscriptions/subscribe`
- **Description**: Upgrade user's subscription plan
- **Auth**: Required
- **Request Body**:
```json
{
  "planId": 2
}
```
- **Response** (200):
```json
{
  "success": true,
  "message": "Subscription updated",
  "plan": "Gold"
}
```
- **Errors**:
  - 400: Missing or invalid planId
  - 404: Plan not found

---

## HTTP Status Codes
- **200**: Success
- **201**: Created successfully
- **400**: Bad request (validation error)
- **401**: Unauthorized (missing/invalid token or credentials)
- **403**: Forbidden (token invalid or expired)
- **404**: Resource not found
- **409**: Conflict (e.g., duplicate email)
- **500**: Server error

---

## Error Response Format
```json
{
  "message": "Error description"
}
```

In development mode, errors include a `details` field with additional information.

---

## Default Test Credentials
- Email: `jane.doe@example.com`
- Password: `password123`
