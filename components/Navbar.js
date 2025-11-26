'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { FaBook, FaShoppingCart } from 'react-icons/fa';
import { ethers } from 'ethers';
import { Prompt } from 'next/font/google';
import { useCart } from '@/context/CartContext';
import { usePathname } from 'next/navigation';
import { GiBookshelf } from "react-icons/gi";
import { getTokenContract } from "@/lib/token";   // ✅ ดึงจาก lib
import "./Navbar.css"; 

const prompt = Prompt({
  subsets: ['thai', 'latin'],
  weight: ['300', '400', '500', '600', '700'],
});

export default function Navbar() {
  const pathname = usePathname();

  const [account, setAccount] = useState(null);
  const [ethBalance, setEthBalance] = useState(0);
  const [tokenBalance, setTokenBalance] = useState(0);
  const { cart } = useCart();

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

      // ETH Balance
      const bal = await provider.getBalance(account);
      setEthBalance(parseFloat(ethers.formatEther(bal)).toFixed(4));

      // Token balance (ใช้ lib เรียก contract)
      const tokenContract = getTokenContract(provider);   // ✅ ใช้ lib
      const tokenBal = await tokenContract.balanceOf(account);
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

  // Hide navbar on reading page
  if (pathname.startsWith('/read')) {
    return null;
  }

  return (
    <nav className={`${prompt.className} navbar`}>

      {/* Logo */}
      <div className="logoContainer">
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

      {/* Right Menu */}
      <div className="rightMenu">

        {!account ? (
          <button onClick={connectWallet} className="connectBtn">
            Connect Wallet
          </button>
        ) : (
          <div className="rightMenu">

            {/* Wallet Info */}
            <div className="walletInfo">
              <div className="walletRow">ETH : {ethBalance}</div>
              <div className="walletRow">Token : {tokenBalance} NWN</div>
              <div className="walletRow">Addr : {formatAddress(account)}</div>
            </div>

            <Link href="/buy-token" className="buyTokenLink">
              Buy Token
            </Link>

            {/* Bookshelf */}
            <Link href="/bookshelf" title="Bookshelf" className="iconWrapper">
              <GiBookshelf />
            </Link>

            {/* Cart */}
            <Link href="/market" title="Marketplace" className="iconWrapper">
              <FaShoppingCart />
              {cart.length > 0 && (
                <span className="cartBadge">{cart.length}</span>
              )}
            </Link>

            {/* Book Recommend */}
            <Link href="/book" title="Book Recommend" className="iconWrapper">
              <FaBook />
            </Link>

          </div>
        )}
      </div>
    </nav>
  );
}
