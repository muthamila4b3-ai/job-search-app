# 🚀 Railway Deployment - Step by Step

**Project Ready Date:** April 29, 2026  
**GitHub Repository:** https://github.com/muthamila4b3-ai/job-search-app  
**Railway Project ID:** cc1e471b-a236-4505-8105-1bdfde362319

---

## ✅ Pre-Deployment Checklist

- [ ] Railway account created and logged in
- [ ] Project cc1e471b-a236-4505-8105-1bdfde362319 exists
- [ ] GitHub repository synced with latest code
- [ ] All test files ready (production-test.js, run-tests.js, update-docs.js)
- [ ] Database schema ready (database/schema.sql)

---

## 📋 STEP 1: Deploy Backend Service

### Option A: Using Railway Dashboard (Recommended)

1. **Go to Railway Dashboard**
   - URL: https://railway.app/dashboard
   - Log in with your account

2. **Open Your Project**
   - Click on project ID: `cc1e471b-a236-4505-8105-1bdfde362319`
   - Or search for "job-search-app"

3. **Add Backend Service**
   - Click blue "+" button at top right
   - Select "GitHub Repository"
   - Authenticate if needed
   - Search for and select: `muthamila4b3-ai/job-search-app`

4. **Configure Backend Service**
   - **Name:** backend
   - **Root Directory:** `backend`
   - **Environment:** Docker
   - **Dockerfile Path:** `Dockerfile`

5. **Set Environment Variables**
   - Click "Variables" tab
   - Add these variables:
     ```
     DB_HOST=${{MYSQLHOST}}
     DB_USER=${{MYSQLUSER}}
     DB_PASSWORD=${{MYSQLPASSWORD}}
     DB_NAME=${{MYSQLDATABASE}}
     PORT=5000
     JWT_SECRET=6efbb03ad35df54ddf9020f2b09279a4337b1bc29fb6098efbfcfe6b92f80b42
     NODE_ENV=production
     ```

6. **Deploy**
   - Click "Deploy" button
   - Wait 3-5 minutes for build & deployment
   - Monitor build logs
   - ✅ When status shows "Active", note the URL (e.g., `https://your-backend.up.railway.app`)

### Expected Output:
```
Build successful ✅
Container running on port 5000
Health endpoint: https://[your-backend].up.railway.app/api/health
Status: Active
```

**⏱️ Estimated Time:** 3-5 minutes

---

## 📋 STEP 2: Deploy Database (MySQL)

**Note:** Railway should have provided a MySQL database with your project. If not:

1. **In Railway Dashboard**
   - Click "+" button
   - Select "MySQL"
   - Wait for initialization

2. **Get Database Credentials**
   - In MySQL service, click "Variables" tab
   - Note:
     - MYSQLHOST
     - MYSQLUSER
     - MYSQLPASSWORD
     - MYSQLDATABASE

3. **Initialize Database Schema**
   
   **Option A: Via Railway Terminal (Easiest)**
   - Go to backend service
   - Click "Terminal" tab
   - Run:
     ```bash
     cd ../database && mysql -h $MYSQLHOST -u $MYSQLUSER -p$MYSQLPASSWORD $MYSQLDATABASE < schema.sql
     ```
   
   **Option B: Via Local Terminal**
   - Get MySQL credentials from Railway Variables
   - Replace placeholder values:
     ```bash
     mysql -h [MYSQLHOST] -u [MYSQLUSER] -p[MYSQLPASSWORD] [MYSQLDATABASE] < database/schema.sql
     ```

4. **Verify Database**
   - In Railway Terminal, run:
     ```bash
     mysql -h $MYSQLHOST -u $MYSQLUSER -p$MYSQLPASSWORD $MYSQLDATABASE -e "SHOW TABLES;"
     ```
   - Expected output: Tables (users, jobs, applications, subscription_plans)

**✅ Success:** All 4 tables created with test data

---

## 📋 STEP 3: Deploy Frontend Service

1. **In Railway Dashboard**
   - Click "+" button
   - Select "GitHub Repository"
   - Select: `muthamila4b3-ai/job-search-app` again

2. **Configure Frontend Service**
   - **Name:** frontend
   - **Root Directory:** `frontend`
   - **Service:** Web Framework
   - **Build Command:** `flutter build web --release`
   - **Start Command:** (leave empty for static site)

3. **Set Environment Variables**
   - Click "Variables" tab
   - Add: `API_BASE_URL=https://[your-backend].up.railway.app`
   - (Replace [your-backend] with actual backend URL from Step 1)

4. **Deploy**
   - Click "Deploy" button
   - Wait 5-10 minutes for Flutter build
   - ✅ When status shows "Active", note the URL (e.g., `https://your-frontend.up.railway.app`)

