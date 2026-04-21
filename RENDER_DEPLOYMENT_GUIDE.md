# 🚀 Render Deployment Guide - For Beginners

## Overview
This guide will help you deploy your Job Search App backend on Render (a free hosting platform).

---

## ✅ What You Need
- GitHub account (free at github.com)
- Render account (free at render.com)
- This project code
- 15-20 minutes

---

# STEP 1: Create a GitHub Repository (5 minutes)

### 1.1 Create a new repo on GitHub
1. Go to **github.com** → Sign in or Create account
2. Click **"+"** icon (top right) → **"New repository"**
3. Fill in:
   - **Repository name**: `job-search-app` (or any name you like)
   - **Description**: `Job Search Application Backend`
   - **Visibility**: Choose **"Public"** (free plan requires public)
   - Leave other settings default
4. Click **"Create repository"**

### 1.2 Get the URL
- Copy the URL shown (looks like: `https://github.com/YOUR-USERNAME/job-search-app.git`)
- You'll need this in a moment

---

# STEP 2: Push Your Code to GitHub (5 minutes)

### 2.1 Open PowerShell in Your Project Folder
1. Go to your project folder: `f:\Final project`
2. Right-click → **"Open PowerShell here"**

### 2.2 Run These Commands (One by One)

**Command 1:** Configure Git
```powershell
git config --global user.name "Your Name"
git config --global user.email "your-email@example.com"
```

**Command 2:** Initialize Git in your project
```powershell
git init
```

**Command 3:** Add all files
```powershell
git add .
```

**Command 4:** Create a snapshot (commit)
```powershell
git commit -m "Initial commit - Job Search App"
```

**Command 5:** Add GitHub as the remote location
```powershell
git remote add origin https://github.com/YOUR-USERNAME/job-search-app.git
```
(Replace `YOUR-USERNAME` with your actual GitHub username)

**Command 6:** Push code to GitHub
```powershell
git branch -M main
git push -u origin main
```

### 2.3 Verify on GitHub
- Go to your GitHub repo URL
- You should see all your project files there ✅

---

# STEP 3: Create a Render Service (5 minutes)

### 3.1 Sign Up to Render
1. Go to **render.com**
2. Sign up with GitHub (easiest option)
3. Authorize Render to access your GitHub

### 3.2 Create New Web Service
1. Click **"Dashboard"** (top left)
2. Click **"New +"** button → **"Web Service"**
3. Choose **"Build and deploy from a Git repository"**
4. Click **"Connect repository"**

### 3.3 Select Your GitHub Repo
1. Search for your repo name (`job-search-app`)
2. Click **"Connect"**
3. Fill in:
   - **Name**: `job-search-api` (or any name)
   - **Region**: Choose closest to you (e.g., `Ohio` for USA)
   - **Branch**: `main`
   - **Root Directory**: `backend` (⚠️ **IMPORTANT** - leave blank if NOT needed based on structure)
   - **Runtime**: Leave as default
   - **Build Command**: Leave empty
   - **Start Command**: Leave empty

### 3.4 Select Docker Deployment
1. Scroll down and look for **"Docker"** option
2. Under "Runtime", select **"Docker"**
3. Render will automatically find the `backend/Dockerfile`

---

# STEP 4: Configure Environment Variables (5 minutes)

### 4.1 Go to Environment Tab
1. In Render dashboard, find your service
2. Click on **"Service"** name
3. Click **"Environment"** tab (left sidebar)

### 4.2 Add Environment Variables

Click **"Add Environment Variable"** and add each of these:

| Variable Name | Value | Notes |
|---|---|---|
| `NODE_ENV` | `production` | Tells app to use production mode |
| `PORT` | `5000` | Port your app runs on |
| `JWT_SECRET` | `your-secret-key-123-xyz` | Use a strong random string |
| `CORS_ORIGIN` | Depends on frontend URL | For now: `*` (allow all) |
| `DB_HOST` | See notes below | See note 1 |
| `DB_USER` | See notes below | See note 2 |
| `DB_PASSWORD` | See notes below | See note 2 |
| `DB_NAME` | `job_search` | Database name |

### 4.3 Database Setup - Choose One Option:

**Option A: Use External Database (Recommended)**
- Use a MySQL database service (e.g., JawsDB on Render)
1. Go to Render Dashboard
2. Create a new MySQL database service
3. Copy the connection details → Paste into your environment variables

**Option B: Temporary Testing Without Database**
- For now, set dummy values:
  - `DB_HOST`: `localhost`
  - `DB_USER`: `root`
  - `DB_PASSWORD`: `password`
  - `DB_NAME`: `job_search`

---

# STEP 5: Deploy (Automatic) ⚡

### When You're Ready:
1. Click **"Deploy"** button (top right)
2. Render will automatically:
   - Pull your code from GitHub
   - Build the Docker image
   - Deploy and start your app

### Monitor Deployment
1. Click **"Logs"** tab to watch the deployment
2. Look for: `Server running on port 5000` (Success ✅)
3. Deployment takes 2-5 minutes

### Get Your Live URL
1. At the top of the page, copy your URL (looks like: `https://job-search-api.onrender.com`)
2. This is your **Live API URL** ✅

---

# STEP 6: Test Your Live API (2 minutes)

### 6.1 Open PowerShell and Test

Run these commands:

**Test 1: Health Check**
```powershell
curl https://YOUR-LIVE-URL/api/health
```

Expected response:
```json
{"status": "OK"}
```

**Test 2: Register a User**
```powershell
curl -X POST https://YOUR-LIVE-URL/api/auth/register `
  -H "Content-Type: application/json" `
  -d '{"email":"test@example.com","password":"Test123!"}'
```

**Test 3: Login**
```powershell
curl -X POST https://YOUR-LIVE-URL/api/auth/login `
  -H "Content-Type: application/json" `
  -d '{"email":"test@example.com","password":"Test123!"}'
```

### 6.2 Using Postman (Alternative - Easier UI)

1. Download **Postman** (free at postman.com)
2. File → New → Request
3. Set method to **POST**
4. URL: `https://YOUR-LIVE-URL/api/auth/login`
5. Go to **Body** → Select **"raw"** → **"JSON"**
6. Paste:
```json
{
  "email": "test@example.com",
  "password": "Test123!"
}
```
7. Click **"Send"**
8. You should see a response with a JWT token ✅

---

# 🎉 Success Checklist

- [ ] GitHub repo created and code pushed
- [ ] Render account created
- [ ] Web service created
- [ ] Environment variables set
- [ ] Deployment started (check logs)
- [ ] Health check endpoint working
- [ ] API endpoints responding

---

# ⚠️ Troubleshooting

### "Deployment Failed"
- **Check logs**: Click "Logs" tab to see error messages
- **Common issue**: Missing environment variables
- **Solution**: Add all required variables and redeploy

### "Connection to database failed"
- **Check**: Make sure DB_HOST, DB_USER, DB_PASSWORD are correct
- **Temporary fix**: Comment out database calls for testing

### "Port already in use"
- **Render handles this**: Should be automatic with `PORT` variable

### "404 Not Found"
- Check your endpoint URL is correct
- Use `/api/health` first to verify API is running

---

# 🔄 Future Updates

When you update your code:

1. Make changes locally
2. Commit and push to GitHub:
   ```powershell
   git add .
   git commit -m "Your message"
   git push origin main
   ```
3. **Render automatically deploys** 🚀

---

# 📞 Need More Help?

- **Render Docs**: https://render.com/docs
- **GitHub Docs**: https://docs.github.com
- **Test APIs guide**: See `docs/TESTING.md` in your project

