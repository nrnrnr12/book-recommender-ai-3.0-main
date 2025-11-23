'use client';

import { useCart } from '@/context/CartContext';
import { Prompt } from 'next/font/google';
import Link from 'next/link';
import { FaTrash } from 'react-icons/fa';
import { ethers } from 'ethers';
import { getTokenContract } from '@/lib/token'; // ไฟล์ของคุณ

const prompt = Prompt({
  subsets: ['thai', 'latin'],
  weight: ['300', '400', '500', '600'],
});

export default function CartPage() {
  const { cart, removeFromCart, clearCart } = useCart();

  const totalPrice = cart.reduce((sum, book) => sum + parseFloat(book.price), 0);

  const handleCheckout = async () => {
    if (cart.length === 0) {
      alert("ตะกร้าคุณว่าง ไม่มีสินค้าให้ชำระ");
      return;
    }

    if (!window.ethereum) {
      alert("โปรดติดตั้ง MetaMask");
      return;
    }

    try {
      await window.ethereum.request({ method: "eth_requestAccounts" });
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner();
      const tokenContract = getTokenContract(signer);

      const RECEIVER_ADDRESS = "0x04eb3c4544090e5e70f1ce07a0f864c0048f517c"; // เปลี่ยนเป็น address ร้านของคุณ
      const decimals = await tokenContract.decimals();
      const amount = ethers.utils.parseUnits(totalPrice.toString(), decimals);

      // ทำการโอน token NWN
      const tx = await tokenContract.transfer(RECEIVER_ADDRESS, amount);
      await tx.wait();

      alert(`ชำระเงินเรียบร้อย! ยอดรวม: ${totalPrice.toLocaleString()} NWN`);
      clearCart();
    } catch (err) {
      console.error(err);
      alert("เกิดข้อผิดพลาดในการชำระเงิน");
    }
  };

  return (
    <div className={prompt.className} style={{ minHeight: '100vh', padding: '60px 20px', backgroundColor: '#ffebd6' }}>
      <div style={{ maxWidth: '900px', margin: '0 auto' }}>
        <h1 style={{ fontSize: '2rem', color: '#333333ff', fontWeight: '600', marginBottom: '20px' }}>ตะกร้าสินค้า</h1>

        {cart.length === 0 ? (
          <p style={{ textAlign: 'center', color: '#333333ff', fontWeight: '300', marginTop: '50px' }}>
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
              <p style={{ fontWeight: '600', color: '#333333ff', fontSize: '1.2rem' }}>รวม: {totalPrice.toLocaleString()} NWN</p>
              <div style={{ display: 'flex', gap: '10px' }}>
                <button onClick={clearCart} style={{ padding: '10px 20px', borderRadius: '30px', background: '#D9534F', color: 'white', border: 'none', cursor: 'pointer' }}>
                  ล้างตะกร้า
                </button>
                <button onClick={handleCheckout} style={{ padding: '10px 20px', borderRadius: '30px', background: '#333', color: 'white', border: 'none', cursor: 'pointer' }}>
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
