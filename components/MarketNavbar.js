'use client';

import Link from 'next/link';
import { FaShoppingBag } from 'react-icons/fa';
import { useCart } from '@/context/CartContext';
import { Prompt } from 'next/font/google';

const prompt = Prompt({
  subsets: ['thai', 'latin'],
  weight: ['400', '600'],
});

export default function MarketNavbar() {
  const { cart } = useCart();

  return (
    <div className={prompt.className} style={{
      // จัดตำแหน่ง Sticky
      position: 'sticky',
      top: '85px', // ปรับลงมาจาก Navbar หลักนิดหน่อย
      zIndex: 90,
      
      // Layout
      display: 'flex',
      justifyContent: 'flex-end',
      padding: '10px 40px',
      maxWidth: '100%', // ให้กว้างเต็มจอ (แต่ปุ่มจะชิดขวาตาม flex-end)
      margin: '0 auto',
      
      // *** สำคัญ: กำหนดพื้นหลังให้โปร่งใส ***
      backgroundColor: 'transparent', 
      
      // ให้กดทะลุพื้นที่ว่างๆ ได้ (จะได้ไม่บังเนื้อหาข้างล่าง)
      pointerEvents: 'none', 
    }}>
      
      {/* ตัวปุ่มตะกร้า (เปิดให้กดได้เฉพาะตรงนี้) */}
      <Link href="/cart" style={{ pointerEvents: 'auto', textDecoration: 'none' }}>
        <div style={{
          backgroundColor: 'white', // ตัวปุ่มเป็นสีขาว
          display: 'flex',
          alignItems: 'center',
          gap: '10px',
          padding: '10px 20px',
          borderRadius: '50px',
          boxShadow: '0 4px 15px rgba(0,0,0,0.1)',
          border: '1px solid #eee',
          cursor: 'pointer',
          transition: 'transform 0.2s',
        }}
        onMouseOver={(e) => e.currentTarget.style.transform = 'scale(1.05)'}
        onMouseOut={(e) => e.currentTarget.style.transform = 'scale(1)'}
        >
          
          <div style={{ position: 'relative', display: 'flex' }}>
            <FaShoppingBag style={{ fontSize: '1.4rem', color: '#333' }} />
            
            {cart.length > 0 && (
              <span style={{
                position: 'absolute',
                top: '-5px',
                right: '-5px',
                backgroundColor: '#D9534F',
                color: 'white',
                fontSize: '0.7rem',
                fontWeight: 'bold',
                borderRadius: '50%',
                width: '18px',
                height: '18px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                border: '2px solid white'
              }}>
                {cart.length}
              </span>
            )}
          </div>

          <span style={{ color: '#333', fontWeight: '600', fontSize: '0.9rem' }}>
             My Cart
          </span>
          
        </div>
      </Link>

    </div>
  );
}