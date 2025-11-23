'use client';

import { useState, useEffect } from 'react';
import { FaShoppingCart, FaShoppingBag } from 'react-icons/fa'; // เพิ่ม FaShoppingBag
import { Prompt } from 'next/font/google';
import { useCart } from '@/context/CartContext'; // เรียกใช้ Context
import Link from 'next/link';

const prompt = Prompt({
  subsets: ['thai', 'latin'],
  weight: ['300', '400', '500', '600'],
});

export default function MarketPage() {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [hoveredId, setHoveredId] = useState(null);
  const { addToCart, cart } = useCart(); // ดึง cart มาด้วยเพื่อโชว์เลข

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8; 

  useEffect(() => {
    fetchMarketBooks();
  }, []);

  const fetchMarketBooks = async () => {
    try {
      const res = await fetch('/api/market');
      const data = await res.json();
      setBooks(data);
      setLoading(false);
    } catch (error) {
      console.error('Error:', error);
      setLoading(false);
    }
  };

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentBooks = books.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(books.length / itemsPerPage);

  const handleAddToCart = (book) => {
    addToCart(book);
  };

  if (loading) return <div className={`p-20 text-center text-gray-500 ${prompt.className}`}>Loading...</div>;

  return (
    <div className={prompt.className} style={{ minHeight: '100vh', backgroundColor: '#ffebd6', padding: '60px 20px' }}>
      
      <div style={{ maxWidth: '1100px', margin: '0 auto', position: 'relative' }}> {/* เพิ่ม position: relative ให้แม่ */}

        <div style={{ textAlign: 'center', marginBottom: '50px' }}>
          <h1 style={{ fontSize: '2.2rem', fontWeight: '600', color: '#2D2D2D', letterSpacing: '-0.5px' }}>
            Marketplace
          </h1>
          <p style={{ color: '#888', fontWeight: '300', marginTop: '5px' }}>
            คัดสรรหนังสือดี E-Book คุณภาพเพื่อคุณ
          </p>
        </div>

        {books.length === 0 ? (
          <p style={{ textAlign: 'center', color: '#999', marginTop: '50px', fontWeight: '300' }}>ยังไม่มีหนังสือวางขาย</p>
        ) : (
          <div style={{ 
            display: 'grid', 
            gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', 
            gap: '40px 25px' 
          }}>
            {currentBooks.map((book) => (
              <div 
                key={book.id}
                onMouseEnter={() => setHoveredId(book.id)}
                onMouseLeave={() => setHoveredId(null)}
                style={{ 
                  backgroundColor: 'white',
                  borderRadius: '12px',
                  padding: '15px',
                  display: 'flex',
                  flexDirection: 'column',
                  transition: 'all 0.3s ease',
                  transform: hoveredId === book.id ? 'translateY(-8px)' : 'translateY(0)',
                  boxShadow: hoveredId === book.id ? '0 15px 30px rgba(0,0,0,0.08)' : 'none',
                  cursor: 'pointer',
                  position: 'relative'
                }}
              >
                <Link href={`/market/${book.id}`} style={{ textDecoration: 'none', flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
                  
                  <div style={{ 
                    width: '100%', aspectRatio: '2/3', borderRadius: '8px', overflow: 'hidden', marginBottom: '15px', backgroundColor: '#f9f9f9', boxShadow: '0 4px 10px rgba(0,0,0,0.05)'
                  }}>
                    <img 
                      src={book.cover_image || 'https://via.placeholder.com/300x450'} 
                      alt={book.title} 
                      style={{ width: '100%', height: '100%', objectFit: 'cover' }} 
                    />
                  </div>

                  <div style={{ flexGrow: 1 }}>
                    <h3 style={{ fontWeight: '500', fontSize: '1rem', color: '#333', marginBottom: '4px', lineHeight: '1.4', height: '44px', overflow: 'hidden', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical' }}>
                      {book.title}
                    </h3>
                    <p style={{ fontSize: '0.85rem', color: '#999', marginBottom: '10px' }}>
                      {book.author || 'Unknown Author'}
                    </p>
                  </div>
                </Link>

                <div style={{ marginTop: '10px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontWeight: '600', color: '#D9534F', fontSize: '1.1rem' }}>
                    {parseFloat(book.price).toLocaleString()} <span style={{fontSize: '0.7rem', color:'#999', fontWeight:'400'}}>NWN</span>
                  </span>
                  
                  <button 
                    onClick={(e) => {
                        e.stopPropagation();
                        handleAddToCart(book);
                    }}
                    style={{
                      backgroundColor: hoveredId === book.id ? '#333' : 'transparent',
                      color: hoveredId === book.id ? 'white' : '#ccc',
                      border: '1px solid #eee',
                      borderRadius: '50%',
                      width: '36px',
                      height: '36px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      cursor: 'pointer',
                      transition: 'all 0.2s'
                    }}
                    title="Add to Cart"
                  >
                    <FaShoppingCart style={{ fontSize: '0.9rem' }} />
                  </button>
                </div>

              </div>
            ))}
          </div>
        )}

        {totalPages > 1 && (
          <div style={{ display: 'flex', justifyContent: 'center', gap: '10px', marginTop: '60px' }}>
            <button 
              disabled={currentPage === 1}
              onClick={() => setCurrentPage(prev => prev - 1)}
              style={{ padding: '8px 20px', cursor: currentPage === 1 ? 'not-allowed' : 'pointer', color: currentPage === 1 ? '#ccc' : '#555', background: '#eee', border: '1px solid #eee', borderRadius: '30px', fontSize: '0.9rem' }}
            >
              Previous
            </button>
            <button 
              disabled={currentPage === totalPages}
              onClick={() => setCurrentPage(prev => prev + 1)}
              style={{ padding: '8px 20px', cursor: currentPage === totalPages ? 'not-allowed' : 'pointer', color: currentPage === totalPages ? '#ccc' : '#555', background: '#eee', border: '1px solid #eee', borderRadius: '30px', fontSize: '0.9rem' }}
            >
              Next
            </button>
          </div>
        )}

      </div>
    </div>
  );
}