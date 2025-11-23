import { NextResponse } from 'next/server';
import pool from '@/lib/db';

// 1. POST: บันทึกการซื้อ (ทำงานตอนจ่ายเงินสำเร็จ)
export async function POST(request) {
  try {
    const body = await request.json();
    const { wallet_address, items } = body;

    // Loop บันทึกหนังสือทีละเล่มลงตาราง user_books
    for (const item of items) {
        // เช็คก่อนว่าเคยซื้อหรือยัง (กันซ้ำ)
        const [exists] = await pool.query(
            'SELECT * FROM user_books WHERE wallet_address = ? AND book_id = ?', 
            [wallet_address, item.id]
        );

        if (exists.length === 0) {
            await pool.query(
                'INSERT INTO user_books (wallet_address, book_id) VALUES (?, ?)',
                [wallet_address, item.id]
            );
        }
    }

    return NextResponse.json({ message: 'Purchase recorded successfully' });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
// ... (ส่วน POST เหมือนเดิม)

// 2. GET: ดึงหนังสือของฉัน
export async function GET(request) {
    try {
        const { searchParams } = new URL(request.url);
        const wallet = searchParams.get('wallet');

        if (!wallet) return NextResponse.json([]);

        // ⭐ แก้ตรงนี้: เพิ่ม ", user_books.purchase_date" เข้าไปใน SELECT
        const sql = `
            SELECT book_market.*, user_books.purchase_date 
            FROM book_market 
            JOIN user_books ON book_market.id = user_books.book_id 
            WHERE user_books.wallet_address = ?
            ORDER BY user_books.purchase_date DESC
        `;
        
        const [rows] = await pool.query(sql, [wallet]);
        return NextResponse.json(rows);
    } catch (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}