'use client';

import { useEffect, useState } from 'react';
import { Prompt } from 'next/font/google';

const prompt = Prompt({
  subsets: ['thai', 'latin'],
  weight: ['300', '400', '500', '600'],
});

export default function BookPage() {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [hoveredId, setHoveredId] = useState(null);

  // --- เพิ่ม State สำหรับ Pagination ---
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8; // แสดงหน้าละ 8 เล่ม

  useEffect(() => {
    const fetchBooks = async () => {
      try {
        const res = await fetch('/api/books');
        const data = await res.json();
        setBooks(data);
      } catch (err) {
        console.error('❌ Failed to load books:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchBooks();
  }, []);

  // --- คำนวณการตัดแบ่งข้อมูล ---
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentBooks = books.slice(indexOfFirstItem, indexOfLastItem); // เอาเฉพาะข้อมูลหน้าปัจจุบัน
  const totalPages = Math.ceil(books.length / itemsPerPage); // จำนวนหน้าทั้งหมด

  if (loading) return <div className={`p-20 text-center text-gray-500 ${prompt.className}`}>Loading...</div>;

  return (
    <div className={prompt.className} style={{ minHeight: '100vh', backgroundColor: '#ffebd6', padding: '60px 20px' }}>
      
      <div style={{ 
        backgroundColor: 'white', 
        borderRadius: '24px', 
        padding: '50px', 
        maxWidth: '1200px', 
        margin: '0 auto',
        boxShadow: '0 10px 40px rgba(0,0,0,0.03)',
        minHeight: '600px'
      }}>
        
        <div style={{ textAlign: 'center', marginBottom: '50px' }}>
          <h1 style={{ fontSize: '2rem', fontWeight: '600', color: '#333' }}>
            Recommended Books
          </h1>
          <p style={{ color: '#999', fontWeight: '300', marginTop: '5px' }}>
            หนังสือแนะนำที่คัดสรรมาเพื่อคุณ
          </p>
        </div>

        {/* Grid แสดงหนังสือ (ใช้ currentBooks แทน books) */}
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', 
          gap: '40px 30px' 
        }}>
          {currentBooks.map((book) => (
            <div 
              key={book.id} 
              onMouseEnter={() => setHoveredId(book.id)}
              onMouseLeave={() => setHoveredId(null)}
              style={{ 
                backgroundColor: 'white',
                border: '1px solid #ccccccff', 
                borderRadius: '16px', 
                padding: '15px',
                display: 'flex',
                flexDirection: 'column',
                transition: 'all 0.3s ease',
                transform: hoveredId === book.id ? 'translateY(-8px)' : 'translateY(0)',
                boxShadow: hoveredId === book.id ? '0 15px 30px rgba(0,0,0,0.08)' : 'none',
                cursor: 'pointer'
              }}
            >
              
              <div style={{ 
                width: '100%', 
                aspectRatio: '2/3', 
                borderRadius: '10px', 
                overflow: 'hidden', 
                marginBottom: '15px',
                backgroundColor: '#f9f9f9',
                position: 'relative'
              }}>
                <img 
                  src={book.image_url && book.image_url !== "" ? book.image_url : 'https://via.placeholder.com/300x450?text=No+Image'} 
                  alt={book.title} 
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }} 
                  onError={(e) => { 
                    e.target.onerror = null;
                    e.target.src = 'https://via.placeholder.com/300x450?text=No+Image';
                  }}
                />
              </div>

              <div>
                {book.category && (
                  <span style={{ 
                    fontSize: '0.7rem', 
                    color: '#888', 
                    backgroundColor: '#f5f5f5', 
                    padding: '2px 8px', 
                    borderRadius: '20px',
                    display: 'inline-block',
                    marginBottom: '8px'
                  }}>
                    {book.category}
                  </span>
                )}

                <h3 style={{ 
                  fontWeight: '500', 
                  fontSize: '1.05rem', 
                  color: '#2D2D2D', 
                  marginBottom: '5px', 
                  lineHeight: '1.4',
                  height: '46px',
                  overflow: 'hidden',
                  display: '-webkit-box',
                  WebkitLineClamp: 2,
                  WebkitBoxOrient: 'vertical'
                }}>
                  {book.title}
                </h3>
                
                <p style={{ fontSize: '0.85rem', color: '#999', lineHeight: '1.5' }}>
                  {book.author || 'Unknown Author'}
                </p>
              </div>

            </div>
          ))}
        </div>

        {/* --- ส่วนปุ่มเปลี่ยนหน้า (Pagination) --- */}
        {totalPages > 1 && (
          <div style={{ display: 'flex', justifyContent: 'center', gap: '10px', marginTop: '60px' }}>
            <button 
              disabled={currentPage === 1}
              onClick={() => setCurrentPage(prev => prev - 1)}
              style={{ 
                padding: '8px 20px', 
                cursor: currentPage === 1 ? 'not-allowed' : 'pointer', 
                color: currentPage === 1 ? '#ccc' : '#555',
                background: '#eee',
                border: '1px solid #eee',
                borderRadius: '30px',
                fontSize: '0.9rem'
              }}
            >
              Previous
            </button>
            
            {/* แสดงเลขหน้า (ถ้าอยากให้มี) */}
            {/* <span style={{ display: 'flex', alignItems: 'center', color: '#999' }}>
              Page {currentPage} of {totalPages}
            </span> */}

            <button 
              disabled={currentPage === totalPages}
              onClick={() => setCurrentPage(prev => prev + 1)}
              style={{ 
                padding: '8px 20px', 
                cursor: currentPage === totalPages ? 'not-allowed' : 'pointer', 
                color: currentPage === totalPages ? '#ccc' : '#555',
                background: '#eee',
                border: '1px solid #eee',
                borderRadius: '30px',
                fontSize: '0.9rem'
              }}
            >
              Next
            </button>
          </div>
        )}

      </div>
    </div>
  );
}