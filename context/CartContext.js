'use client';

import { createContext, useContext, useState, useEffect } from 'react';
import { useRouter } from 'next/navigation'; // เพิ่ม useRouter

const CartContext = createContext();

export function CartProvider({ children }) {
  const [cart, setCart] = useState([]);
  const router = useRouter(); // ใช้ router เพื่อ navigate

  // โหลด cart จาก localStorage ตอนเริ่ม
  useEffect(() => {
    const storedCart = localStorage.getItem('cart');
    if (storedCart) {
      setCart(JSON.parse(storedCart));
    }
  }, []);

  // อัพเดต localStorage ทุกครั้งที่ cart เปลี่ยน
  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(cart));
  }, [cart]);

  // ฟังก์ชันเพิ่มของลงตะกร้า
  const addToCart = (book) => {
    setCart((prevCart) => {
      const existingItem = prevCart.find((item) => item.id === book.id);
      if (existingItem) {
        return prevCart; // หรือจะเพิ่ม quantity ก็ได้
      }
      return [...prevCart, book];
    });
  };

  // ฟังก์ชันเพิ่มของลงตะกร้าแล้วไปหน้า cart
  const addandgocart = (book) => {
    addToCart(book);       // ใส่หนังสือเข้า cart
    router.push('/cart');  // ไปหน้า CartPage
  };

  // ฟังก์ชันลบสินค้า
  const removeFromCart = (id) => {
    setCart((prevCart) => prevCart.filter((item) => item.id !== id));
  };

  // ฟังก์ชันล้างตะกร้า
  const clearCart = () => {
    setCart([]);
  };

  return (
    <CartContext.Provider value={{ cart, addToCart, addandgocart , removeFromCart, clearCart }}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  return useContext(CartContext);
}
