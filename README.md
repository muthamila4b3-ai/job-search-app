# Job Searching Application

A full-stack job search platform with user authentication, job listings, applications, and subscription management.

## 📚 Table of Contents

- [Project Structure](#project-structure)
- [Tech Stack](#tech-stack)
- [Quick Start](#quick-start)
- [Configuration](#configuration)
- [Documentation](#documentation)
- [Features](#features)
- [Testing](#testing)
- [Recent Improvements](#recent-improvements)

## 📁 Project Structure

See [docs/PROJECT_STRUCTURE.md](docs/PROJECT_STRUCTURE.md) for detailed folder organization.

```
backend/           # Express.js API server
database/          # Database schema and migrations
frontend/          # Flutter mobile app
docs/              # Comprehensive documentation
```

## 🛠 Tech Stack

**Backend**:
- Node.js + Express.js
- MySQL database
- JWT authentication
- bcryptjs password hashing

**Frontend**:
- Flutter mobile framework
- REST API client

## 🚀 Quick Start

### Backend Setup
```bash
# Install dependencies
cd backend
npm install

# Create and configure environment
cp .env.example .env
# Edit .env with your database credentials

# Initialize database
npm run init-db

# Start server
npm start
```

Server runs at `http://localhost:5000`

### Deploy to Render
This repo includes a Render deployment configuration at `.render.yaml`.
On Render, create a new web service, connect your GitHub repo, and deploy using the Dockerfile at `backend/Dockerfile`.
Set backend secrets for `DB_HOST`, `DB_USER`, `DB_PASSWORD`, `DB_NAME`, `JWT_SECRET`, and `CORS_ORIGIN`.

### CI/CD
This repository includes GitHub Actions workflows for the backend and frontend.
- Backend test and Docker validation: `.github/workflows/backend-ci.yml`
- Backend Docker deploy: `.github/workflows/backend-deploy.yml`
- Flutter build and tests: `.github/workflows/flutter-ci.yml`

### Frontend Setup
```bash
cd frontend
flutter pub get
flutter run  # Run on connected device/emulator
```

## ⚙️ Configuration

### Backend Environment Variables
```env
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=
DB_NAME=job_search
PORT=5000
JWT_SECRET=your-secret-key-here
NODE_ENV=development
CORS_ORIGIN=*
```

See [backend/.env.example](backend/.env.example) for all options.

## 📖 Documentation

- **[API Documentation](docs/API.md)** - Complete API endpoint reference
- **[Deployment Guide](docs/DEPLOYMENT.md)** - Production deployment instructions
- **[Testing Guide](docs/TESTING.md)** - Testing strategies and commands
- **[Code Review](docs/CODE_REVIEW.md)** - Architecture and code improvements
- **[Project Structure](docs/PROJECT_STRUCTURE.md)** - Folder organization details

## ⭐ Features

### Authentication
- ✅ User registration with email validation
- ✅ Secure login with JWT tokens
- ✅ Password hashing with bcryptjs
- ✅ Token expiration (8 hours)

### Job Management
- ✅ Browse available jobs
- ✅ Apply for jobs (one application per job)
- ✅ View job details (title, company, location, salary)
- ✅ Remote job filtering

### Subscriptions
- ✅ Multiple subscription plans (Silver, Gold, Platinum)
- ✅ Plan details with benefits
- ✅ Upgrade/downgrade subscriptions
- ✅ Subscription status in profile

### API Quality
- ✅ Comprehensive input validation
- ✅ Detailed error handling
- ✅ Request logging with timestamps
- ✅ Health check endpoint
- ✅ CORS support
- ✅ Standard HTTP status codes

## 🧪 Testing

### Run API Tests
```bash
cd backend
npm start  # Terminal 1

# Terminal 2
node test.js
```

### Manual Testing
See [docs/TESTING.md](docs/TESTING.md) for cURL and Postman examples.

## 🎯 Recent Improvements

### Code Quality
✅ **Input Validation**
- Email format validation
- Password strength requirements
- Numeric ID validation
- Request size limits

✅ **Error Handling**
- Descriptive error messages
- Proper HTTP status codes
- Specific error types (409 for duplicates, 401 for auth)
- Detailed logging in development

✅ **Security**
- CORS configuration
- JSON request size limits (10KB)
- Proper authentication flow
- Sensitive error logging only in dev

✅ **API Improvements**
- Consistent response format
- Health check endpoint
- Complete registration endpoint
- Request/response logging

### Documentation
✅ Created comprehensive docs:
- Complete API reference
- Deployment guide
- Testing strategies
- Code architecture review

## 👥 Default Test Credentials

Email: `jane.doe@example.com`  
Password: `password123`

## 🔒 Security Notes

- Change `JWT_SECRET` in production
- Set `CORS_ORIGIN` to your frontend domain
- Use HTTPS in production
- Keep `.env` file private (never commit)
- Implement rate limiting for production

## 📝 License

MIT License - see LICENSE file for details

## 🤝 Contributing

1. Create a feature branch
2. Make your changes
3. Run tests to ensure nothing broke
4. Submit a pull request

---

For detailed information on any topic, see the [docs](docs/) folder.

- **Authentication** - Login with JWT tokens
- **Job Listings** - Browse available jobs
- **Job Applications** - Apply to jobs you're interested in
- **Subscription Plans** - Silver, Gold, and Platinum tiers
- **Responsive UI** - Flutter mobile app with intuitive navigation

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/login` | User login |
| GET | `/api/profile` | Get current user profile |
| GET | `/api/jobs` | List all jobs |
| POST | `/api/jobs/:jobId/apply` | Apply to a job |
| GET | `/api/subscriptions` | List subscription plans |
| POST | `/api/subscriptions/subscribe` | Subscribe to a plan |

## Notes

- Flutter app connects to `http://10.0.2.2:5000/api` (Android emulator)
- For physical devices, update the URL in `frontend/lib/services/api_service.dart`

