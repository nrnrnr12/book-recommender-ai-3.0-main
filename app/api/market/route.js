import { NextResponse } from 'next/server';
import pool from '@/lib/db';

// GET: ดึงข้อมูล (อันเดิม)
export async function GET() {
  try {
    const [rows] = await pool.query('SELECT * FROM book_market ORDER BY id DESC');
    return NextResponse.json(rows);
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// POST: เพิ่มหนังสือใหม่เข้าตลาด (อันใหม่)
export async function POST(request) {
  try {
    const body = await request.json();
    const { 
        title, author, translator, category, 
        original_language, description, price, 
        cover_image, ebook_file_url 
    } = body;
    
    const sql = `
        INSERT INTO book_market 
        (title, author, translator, category, original_language, description, price, cover_image, ebook_file_url) 
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;
    
    const [result] = await pool.query(sql, [
        title, author, translator, category, 
        original_language, description, price, 
        cover_image, ebook_file_url
    ]);

    return NextResponse.json({ id: result.insertId, message: 'Book added to market successfully' });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}