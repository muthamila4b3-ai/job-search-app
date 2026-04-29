# 🚀 Production Deployment Guide

**Last Updated**: April 22, 2026  
**Status**: Ready for deployment  

---

## 📋 Table of Contents
1. [Quick Start](#quick-start)
2. [Backend Deployment](#backend-deployment)
3. [Frontend Deployment](#frontend-deployment)
4. [Database Setup](#database-setup)
5. [Security Configuration](#security-configuration)
6. [Monitoring & Maintenance](#monitoring--maintenance)
7. [Troubleshooting](#troubleshooting)

---

## Quick Start

**Minimum deployment time**: 15-30 minutes

### Prerequisites
- GitHub account (to push code)
- Render account (for backend hosting)
- Firebase/Vercel/Netlify account (for frontend)
- Production MySQL database (or Render managed DB)

---

## Backend Deployment

### Option 1: Deploy to Render (Recommended)

#### Step 1: Push to GitHub
```bash
cd "f:\Final project"
git init
git add .
git commit -m "Job Search App - Production Release"
git remote add origin https://github.com/YOUR_USERNAME/job-search-app.git
git push -u origin main
```

#### Step 2: Create Render Service
1. Go to [Render Dashboard](https://dashboard.render.com)
2. Click **New +** → **Web Service**
3. Connect your GitHub repository
4. Configure:
   - **Name**: `job-search-api`
   - **Environment**: `Docker`
   - **Dockerfile Path**: `backend/Dockerfile`
   - **Branch**: `main`
   - **Auto-deploy**: Enable

#### Step 3: Add Environment Variables
In Render dashboard, add these as **Environment** or **Secret** variables:

```env
NODE_ENV=production
PORT=5000
DB_HOST=your_db_host.mysql.database.azure.com
DB_USER=your_db_user
DB_PASSWORD=your_secure_password
DB_NAME=job_search
JWT_SECRET=generate_with: node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
CORS_ORIGIN=https://your-frontend-domain.com
```

**Generate a secure JWT_SECRET:**
```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

#### Step 4: Initialize Database
After deployment, run migrations:
```bash
# Via Render dashboard terminal or API call
curl https://your-api.render.com/api/health
```

#### Step 5: Verify Deployment
```bash
# Test health check
curl https://your-api.render.com/api/health

# Should return:
{
  "success": true,
  "data": {
    "status": "healthy",
    "timestamp": "2026-04-22T10:00:00Z"
  }
}
```

---

### Option 2: Deploy to AWS/Azure/GCP

#### Docker Build & Push
```bash
# Build Docker image
docker build -t job-search-api:latest backend/

# Push to Docker Hub
docker login
docker tag job-search-api:latest YOUR_DOCKERHUB/job-search-api:latest
docker push YOUR_DOCKERHUB/job-search-api:latest

# Deploy to your cloud provider
```

---

## Frontend Deployment

### Prerequisites
- Flutter SDK installed
- Build files generated

### Build for Web
```bash
cd frontend

# Install dependencies
flutter pub get

# Build web version
flutter build web --release

# Output: frontend/build/web/
```

### Deploy to Vercel (Easiest)
```bash
# Install Vercel CLI
npm install -g vercel

# Deploy
cd frontend/build/web
vercel
```

### Deploy to Firebase
```bash
# Install Firebase CLI
npm install -g firebase-tools

# Initialize Firebase
firebase init hosting

# Deploy
firebase deploy
```

### Build for Mobile

#### Android APK
```bash
flutter build apk --release

# Output: build/app/outputs/flutter-apk/app-release.apk
# Upload to Google Play Store
```

#### iOS IPA
```bash
flutter build ios --release

# Output: build/ios/iphoneos/Runner.app
# Upload to Apple App Store (requires Mac)
```

---

## Database Setup

### Using Render Managed Database (Recommended)

1. In Render dashboard, click **New +** → **PostgreSQL Database**
2. Create database with:
   - **Name**: `job-search-db`
   - **Postgres Version**: 14+

### Using External MySQL

1. Create MySQL database at:
   - AWS RDS
   - Azure Database for MySQL
   - DigitalOcean Managed Database
   - Planet Scale (MySQL compatible)

2. Connection string format:
   ```
   mysql://user:password@host:3306/job_search
   ```

### Initialize Database

```bash
# Option 1: Via environment variable (automatic on first deploy)
DB_INIT_ON_START=true

# Option 2: Run migrations manually
# SSH into your deployment and run:
npm run init-db
```

---

## Security Configuration

### ✅ Checklist

- [ ] Change `CORS_ORIGIN` from `*` to your frontend domain
- [ ] Generate strong `JWT_SECRET` (32+ characters)
- [ ] Set `NODE_ENV=production`
- [ ] Enable HTTPS/SSL (automatic on Render/Firebase)
- [ ] Configure database backups
- [ ] Enable rate limiting (see below)
- [ ] Set up security headers
- [ ] Enable CORS properly

### Rate Limiting (Optional Enhancement)

Add to `backend/src/server.js`:

```javascript
const rateLimit = require('express-rate-limit');

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  message: 'Too many requests from this IP, please try again later.'
});

app.use('/api/', limiter);
```

### CORS Configuration (Production)

Update `backend/src/server.js`:

```javascript
app.use(cors({
  origin: process.env.CORS_ORIGIN, // Set to your frontend domain
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
```

---

## Monitoring & Maintenance

### Health Checks
- Render automatically monitors `/api/health`
- Response time target: < 200ms
- Uptime target: > 99.9%

### Logs
- View logs in Render dashboard under **Logs**
- Check for errors in development environment
- Monitor database performance

### Backups
- Enable automated MySQL backups (daily)
- Store backup location: AWS S3 or Azure Blob Storage

---

## Troubleshooting

### Backend not deploying
```
❌ Error: Docker build failed
✅ Fix: Check Dockerfile path and syntax
```

### Database connection error
```
❌ Error: ECONNREFUSED
✅ Fix: Verify DB_HOST, DB_USER, DB_PASSWORD in environment
```

### API returns 500 error
```
❌ Error: Internal Server Error
✅ Fix: Check backend logs, ensure database is initialized
```

### Flutter app can't connect
```
❌ Error: Failed to connect to API
✅ Fix: Update CORS_ORIGIN, verify API_BASE_URL in app
```

---

## 📞 Support

- **Backend Issues**: Check `backend` folder README
- **Database Issues**: Check `database` folder README  
- **Frontend Issues**: Check `frontend` pubspec.yaml
- **API Documentation**: See `docs/API.md`

---

## 🎉 Success Indicators

✅ All items below should be complete:

- [ ] Backend deployed and health check returning 200
- [ ] Database initialized with tables and seed data
- [ ] Frontend build completed without errors
- [ ] API successfully returning standardized responses
- [ ] CORS configured for frontend domain
- [ ] Tests passing (13/13)
- [ ] Documentation complete and accurate
- [ ] Environment variables secured

---

**Ready to deploy? Start with Backend Deployment → Option 1: Render!**
