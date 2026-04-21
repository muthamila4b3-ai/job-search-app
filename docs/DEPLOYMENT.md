# Deployment Guide

## Prerequisites
- Node.js v14+ 
- MySQL 5.7+
- npm or yarn

## Backend Deployment

### 1. Environment Setup
Copy `.env.example` to `.env` and configure:
```bash
cp backend/.env.example backend/.env
```

Edit `backend/.env`:
```env
DB_HOST=your_db_host
DB_USER=your_db_user
DB_PASSWORD=your_db_password
DB_NAME=job_search
JWT_SECRET=generate_a_strong_secret_key
NODE_ENV=production
``` 

### 2. Render Deployment (Recommended)
This repository includes a Render configuration file at `.render.yaml`.

1. Create a new service on Render.
2. Connect your GitHub repository.
3. Use Docker deploy and select the `backend/Dockerfile`.
4. Add the required environment variables or secrets:
   - `DB_HOST`
   - `DB_USER`
   - `DB_PASSWORD`
   - `DB_NAME`
   - `JWT_SECRET`
   - `CORS_ORIGIN`
5. Set `PORT=5000` and `NODE_ENV=production`.
6. Enable auto deploy from `main` branch.

If you prefer, you can also deploy with an external MySQL database and set its host/credentials in Render.

### 3. Install Dependencies
```bash
cd backend
npm install
```

### 4. Database Initialization
```bash
npm run init-db
```

### 5. Start Server Locally
```bash
npm start
```

The server will run on `http://localhost:5000`

---

## Frontend Deployment

### 1. Build APK/Release
```bash
cd frontend
flutter pub get
flutter build apk --release  # For Android

# Or for iOS
flutter build ios --release
```

### 2. Configuration
Update API endpoint in `frontend/lib/services/api_service.dart`:
```dart
static const String baseUrl = 'https://your-api-domain.com';
```

---

## Production Checklist

- [ ] Change `CORS_ORIGIN` from `*` to your frontend domain
- [ ] Set a strong `JWT_SECRET`
- [ ] Set `NODE_ENV` to `production`
- [ ] Configure database backups
- [ ] Enable HTTPS/SSL certificates
- [ ] Set up monitoring and logging
- [ ] Configure rate limiting
- [ ] Set up automated tests
- [ ] Review security headers
- [ ] Enable database query logging

---

## Docker Deployment (Optional)

Create `backend/Dockerfile`:
```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
EXPOSE 5000
CMD ["npm", "start"]
```

Build and run:
```bash
docker build -t job-search-api .
docker run -p 5000:5000 --env-file .env job-search-api
```

---

## Environment Specific Configs

### Development
```
NODE_ENV=development
CORS_ORIGIN=http://localhost:3000
```

### Staging
```
NODE_ENV=production
CORS_ORIGIN=https://staging.example.com
```

### Production
```
NODE_ENV=production
CORS_ORIGIN=https://app.example.com
```

---

## Database Migrations

For future schema changes, create migration files in `database/migrations/` and execute them:
```bash
node database/migrations/your_migration.js
```

---

## Monitoring & Logging

- Monitor logs in `NODE_ENV=development` for detailed error messages
- Set up external logging service (e.g., Sentry, LogRocket)
- Monitor database performance
- Track API response times
- Set up alerts for errors and downtime

---

## Troubleshooting

### Database Connection Issues
- Verify MySQL is running
- Check DB credentials in `.env`
- Ensure database exists: `job_search`

### CORS Issues
- Verify `CORS_ORIGIN` matches frontend domain
- Check `Access-Control-Allow-*` headers

### JWT Token Issues
- Verify `JWT_SECRET` is consistent
- Check token expiration (8 hours)
- Ensure `Authorization` header format is correct

---

## Production Flutter Builds

Use `dart-define` to set the backend API domain for your release builds.

```bash
cd frontend
flutter pub get
flutter build apk --release \
  --dart-define=API_BASE_URL=https://your-api-domain.com/api
```

If you use iOS:

```bash
cd frontend
flutter pub get
flutter build ios --release \
  --dart-define=API_BASE_URL=https://your-api-domain.com/api
```

In production, the frontend code reads `API_BASE_URL` from Dart environment variables.

---

## CI/CD with GitHub Actions

This repository includes GitHub Actions workflows:
- `.github/workflows/backend-ci.yml` — runs backend tests and Docker validation
- `.github/workflows/backend-deploy.yml` — builds and pushes the backend Docker image
- `.github/workflows/flutter-ci.yml` — runs Flutter tests and builds a release APK

### GitHub Secrets
Add these secrets to your repo settings for deployment:
- `DOCKERHUB_USERNAME` (optional)
- `DOCKERHUB_TOKEN` (optional)
- `GITHUB_TOKEN` (provided automatically by GitHub Actions)

### Deploying the Backend Image
The backend deploy workflow publishes a Docker image to GitHub Container Registry.
Once the image exists, connect your cloud provider to the registry and deploy it.

### Recommended Cloud Providers
- Render.com (Docker deploy)
- AWS Elastic Container Service / App Runner
- Azure App Service for Containers
- DigitalOcean App Platform
- Google Cloud Run

For each provider, set the backend service to use the pushed Docker image and configure environment variables from `backend/.env`.

---

## Cloud Provider Notes

### Render (recommended)
1. Create a new Web Service
2. Choose Docker deploy
3. Connect your GitHub repo
4. Set `PORT=5000`, `NODE_ENV=production`, `JWT_SECRET`, `DB_*` values
5. Set `CORS_ORIGIN` to your frontend domain

### Azure Web App for Containers
1. Create App Service with Docker support
2. Set container image location to the GitHub Container Registry image
3. Add app settings for `DB_HOST`, `DB_USER`, `DB_PASSWORD`, `DB_NAME`, `JWT_SECRET`, `NODE_ENV`, `CORS_ORIGIN`

### AWS App Runner / ECS / ECR
1. Push the backend image to ECR
2. Deploy App Runner or ECS service using that image
3. Set environment variables as above

---

## Ready for Production
Your backend is now deployable via Docker and GitHub Actions, and your Flutter app is prepared for release with build-time API configuration. Ensure all production secrets are stored securely in your cloud provider or GitHub Secrets. 
