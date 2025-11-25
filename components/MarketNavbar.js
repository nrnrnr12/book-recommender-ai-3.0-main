'use client';

import Link from 'next/link';
import { FaShoppingBag } from 'react-icons/fa';
import { useCart } from '@/context/CartContext';
import { Prompt } from 'next/font/google';
import './MarketNavbar.css';   // ← ดึง CSS เข้ามา

const prompt = Prompt({
  subsets: ['thai', 'latin'],
  weight: ['400', '600'],
});

export default function MarketNavbar() {
  const { cart } = useCart();

  return (
    <div className={`market-navbar ${prompt.className}`}>
      <Link href="/cart" className="cart-button">
        <div className="cart-icon-wrapper">
          <FaShoppingBag className="cart-icon" />
          {cart.length > 0 && (
            <span className="cart-badge">{cart.length}</span>
          )}
        </div>

        <span className="cart-text">My Cart</span>
      </Link>
    </div>
  );
}
