import mysql from 'mysql2/promise';
import dotenv from 'dotenv';

dotenv.config();

const dbConfig = {
  host: process.env.DB_HOST || 'localhost',
  port: process.env.DB_PORT || 3306,
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'hotel_gateway',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
};

let pool = null;

export async function createConnection() {
  if (pool) return pool;
  
  try {
    const tempPool = mysql.createPool({
      ...dbConfig,
      database: undefined
    });
    
    await tempPool.query(
      `CREATE DATABASE IF NOT EXISTS \`${dbConfig.database}\``
    );
    await tempPool.end();
    
    pool = mysql.createPool(dbConfig);
    console.log('Database connected successfully');
    return pool;
  } catch (error) {
    console.error('Database connection error:', error.message);
    throw error;
  }
}

export function getPool() {
  if (!pool) {
    throw new Error('Database not initialized');
  }
  return pool;
}

export default { createConnection, getPool };
