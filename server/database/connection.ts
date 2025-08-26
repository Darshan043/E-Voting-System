import Database from 'better-sqlite3';
import { createTablesSQL } from './models.js';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Create database file in the project root
const dbPath = path.join(__dirname, '../../voting_system.db');

// Initialize database connection
export const db = new Database(dbPath);

// Enable foreign key constraints
db.pragma('foreign_keys = ON');

// Initialize database tables
export function initializeDatabase() {
  try {
    // Execute the table creation SQL
    db.exec(createTablesSQL);
    console.log('✅ Database initialized successfully');
    
    // Log database info
    const tables = db.prepare("SELECT name FROM sqlite_master WHERE type='table'").all();
    console.log('📊 Database tables:', tables.map(t => t.name).join(', '));
    
    return true;
  } catch (error) {
    console.error('❌ Failed to initialize database:', error);
    throw error;
  }
}

// Graceful shutdown
process.on('SIGINT', () => {
  console.log('\n🔄 Closing database connection...');
  db.close();
  process.exit(0);
});

process.on('SIGTERM', () => {
  console.log('\n🔄 Closing database connection...');
  db.close();
  process.exit(0);
});

export default db;