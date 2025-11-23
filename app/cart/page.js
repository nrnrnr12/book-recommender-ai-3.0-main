'use client';

import { useState } from 'react';
import { useCart } from '@/context/CartContext';
import { Prompt } from 'next/font/google';
import Link from 'next/link';
import { FaTrash } from 'react-icons/fa';
import { ethers } from 'ethers';
import { useRouter } from 'next/navigation';
import CheckoutModal from '@/components/CheckoutModal';
import IERC20 from "@/abi/abitoken.json";

const prompt = Prompt({
  subsets: ['thai', 'latin'],
  weight: ['300', '400', '500', '600'],
});

export default function CartPage() {
  const { cart, removeFromCart, clearCart } = useCart();
  const router = useRouter();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [userBalance, setUserBalance] = useState(0);
  const [isProcessing, setIsProcessing] = useState(false);
  const [currentAccount, setCurrentAccount] = useState(null);

  // ⚙️ ตั้งค่า Address
  const tokenAddress = "0x28F935a443189a57a3ec7C8c753Cd53D4aB72803"; // Contract Address
  
  // 🔴 สำคัญ: ใส่เลขกระเป๋าของคุณ (Admin/คนขาย) ที่จะรับเงิน NWN
  const merchantAddress = "0x183f72fb6a3daa6e1e7bdfa040e377c8dcad97ed"; 

  const totalPrice = cart.reduce((sum, book) => sum + parseFloat(book.price), 0);

  // ฟังก์ชันดึงยอดเงิน
  const fetchBalance = async () => {
    if (typeof window.ethereum !== 'undefined') {
      try {
        const provider = new ethers.BrowserProvider(window.ethereum);
        const accounts = await provider.listAccounts();
        
        if (accounts.length > 0) {
            const accountAddr = accounts[0].address;
            setCurrentAccount(accountAddr);

            const token = new ethers.Contract(tokenAddress, IERC20, provider);
            const bal = await token.balanceOf(accountAddr);
            setUserBalance(ethers.formatEther(bal));
        }
      } catch (error) {
        console.error("Check balance error:", error);
      }
    }
  };

  const handleCheckoutClick = async () => {
    if (typeof window.ethereum !== 'undefined') {
        await fetchBalance();
        setIsModalOpen(true);
    } else {
        alert("กรุณาติดตั้ง MetaMask");
    }
  };

  const handleConfirmPayment = async () => {
    setIsProcessing(true);
    try {
      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      const tokenContract = new ethers.Contract(tokenAddress, IERC20, signer);

      // 1. โอนเหรียญ (Transfer Token)
      const tx = await tokenContract.transfer(merchantAddress, ethers.parseEther(totalPrice.toString()));
      await tx.wait(); 

      // 2. บันทึกลง Database
      const saveRes = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            wallet_address: currentAccount, 
            items: cart
        })
      });

      if (!saveRes.ok) throw new Error("บันทึกข้อมูลไม่สำเร็จ");

      alert("ชำระเงินสำเร็จ! หนังสือถูกเพิ่มเข้าชั้นหนังสือแล้ว 🎉");
      
      clearCart();
      setIsModalOpen(false);
      router.push('/bookshelf'); // ไปหน้าชั้นหนังสือ

    } catch (error) {
      console.error(error);
      alert("การชำระเงินล้มเหลว: " + (error.reason || error.message));
    } finally {
      setIsProcessing(false);
    }
  };

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
                <button 
                    onClick={handleCheckoutClick}
                    style={{ padding: '10px 20px', borderRadius: '30px', background: '#333', color: 'white', border: 'none', cursor: 'pointer' }}
                >
                  ชำระเงิน
                </button>
              </div>
            </div>
          </>
        )}
      </div>

      <CheckoutModal 
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        total={totalPrice}
        balance={userBalance}
        onConfirm={handleConfirmPayment}
        isProcessing={isProcessing}
      />

    </div>
  );
}