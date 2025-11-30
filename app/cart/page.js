'use client';

import { useState } from 'react';
import Link from 'next/link';
import { FaTrash } from 'react-icons/fa';
import { ethers } from 'ethers';
import { Prompt } from 'next/font/google';
import { useCart } from '@/context/CartContext';
import { useRouter } from 'next/navigation';
import CheckoutModal from '@/components/CheckoutModal';

import { getMarketplaceContract } from '@/lib/marketplace';
import { getTokenContract } from '@/lib/token';  // ใช้อันนี้แทนทุกที่
import './CartPage.css';

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

  // ❗ เหลือแค่ merchant อย่างเดียว เพราะ token address อยู่ใน lib แล้ว
  const merchantAddress = "0x183f72fb6a3daa6e1e7bdfa040e377c8dcad97ed";

  const totalPrice = cart.reduce((sum, book) => sum + parseFloat(book.price), 0);

  // 📌 ดึงยอดเงินผู้ใช้
  const fetchBalance = async () => {
    if (!window.ethereum) return;

    try {
      const provider = new ethers.BrowserProvider(window.ethereum);
      const accounts = await provider.listAccounts();

      if (accounts.length > 0) {
        const accountAddr = accounts[0].address;
        setCurrentAccount(accountAddr);

        const token = getTokenContract(provider); // ⬅ ใช้ lib
        const bal = await token.balanceOf(accountAddr);

        setUserBalance(ethers.formatEther(bal));
      }
    } catch (err) {
      console.error("Check balance error:", err);
    }
  };

  // 📌 เปิด modal พร้อมดึง balance
  const handleCheckoutClick = async () => {
    await fetchBalance();
    setIsModalOpen(true);
  };

  // 📌 กดปุ่มชำระเงิน
  const handleConfirmPayment = async () => {
    setIsProcessing(true);

    try {
      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();

      // 1️⃣ โอนเหรียญ NWN ไปให้ร้านค้า
      const token = getTokenContract(signer);  // ⬅ ใช้ lib แทนการ new contract
      const tx1 = await token.transfer(
        merchantAddress,
        ethers.parseEther(totalPrice.toString())
      );
      await tx1.wait();

      // 2️⃣ บันทึกข้อมูลหนังสือใน smart contract
      const marketplace = getMarketplaceContract(signer);

      for (let book of cart) {
        const txSale = await marketplace.recordSale(
          book.id,
          book.title,
          1,
          ethers.parseEther(book.price.toString()),
          token.target   // ⬅ address ของ token จะมาจาก contract เอง
        );
        await txSale.wait();
      }

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

      alert("ชำระเงินสำเร็จ 🎉");
      clearCart();
      setIsModalOpen(false);
      router.push('/bookshelf');

    } catch (err) {
      console.error(err);
      alert("เกิดข้อผิดพลาด: " + (err.reason || err.message));
    } finally {
      setIsProcessing(false);
    }
  };

  // ⛩ UI -----------------------------------------------------
  return (
    <div className={prompt.className + ' cartPage'}>
      <div className="cartContainer">
        <h1 className="cartTitle">ตะกร้าสินค้า</h1>

        {cart.length === 0 ? (
          <p className="emptyCart">
            ยังไม่มีสินค้าในตะกร้า <Link href="/market">ไปเลือกซื้อเลย</Link>
          </p>
        ) : (
          <>
            <div className="cartList">
              {cart.map((book) => (
                <div key={book.id} className="cartItem">
                  <img
                    src={book.cover_image || 'https://via.placeholder.com/80x120'}
                    alt={book.title}
                  />
                  <div className="cartItemContent">
                    <h3>{book.title}</h3>
                    <p className="author">{book.author || 'Unknown'}</p>
                    <p className="price">{parseFloat(book.price).toLocaleString()} NWN</p>
                  </div>
                  <button className="removeBtn" onClick={() => removeFromCart(book.id)}>
                    <FaTrash />
                  </button>
                </div>
              ))}
            </div>

            <div className="cartSummary">
              <p className="totalPrice">รวม: {totalPrice.toLocaleString()} NWN</p>
              <div className="cartActions">
                <button className="clearCartBtn" onClick={clearCart}>ล้างตะกร้า</button>
                <button className="checkoutBtn" onClick={handleCheckoutClick}>ชำระเงิน</button>
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
