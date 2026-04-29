#!/usr/bin/env node

/**
 * Production Testing Suite for Job Search Application
 * Run this script against your deployed URLs to validate everything works
 *
 * Usage: node production-test.js https://your-backend-url.com
 */

const https = require('https');
const http = require('http');

class ProductionTester {
    constructor(baseUrl) {
        this.baseUrl = baseUrl.replace(/\/$/, ''); // Remove trailing slash
        this.testResults = [];
        this.authToken = null;
    }

    async runAllTests() {
        console.log('🚀 Starting Production Testing Suite\n');
        console.log('='.repeat(50));
        console.log(`Testing: ${this.baseUrl}`);
        console.log('='.repeat(50));

        try {
            // Health Check
            await this.testHealthCheck();

            // Authentication Tests
            await this.testUserRegistration();
            await this.testUserLogin();

            // Protected Route Tests
            await this.testGetJobs();
            await this.testGetProfile();
            await this.testGetSubscriptions();
            await this.testJobApplication();

            // Error Handling Tests
            await this.testInvalidLogin();
            await this.test404Handling();

        } catch (error) {
            console.error('❌ Testing suite failed:', error.message);
        }

        this.printResults();
    }

    async makeRequest(endpoint, options = {}) {
        return new Promise((resolve, reject) => {
            const url = `${this.baseUrl}${endpoint}`;
            const requestOptions = {
                method: options.method || 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    ...options.headers
                }
            };

            if (this.authToken) {
                requestOptions.headers['Authorization'] = `Bearer ${this.authToken}`;
            }

            const req = https.request(url, requestOptions, (res) => {
                let data = '';

                res.on('data', (chunk) => {
                    data += chunk;
                });

                res.on('end', () => {
                    try {
                        const response = {
                            status: res.statusCode,
                            headers: res.headers,
                            data: data ? JSON.parse(data) : null
                        };
                        resolve(response);
                    } catch (e) {
                        resolve({
                            status: res.statusCode,
                            headers: res.headers,
                            data: data
                        });
                    }
                });
            });

            req.on('error', (err) => {
                reject(err);
            });

            if (options.body) {
                req.write(JSON.stringify(options.body));
            }

            req.end();
        });
    }

    async testHealthCheck() {
        console.log('\n🔍 Testing Health Check...');
        try {
            const response = await this.makeRequest('/api/health');

            const success = response.status === 200 &&
                          response.data?.success === true &&
                          response.data?.data?.status === 'healthy';

            this.logTest('Health Check', success, response);
        } catch (error) {
            this.logTest('Health Check', false, null, error.message);
        }
    }

    async testUserRegistration() {
        console.log('\n👤 Testing User Registration...');
        try {
            const testUser = {
                email: `test${Date.now()}@example.com`,
                password: 'TestPass123!'
            };

            const response = await this.makeRequest('/api/auth/register', {
                method: 'POST',
                body: testUser
            });

            const success = response.status === 201 &&
                          response.data?.success === true &&
                          response.data?.data?.user?.email === testUser.email;

            this.logTest('User Registration', success, response);

            if (success) {
                this.testUser = testUser; // Store for login test
            }
        } catch (error) {
            this.logTest('User Registration', false, null, error.message);
        }
    }

    async testUserLogin() {
        console.log('\n🔐 Testing User Login...');
        try {
            if (!this.testUser) {
                this.logTest('User Login', false, null, 'No test user available');
                return;
            }

            const response = await this.makeRequest('/api/auth/login', {
                method: 'POST',
                body: this.testUser
            });

            const success = response.status === 200 &&
                          response.data?.success === true &&
                          response.data?.data?.token;

            if (success) {
                this.authToken = response.data.data.token;
            }

            this.logTest('User Login', success, response);
        } catch (error) {
            this.logTest('User Login', false, null, error.message);
        }
    }

    async testGetJobs() {
        console.log('\n💼 Testing Get Jobs...');
        try {
            const response = await this.makeRequest('/api/jobs');

            const success = response.status === 200 &&
                          response.data?.success === true &&
                          Array.isArray(response.data?.data);

            this.logTest('Get Jobs', success, response);
        } catch (error) {
            this.logTest('Get Jobs', false, null, error.message);
        }
    }

    async testGetProfile() {
        console.log('\n👤 Testing Get Profile...');
        try {
            const response = await this.makeRequest('/api/user/profile');

            const success = response.status === 200 &&
                          response.data?.success === true &&
                          response.data?.data?.email;

            this.logTest('Get Profile', success, response);
        } catch (error) {
            this.logTest('Get Profile', false, null, error.message);
        }
    }

    async testGetSubscriptions() {
        console.log('\n💳 Testing Get Subscriptions...');
        try {
            const response = await this.makeRequest('/api/subscriptions');

            const success = response.status === 200 &&
                          response.data?.success === true &&
                          Array.isArray(response.data?.data);

            this.logTest('Get Subscriptions', success, response);
        } catch (error) {
            this.logTest('Get Subscriptions', false, null, error.message);
        }
    }

    async testJobApplication() {
        console.log('\n📝 Testing Job Application...');
        try {
            // First get a job ID
            const jobsResponse = await this.makeRequest('/api/jobs');
            if (jobsResponse.status !== 200 || !jobsResponse.data?.data?.length) {
                this.logTest('Job Application', false, null, 'No jobs available');
                return;
            }

            const jobId = jobsResponse.data.data[0].id;

            const response = await this.makeRequest(`/api/jobs/${jobId}/apply`, {
                method: 'POST'
            });

            const success = response.status === 201 &&
                          response.data?.success === true;

            this.logTest('Job Application', success, response);
        } catch (error) {
            this.logTest('Job Application', false, null, error.message);
        }
    }

    async testInvalidLogin() {
        console.log('\n❌ Testing Invalid Login...');
        try {
            const response = await this.makeRequest('/api/auth/login', {
                method: 'POST',
                body: {
                    email: 'invalid@example.com',
                    password: 'wrongpassword'
                }
            });

            const success = response.status === 401 &&
                          response.data?.success === false;

            this.logTest('Invalid Login Handling', success, response);
        } catch (error) {
            this.logTest('Invalid Login Handling', false, null, error.message);
        }
    }

    async test404Handling() {
        console.log('\n🔍 Testing 404 Handling...');
        try {
            const response = await this.makeRequest('/api/nonexistent');

            const success = response.status === 404;

            this.logTest('404 Error Handling', success, response);
        } catch (error) {
            this.logTest('404 Error Handling', false, null, error.message);
        }
    }

    logTest(testName, success, response, error = null) {
        const result = {
            test: testName,
            success,
            status: response?.status,
            error
        };

        this.testResults.push(result);

        if (success) {
            console.log(`✅ ${testName}: PASSED`);
        } else {
            console.log(`❌ ${testName}: FAILED`);
            if (error) console.log(`   Error: ${error}`);
            if (response) console.log(`   Status: ${response.status}`);
        }
    }

    printResults() {
        console.log('\n' + '='.repeat(50));
        console.log('📊 TEST RESULTS SUMMARY');
        console.log('='.repeat(50));

        const passed = this.testResults.filter(r => r.success).length;
        const total = this.testResults.length;

        console.log(`\nTotal Tests: ${total}`);
        console.log(`Passed: ${passed}`);
        console.log(`Failed: ${total - passed}`);

        if (passed === total) {
            console.log('\n🎉 ALL TESTS PASSED! Your application is production-ready!');
        } else {
            console.log('\n⚠️  Some tests failed. Check the details above.');
        }

        console.log('\nDetailed Results:');
        this.testResults.forEach(result => {
            const icon = result.success ? '✅' : '❌';
            console.log(`${icon} ${result.test}`);
        });
    }
}

// CLI Interface
if (require.main === module) {
    const baseUrl = process.argv[2];

    if (!baseUrl) {
        console.log('Usage: node production-test.js <backend-url>');
        console.log('Example: node production-test.js https://your-app.up.railway.app');
        process.exit(1);
    }

    const tester = new ProductionTester(baseUrl);
    tester.runAllTests().catch(console.error);
}

module.exports = ProductionTester;