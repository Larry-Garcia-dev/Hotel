import { getPool } from '../config/database.js';

export async function findAll(filters = {}) {
  const pool = getPool();
  let query = `
    SELECT r.*, rt.name as room_type_name, rt.base_price, rt.max_guests
    FROM rooms r
    JOIN room_types rt ON r.room_type_id = rt.id
  `;
  const params = [];
  const conditions = [];

  if (filters.status) {
    conditions.push('r.status = ?');
    params.push(filters.status);
  }
  if (filters.room_type_id) {
    conditions.push('r.room_type_id = ?');
    params.push(filters.room_type_id);
  }

  if (conditions.length > 0) {
    query += ' WHERE ' + conditions.join(' AND ');
  }
  query += ' ORDER BY r.room_number';

  const [rows] = await pool.query(query, params);
  return rows;
}

export async function findById(id) {
  const pool = getPool();
  const [rows] = await pool.query(
    `SELECT r.*, rt.name as room_type_name, rt.base_price 
     FROM rooms r JOIN room_types rt ON r.room_type_id = rt.id 
     WHERE r.id = ?`,
    [id]
  );
  return rows[0] || null;
}

export async function create(data) {
  const pool = getPool();
  const { room_number, room_type_id, floor, status, notes } = data;
  const [result] = await pool.query(
    `INSERT INTO rooms (room_number, room_type_id, floor, status, notes) 
     VALUES (?, ?, ?, ?, ?)`,
    [room_number, room_type_id, floor || 1, status || 'available', notes]
  );
  return findById(result.insertId);
}

export async function update(id, data) {
  const pool = getPool();
  const { room_number, room_type_id, floor, status, notes } = data;
  await pool.query(
    `UPDATE rooms SET room_number = ?, room_type_id = ?, floor = ?, 
     status = ?, notes = ? WHERE id = ?`,
    [room_number, room_type_id, floor, status, notes, id]
  );
  return findById(id);
}

export async function remove(id) {
  const pool = getPool();
  await pool.query('DELETE FROM rooms WHERE id = ?', [id]);
  return true;
}

export async function checkAvailability(checkIn, checkOut, roomTypeId = null) {
  const pool = getPool();
  let query = `
    SELECT r.*, rt.name as room_type_name, rt.base_price, rt.max_guests
    FROM rooms r
    JOIN room_types rt ON r.room_type_id = rt.id
    WHERE r.status = 'available'
    AND r.id NOT IN (
      SELECT room_id FROM reservations 
      WHERE status NOT IN ('cancelled', 'checked_out')
      AND check_in < ? AND check_out > ?
    )
  `;
  const params = [checkOut, checkIn];

  if (roomTypeId) {
    query += ' AND r.room_type_id = ?';
    params.push(roomTypeId);
  }

  const [rows] = await pool.query(query, params);
  return rows;
}

export async function findAvailable(checkIn, checkOut, roomType = null) {
  const pool = getPool();
  
  const roomTypeMap = {
    'king': 'One King Bed',
    'double': 'Two Double Beds',
    'accessible': 'Accessible Room'
  };
  
  let query = `
    SELECT r.id, r.room_number, r.floor, rt.name as type_name, rt.base_price, rt.max_guests
    FROM rooms r
    JOIN room_types rt ON r.room_type_id = rt.id
    WHERE r.status = 'available'
    AND r.id NOT IN (
      SELECT room_id FROM reservations 
      WHERE status NOT IN ('cancelled', 'checked_out')
      AND check_in < ? AND check_out > ?
    )
  `;
  const params = [checkOut, checkIn];

  if (roomType && roomTypeMap[roomType]) {
    query += ' AND rt.name = ?';
    params.push(roomTypeMap[roomType]);
  }
  
  query += ' ORDER BY rt.base_price ASC, r.room_number ASC';

  const [rows] = await pool.query(query, params);
  return rows;
}

export default { findAll, findById, create, update, remove, checkAvailability, findAvailable };
