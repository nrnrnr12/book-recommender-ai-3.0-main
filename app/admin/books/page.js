'use client'; // บอกว่าเป็น Client Component (เพราะต้องกดปุ่มได้)

import { useState, useEffect } from 'react';

export default function AdminPage() {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);

  // ฟังก์ชันดึงข้อมูลหนังสือเมื่อเปิดหน้าเว็บ
  useEffect(() => {
    fetchBooks();
  }, []);

  const fetchBooks = async () => {
    try {
      const res = await fetch('/api/books'); // เรียกใช้ API ที่เราสร้างในข้อ 2
      const data = await res.json();
      setBooks(data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching books:', error);
      setLoading(false);
    }
  };

  // ฟังก์ชันลบหนังสือ
  const handleDelete = async (id) => {
    if (!confirm('ยืนยันที่จะลบหนังสือเล่มนี้?')) return;

    try {
      const res = await fetch(`/api/books?id=${id}`, {
        method: 'DELETE',
      });
      
      if (res.ok) {
        alert('ลบเรียบร้อย!');
        fetchBooks(); // โหลดข้อมูลใหม่
      } else {
        alert('ลบไม่สำเร็จ');
      }
    } catch (error) {
      console.error('Error deleting:', error);
    }
  };

  if (loading) return <div className="p-10">กำลังโหลดข้อมูล...</div>;

  return (
    <div style={{ padding: '40px', maxWidth: '800px', margin: '0 auto' }}>
      <h1 style={{ fontSize: '2rem', marginBottom: '20px' }}>Admin: จัดการหนังสือ</h1>
      
      {books.length === 0 ? (
        <p>ไม่พบข้อมูลหนังสือใน Database</p>
      ) : (
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ background: '#333', color: '#fff', textAlign: 'left' }}>
              <th style={{ padding: '10px' }}>ID</th>
              <th style={{ padding: '10px' }}>ชื่อหนังสือ</th>
              <th style={{ padding: '10px' }}>ผู้แต่ง</th>
              <th style={{ padding: '10px' }}>จัดการ</th>
            </tr>
          </thead>
          <tbody>
            {books.map((book) => (
              <tr key={book.id} style={{ borderBottom: '1px solid #ccc' }}>
                <td style={{ padding: '10px' }}>{book.id}</td>
                <td style={{ padding: '10px' }}>{book.title}</td>
                <td style={{ padding: '10px' }}>{book.author}</td>
                <td style={{ padding: '10px' }}>
                  <button 
                    onClick={() => handleDelete(book.id)}
                    style={{
                      background: 'red', 
                      color: 'white', 
                      border: 'none', 
                      padding: '5px 10px', 
                      cursor: 'pointer',
                      borderRadius: '5px'
                    }}
                  >
                    ลบ
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}