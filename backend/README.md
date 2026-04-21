# Backend - Job Searching Application

## Setup
1. Install dependencies:
   ```bash
   npm install
   ```
2. Configure database connection by exporting environment variables or editing `db.js`:
   - `DB_HOST`
   - `DB_USER`
   - `DB_PASSWORD`
   - `DB_NAME`
3. Initialize the database:
   ```bash
   npm run init-db
   ```
4. Start the server:
   ```bash
   npm start
   ```

## API Endpoints
- `POST /api/auth/login`
- `GET /api/profile`
- `GET /api/jobs`
- `POST /api/jobs/:jobId/apply`
- `GET /api/subscriptions`
- `POST /api/subscriptions/subscribe`

## Default credentials
- Email: `jane.doe@example.com`
- Password: `password123`
