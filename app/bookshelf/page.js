'use client';

import { useState, useEffect } from 'react';
import { Prompt } from 'next/font/google';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { FaBookOpen, FaInfoCircle, FaCalendarAlt } from 'react-icons/fa';

const prompt = Prompt({
  subsets: ['thai', 'latin'],
  weight: ['300', '400', '500', '600', '700'],
});

export default function BookshelfPage() {
  const [books, setBooks] = useState([]);
  const [account, setAccount] = useState(null);
  const [loading, setLoading] = useState(true);
  const [hoveredId, setHoveredId] = useState(null);
  const router = useRouter();

  useEffect(() => {
    const checkWallet = async () => {
      if (typeof window.ethereum !== 'undefined') {
        const accounts = await window.ethereum.request({ method: 'eth_accounts' });
        if (accounts.length > 0) {
          setAccount(accounts[0]);
          fetchMyBooks(accounts[0]);
        } else {
          setLoading(false);
        }
      }
    };
    checkWallet();
  }, []);

  const fetchMyBooks = async (wallet) => {
    try {
      const res = await fetch(`/api/orders?wallet=${wallet}`);
      const data = await res.json();
      setBooks(data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  if (!account) return <div className={`p-20 text-center text-gray-500 ${prompt.className}`}>กรุณาเชื่อมต่อกระเป๋าเพื่อดูชั้นหนังสือของคุณ</div>;
  if (loading) return <div className={`p-20 text-center text-gray-500 ${prompt.className}`}>Loading Library...</div>;

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
            My Bookshelf
          </h1>
          <p style={{ color: '#999', fontWeight: '300', marginTop: '5px' }}>
            หนังสือทั้งหมดที่คุณเป็นเจ้าของ
          </p>
        </div>

        {books.length === 0 ? (
          <div style={{ textAlign: 'center', color: '#999', marginTop: '50px' }}>
            <p>ยังไม่มีหนังสือในชั้น</p>
            <Link href="/market" style={{ color: '#333', textDecoration: 'underline', marginTop: '10px', display: 'inline-block', fontWeight: '500' }}>
              ไปเลือกซื้อหนังสือที่ Market
            </Link>
          </div>
        ) : (
          <div style={{ 
            display: 'grid', 
            gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', 
            gap: '40px 30px' 
          }}>
            {books.map((book) => (
              <div 
                key={book.id}
                onMouseEnter={() => setHoveredId(book.id)}
                onMouseLeave={() => setHoveredId(null)}
                style={{ 
                  backgroundColor: 'white',
                  border: '1px solid #f0f0f0', 
                  borderRadius: '16px', 
                  padding: '15px',
                  display: 'flex',
                  flexDirection: 'column',
                  transition: 'all 0.3s ease',
                  transform: hoveredId === book.id ? 'translateY(-8px)' : 'translateY(0)',
                  boxShadow: hoveredId === book.id ? '0 15px 30px rgba(0,0,0,0.08)' : 'none',
                  position: 'relative'
                }}
              >
                
                <Link href={`/market/${book.id}`} style={{ textDecoration: 'none' }}>
                    <div style={{ 
                        width: '100%', aspectRatio: '2/3', borderRadius: '10px', overflow: 'hidden', marginBottom: '15px', backgroundColor: '#f9f9f9', position: 'relative', cursor: 'pointer'
                    }}>
                        <img 
                        src={book.cover_image || book.image_url} 
                        alt={book.title} 
                        style={{ width: '100%', height: '100%', objectFit: 'cover' }} 
                        />
                    </div>

                    <div>
                        <h3 style={{ 
                        fontWeight: '500', fontSize: '1.05rem', color: '#2D2D2D', 
                        marginBottom: '5px', lineHeight: '1.4', height: '46px', 
                        overflow: 'hidden', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical'
                        }}>
                        {book.title}
                        </h3>
                        
                        {/* แสดงวันที่แบบดิบๆ หรือแปลงง่ายๆ */}
                        <p style={{ fontSize: '0.75rem', color: '#aaa', display: 'flex', alignItems: 'center', gap: '5px', marginBottom: '10px' }}>
                            <FaCalendarAlt /> 
                            {/* ใช้ toLocaleString() เพื่อให้มันแปลงเป็นวันที่อ่านรู้เรื่องตามเครื่อง user */}
                            ซื้อเมื่อ: {book.purchase_date ? new Date(book.purchase_date).toLocaleString() : '-'}
                        </p>
                    </div>
                </Link>

                <div style={{ marginTop: 'auto', display: 'flex', gap: '10px' }}>
                    <Link href={`/market/${book.id}`} style={{ flex: 1 }}>
                        <button style={{ width: '100%', padding: '10px', backgroundColor: 'white', color: '#555', border: '1px solid #ddd', borderRadius: '8px', cursor: 'pointer', fontSize: '0.85rem', fontWeight: '500', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '5px' }}>
                            <FaInfoCircle /> รายละเอียด
                        </button>
                    </Link>

                    <Link href={`/read/${book.id}`} style={{ flex: 1 }}>
                        <button style={{ width: '100%', padding: '10px', backgroundColor: '#2D2D2D', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer', fontSize: '0.85rem', fontWeight: '500', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '5px' }}>
                            <FaBookOpen /> อ่านเลย
                        </button>
                    </Link>
                </div>

              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}