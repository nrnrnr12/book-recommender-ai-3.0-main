import { NextResponse } from 'next/server';
import pool from '@/lib/db'; // เรียกใช้ตัวเชื่อมต่อจากไฟล์กลาง (lib/db.js)

// 1. GET: ดึงข้อมูลหนังสือเล่มเดียว (ตาม ID)
export async function GET(req, { params }) {
  try {
    const { id } = params;
    
    // ใช้ pool.query แทนการสร้าง connection ใหม่
    const [rows] = await pool.query('SELECT * FROM books WHERE id = ?', [id]);

    if (rows.length === 0) {
      return NextResponse.json({ error: 'Book not found' }, { status: 404 });
    }

    return NextResponse.json(rows[0]);
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// 2. PUT: แก้ไขข้อมูลหนังสือ
export async function PUT(req, { params }) {
  try {
    const { id } = params;
    // รับค่า category เพิ่มเข้ามาด้วย เพื่อให้แก้ไขหมวดหมู่ได้
    const { title, description, image_url, category } = await req.json();

    // SQL อัปเดตข้อมูล (เพิ่ม category เข้าไป)
    const sql = 'UPDATE books SET title = ?, description = ?, image_url = ?, category = ? WHERE id = ?';
    
    await pool.query(sql, [title, description, image_url, category, id]);

    return NextResponse.json({ message: 'Book updated successfully' });
  } catch (err) {
    return NextResponse.json({ error: 'Failed to update book: ' + err.message }, { status: 500 });
  }
}

// 3. DELETE: ลบหนังสือ
export async function DELETE(req, { params }) {
  try {
    const { id } = params;

    await pool.query('DELETE FROM books WHERE id = ?', [id]);

    return NextResponse.json({ message: 'Book deleted successfully' });
  } catch (err) {
    return NextResponse.json({ error: 'Failed to delete book: ' + err.message }, { status: 500 });
  }
}