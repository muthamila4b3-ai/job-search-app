#!/usr/bin/env node

/**
 * Complete Production Testing Suite
 * Runs all tests and generates validation report
 *
 * Usage: node run-tests.js <backend-url> <frontend-url>
 */

const ProductionTester = require('./production-test');
const DocsUpdater = require('./update-docs');
const fs = require('fs');
const path = require('path');

class CompleteTestRunner {
    constructor(backendUrl, frontendUrl) {
        this.backendUrl = backendUrl;
        this.frontendUrl = frontendUrl;
        this.results = {
            backend: null,
            frontend: null,
            integration: null
        };
    }

    async runCompleteTesting() {
        console.log('🚀 COMPLETE PRODUCTION TESTING SUITE\n');
        console.log('='.repeat(60));
        console.log(`Backend URL: ${this.backendUrl}`);
        console.log(`Frontend URL: ${this.frontendUrl}`);
        console.log('='.repeat(60));

        // Run backend API tests
        console.log('\n📡 TESTING BACKEND API...');
        await this.runBackendTests();

        // Run frontend tests (manual checklist)
        console.log('\n📱 FRONTEND TESTING CHECKLIST:');
        this.showFrontendChecklist();

        // Run integration tests
        console.log('\n🔗 INTEGRATION TESTING:');
        await this.runIntegrationTests();

        // Generate report
        this.generateReport();

        // Update documentation
        this.updateDocumentation();
    }

    async runBackendTests() {
        const tester = new ProductionTester(this.backendUrl);

        try {
            await tester.runAllTests();
            this.results.backend = tester.testResults;
        } catch (error) {
            console.error('❌ Backend testing failed:', error.message);
            this.results.backend = [];
        }
    }

    showFrontendChecklist() {
        const checklist = [
            '1. Open frontend URL in browser',
            '2. Test app launches without errors',
            '3. Test user registration flow',
            '4. Test user login flow',
            '5. Test job listings display',
            '6. Test job application functionality',
            '7. Test navigation between screens',
            '8. Test responsive design (mobile/desktop)',
            '9. Test error handling',
            '10. Test loading states'
        ];

        checklist.forEach(item => console.log(`   • ${item}`));
        console.log('\n   📋 See FRONTEND_TESTING_CHECKLIST.md for detailed checklist');
    }

    async runIntegrationTests() {
        console.log('🔄 Testing Frontend-Backend Integration...');

        const integrationTests = [
            { name: 'CORS Configuration', status: 'unknown' },
            { name: 'API Response Format', status: 'unknown' },
            { name: 'Authentication Flow', status: 'unknown' },
            { name: 'Error Propagation', status: 'unknown' },
            { name: 'Data Synchronization', status: 'unknown' }
        ];

        // Basic CORS test
        try {
            const response = await this.makeRequest(this.backendUrl + '/api/health', {
                headers: {
                    'Origin': this.frontendUrl
                }
            });

            integrationTests[0].status = response.headers['access-control-allow-origin'] ? 'pass' : 'fail';
        } catch (error) {
            integrationTests[0].status = 'fail';
        }

        // API response format test
        try {
            const response = await this.makeRequest(this.backendUrl + '/api/health');
            const isValidFormat = response.data &&
                                typeof response.data.success === 'boolean' &&
                                response.data.data;

            integrationTests[1].status = isValidFormat ? 'pass' : 'fail';
        } catch (error) {
            integrationTests[1].status = 'fail';
        }

        integrationTests.forEach(test => {
            const icon = test.status === 'pass' ? '✅' : test.status === 'fail' ? '❌' : '❓';
            console.log(`   ${icon} ${test.name}: ${test.status.toUpperCase()}`);
        });

        this.results.integration = integrationTests;
    }

    async makeRequest(url, options = {}) {
        const https = require('https');
        return new Promise((resolve, reject) => {
            const req = https.request(url, options, (res) => {
                let data = '';
                res.on('data', (chunk) => data += chunk);
                res.on('end', () => {
                    try {
                        resolve({
                            status: res.statusCode,
                            headers: res.headers,
                            data: JSON.parse(data)
                        });
                    } catch (e) {
                        resolve({
                            status: res.statusCode,
                            headers: res.headers,
                            data: data
                        });
                    }
                });
            });
            req.on('error', reject);
            req.end();
        });
    }

    generateReport() {
        console.log('\n📊 GENERATING VALIDATION REPORT...');

        const backendPassed = this.results.backend ? this.results.backend.filter(r => r.success).length : 0;
        const backendTotal = this.results.backend ? this.results.backend.length : 0;

        const integrationPassed = this.results.integration ? this.results.integration.filter(r => r.status === 'pass').length : 0;
        const integrationTotal = this.results.integration ? this.results.integration.length : 0;

        console.log('\n' + '='.repeat(60));
        console.log('🎯 PRODUCTION VALIDATION RESULTS');
        console.log('='.repeat(60));
        console.log(`Backend API Tests: ${backendPassed}/${backendTotal} passed`);
        console.log(`Integration Tests: ${integrationPassed}/${integrationTotal} passed`);
        console.log('Frontend Tests: Manual verification required');
        console.log('='.repeat(60));

        const totalScore = backendPassed + integrationPassed;
        const maxScore = backendTotal + integrationTotal;

        if (totalScore === maxScore) {
            console.log('🎉 EXCELLENT! All automated tests passed!');
            console.log('📝 Complete the manual frontend testing, then you\'re ready for production!');
        } else {
            console.log('⚠️  Some tests failed. Check the details above.');
            console.log('🔧 Fix the issues before proceeding to production.');
        }

        // Save detailed report
        this.saveDetailedReport();
    }

    saveDetailedReport() {
        const report = {
            timestamp: new Date().toISOString(),
            backendUrl: this.backendUrl,
            frontendUrl: this.frontendUrl,
            results: this.results,
            summary: {
                backend: {
                    passed: this.results.backend ? this.results.backend.filter(r => r.success).length : 0,
                    total: this.results.backend ? this.results.backend.length : 0
                },
                integration: {
                    passed: this.results.integration ? this.results.integration.filter(r => r.status === 'pass').length : 0,
                    total: this.results.integration ? this.results.integration.length : 0
                }
            }
        };

        fs.writeFileSync(
            path.join(__dirname, 'test-results.json'),
            JSON.stringify(report, null, 2)
        );

        console.log('📄 Detailed results saved to test-results.json');
    }

    updateDocumentation() {
        console.log('\n📝 UPDATING DOCUMENTATION...');

        try {
            const updater = new DocsUpdater(this.frontendUrl, this.backendUrl);
            updater.updateAllDocs();
        } catch (error) {
            console.error('❌ Documentation update failed:', error.message);
        }
    }
}

// CLI Interface
if (require.main === module) {
    const backendUrl = process.argv[2];
    const frontendUrl = process.argv[3];

    if (!backendUrl || !frontendUrl) {
        console.log('Usage: node run-tests.js <backend-url> <frontend-url>');
        console.log('Example: node run-tests.js https://job-search-backend.up.railway.app https://job-search-frontend.up.railway.app');
        process.exit(1);
    }

    const runner = new CompleteTestRunner(backendUrl, frontendUrl);
    runner.runCompleteTesting().catch(console.error);
}

module.exports = CompleteTestRunner;