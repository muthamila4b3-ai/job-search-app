# Testing Guide

## API Test Suite

### Quick Start
Run the API test suite that's already in the backend:

```bash
cd backend
npm start  # Terminal 1 - Start server
node test.js  # Terminal 2 - Run tests
```

The test suite includes 12 comprehensive tests covering:
- Root route and health check
- User registration (valid/invalid)
- User login (valid credentials, invalid credentials)
- Protected profile endpoint (with/without token)
- Job listing
- Subscription management
- Job applications
- 404 handling

### Test Results
Expected output:
```
✅ GET / - Root route
✅ POST /api/auth/register - Validation (missing email)
✅ GET /api/profile - Unauthenticated access (no token)
✅ GET /nonexistent - 404 handling
...
📊 TEST RESULTS
✅ Passed: 12
❌ Failed: 0
📈 Total:  12
```

---

## Manual Testing with cURL

### 1. Register a User
```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "testuser@example.com",
    "password": "Password123"
  }'
```

### 2. Login
```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "jane.doe@example.com",
    "password": "password123"
  }'
```

Response will include:
```json
{
  "success": true,
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "subscription_plan": "Silver"
}
```

### 3. Get Profile (Protected)
```bash
curl -X GET http://localhost:5000/api/profile \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

### 4. Get Jobs
```bash
curl -X GET http://localhost:5000/api/jobs
```

### 5. Apply for Job
```bash
curl -X POST http://localhost:5000/api/jobs/1/apply \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

### 6. Get Subscriptions
```bash
curl -X GET http://localhost:5000/api/subscriptions
```

### 7. Subscribe to Plan
```bash
curl -X POST http://localhost:5000/api/subscriptions/subscribe \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN_HERE" \
  -d '{
    "planId": 2
  }'
```

---

## Testing with Postman

1. **Import Collection**:
   - Create a new Postman collection
   - Add all endpoints listed above
   - Use variables for `{{token}}` and `{{baseUrl}}`

2. **Set Environment Variables**:
   ```json
   {
     "baseUrl": "http://localhost:5000",
     "token": ""
   }
   ```

3. **Pre-request Scripts**:
   - Set `{{token}}` from login response automatically

4. **Execute Collection**: Run all requests in sequence

---

## Frontend Testing

### Setup Flutter Test Environment
```bash
cd frontend
flutter pub get
flutter test  # Run unit tests
flutter run   # Run on device/emulator
```

### Manual Testing Scenarios
1. **Authentication Flow**:
   - [ ] Login with valid credentials
   - [ ] Login with invalid credentials
   - [ ] Register new account
   - [ ] Register with existing email
   - [ ] Token expiration and refresh

2. **Job Browsing**:
   - [ ] Load job list
   - [ ] Apply for job
   - [ ] Try to apply for same job twice
   - [ ] Check application status

3. **Subscriptions**:
   - [ ] View subscription plans
   - [ ] Upgrade subscription
   - [ ] Verify plan update in profile

4. **UI/UX**:
   - [ ] All screens load correctly
   - [ ] Navigation works properly
   - [ ] Form validation messages display
   - [ ] Error handling displays user-friendly messages

---

## Load Testing

### Using Apache Bench
```bash
# Test login endpoint (100 requests, 10 concurrent)
ab -n 100 -c 10 -p credentials.json -T application/json \
  http://localhost:5000/api/auth/login
```

### Using wrk
```bash
# Test job listing (4 threads, 100 connections for 30s)
wrk -t4 -c100 -d30s http://localhost:5000/api/jobs
```

### Performance Targets
- **Response Time**: < 500ms for 95th percentile
- **Throughput**: > 1000 requests/second
- **Error Rate**: < 0.1% under load

---

## Continuous Testing

### Pre-commit Tests
```bash
# Run tests before pushing code
cd backend
npm run test  # If configured
```

### Database Reset for Testing
```bash
# Reset database to fresh state
cd backend
npm run init-db
```

---

## Integration Testing Checklist

- [ ] User can register -> login -> browse jobs
- [ ] User can apply for multiple jobs
- [ ] User can upgrade subscription
- [ ] Profile information updates correctly
- [ ] Token expires after 8 hours
- [ ] Duplicate email registration fails
- [ ] Invalid credentials return 401
- [ ] Invalid job ID returns 400
- [ ] All error messages are user-friendly

---

## Security Testing

- [ ] Test SQL injection attempts
- [ ] Test XSS via job descriptions
- [ ] Test CORS origin validation
- [ ] Test rate limiting behavior
- [ ] Test token tamper detection
- [ ] Test large request rejection (>10KB)
- [ ] Verify sensitive data not logged

---

## Performance Testing

- [ ] Profile endpoint response time
- [ ] Jobs list load time with 1000+ jobs
- [ ] Search performance
- [ ] Subscription update performance
- [ ] Concurrent user capacity test

---

## Known Issues

None currently documented. Report issues in the issue tracker.

---

## Test Automation (Future)

Plan to implement:
- Jest unit tests
- Supertest for API testing
- Jest coverage reports
- GitHub Actions CI/CD
- Automated performance testing
