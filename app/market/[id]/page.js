'use client';

import { useState, useEffect } from 'react';
import { Prompt } from 'next/font/google';
import { FaShoppingCart, FaStar, FaShoppingBag } from 'react-icons/fa';
import { useCart } from '@/context/CartContext';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';

const prompt = Prompt({
  subsets: ['thai', 'latin'],
  weight: ['300', '400', '500', '600', '700'],
});

export default function BookDetailPage() {
  const { id } = useParams();
  const [book, setBook] = useState(null);
  const [loading, setLoading] = useState(true);
  const { addToCart, cart } = useCart(); 
  const router = useRouter();

  useEffect(() => {
    if (id) {
      fetch(`/api/market/${id}`)
        .then((res) => res.json())
        .then((data) => {
          setBook(data);
          setLoading(false);
        })
        .catch((err) => console.error(err));
    }
  }, [id]);

  if (loading) return <div className={`p-20 text-center text-black ${prompt.className}`}>Loading...</div>;
  if (!book || book.error) return <div className="text-center p-20 text-black">Book not found</div>;

  return (
    <div className={prompt.className} style={{ minHeight: '100vh', backgroundColor: '#ffebd6', padding: '60px 20px' }}>
      
      <div style={{ 
        backgroundColor: 'white', 
        maxWidth: '1000px', 
        margin: '0 auto', 
        borderRadius: '8px', 
        overflow: 'visible', 
        boxShadow: '0 4px 15px rgba(0,0,0,0.05)',
        position: 'relative' 
      }}>

        {/* (ส่วนเนื้อหาที่เหลือเหมือนเดิมครับ) */}
        <div style={{ backgroundColor: 'black', color: 'white', padding: '15px 30px', fontSize: '1.2rem', fontWeight: '500', borderTopLeftRadius: '8px', borderTopRightRadius: '8px' }}>
          รายละเอียดเพิ่มเติม : {book.title}
        </div>

        <div style={{ display: 'flex', flexDirection: 'row', flexWrap: 'wrap', padding: '40px' }}>
          <div style={{ flex: '1', minWidth: '300px', paddingRight: '40px', display: 'flex', flexDirection: 'column', gap: '15px' }}>
             <div style={{ width: '100%', aspectRatio: '2/3', backgroundColor: '#ddd', borderRadius: '4px', overflow: 'hidden', boxShadow: '0 5px 15px rgba(0,0,0,0.1)' }}>
                <img src={book.cover_image} alt={book.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
             </div>
             <button 
                onClick={() => router.push(`/read/${book.id}`)} // <-- เพิ่มบรรทัดนี้  
                style={{ width: '100%', padding: '10px', border: '1px solid #ddd', borderRadius: '4px', backgroundColor: 'white', color: '#555', cursor: 'pointer', fontWeight: '500' }}>
                ทดลองอ่าน
             </button>
          </div>

          <div style={{ flex: '1.5', minWidth: '300px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <h1 style={{ fontSize: '1.8rem', fontWeight: 'bold', color: '#333', marginBottom: '10px' }}>{book.title}</h1>
            
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
              <span style={{ color: '#888', minWidth: '60px' }}>นักเขียน :</span>
              <span style={{ border: '1px solid #eee', padding: '2px 10px', borderRadius: '20px', fontSize: '0.85rem', color: '#555' }}>{book.author || '-'}</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
               <span style={{ color: '#888', minWidth: '60px' }}>นักแปล :</span>
               <span style={{ border: '1px solid #eee', padding: '2px 10px', borderRadius: '20px', fontSize: '0.85rem', color: '#555' }}>{book.translator || '-'}</span>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '5px', color: '#D9534F' }}>
               {[...Array(5)].map((_, i) => <FaStar key={i} style={{ opacity: i < 4 ? 1 : 0.3 }} />)}
               <span style={{ color: '#888', fontSize: '0.9rem', marginLeft: '5px' }}>0 (รีวิว)</span>
            </div>

            <div style={{ display: 'flex', gap: '10px', marginTop: '5px' }}>
               <span style={{ border: '1px solid #eee', padding: '4px 12px', borderRadius: '20px', fontSize: '0.8rem', color: '#555' }}>{book.category}</span>
               <span style={{ border: '1px solid #eee', padding: '4px 12px', borderRadius: '20px', fontSize: '0.8rem', color: '#555' }}>ภาษาต้นฉบับ: {book.original_language || '-'}</span>
            </div>

            <p style={{ color: '#666', lineHeight: '1.6', fontSize: '0.95rem' }}>{book.description || 'ไม่มีคำอธิบายสินค้า'}</p>

            <div style={{ fontSize: '2rem', fontWeight: 'bold', color: '#333', marginTop: '10px' }}>
              {parseFloat(book.price).toLocaleString()} <span style={{ fontSize: '1rem' }}>NWN</span>
            </div>

            <div style={{ display: 'flex', gap: '15px', marginTop: '10px' }}>
               <button style={{ backgroundColor: '#D9534F', color: 'white', border: 'none', padding: '12px 30px', borderRadius: '5px', fontSize: '1rem', fontWeight: 'bold', cursor: 'pointer' }}>ซื้อเลย</button>
               <button onClick={() => addToCart(book)} style={{ backgroundColor: 'white', color: '#333', border: '1px solid #ccc', padding: '12px 30px', borderRadius: '5px', fontSize: '1rem', fontWeight: 'bold', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px' }}>
                 <FaShoppingCart /> ใส่ตะกร้า
               </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}