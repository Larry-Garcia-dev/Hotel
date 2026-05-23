import { getPool } from '../config/database.js';

export async function findAll(filters = {}) {
  const pool = getPool();
  let query = `
    SELECT res.*, g.first_name, g.last_name, g.email, g.phone,
           r.room_number, rt.name as room_type_name
    FROM reservations res
    JOIN guests g ON res.guest_id = g.id
    JOIN rooms r ON res.room_id = r.id
    JOIN room_types rt ON r.room_type_id = rt.id
  `;
  const params = [];
  const conditions = [];

  if (filters.status) {
    conditions.push('res.status = ?');
    params.push(filters.status);
  }
  if (filters.from_date) {
    conditions.push('res.check_in >= ?');
    params.push(filters.from_date);
  }
  if (filters.to_date) {
    conditions.push('res.check_out <= ?');
    params.push(filters.to_date);
  }

  if (conditions.length > 0) {
    query += ' WHERE ' + conditions.join(' AND ');
  }
  query += ' ORDER BY res.check_in DESC';

  const [rows] = await pool.query(query, params);
  return rows;
}

export async function findById(id) {
  const pool = getPool();
  const [rows] = await pool.query(
    `SELECT res.*, g.first_name, g.last_name, g.email, g.phone,
            r.room_number, rt.name as room_type_name, rt.base_price
     FROM reservations res
     JOIN guests g ON res.guest_id = g.id
     JOIN rooms r ON res.room_id = r.id
     JOIN room_types rt ON r.room_type_id = rt.id
     WHERE res.id = ?`,
    [id]
  );
  return rows[0] || null;
}

export async function create(data) {
  const pool = getPool();
  const {
    guest_id, room_id, check_in, check_out,
    adults, children, total_price, status, notes
  } = data;
  
  const [result] = await pool.query(
    `INSERT INTO reservations 
     (guest_id, room_id, check_in, check_out, adults, children, total_price, status, notes)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    [guest_id, room_id, check_in, check_out, adults || 1, children || 0, 
     total_price, status || 'pending', notes]
  );
  return findById(result.insertId);
}

export async function update(id, data) {
  const pool = getPool();
  const {
    guest_id, room_id, check_in, check_out,
    adults, children, total_price, status, notes
  } = data;
  
  await pool.query(
    `UPDATE reservations SET 
     guest_id = ?, room_id = ?, check_in = ?, check_out = ?,
     adults = ?, children = ?, total_price = ?, status = ?, notes = ?
     WHERE id = ?`,
    [guest_id, room_id, check_in, check_out, adults, children, 
     total_price, status, notes, id]
  );
  return findById(id);
}

export async function updateStatus(id, status) {
  const pool = getPool();
  await pool.query('UPDATE reservations SET status = ? WHERE id = ?', [status, id]);
  return findById(id);
}

export async function remove(id) {
  const pool = getPool();
  await pool.query('DELETE FROM reservations WHERE id = ?', [id]);
  return true;
}

export default { findAll, findById, create, update, updateStatus, remove };