**⏱️ Estimated Time:** 5-10 minutes (Flutter build takes time)

---

## ✅ STEP 4: Test Backend Endpoints

**Location:** `backend/production-test.js`

Run in your local terminal:
```bash
cd f:\Final project
node production-test.js https://[your-backend].up.railway.app
```

Replace `[your-backend]` with actual URL from Step 1.

### Expected Output:
```
✅ Test 1: Health Check
✅ Test 2: User Registration
✅ Test 3: User Login
✅ Test 4: Get Jobs
✅ Test 5: Get Profile (Protected Route)
✅ Test 6: Get Subscriptions
✅ Test 7: Job Application
✅ Test 8: Invalid Login (401)
✅ Test 9: 404 Handling
✅ Test 10: Response Format

Results saved to: test-results.json
All 10 tests passed! ✅
```

**⏱️ Estimated Time:** 2-3 minutes

---

## ✅ STEP 5: Test Frontend-Backend Integration

Run in local terminal:
```bash
cd f:\Final project
node run-tests.js https://[your-backend].up.railway.app https://[your-frontend].up.railway.app
```

### Expected Output:
```
Backend Tests: 10/10 ✅
Frontend Accessibility: Verified ✅
CORS Configuration: Working ✅
API Integration: Successful ✅

Manual Testing Checklist:
- [ ] Login flow working
- [ ] Job list displaying
- [ ] Applications processing
- [ ] Subscriptions showing
- [ ] UI responsive on mobile/tablet/desktop

Next Steps:
1. Navigate through the application
2. Test all workflows manually
3. Verify data persists in database
```

**⏱️ Estimated Time:** 5 minutes + manual testing

---

## 📄 STEP 6: Update Documentation

Update all docs with live URLs:

```bash
cd f:\Final project
node update-docs.js https://[your-frontend].up.railway.app https://[your-backend].up.railway.app
```

This automatically updates:
- README.md (with live links)
- docs/API.md (with production URL)
- PRODUCTION_DEPLOYMENT.md (with URLs)
- All references to placeholder URLs

**⏱️ Estimated Time:** < 1 minute

---

## 🎉 STEP 7: Go Live!

1. **Announce Launch**
   - Update social media
   - Notify users
   - Share GitHub link: https://github.com/muthamila4b3-ai/job-search-app

2. **Monitor**
   - Watch Railway dashboard for errors
   - Check logs regularly
   - Use monitoring procedures from MONITORING_SETUP.md

3. **Celebrate** 🎊
   - Your application is now live!
   - Users can access it at: `https://[your-frontend].up.railway.app`

---

## 🔗 Quick Reference: URLs You'll Need

After deployment, you'll have:

```
Backend URL:    https://[your-backend].up.railway.app
Frontend URL:   https://[your-frontend].up.railway.app
API Health:     https://[your-backend].up.railway.app/api/health
Database:       Railway MySQL (configured automatically)
```

---

## ❌ Troubleshooting

### Backend Won't Deploy
- Check Docker build logs
- Ensure backend/Dockerfile exists
- Verify package.json has correct dependencies
- Check Node version compatibility

### Frontend Build Fails
- Ensure Flutter is installed on Railway
- Check pubspec.yaml dependencies
- Verify build command: `flutter build web --release`
- Check web platform enabled: `flutter config --enable-web`

### Database Connection Fails
- Verify environment variables are set correctly
- Check MySQL is running and accessible
- Run: `mysql -h $MYSQLHOST -u $MYSQLUSER -p$MYSQLPASSWORD $MYSQLDATABASE -e "SELECT 1;"`

### Tests Fail
- Ensure backend is fully deployed and running
- Check API_BASE_URL is correct
- Verify database schema initialized successfully
- Run: `node production-test.js [backend-url]` again

---

## 📞 Support

For detailed information, see:
- [PHASE_4_FINAL_LAUNCH.md](PHASE_4_FINAL_LAUNCH.md) - Launch procedures
- [MONITORING_SETUP.md](MONITORING_SETUP.md) - Monitoring guide
- [PRODUCTION_DEPLOYMENT.md](PRODUCTION_DEPLOYMENT.md) - Detailed deployment
- [docs/API.md](docs/API.md) - API reference

---

## ✅ Deployment Checklist

- [ ] Backend service deployed to Railway
- [ ] Backend environment variables set
- [ ] Frontend service deployed to Railway  
- [ ] Frontend environment variables set
- [ ] Database initialized with schema
- [ ] Backend tests passing (10/10)
- [ ] Frontend-backend integration working
- [ ] Documentation updated with live URLs
- [ ] All monitoring alerts configured
- [ ] Application accessible and functional
- [ ] **GO LIVE!** 🎉

---

**Ready to deploy? Let's go!** 🚀
