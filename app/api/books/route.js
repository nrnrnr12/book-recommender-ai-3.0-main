import { NextResponse } from 'next/server';
import pool from '@/lib/db';

// 1. GET: ดึงข้อมูลหนังสือทั้งหมด
export async function GET() {
  try {
    const [rows] = await pool.query('SELECT * FROM books');
    return NextResponse.json(rows);
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// 2. POST: เพิ่มหนังสือใหม่ (เผื่อใช้)
export async function POST(request) {
  try {
    const body = await request.json();
    const { title, author, category, image_url } = body;
    
    const sql = 'INSERT INTO books (title, author, category, image_url) VALUES (?, ?, ?, ?)';
    const [result] = await pool.query(sql, [title, author, category, image_url]);

    return NextResponse.json({ id: result.insertId, message: 'เพิ่มหนังสือสำเร็จ' });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// 3. DELETE: ลบหนังสือ (ต้องส่ง ID มา)
export async function DELETE(request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) return NextResponse.json({ error: 'ID is required' }, { status: 400 });

    await pool.query('DELETE FROM books WHERE id = ?', [id]);
    return NextResponse.json({ message: 'ลบหนังสือสำเร็จ' });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}