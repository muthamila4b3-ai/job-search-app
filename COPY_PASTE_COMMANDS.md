# 🚀 Railway Deployment - Copy & Paste Commands

**Ready to deploy?** Use these exact commands in order. Replace placeholders with your actual URLs.

---

## 📋 BEFORE YOU START

You'll need these URLs after deploying. I'll show you where to find them.

**Placeholders to replace:**
- `[YOUR_BACKEND_URL]` - e.g., `https://job-search-backend.up.railway.app`
- `[YOUR_FRONTEND_URL]` - e.g., `https://job-search-frontend.up.railway.app`
- `[MYSQLHOST]` - e.g., `containers-us-west-12.railway.app`
- `[MYSQLUSER]` - e.g., `root`
- `[MYSQLPASSWORD]` - Your database password
- `[MYSQLDATABASE]` - e.g., `railway`

---

## 🎯 STEP 1: Get Your Project Ready

Before any deployment, make sure everything is committed to GitHub:

```powershell
cd f:\Final project
git status
git add .
git commit -m "Ready for Railway deployment"
git push origin main
```

**Expected Output:**
```
✅ All files committed
✅ Pushed to GitHub
```

---

## 🎯 STEP 2: Deploy Backend Service (Manual - Use Railway Dashboard)

### 2a. Go to Railway Dashboard
```
https://railway.app/dashboard
```

### 2b. Create Backend Service
1. Click your project: `cc1e471b-a236-4505-8105-1bdfde362319`
2. Click blue "+" button → "GitHub Repository"
3. Select: `muthamila4b3-ai/job-search-app`
4. Set Root Directory: `backend`
5. Environment: `Docker`
6. Dockerfile Path: `Dockerfile`
7. Click "Deploy"

### 2c. Set Backend Environment Variables

In Railway Dashboard → Backend Service → Variables tab:

```
DB_HOST=${{MYSQLHOST}}
DB_USER=${{MYSQLUSER}}
DB_PASSWORD=${{MYSQLPASSWORD}}
DB_NAME=${{MYSQLDATABASE}}
PORT=5000
JWT_SECRET=6efbb03ad35df54ddf9020f2b09279a4337b1bc29fb6098efbfcfe6b92f80b42
NODE_ENV=production
```

**⏱️ Wait 3-5 minutes for deployment**

**Find your backend URL:**
- In Railway Dashboard → Backend Service → Settings
- Copy the generated URL (e.g., `https://job-search-backend.up.railway.app`)
- **Save this!** You'll need it for steps 4 and 6

---

## 🎯 STEP 3: Deploy Frontend Service (Manual - Use Railway Dashboard)

### 3a. Create Frontend Service
1. In Railway Dashboard, click blue "+" button → "GitHub Repository"
2. Select: `muthamila4b3-ai/job-search-app`
3. Set Root Directory: `frontend`
4. Build Command: `flutter build web --release`
5. Click "Deploy"

### 3b. Set Frontend Environment Variables

In Railway Dashboard → Frontend Service → Variables tab:

```
API_BASE_URL=[YOUR_BACKEND_URL]
```

Replace `[YOUR_BACKEND_URL]` with your actual backend URL from Step 2.

**⏱️ Wait 5-10 minutes for Flutter build**

**Find your frontend URL:**
- In Railway Dashboard → Frontend Service → Settings
- Copy the generated URL (e.g., `https://job-search-frontend.up.railway.app`)
- **Save this!** You'll need it for step 6

---

## 🎯 STEP 4: Initialize Database (Local Terminal)

### Option A: Via Railway Terminal (Easiest)

In Railway Dashboard:
1. Go to Backend Service
2. Click "Terminal" tab
3. Paste this command:

```bash
mysql -h $MYSQLHOST -u $MYSQLUSER -p$MYSQLPASSWORD $MYSQLDATABASE < /app/database/schema.sql
```

### Option B: Via Local Terminal

First, get your MySQL credentials from Railway:
1. Railway Dashboard → MySQL Service → Variables tab
2. Copy MYSQLHOST, MYSQLUSER, MYSQLPASSWORD, MYSQLDATABASE

Then run (replace placeholders):

```powershell
cd f:\Final project
mysql -h [MYSQLHOST] -u [MYSQLUSER] -p[MYSQLPASSWORD] [MYSQLDATABASE] < database/schema.sql
```

**Example with real values:**
```powershell
mysql -h containers-us-west-12.railway.app -u root -pmypassword123 railway < database/schema.sql
```

### Verify Database Initialized

```powershell
mysql -h [MYSQLHOST] -u [MYSQLUSER] -p[MYSQLPASSWORD] [MYSQLDATABASE] -e "SHOW TABLES;"
```

**Expected Output:**
```
+---------------------------+
| Tables_in_railway         |
+---------------------------+
| applications              |
| jobs                      |
| subscription_plans        |
| users                     |
+---------------------------+
```

✅ **All 4 tables created!**

---

## 🎯 STEP 5: Test Backend Endpoints

In your local terminal:

```powershell
cd f:\Final project
node production-test.js https://[YOUR_BACKEND_URL]
```

**Example:**
```powershell
node production-test.js https://job-search-backend.up.railway.app
```

