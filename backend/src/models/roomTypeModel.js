import { getPool } from '../config/database.js';

export async function findAll() {
  const pool = getPool();
  const [rows] = await pool.query('SELECT * FROM room_types ORDER BY id');
  return rows;
}

export async function findById(id) {
  const pool = getPool();
  const [rows] = await pool.query('SELECT * FROM room_types WHERE id = ?', [id]);
  return rows[0] || null;
}

export async function create(data) {
  const pool = getPool();
  const { name, description, base_price, max_guests, image_url, amenities } = data;
  const [result] = await pool.query(
    `INSERT INTO room_types (name, description, base_price, max_guests, image_url, amenities) 
     VALUES (?, ?, ?, ?, ?, ?)`,
    [name, description, base_price, max_guests, image_url, JSON.stringify(amenities || [])]
  );
  return { id: result.insertId, ...data };
}

export async function update(id, data) {
  const pool = getPool();
  const { name, description, base_price, max_guests, image_url, amenities } = data;
  await pool.query(
    `UPDATE room_types SET name = ?, description = ?, base_price = ?, 
     max_guests = ?, image_url = ?, amenities = ? WHERE id = ?`,
    [name, description, base_price, max_guests, image_url, JSON.stringify(amenities || []), id]
  );
  return findById(id);
}

export async function remove(id) {
  const pool = getPool();
  await pool.query('DELETE FROM room_types WHERE id = ?', [id]);
  return true;
}

export default { findAll, findById, create, update, remove };
