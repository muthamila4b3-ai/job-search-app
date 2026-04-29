# Production Environment Configuration

This file documents the required environment variables for production deployment.

## Backend Environment Variables

### Database Configuration
```
DB_HOST=your-database-host.mysql.database.azure.com
DB_USER=admin
DB_PASSWORD=YourSecurePassword123!
DB_NAME=job_search
```

### Application Configuration
```
NODE_ENV=production
PORT=5000
```

### Security
```
JWT_SECRET=your-generated-secret-key-32-characters-minimum
CORS_ORIGIN=https://your-frontend-domain.com
```

### Generate Secure JWT_SECRET
```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

## Database Connection Examples

### AWS RDS MySQL
```
DB_HOST: your-instance.xxxxxx.us-east-1.rds.amazonaws.com
DB_USER: admin
DB_PASSWORD: YourPassword
DB_NAME: job_search
```

### Azure Database for MySQL
```
DB_HOST: your-server.mysql.database.azure.com
DB_USER: admin@your-server
DB_PASSWORD: YourPassword
DB_NAME: job_search
```

### DigitalOcean Managed Database
```
DB_HOST: your-db-endpoint.ondigitalocean.com
DB_USER: doadmin
DB_PASSWORD: YourPassword
DB_NAME: job_search
```

### Render MySQL
```
DB_HOST: oregon-mysql.render.com
DB_USER: render_user
DB_PASSWORD: YourPassword
DB_NAME: job_search
```

## Frontend Configuration

### Flutter Build Environment
```
API_BASE_URL=https://your-api-domain.com/api
```

### Firebase Configuration (for web deployment)
```
FIREBASE_PROJECT_ID=your-project-id
FIREBASE_API_KEY=your-api-key
FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
FIREBASE_DATABASE_URL=https://your-project.firebaseio.com
FIREBASE_STORAGE_BUCKET=your-project.appspot.com
```

## Render Deployment Secrets

Create these as **Secret** variables in Render dashboard:

1. `DB_HOST` - Database hostname
2. `DB_USER` - Database username
3. `DB_PASSWORD` - Database password (keep secret!)
4. `DB_NAME` - Database name
5. `JWT_SECRET` - Generated JWT secret
6. `CORS_ORIGIN` - Frontend domain

## Security Best Practices

✅ DO:
- Use environment variables for sensitive data
- Regenerate JWT_SECRET for production
- Set CORS_ORIGIN to specific domain (not *)
- Use HTTPS for all connections
- Enable database backups
- Use strong passwords (12+ characters)

❌ DON'T:
- Commit .env files to Git
- Hardcode secrets in code
- Use default passwords
- Use wildcard CORS origin in production
- Share environment variables publicly

## Testing Configuration

```
NODE_ENV=test
DB_HOST=localhost
DB_USER=test_user
DB_PASSWORD=test_password
DB_NAME=job_search_test
```

## Local Development

Create `backend/.env`:
```
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=@leo
DB_NAME=job_search
JWT_SECRET=dev-secret-key-do-not-use-production
NODE_ENV=development
CORS_ORIGIN=*
```
