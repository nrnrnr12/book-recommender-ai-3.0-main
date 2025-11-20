import mysql from 'mysql2/promise';

// สร้างตัวเชื่อมต่อ (Connection Pool)
const pool = mysql.createPool({
  host: 'localhost',
  user: 'root',           // User ปกติของ XAMPP
  password: '',           // ปกติ XAMPP ไม่ตั้งรหัส
  database: 'book_recommender', // ชื่อ DB ที่เราสร้างใน phpMyAdmin
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

export default pool;