'use client';

import { useState, useEffect } from 'react';
import { useCart } from '@/context/CartContext';
import { Prompt } from 'next/font/google';
import Link from 'next/link';
import { FaTrash } from 'react-icons/fa';
import { ethers } from 'ethers';
import { useRouter } from 'next/navigation';
import CheckoutModal from '@/components/CheckoutModal';
import IERC20 from "@/abi/abitoken.json";
import { getMarketplaceContract } from "@/lib/marketplace";
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

  const tokenAddress = "0x28F935a443189a57a3ec7C8c753Cd53D4aB72803"; 
  const merchantAddress = "0x183f72fb6a3daa6e1e7bdfa040e377c8dcad97ed"; 

  const totalPrice = cart.reduce((sum, book) => sum + parseFloat(book.price), 0);

  // ดึงยอดเงินผู้ใช้
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
    await fetchBalance();
    setIsModalOpen(true);
  };

  const handleConfirmPayment = async () => {
    setIsProcessing(true);
    try {
      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();

      // 1️⃣ โอนเหรียญ NWN ไป Merchant
      const tokenContract = new ethers.Contract(tokenAddress, IERC20, signer);
      const txToken = await tokenContract.transfer(
        merchantAddress,
        ethers.parseEther(totalPrice.toString())
      );
      await txToken.wait();

      // 2️⃣ บันทึกแต่ละหนังสือลง Smart Contract
      const marketplace = getMarketplaceContract(signer);
      for (let book of cart) {
        const txSale = await marketplace.recordSale(
          book.id,
          book.title,
          1,
          ethers.parseEther(book.price.toString()),
          tokenAddress
        );
        await txSale.wait();
      }

      alert("ชำระเงินสำเร็จ! หนังสือถูกเพิ่มเข้าชั้นหนังสือแล้ว 🎉");
      clearCart();
      setIsModalOpen(false);
      router.push('/bookshelf');
    } catch (error) {
      console.error(error);
      alert("การชำระเงินล้มเหลว: " + (error.reason || error.message));
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className={prompt.className + ' cartPage'}>
      <div className="cartContainer">
        <h1 className="cartTitle">ตะกร้าสินค้า</h1>
        {cart.length === 0 ? (
          <p className="emptyCart">
            ยังไม่มีสินค้าภายในตะกร้า <Link href="/market">ไปซื้อหนังสือ</Link>
          </p>
        ) : (
          <>
            <div className="cartList">
              {cart.map((book) => (
                <div key={book.id} className="cartItem">
                  <img src={book.cover_image || 'https://via.placeholder.com/80x120'} alt={book.title} />
                  <div className="cartItemContent">
                    <h3>{book.title}</h3>
                    <p className="author">{book.author || 'Unknown Author'}</p>
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
