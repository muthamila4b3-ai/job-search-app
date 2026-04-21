const path = require('path');
const fs = require('fs');
const mysql = require('mysql2/promise');
const bcrypt = require('bcryptjs');
const readline = require('readline');

// Load .env manually
const envPath = path.join(__dirname, '../../backend/.env');
if (fs.existsSync(envPath)) {
  const content = fs.readFileSync(envPath, 'utf-8');
  content.split('\n').forEach(line => {
    const [key, value] = line.split('=');
    if (key && value) process.env[key.trim()] = value.trim();
  });
}

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

async function initDatabase() {
  try {
    const host = process.env.DB_HOST || 'localhost';
    const user = process.env.DB_USER || 'root';
    const password = process.env.DB_PASSWORD || '';
    const dbName = process.env.DB_NAME || 'job_search';

    console.log('\n🔧 Job Search Database Initialization\n');
    console.log(`Database Host: ${host}`);
    console.log(`Database User: ${user}`);
    console.log(`Database Name: ${dbName}\n`);

    // Try connection with provided credentials
    console.log('🔐 Attempting to connect to MySQL...\n');
    
    let connection;
    try {
      connection = await mysql.createConnection({ 
        host, 
        user, 
        password: password || undefined,
        waitForConnections: true,
      });
      console.log('✅ Connected successfully!\n');
    } catch (connError) {
      console.log('❌ Connection failed with provided credentials:\n', connError.message, '\n');

      // Ask user for password
      return new Promise((resolve) => {
        rl.question('Enter MySQL root password (press Enter for no password): ', async (pwd) => {
          try {
            console.log('\n🔄 Retrying with provided password...\n');
            connection = await mysql.createConnection({
              host,
              user,
              password: pwd || undefined,
              waitForConnections: true,
            });
            console.log('✅ Connected successfully!\n');
            await performInit(connection, dbName);
            await connection.end();
            resolve();
          } catch (retryError) {
            console.error('❌ Connection still failed:', retryError.message);
            console.log('\n📋 Troubleshooting:');
            console.log('1. Verify MySQL is running: Get-Service MySQL80');
            console.log('2. Check MySQL root user password');
            console.log('3. Try: mysql_secure_installation.exe\n');
            rl.close();
            resolve();
          }
        });
      });
    }

    // If we got here, connection succeeded
    await performInit(connection, dbName);
    await connection.end();
    rl.close();

  } catch (error) {
    console.error('❌ Database initialization failed:', error.message);
    process.exit(1);
  }
}

async function performInit(connection, dbName) {
  try {
    // Create database
    await connection.query(
      `CREATE DATABASE IF NOT EXISTS \`${dbName}\` CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci`
    );
    console.log(`✅ Database '${dbName}' ready\n`);

    // Select database
    await connection.query(`USE \`${dbName}\``);

    // Create users table
    await connection.query(`
      CREATE TABLE IF NOT EXISTS users (
        id INT AUTO_INCREMENT PRIMARY KEY,
        email VARCHAR(255) NOT NULL UNIQUE,
        password_hash VARCHAR(255) NOT NULL,
        subscription_plan VARCHAR(50) DEFAULT 'Silver',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      ) ENGINE=InnoDB;
    `);
    console.log('✅ Created users table');

    // Create jobs table
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
    console.log('✅ Created jobs table');

    // Create applications table
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
    console.log('✅ Created applications table');

    // Create subscription_plans table
    await connection.query(`
      CREATE TABLE IF NOT EXISTS subscription_plans (
        id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(100) NOT NULL,
        price VARCHAR(50) NOT NULL,
        benefits TEXT NOT NULL
      ) ENGINE=InnoDB;
    `);
    console.log('✅ Created subscription_plans table\n');

    // Insert test user
    const passwordHash = bcrypt.hashSync('password123', 10);
    await connection.query(
      'INSERT IGNORE INTO users (email, password_hash, subscription_plan) VALUES (?, ?, ?)',
      ['jane.doe@example.com', passwordHash, 'Silver']
    );
    console.log('✅ Seeded test user: jane.doe@example.com');

    // Insert subscription plans
    await connection.query(`INSERT IGNORE INTO subscription_plans (name, price, benefits) VALUES
      ("Silver", "$9.99/mo", "Basic job alerts, Standard applications"),
      ("Gold", "$19.99/mo", "Priority listing, Faster responses, Interview prep tips"),
      ("Platinum", "$29.99/mo", "Premium support, Direct recruiter access, Resume reviews")
    `);
    console.log('✅ Seeded subscription plans');

    // Insert jobs
    await connection.query(`INSERT IGNORE INTO jobs (title, company, location, description, salary, remote) VALUES
      ("Frontend Developer", "Neon Labs", "Remote", "Build responsive UI and deliver polished web experiences.", "$70k - $90k", TRUE),
      ("Backend Engineer", "Atlas Solutions", "Austin, TX", "Design APIs, optimize performance, and integrate services.", "$85k - $110k", FALSE),
      ("Product Designer", "Echo Interactive", "New York, NY", "Collaborate on product strategy and visual design.", "$65k - $80k", TRUE)
    `);
    console.log('✅ Seeded 5 jobs\n');

    console.log('═══════════════════════════════════════════════════════');
    console.log('✨ Database initialization completed successfully!');
    console.log('═══════════════════════════════════════════════════════\n');
    console.log('📋 Next steps:');
    console.log('   1. npm start (Start the server)');
    console.log('   2. node test.js (Run API tests in another terminal)');
    console.log('   3. frontend: flutter run (Start Flutter app)\n');

  } catch (error) {
    console.error('❌ Error during initialization:', error.message);
    throw error;
  }
}

initDatabase().catch((error) => {
  console.error('Failed:', error);
  process.exit(1);
});
