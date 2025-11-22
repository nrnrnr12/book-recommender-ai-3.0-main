'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { FaBook, FaShoppingCart } from 'react-icons/fa';
import { Prompt } from 'next/font/google';

const prompt = Prompt({
  subsets: ['thai', 'latin'],
  weight: ['300', '400', '500', '600', '700'],
});

export default function Navbar() {
  const [account, setAccount] = useState(null);
  const [tokenBalance, setTokenBalance] = useState(0);

  useEffect(() => {
    checkWalletConnection();
  }, []);

  const checkWalletConnection = async () => {
    if (typeof window.ethereum !== 'undefined') {
      try {
        const accounts = await window.ethereum.request({ method: 'eth_accounts' });
        if (accounts.length > 0) {
          setAccount(accounts[0]);
        }
        
        window.ethereum.on('accountsChanged', (accounts) => {
            setAccount(accounts.length > 0 ? accounts[0] : null);
        });

      } catch (error) {
        console.error("Error checking wallet:", error);
      }
    }
  };

  const connectWallet = async () => {
    if (typeof window.ethereum !== 'undefined') {
      try {
        const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
        setAccount(accounts[0]);
      } catch (error) {
        alert("User rejected connection");
      }
    } else {
      alert("Please install MetaMask!");
      window.open('https://metamask.io/', '_blank');
    }
  };

  const formatAddress = (addr) => {
      return addr ? `${addr.substring(0, 6)}...${addr.substring(addr.length - 4)}` : '';
  };

  return (
    <nav 
      className={prompt.className} 
      style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: '15px 40px',
        
        // --- ส่วนที่ทำให้เกาะติดด้านบน (Sticky) ---
        position: 'sticky', 
        top: 0, 
        zIndex: 1000, // ตัวเลขสูงๆ เพื่อให้ลอยอยู่เหนือเนื้อหาอื่น
        
        // --- ตกแต่งให้สวยงาม ---
        backgroundColor: 'rgba(255, 255, 255, 0.95)', // พื้นหลังขาวโปร่งแสงนิดๆ
        backdropFilter: 'blur(10px)', // เอฟเฟกต์เบลอฉากหลัง (เหมือนกระจกฝ้า)
        borderBottom: '1px solid rgba(0,0,0,0.05)', 
        boxShadow: '0 4px 30px rgba(0,0,0,0.03)', // เงาจางๆ ด้านล่าง
    }}>
      {/* --- Logo --- */}
      <div style={{ display: 'flex', alignItems: 'center' }}>
        <Link href="/">
            <Image 
                src="/images/logo.png" 
                alt="Logo" 
                width={50} 
                height={50} 
                style={{ objectFit: 'contain', cursor: 'pointer' }} 
            />
        </Link>
      </div>

      {/* --- เมนูขวา --- */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '25px' }}>
        
        {!account ? (
          <button 
            onClick={connectWallet}
            style={{
              backgroundColor: '#333',
              color: 'white',
              border: 'none',
              padding: '10px 20px',
              borderRadius: '30px',
              cursor: 'pointer',
              fontSize: '0.9rem',
              fontWeight: '500',
              fontFamily: 'inherit'
            }}
          >
            Connect Wallet
          </button>
        ) : (
          <div style={{ display: 'flex', alignItems: 'center', gap: '25px' }}>
            
            {/* ส่วนแสดงผล Token และ Address */}
            <div style={{ 
                display: 'flex', 
                flexDirection: 'column', 
                fontSize: '0.95rem', 
                fontWeight: '600',
                color: '#000', 
                gap: '4px' 
            }}>
                <div style={{ 
                    borderBottom: '1px solid #000', 
                    paddingBottom: '2px', 
                    minWidth: '200px' 
                }}>
                    Token Balance : {tokenBalance} NWN
                </div>
                <div style={{ 
                    borderBottom: '1px solid #000', 
                    paddingBottom: '2px', 
                    minWidth: '200px' 
                }}>
                    Address : {formatAddress(account)}
                </div>
            </div>

            {/* ปุ่ม Buy Token */}
            <Link href="/buy-token" style={{ textDecoration: 'none', color: 'black', fontWeight: '600', fontSize: '1rem', borderBottom: '2px solid black' }}>
                Buy Token
            </Link>

            {/* Icons */}
            <Link href="/market" title="Marketplace" style={{ fontSize: '1.6rem', color: '#333', display: 'flex', transition: 'transform 0.2s' }}>
               <FaShoppingCart />
            </Link>

            <Link href="/book" title="book recommend" style={{ fontSize: '1.6rem', color: '#333', display: 'flex', transition: 'transform 0.2s' }}>
               <FaBook /> 
            </Link>

          </div>
        )}

      </div>
    </nav>
  );
}