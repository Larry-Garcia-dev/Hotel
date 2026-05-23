import { getPool } from '../config/database.js';
import bcrypt from 'bcryptjs';

export async function findByUsername(username) {
  const pool = getPool();
  const [rows] = await pool.query(
    'SELECT * FROM users WHERE username = ?',
    [username]
  );
  return rows[0] || null;
}

export async function findById(id) {
  const pool = getPool();
  const [rows] = await pool.query(
    'SELECT id, username, email, role, created_at FROM users WHERE id = ?',
    [id]
  );
  return rows[0] || null;
}

export async function create(data) {
  const pool = getPool();
  const { username, email, password, role } = data;
  const hashedPassword = await bcrypt.hash(password, 10);
  
  const [result] = await pool.query(
    'INSERT INTO users (username, email, password, role) VALUES (?, ?, ?, ?)',
    [username, email, hashedPassword, role || 'staff']
  );
  return findById(result.insertId);
}

export async function validatePassword(plainPassword, hashedPassword) {
  return bcrypt.compare(plainPassword, hashedPassword);
}

export default { findByUsername, findById, create, validatePassword };
