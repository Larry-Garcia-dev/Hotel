import { getPool } from '../config/database.js';

export async function findAll() {
  const pool = getPool();
  const [rows] = await pool.query('SELECT * FROM guests ORDER BY last_name, first_name');
  return rows;
}

export async function findById(id) {
  const pool = getPool();
  const [rows] = await pool.query('SELECT * FROM guests WHERE id = ?', [id]);
  return rows[0] || null;
}

export async function findByEmail(email) {
  const pool = getPool();
  const [rows] = await pool.query('SELECT * FROM guests WHERE email = ?', [email]);
  return rows[0] || null;
}

export async function create(data) {
  const pool = getPool();
  const {
    first_name, last_name, email, phone,
    document_type, document_number, address
  } = data;
  
  const [result] = await pool.query(
    `INSERT INTO guests 
     (first_name, last_name, email, phone, document_type, document_number, address)
     VALUES (?, ?, ?, ?, ?, ?, ?)`,
    [first_name, last_name, email, phone, document_type, document_number, address]
  );
  return { id: result.insertId, ...data };
}

export async function update(id, data) {
  const pool = getPool();
  const {
    first_name, last_name, email, phone,
    document_type, document_number, address
  } = data;
  
  await pool.query(
    `UPDATE guests SET 
     first_name = ?, last_name = ?, email = ?, phone = ?,
     document_type = ?, document_number = ?, address = ?
     WHERE id = ?`,
    [first_name, last_name, email, phone, document_type, document_number, address, id]
  );
  return findById(id);
}

export async function remove(id) {
  const pool = getPool();
  await pool.query('DELETE FROM guests WHERE id = ?', [id]);
  return true;
}

export default { findAll, findById, findByEmail, create, update, remove };
