'use client';

import { useState, useEffect } from 'react';
import { Prompt } from 'next/font/google';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

const prompt = Prompt({ subsets: ['thai', 'latin'], weight: ['300', '400', '600'] });

export default function BookshelfPage() {
  const [books, setBooks] = useState([]);
  const [account, setAccount] = useState(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    // ตรวจสอบ Wallet
    const checkWallet = async () => {
      if (typeof window.ethereum !== 'undefined') {
        const accounts = await window.ethereum.request({ method: 'eth_accounts' });
        if (accounts.length > 0) {
          setAccount(accounts[0]);
          fetchMyBooks(accounts[0]);
        } else {
          setLoading(false); // ไม่ได้เชื่อมเป๋า
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

  if (!account) return <div className={`p-20 text-center text-black ${prompt.className}`}>กรุณาเชื่อมต่อกระเป๋าเพื่อดูชั้นหนังสือของคุณ</div>;
  if (loading) return <div className={`p-20 text-center text-black ${prompt.className}`}>Loading Library...</div>;

  return (
    <div className={prompt.className} style={{ minHeight: '100vh', backgroundColor: '#FFF0E0', padding: '60px 20px' }}>
      <div style={{ maxWidth: '1100px', margin: '0 auto' }}>
        
        <div style={{ textAlign: 'center', marginBottom: '50px' }}>
          <h1 style={{ fontSize: '2.2rem', fontWeight: '600', color: '#2D2D2D' }}>My Bookshelf 📚</h1>
          <p style={{ color: '#888', fontWeight: '300' }}>หนังสือทั้งหมดที่คุณเป็นเจ้าของ</p>
        </div>

        {books.length === 0 ? (
          <div style={{ textAlign: 'center', color: '#999' }}>
            <p>ยังไม่มีหนังสือในชั้น</p>
            <Link href="/market" style={{ color: '#333', textDecoration: 'underline', marginTop: '10px', display: 'inline-block' }}>
              ไปเลือกซื้อหนังสือ
            </Link>
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: '30px' }}>
            {books.map((book) => (
              <div key={book.id} style={{ backgroundColor: 'white', borderRadius: '12px', padding: '15px', display: 'flex', flexDirection: 'column', boxShadow: '0 4px 10px rgba(0,0,0,0.05)' }}>
                
                {/* คลิกเพื่อไปหน้าอ่าน */}
                <div style={{ cursor: 'pointer' }} onClick={() => router.push(`/read/${book.id}`)}>
                    <div style={{ width: '100%', aspectRatio: '2/3', borderRadius: '8px', overflow: 'hidden', marginBottom: '15px', backgroundColor: '#f9f9f9' }}>
                        <img src={book.cover_image} alt={book.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    </div>
                    <h3 style={{ fontWeight: '500', fontSize: '1rem', color: '#333', marginBottom: '5px', height: '44px', overflow: 'hidden' }}>{book.title}</h3>
                    <p style={{ fontSize: '0.85rem', color: '#999' }}>{book.author}</p>
                </div>

                {/* ปุ่มอ่าน */}
                <button 
                    onClick={() => router.push(`/read/${book.id}`)}
                    style={{ marginTop: '15px', width: '100%', padding: '10px', backgroundColor: '#333', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer' }}
                >
                    อ่านหนังสือ
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}