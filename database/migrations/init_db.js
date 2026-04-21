const path = require('path');
const fs = require('fs');

// Load .env manually
const envPath = path.join(__dirname, '../../backend/.env');
if (fs.existsSync(envPath)) {
  const content = fs.readFileSync(envPath, 'utf-8');
  content.split('\n').forEach(line => {
    const [key, value] = line.split('=');
    if (key && value) process.env[key.trim()] = value.trim();
  });
}

const mysql = require('mysql2/promise');
const bcrypt = require('bcryptjs');

async function initDatabase() {
  const host = process.env.DB_HOST || 'localhost';
  const user = process.env.DB_USER || 'root';
  const password = process.env.DB_PASSWORD || '';
  const dbName = process.env.DB_NAME || 'job_search';

  const connection = await mysql.createConnection({ host, user, password });
  await connection.query(`CREATE DATABASE IF NOT EXISTS \`${dbName}\` CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci`);
  await connection.query(`USE \`${dbName}\``);
  await connection.query(`
    CREATE TABLE IF NOT EXISTS users (
      id INT AUTO_INCREMENT PRIMARY KEY,
      email VARCHAR(255) NOT NULL UNIQUE,
      password_hash VARCHAR(255) NOT NULL,
      subscription_plan VARCHAR(50) DEFAULT 'Silver',
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    ) ENGINE=InnoDB;
  `);

  await connection.query(`
    CREATE TABLE IF NOT EXISTS jobs (
      id INT AUTO_INCREMENT PRIMARY KEY,
      title VARCHAR(255) NOT NULL,
      company VARCHAR(255) NOT NULL,
      location VARCHAR(255) NOT NULL,
      description TEXT NOT NULL,
      salary VARCHAR(100),
      remote BOOLEAN DEFAULT FALSE,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    ) ENGINE=InnoDB;
  `);

  await connection.query(`
    CREATE TABLE IF NOT EXISTS applications (
      id INT AUTO_INCREMENT PRIMARY KEY,
      user_id INT NOT NULL,
      job_id INT NOT NULL,
      status VARCHAR(50) NOT NULL DEFAULT 'Applied',
      applied_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      UNIQUE KEY unique_application (user_id, job_id),
      FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
      FOREIGN KEY (job_id) REFERENCES jobs(id) ON DELETE CASCADE
    ) ENGINE=InnoDB;
  `);

  await connection.query(`
    CREATE TABLE IF NOT EXISTS subscription_plans (
      id INT AUTO_INCREMENT PRIMARY KEY,
      name VARCHAR(100) NOT NULL,
      price VARCHAR(50) NOT NULL,
      benefits TEXT NOT NULL
    ) ENGINE=InnoDB;
  `);

  const passwordHash = bcrypt.hashSync('password123', 10);

  await connection.query('INSERT IGNORE INTO users (email, password_hash, subscription_plan) VALUES (?, ?, ?)', [
    'jane.doe@example.com',
    passwordHash,
    'Silver',
  ]);

  await connection.query(`INSERT IGNORE INTO subscription_plans (name, price, benefits) VALUES
    ("Silver", "$9.99/mo", "Basic job alerts, Standard applications"),
    ("Gold", "$19.99/mo", "Priority listing, Faster responses, Interview prep tips"),
    ("Platinum", "$29.99/mo", "Premium support, Direct recruiter access, Resume reviews")
  `);

  await connection.query(`INSERT IGNORE INTO jobs (title, company, location, description, salary, remote) VALUES
    ("Frontend Developer", "Neon Labs", "Remote", "Build responsive UI and deliver polished web experiences.", "$70k - $90k", TRUE),
    ("Backend Engineer", "Atlas Solutions", "Austin, TX", "Design APIs, optimize performance, and integrate services.", "$85k - $110k", FALSE),
    ("Product Designer", "Echo Interactive", "New York, NY", "Collaborate on product strategy and visual design.", "$65k - $80k", TRUE)
  `);

  console.log('Database initialized successfully.');
  await connection.end();
}

initDatabase().catch((error) => {
  console.error('Database initialization failed:', error);
  process.exit(1);
});
