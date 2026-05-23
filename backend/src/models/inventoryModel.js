import { getPool } from '../config/database.js';

export async function findAllCategories() {
  const pool = getPool();
  const [rows] = await pool.query('SELECT * FROM inventory_categories ORDER BY name');
  return rows;
}

export async function createCategory(data) {
  const pool = getPool();
  const { name, description } = data;
  const [result] = await pool.query(
    'INSERT INTO inventory_categories (name, description) VALUES (?, ?)',
    [name, description]
  );
  return { id: result.insertId, ...data };
}

export async function findAllItems(filters = {}) {
  const pool = getPool();
  let query = `
    SELECT i.*, c.name as category_name
    FROM inventory_items i
    LEFT JOIN inventory_categories c ON i.category_id = c.id
  `;
  const params = [];
  const conditions = [];

  if (filters.category_id) {
    conditions.push('i.category_id = ?');
    params.push(filters.category_id);
  }
  if (filters.low_stock) {
    conditions.push('i.quantity <= i.min_quantity');
  }

  if (conditions.length > 0) {
    query += ' WHERE ' + conditions.join(' AND ');
  }
  query += ' ORDER BY i.name';

  const [rows] = await pool.query(query, params);
  return rows;
}

export async function findItemById(id) {
  const pool = getPool();
  const [rows] = await pool.query(
    `SELECT i.*, c.name as category_name
     FROM inventory_items i
     LEFT JOIN inventory_categories c ON i.category_id = c.id
     WHERE i.id = ?`,
    [id]
  );
  return rows[0] || null;
}

export async function createItem(data) {
  const pool = getPool();
  const {
    category_id, name, description, quantity,
    min_quantity, unit, cost_per_unit, location
  } = data;
  
  const [result] = await pool.query(
    `INSERT INTO inventory_items 
     (category_id, name, description, quantity, min_quantity, unit, cost_per_unit, location)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
    [category_id, name, description, quantity || 0, min_quantity || 5, 
     unit || 'unidad', cost_per_unit, location]
  );
  return findItemById(result.insertId);
}

export async function updateItem(id, data) {
  const pool = getPool();
  const {
    category_id, name, description, quantity,
    min_quantity, unit, cost_per_unit, location
  } = data;
  
  await pool.query(
    `UPDATE inventory_items SET 
     category_id = ?, name = ?, description = ?, quantity = ?,
     min_quantity = ?, unit = ?, cost_per_unit = ?, location = ?
     WHERE id = ?`,
    [category_id, name, description, quantity, min_quantity, unit, cost_per_unit, location, id]
  );
  return findItemById(id);
}

export async function removeItem(id) {
  const pool = getPool();
  await pool.query('DELETE FROM inventory_items WHERE id = ?', [id]);
  return true;
}

export async function addMovement(data) {
  const pool = getPool();
  const { item_id, type, quantity, reason, user_id } = data;
  
  await pool.query(
    'INSERT INTO inventory_movements (item_id, type, quantity, reason, user_id) VALUES (?, ?, ?, ?, ?)',
    [item_id, type, quantity, reason, user_id]
  );
  
  const operator = type === 'in' ? '+' : '-';
  await pool.query(
    `UPDATE inventory_items SET quantity = quantity ${operator} ? WHERE id = ?`,
    [Math.abs(quantity), item_id]
  );
  
  return findItemById(item_id);
}

export async function getMovements(itemId) {
  const pool = getPool();
  const [rows] = await pool.query(
    `SELECT m.*, u.username
     FROM inventory_movements m
     LEFT JOIN users u ON m.user_id = u.id
     WHERE m.item_id = ?
     ORDER BY m.created_at DESC`,
    [itemId]
  );
  return rows;
}

export default {
  findAllCategories, createCategory,
  findAllItems, findItemById, createItem, updateItem, removeItem,
  addMovement, getMovements
};
