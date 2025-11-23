import { NextResponse } from 'next/server';
import pool from '@/lib/db';

export async function GET(request, { params }) {
  try {
    // ต้อง await params ก่อนใน Next.js รุ่นใหม่ แต่ถ้าใช้รุ่นเก่าเขียนแบบนี้ได้เลย
    const { id } = params; 

    // ดึงข้อมูลแค่ 1 เล่ม โดยเช็คจาก ID
    const [rows] = await pool.query('SELECT * FROM book_market WHERE id = ?', [id]);

    // ถ้าหาไม่เจอ ให้บอกว่า 404
    if (rows.length === 0) {
      return NextResponse.json({ error: 'Book not found' }, { status: 404 });
    }

    // ส่งข้อมูลหนังสือเล่มนั้นกลับไป (rows[0] คือข้อมูลแถวแรกที่เจอ)
    return NextResponse.json(rows[0]);
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}