**Expected Output:**
```
✅ Test 1: Health Check - PASSED
✅ Test 2: User Registration - PASSED
✅ Test 3: User Login - PASSED
✅ Test 4: Get Jobs - PASSED
✅ Test 5: Get Profile (Protected) - PASSED
✅ Test 6: Get Subscriptions - PASSED
✅ Test 7: Job Application - PASSED
✅ Test 8: Invalid Login (401) - PASSED
✅ Test 9: 404 Error Handling - PASSED
✅ Test 10: Response Format - PASSED

🎉 ALL 10 TESTS PASSED!
```

---

## 🎯 STEP 6: Test Frontend-Backend Integration

In your local terminal:

```powershell
cd f:\Final project
node run-tests.js https://[YOUR_BACKEND_URL] https://[YOUR_FRONTEND_URL]
```

**Example:**
```powershell
node run-tests.js https://job-search-backend.up.railway.app https://job-search-frontend.up.railway.app
```

**Expected Output:**
```
🚀 PRODUCTION TEST SUITE
========================

Backend Tests: 10/10 ✅
Frontend Availability: ✅
CORS Configuration: ✅
Response Format: ✅

✅ All tests passed!
```

---

## 🎯 STEP 7: Update Documentation

Update all docs with your live URLs:

```powershell
cd f:\Final project
node update-docs.js https://[YOUR_FRONTEND_URL] https://[YOUR_BACKEND_URL]
```

**Example:**
```powershell
node update-docs.js https://job-search-frontend.up.railway.app https://job-search-backend.up.railway.app
```

**Expected Output:**
```
✅ Updated README.md
✅ Updated docs/API.md
✅ Updated PRODUCTION_DEPLOYMENT.md
✅ Updated deployment guides

🎉 Documentation updated with live URLs!
```

---

## 🎯 STEP 8: Commit and Push Updated Docs

```powershell
cd f:\Final project
git add .
git commit -m "Deploy to Railway: Update documentation with live URLs"
git push origin main
```

---

## 🎯 STEP 9: Manual Testing Checklist

Go to your frontend URL: `https://[YOUR_FRONTEND_URL]`

Test these flows:

```
[ ] Register new user
    - Go to app
    - Click "Register"
    - Enter email, password, confirm
    - Should be logged in

[ ] Login existing user
    - Go to app
    - Click "Login"
    - Use test user: test@example.com / Password123!
    - Should see job list

[ ] View job listings
    - See list of jobs
    - All 5 test jobs displaying
    - No errors in console

[ ] Apply for a job
    - Click "Apply" button on job
    - Should show success message
    - Application count increases

[ ] View subscriptions
    - Click "Subscriptions" tab
    - See Silver, Gold, Platinum plans
    - Prices displaying correctly

[ ] Check responsive design
    - View on desktop (100% width)
    - View on tablet (768px)
    - View on mobile (375px)
    - All layouts working
```

---

## 🎉 STEP 10: GO LIVE!

Once all tests pass and manual testing is complete:

```powershell
Write-Host "🎉 APPLICATION IS LIVE! 🎉" -ForegroundColor Green
Write-Host ""
Write-Host "Frontend URL: https://[YOUR_FRONTEND_URL]" -ForegroundColor Cyan
Write-Host "Backend API:  https://[YOUR_BACKEND_URL]" -ForegroundColor Cyan
Write-Host "Health Check: https://[YOUR_BACKEND_URL]/api/health" -ForegroundColor Cyan
```

---

## 📊 Quick Reference: Your Live URLs

After deployment, save these:

```
Frontend:   https://job-search-frontend.up.railway.app
Backend:    https://job-search-backend.up.railway.app
GitHub:     https://github.com/muthamila4b3-ai/job-search-app
```

---

## ⚡ Useful Commands Summary

**Check backend logs:**
```powershell
# In Railway Dashboard → Backend Service → Logs
```

**Check frontend logs:**
```powershell
# In Railway Dashboard → Frontend Service → Logs
```

**Test health endpoint:**
```powershell
curl https://[YOUR_BACKEND_URL]/api/health
```

**View database:**
```powershell
mysql -h [MYSQLHOST] -u [MYSQLUSER] -p[MYSQLPASSWORD] [MYSQLDATABASE] -e "SELECT * FROM users;"
```

---

## ❌ If Something Goes Wrong

### Backend won't start?
```powershell
# Check logs in Railway Dashboard
# Common issues:
# - Database connection failed: Check environment variables
# - Port already in use: Should be 5000
# - Missing dependencies: Check package.json
```

### Frontend won't build?
```powershell
# Check logs in Railway Dashboard
# Common issues:
# - Flutter not found: Railway should have it
# - Build timeout: Large Flutter builds can take 10+ minutes
# - API URL wrong: Check API_BASE_URL variable
```

### Tests fail?
```powershell
# Re-run with verbose output
node production-test.js [YOUR_BACKEND_URL] --verbose
```

---

## ✅ Complete Deployment Flow

```
1. ✅ Push code to GitHub
         ↓
2. ✅ Deploy Backend (Railway Dashboard)
         ↓
3. ✅ Deploy Frontend (Railway Dashboard)
         ↓
4. ✅ Initialize Database (MySQL schema)
         ↓
5. ✅ Run Backend Tests (10/10)
         ↓
6. ✅ Run Integration Tests (all pass)
         ↓
7. ✅ Update Documentation
         ↓
8. ✅ Push updated docs to GitHub
         ↓
9. ✅ Manual testing (all flows)
         ↓
10. 🎉 GO LIVE!
```

---

## 🎊 You're Ready!

**Copy-paste these commands in order and your app will be live in ~30 minutes!**

Next step: Follow the Railway Dashboard steps to deploy backend and frontend services. 🚀
