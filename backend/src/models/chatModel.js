import { getPool } from '../config/database.js';
import { v4 as uuidv4 } from 'uuid';

export async function createSession(guestName, guestEmail) {
  const pool = getPool();
  const sessionId = uuidv4();
  
  await pool.query(
    'INSERT INTO chat_sessions (session_id, guest_name, guest_email) VALUES (?, ?, ?)',
    [sessionId, guestName || null, guestEmail]
  );
  
  return { sessionId, guestName, guestEmail };
}

export async function getSession(sessionId) {
  const pool = getPool();
  const [rows] = await pool.query(
    'SELECT * FROM chat_sessions WHERE session_id = ?',
    [sessionId]
  );
  return rows[0] || null;
}

export async function getSessionByEmail(email) {
  const pool = getPool();
  const [rows] = await pool.query(
    'SELECT * FROM chat_sessions WHERE guest_email = ? AND status = "active" ORDER BY created_at DESC LIMIT 1',
    [email]
  );
  return rows[0] || null;
}

export async function closeSession(sessionId) {
  const pool = getPool();
  await pool.query(
    'UPDATE chat_sessions SET status = "closed" WHERE session_id = ?',
    [sessionId]
  );
}

export async function addMessage(sessionId, role, content) {
  const pool = getPool();
  await pool.query(
    'INSERT INTO chat_messages (session_id, role, content) VALUES (?, ?, ?)',
    [sessionId, role, content]
  );
}

export async function getMessages(sessionId, limit = 20) {
  const pool = getPool();
  const [rows] = await pool.query(
    `SELECT role, content, created_at 
     FROM chat_messages 
     WHERE session_id = ? 
     ORDER BY created_at ASC 
     LIMIT ?`,
    [sessionId, limit]
  );
  return rows;
}

export async function getConversationHistory(sessionId, limit = 10) {
  const pool = getPool();
  const [rows] = await pool.query(
    `SELECT role, content 
     FROM chat_messages 
     WHERE session_id = ? 
     ORDER BY created_at DESC 
     LIMIT ?`,
    [sessionId, limit]
  );
  return rows.reverse();
}

export async function getAllSessions() {
  const pool = getPool();
  const [rows] = await pool.query(
    `SELECT cs.*, 
            COUNT(cm.id) as message_count,
            MAX(cm.created_at) as last_message_at
     FROM chat_sessions cs
     LEFT JOIN chat_messages cm ON cs.session_id = cm.session_id
     GROUP BY cs.id
     ORDER BY cs.created_at DESC`
  );
  return rows;
}
