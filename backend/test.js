// Backend API Test Suite
const http = require('http');

const BASE_URL = 'http://localhost:5000';
let testResults = { passed: 0, failed: 0, tests: [] };
let authToken = '';
let userId = '';

// Helper function for HTTP requests
async function makeRequest(method, path, body = null, token = null) {
  return new Promise((resolve, reject) => {
    const url = new URL(path, BASE_URL);
    const options = {
      hostname: url.hostname,
      port: url.port,
      path: url.pathname + url.search,
      method: method,
      headers: {
        'Content-Type': 'application/json',
      },
    };

    if (token) {
      options.headers['Authorization'] = `Bearer ${token}`;
    }

    const req = http.request(options, (res) => {
      let data = '';
      res.on('data', (chunk) => (data += chunk));
      res.on('end', () => {
        try {
          resolve({
            status: res.statusCode,
            body: data ? JSON.parse(data) : null,
            headers: res.headers,
          });
        } catch (e) {
          resolve({
            status: res.statusCode,
            body: data,
            headers: res.headers,
          });
        }
      });
    });

    req.on('error', reject);

    if (body) {
      req.write(JSON.stringify(body));
    }
    req.end();
  });
}

// Test function
async function test(name, fn) {
  try {
    await fn();
    testResults.passed++;
    testResults.tests.push({ name, status: '✅ PASS' });
    console.log(`✅ ${name}`);
  } catch (error) {
    testResults.failed++;
    testResults.tests.push({ name, status: `❌ FAIL: ${error.message}` });
    console.log(`❌ ${name}: ${error.message}`);
  }
}

// Test assertions
function assert(condition, message) {
  if (!condition) {
    throw new Error(message);
  }
}

async function runTests() {
  console.log('🧪 Starting API Test Suite...\n');

  // 1. Test Root Route
  await test('GET / - Root route', async () => {
    const res = await makeRequest('GET', '/');
    assert(res.status === 200, `Expected 200, got ${res.status}`);
    assert(res.body.success === true, 'Should have success true');
    assert(res.body.data.message && res.body.data.message.includes('🚀'), 'Root route should return welcome message');
  });

  // 1.5. Test Health Check
  await test('GET /api/health - Health check', async () => {
    const res = await makeRequest('GET', '/api/health');
    assert(res.status === 200, `Expected 200, got ${res.status}`);
    assert(res.body.success === true, 'Should have success true');
    assert(res.body.data.status === 'healthy', 'Should return healthy status');
  });

  // 2. Test Register
  await test('POST /api/auth/register - Register new user', async () => {
    const res = await makeRequest('POST', '/api/auth/register', {
      email: `testuser${Date.now()}@example.com`,
      password: 'TestPassword123',
    });
    assert(res.status === 201, `Expected 201, got ${res.status}`);
    assert(res.body.success === true, 'Should have success true');
    assert(res.body.data.message && res.body.data.message.includes('successfully'), 'Should return success message');
  });

  // 3. Test Register Validation
  await test('POST /api/auth/register - Validation (missing email)', async () => {
    const res = await makeRequest('POST', '/api/auth/register', {
      password: 'TestPassword123',
    });
    assert(res.status === 400, `Expected 400, got ${res.status}`);
  });

  // 4. Test Login
  await test('POST /api/auth/login - Valid login', async () => {
    const res = await makeRequest('POST', '/api/auth/login', {
      email: 'jane.doe@example.com',
      password: 'password123',
    });
    assert(res.status === 200, `Expected 200, got ${res.status}`);
    assert(res.body.success === true, 'Should have success true');
    assert(res.body.data.token, 'Should return JWT token');
    assert(res.body.data.subscription_plan, 'Should return subscription plan');
    authToken = res.body.data.token;
  });

  // 5. Test Login Validation
  await test('POST /api/auth/login - Invalid credentials', async () => {
    const res = await makeRequest('POST', '/api/auth/login', {
      email: 'jane.doe@example.com',
      password: 'wrongpassword',
    });
    assert(res.status === 401, `Expected 401, got ${res.status}`);
  });

  // 6. Test Protected Profile Route
  await test('GET /api/profile - Get user profile (with token)', async () => {
    const res = await makeRequest('GET', '/api/profile', null, authToken);
    assert(res.status === 200, `Expected 200, got ${res.status}`);
    assert(res.body.success === true, 'Should have success true');
    assert(res.body.data.id, 'Should return user ID');
    assert(res.body.data.email, 'Should return user email');
    userId = res.body.data.id;
  });

  // 7. Test Profile without Token
  await test('GET /api/profile - Unauthenticated access (no token)', async () => {
    const res = await makeRequest('GET', '/api/profile');
    assert(res.status === 401, `Expected 401, got ${res.status}`);
  });

  // 8. Test Get Jobs
  await test('GET /api/jobs - Fetch all jobs', async () => {
    const res = await makeRequest('GET', '/api/jobs');
    assert(res.status === 200, `Expected 200, got ${res.status}`);
    assert(res.body.success === true, 'Should have success true');
    assert(Array.isArray(res.body.data), 'Should return an array of jobs');
  });

  // 9. Test Subscriptions List
  await test('GET /api/subscriptions - Fetch subscription plans', async () => {
    const res = await makeRequest('GET', '/api/subscriptions');
    assert(res.status === 200, `Expected 200, got ${res.status}`);
    assert(res.body.success === true, 'Should have success true');
    assert(Array.isArray(res.body.data), 'Should return an array of plans');
  });

  // 10. Test Apply for Job
  await test('POST /api/jobs/:jobId/apply - Apply for job', async () => {
    const res = await makeRequest(
      'POST',
      '/api/jobs/1/apply',
      {},
      authToken
    );
    assert(
      res.status === 201 || res.status === 409,
      `Expected 201 or 409, got ${res.status}`
    );
  });

  // 11. Test Subscribe to Plan
  await test('POST /api/subscriptions/subscribe - Update subscription', async () => {
    const res = await makeRequest(
      'POST',
      '/api/subscriptions/subscribe',
      { planId: 1 },
      authToken
    );
    assert(res.status === 200 || res.status === 404, `Expected 200 or 404, got ${res.status}`);
  });

  // 12. Test 404 Route
  await test('GET /nonexistent - 404 handling', async () => {
    const res = await makeRequest('GET', '/nonexistent');
    assert(res.status === 404, `Expected 404, got ${res.status}`);
  });

  // Print Results
  console.log('\n' + '='.repeat(50));
  console.log('📊 TEST RESULTS');
  console.log('='.repeat(50));
  console.log(`✅ Passed: ${testResults.passed}`);
  console.log(`❌ Failed: ${testResults.failed}`);
  console.log(`📈 Total:  ${testResults.tests.length}`);
  console.log('='.repeat(50) + '\n');

  process.exit(testResults.failed > 0 ? 1 : 0);
}

// Run tests after a short delay to ensure server is ready
setTimeout(runTests, 1000);
