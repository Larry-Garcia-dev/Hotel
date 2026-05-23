import { getPool } from './database.js';
import bcrypt from 'bcryptjs';

const tables = [
  {
    name: 'users',
    sql: `CREATE TABLE IF NOT EXISTS users (
      id INT AUTO_INCREMENT PRIMARY KEY,
      username VARCHAR(100) NOT NULL UNIQUE,
      email VARCHAR(255) NOT NULL UNIQUE,
      password VARCHAR(255) NOT NULL,
      role ENUM('admin', 'staff') DEFAULT 'staff',
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
    )`
  },
  {
    name: 'room_types',
    sql: `CREATE TABLE IF NOT EXISTS room_types (
      id INT AUTO_INCREMENT PRIMARY KEY,
      name VARCHAR(100) NOT NULL,
      description TEXT,
      base_price DECIMAL(10,2) NOT NULL,
      max_guests INT DEFAULT 2,
      image_url VARCHAR(500),
      amenities JSON,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
    )`
  },
  {
    name: 'rooms',
    sql: `CREATE TABLE IF NOT EXISTS rooms (
      id INT AUTO_INCREMENT PRIMARY KEY,
      room_number VARCHAR(20) NOT NULL UNIQUE,
      room_type_id INT NOT NULL,
      floor INT DEFAULT 1,
      status ENUM('available', 'occupied', 'maintenance', 'cleaning') DEFAULT 'available',
      notes TEXT,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
      FOREIGN KEY (room_type_id) REFERENCES room_types(id) ON DELETE CASCADE
    )`
  },
  {
    name: 'guests',
    sql: `CREATE TABLE IF NOT EXISTS guests (
      id INT AUTO_INCREMENT PRIMARY KEY,
      first_name VARCHAR(100) NOT NULL,
      last_name VARCHAR(100) NOT NULL,
      email VARCHAR(255),
      phone VARCHAR(50),
      document_type VARCHAR(50),
      document_number VARCHAR(100),
      address TEXT,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
    )`
  },
  {
    name: 'reservations',
    sql: `CREATE TABLE IF NOT EXISTS reservations (
      id INT AUTO_INCREMENT PRIMARY KEY,
      guest_id INT NOT NULL,
      room_id INT NOT NULL,
      check_in DATE NOT NULL,
      check_out DATE NOT NULL,
      adults INT DEFAULT 1,
      children INT DEFAULT 0,
      total_price DECIMAL(10,2),
      status ENUM('pending', 'confirmed', 'checked_in', 'checked_out', 'cancelled') DEFAULT 'pending',
      notes TEXT,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
      FOREIGN KEY (guest_id) REFERENCES guests(id) ON DELETE CASCADE,
      FOREIGN KEY (room_id) REFERENCES rooms(id) ON DELETE CASCADE
    )`
  },
  {
    name: 'inventory_categories',
    sql: `CREATE TABLE IF NOT EXISTS inventory_categories (
      id INT AUTO_INCREMENT PRIMARY KEY,
      name VARCHAR(100) NOT NULL,
      description TEXT,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )`
  },
  {
    name: 'inventory_items',
    sql: `CREATE TABLE IF NOT EXISTS inventory_items (
      id INT AUTO_INCREMENT PRIMARY KEY,
      category_id INT,
      name VARCHAR(200) NOT NULL,
      description TEXT,
      quantity INT DEFAULT 0,
      min_quantity INT DEFAULT 5,
      unit VARCHAR(50) DEFAULT 'unidad',
      cost_per_unit DECIMAL(10,2),
      location VARCHAR(200),
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
      FOREIGN KEY (category_id) REFERENCES inventory_categories(id) ON DELETE SET NULL
    )`
  },
  {
    name: 'inventory_movements',
    sql: `CREATE TABLE IF NOT EXISTS inventory_movements (
      id INT AUTO_INCREMENT PRIMARY KEY,
      item_id INT NOT NULL,
      type ENUM('in', 'out', 'adjustment') NOT NULL,
      quantity INT NOT NULL,
      reason TEXT,
      user_id INT,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (item_id) REFERENCES inventory_items(id) ON DELETE CASCADE,
      FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL
    )`
  },
  {
    name: 'chat_sessions',
    sql: `CREATE TABLE IF NOT EXISTS chat_sessions (
      id INT AUTO_INCREMENT PRIMARY KEY,
      session_id VARCHAR(100) NOT NULL UNIQUE,
      guest_name VARCHAR(200),
      guest_email VARCHAR(255) NOT NULL,
      status ENUM('active', 'closed') DEFAULT 'active',
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
      INDEX idx_email (guest_email),
      INDEX idx_session (session_id)
    )`
  },
  {
    name: 'chat_messages',
    sql: `CREATE TABLE IF NOT EXISTS chat_messages (
      id INT AUTO_INCREMENT PRIMARY KEY,
      session_id VARCHAR(100) NOT NULL,
      role ENUM('user', 'assistant', 'system') NOT NULL,
      content TEXT NOT NULL,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      INDEX idx_session_messages (session_id),
      FOREIGN KEY (session_id) REFERENCES chat_sessions(session_id) ON DELETE CASCADE
    )`
  }
];

export async function runMigrations() {
  const pool = getPool();
  
  console.log('Running database migrations...');
  
  for (const table of tables) {
    try {
      await pool.query(table.sql);
      console.log(`Table "${table.name}" created/verified`);
    } catch (error) {
      console.error(`Error creating table "${table.name}":`, error.message);
      throw error;
    }
  }
  
  await seedInitialData(pool);
  console.log('Migrations completed successfully');
}

async function seedInitialData(pool) {
  const [admins] = await pool.query(
    'SELECT id FROM users WHERE role = "admin" LIMIT 1'
  );
  
  if (admins.length === 0) {
    const hashedPassword = await bcrypt.hash('admin123', 10);
    await pool.query(
      'INSERT INTO users (username, email, password, role) VALUES (?, ?, ?, ?)',
      ['admin', 'admin@gateway.com', hashedPassword, 'admin']
    );
    console.log('Default admin user created (admin / admin123)');
  }
  
  const [roomTypes] = await pool.query('SELECT id FROM room_types LIMIT 1');
  
  if (roomTypes.length === 0) {
    const defaultRoomTypes = [
      ['Two Double Beds', 'Room for families or small groups', 120.00, 4, '/images/rooms/two_double_beds.jpg'],
      ['One King Bed', 'Comfortable option for couples', 150.00, 2, '/images/rooms/one_king_bed.jpg'],
      ['Accessible Room', 'ADA-friendly room designed for easier access', 130.00, 2, '/images/rooms/accessible.jpg']
    ];
    
    for (const rt of defaultRoomTypes) {
      await pool.query(
        'INSERT INTO room_types (name, description, base_price, max_guests, image_url) VALUES (?, ?, ?, ?, ?)',
        rt
      );
    }
    console.log('Default room types created');
  }
  
  const [categories] = await pool.query('SELECT id FROM inventory_categories LIMIT 1');
  
  if (categories.length === 0) {
    const defaultCategories = [
      ['Limpieza', 'Productos de limpieza'],
      ['Amenities', 'Artículos para huéspedes'],
      ['Ropa de Cama', 'Sábanas, toallas, almohadas'],
      ['Mantenimiento', 'Herramientas y suministros']
    ];
    
    for (const cat of defaultCategories) {
      await pool.query(
        'INSERT INTO inventory_categories (name, description) VALUES (?, ?)',
        cat
      );
    }
    console.log('Default inventory categories created');
  }
}

export default { runMigrations };
