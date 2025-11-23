'use client';

import { useCart } from '@/context/CartContext';
import { Prompt } from 'next/font/google';
import Link from 'next/link';
import { FaTrash } from 'react-icons/fa';

const prompt = Prompt({
  subsets: ['thai', 'latin'],
  weight: ['300', '400', '500', '600'],
});

export default function CartPage() {
  const { cart, removeFromCart, clearCart } = useCart();

  const totalPrice = cart.reduce((sum, book) => sum + parseFloat(book.price), 0);

  return (
    <div className={prompt.className} style={{ minHeight: '100vh', padding: '60px 20px', backgroundColor: '#ffebd6' }}>
      <div style={{ maxWidth: '900px', margin: '0 auto' }}>
        <h1 style={{ fontSize: '2rem',color: '#333333ff', fontWeight: '600', marginBottom: '20px' }}>ตะกร้าสินค้า</h1>

        {cart.length === 0 ? (
          <p style={{ textAlign: 'center', color: '#333333ff' ,  fontWeight: '300', marginTop: '50px' }}>
            ยังไม่มีสินค้าภายในตะกร้า <Link href="/market" style={{ color: '#333333ff', fontWeight: '500' }}>ไปซื้อหนังสือ</Link>
          </p>
        ) : (
          <>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
              {cart.map((book) => (
                <div key={book.id} style={{ display: 'flex', alignItems: 'center', background: 'white', padding: '10px', borderRadius: '12px', boxShadow: '0 4px 10px rgba(0,0,0,0.05)' }}>
                  <img src={book.cover_image || 'https://via.placeholder.com/80x120'} alt={book.title} style={{ width: '80px', height: '120px', objectFit: 'cover', borderRadius: '8px', marginRight: '15px' }} />
                  <div style={{ flexGrow: 1 }}>
                    <h3 style={{ fontWeight: '500', fontSize: '1rem', color: '#333' }}>{book.title}</h3>
                    <p style={{ fontSize: '0.85rem', color: '#999' }}>{book.author || 'Unknown Author'}</p>
                    <p style={{ fontWeight: '600', color: '#D9534F' }}>{parseFloat(book.price).toLocaleString()} NWN</p>
                  </div>
                  <button onClick={() => removeFromCart(book.id)} style={{ color: '#D9534F', fontSize: '1.2rem', cursor: 'pointer', border: 'none', background: 'transparent' }} title="Remove from Cart">
                    <FaTrash />
                  </button>
                </div>
              ))}
            </div>

            <div style={{ marginTop: '30px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <p style={{ fontWeight: '600',color: '#333333ff', fontSize: '1.2rem' }}>รวม: {totalPrice.toLocaleString()} NWN</p>
              <div style={{ display: 'flex', gap: '10px' }}>
                <button onClick={clearCart} style={{ padding: '10px 20px', borderRadius: '30px', background: '#D9534F', color: 'white', border: 'none', cursor: 'pointer' }}>
                  ล้างตะกร้า
                </button>
                <button style={{ padding: '10px 20px', borderRadius: '30px', background: '#333', color: 'white', border: 'none', cursor: 'pointer' }}>
                  ชำระเงิน
                </button>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
