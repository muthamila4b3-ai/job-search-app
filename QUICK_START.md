# 🚀 Quick Start Guide

Get the Job Searching Application running in **5 minutes** locally, or deploy to production in **15 minutes**.

---

## Local Development (5 minutes)

### Prerequisites
- Node.js v14+
- MySQL 5.7+
- GitHub (optional)

### Setup

```bash
# 1. Navigate to project
cd "f:\Final project"

# 2. Install backend dependencies
cd backend
npm install

# 3. Configure environment
cp .env.example .env
# Edit .env with your MySQL credentials

# 4. Initialize database
npm run init-db

# 5. Start backend server
npm start
# Server runs at http://localhost:5000
```

**In another terminal:**

```bash
# 6. Install Flutter (one time only)
# Download from: https://flutter.dev/docs/get-started/install/windows

# 7. Setup frontend
cd frontend
flutter pub get

# 8. Run Flutter app
flutter run
```

**Success!** 🎉 App is running locally.

---

## Production Deployment (15 minutes)

### Quick Deploy to Render

```bash
# 1. Push to GitHub
cd "f:\Final project"
git init
git add .
git commit -m "Job Search App - Production"
git remote add origin https://github.com/YOUR_USERNAME/job-search-app.git
git push -u origin main

# 2. Create Render account
# Go to: https://render.com

# 3. Connect GitHub repository
# Select your repo in Render dashboard

# 4. Create Web Service
# - Name: job-search-api
# - Environment: Docker
# - Dockerfile: backend/Dockerfile
# - Branch: main

# 5. Add environment variables in Render dashboard:
NODE_ENV=production
PORT=5000
DB_HOST=your_db_host
DB_USER=your_db_user
DB_PASSWORD=your_db_password
DB_NAME=job_search
JWT_SECRET=generate_with: node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
CORS_ORIGIN=https://your-frontend-domain.com

# 6. Deploy
# Click "Deploy" in Render dashboard

# 7. Verify
# Visit: https://your-service.render.com/api/health
```

**Deployment complete!** 🎉 Backend is live.

---

## Deploy Frontend

### To Firebase (Recommended)

```bash
# 1. Build Flutter web
cd frontend
flutter build web --release

# 2. Install Firebase CLI
npm install -g firebase-tools

# 3. Deploy
firebase deploy

# URL: https://your-project.web.app
```

### To Vercel

```bash
# 1. Build Flutter web
cd frontend
flutter build web --release

# 2. Deploy
npm install -g vercel
cd build/web
vercel
```

---

## Testing

### Run API Tests

```bash
cd backend

# Start server in one terminal
npm start

# Run tests in another terminal
node test.js

# Expected: 13/13 tests passing ✅
```

---

## Verify Everything Works

### Backend Health Check
```bash
curl http://localhost:5000/api/health
```

### Login Test
```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"jane.doe@example.com","password":"password123"}'
```

### Get Jobs
```bash
curl http://localhost:5000/api/jobs
```

---

## Troubleshooting

| Issue | Solution |
|-------|----------|
| `ECONNREFUSED` | MySQL not running or wrong credentials |
| `PORT 5000 in use` | Kill process: `lsof -i :5000` or `fuser -k 5000/tcp` |
| `Flutter not found` | Install Flutter SDK and add to PATH |
| `npm ERR! 404` | Run `npm install` to install dependencies |

---

## Key Files

- **Backend API**: `backend/src/server.js`
- **Flutter App**: `frontend/lib/main.dart`
- **API Docs**: `docs/API.md`
- **Database**: `database/schema.sql`
- **Tests**: `backend/test.js`

---

## Documentation

- [Full API Documentation](docs/API.md)
- [Deployment Guide](PRODUCTION_DEPLOYMENT.md)
- [Environment Config](ENVIRONMENT_CONFIG.md)
- [Deployment Checklist](DEPLOYMENT_CHECKLIST.md)

---

## Next Steps

1. **Local Development** → [Development Guide](README.md)
2. **Production Deployment** → [Deployment Guide](PRODUCTION_DEPLOYMENT.md)
3. **API Reference** → [API Documentation](docs/API.md)
4. **Monitoring** → [Render Dashboard](https://dashboard.render.com)

---

**Need help?** Check the troubleshooting section or review full documentation files.

