'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { FaBook, FaShoppingCart } from 'react-icons/fa';
import { ethers } from 'ethers';
import IERC20 from "@/abi/abitoken.json";
import { Prompt } from 'next/font/google';

const prompt = Prompt({
  subsets: ['thai', 'latin'],
  weight: ['300', '400', '500', '600', '700'],
});

export default function Navbar() {
  const [account, setAccount] = useState(null);
  const [ethBalance, setEthBalance] = useState(0);
  const [tokenBalance, setTokenBalance] = useState(0);

  // 👉 ตั้งค่า token contract address ของคุณ
  const tokenAddress = "0x30b32EE29623350E94206Ce0f83483E5cAF69416";

  useEffect(() => {
    checkWalletConnection();
  }, []);

  useEffect(() => {
    if (account) {
      loadBalances();
    }
  }, [account]);

  const checkWalletConnection = async () => {
    if (typeof window.ethereum !== 'undefined') {
      try {
        const accounts = await window.ethereum.request({ method: 'eth_accounts' });
        if (accounts.length > 0) {
          setAccount(accounts[0]);
        }
        
        // Detect เมื่อสลับบัญชีใน MetaMask  
        window.ethereum.on('accountsChanged', (accounts) => {
          setAccount(accounts.length > 0 ? accounts[0] : null);
        });

      } catch (error) {
        console.error("Error checking wallet:", error);
      }
    }
  };

  const loadBalances = async () => {
    try {
      const provider = new ethers.BrowserProvider(window.ethereum);

      // ⭐ โหลดยอด ETH
      const bal = await provider.getBalance(account);
      setEthBalance(ethers.formatEther(bal));

      // ⭐ โหลดยอด Token จาก Smart Contract
      const token = new ethers.Contract(tokenAddress, IERC20, provider);
      const tokenBal = await token.balanceOf(account);
      setTokenBalance(ethers.formatEther(tokenBal));

    } catch (err) {
      console.error("Error loading balances:", err);
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
        position: 'sticky', 
        top: 0, 
        zIndex: 1000,
        backgroundColor: 'rgba(255, 255, 255, 0.95)',
        backdropFilter: 'blur(10px)',
        borderBottom: '1px solid rgba(0,0,0,0.05)', 
        boxShadow: '0 4px 30px rgba(0,0,0,0.03)',
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

      {/* --- Right Menu --- */}
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

            {/* Balance + Address */}
            <div style={{ 
              display: 'flex', 
              flexDirection: 'column', 
              fontSize: '0.95rem', 
              fontWeight: '600',
              color: '#000', 
              gap: '4px' 
            }}>

              <div style={{ borderBottom: '1px solid #000', paddingBottom: '2px', minWidth: '200px' }}>
                ETH Balance : {ethBalance}
              </div>

              <div style={{ borderBottom: '1px solid #000', paddingBottom: '2px', minWidth: '200px' }}>
                Token Balance : {tokenBalance} NWN
              </div>

              <div style={{ borderBottom: '1px solid #000', paddingBottom: '2px', minWidth: '200px' }}>
                Address : {formatAddress(account)}
              </div>
            </div>

            {/* Buy Token Button */}
            <Link href="/buy-token" style={{ textDecoration: 'none', color: 'black', fontWeight: '600', fontSize: '1rem', borderBottom: '2px solid black' }}>
              Buy Token
            </Link>

            {/* Icons */}
            <Link href="/market" title="Marketplace" style={{ fontSize: '1.6rem', color: '#333' }}>
               <FaShoppingCart />
            </Link>

            <Link href="/book" title="book recommend" style={{ fontSize: '1.6rem', color: '#333' }}>
               <FaBook /> 
            </Link>

          </div>
        )}

      </div>
    </nav>
  );
}
