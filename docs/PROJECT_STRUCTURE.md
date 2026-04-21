# Project Structure

## Overview
Job Searching Application with organized separation of concerns:

```
f:\Final project/
├── backend/          # Node.js backend server
│   ├── src/         # Source files
│   │   ├── server.js       # Express API server
│   │   └── db.js           # MySQL connection pool
│   ├── package.json  # Dependencies and scripts
│   └── README.md    # Backend setup instructions
│
├── database/         # Database configuration
│   ├── schema.sql   # Database schema SQL file
│   └── migrations/
│       └── init_db.js      # Database initialization script
│
├── frontend/        # Flutter mobile app
│   ├── lib/
│   │   ├── main.dart       # App entry point
│   │   ├── screens/        # UI screens
│   │   │   ├── login_screen.dart
│   │   │   ├── job_list_screen.dart
│   │   │   └── subscription_screen.dart
│   │   └── services/       # API communication
│   │       └── api_service.dart
│   └── pubspec.yaml        # Flutter dependencies
│
├── docs/             # Documentation (this file)
├── .gitignore       # Git ignore rules
└── README.md        # Project root README
```

## File Organization

### Backend (`backend/`)
- **src/server.js** - Express server with all API routes
- **src/db.js** - MySQL connection pool configuration
- **package.json** - NPM scripts and dependencies

### Database (`database/`)
- **schema.sql** - Complete database schema definition
- **migrations/init_db.js** - Script to create database and seed initial data

### Frontend (`frontend/`)
- **lib/main.dart** - Main Flutter app entry point
- **lib/screens/** - Individual screen components
- **lib/services/api_service.dart** - HTTP client for backend API

## Running the Project

### Backend
```bash
cd backend
npm install
npm run init-db
npm start
```

### Frontend
```bash
cd frontend
flutter pub get
flutter run
```

See individual README files in backend/ for more details.
