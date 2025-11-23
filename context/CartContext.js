'use client';

import { createContext, useContext, useState, useEffect } from 'react';

const CartContext = createContext();

export function CartProvider({ children }) {
  const [cart, setCart] = useState([]);

  // ฟังก์ชันเพิ่มของลงตะกร้า
  const addToCart = (book) => {
    setCart((prevCart) => {
      // เช็คว่ามีเล่มนี้อยู่แล้วไหม ถ้ามีให้เพิ่มจำนวน (หรือจะใส่ซ้ำก็ได้แล้วแต่ logic)
      const existingItem = prevCart.find((item) => item.id === book.id);
      if (existingItem) {
        return prevCart; // ถ้ามีแล้ว ไม่ต้องทำอะไร (หรือจะเพิ่ม quantity ก็ได้)
      }
      return [...prevCart, book];
    });
    // alert(`ใส่ตะกร้าเรียบร้อย: ${book.title}`);
  };

  return (
    <CartContext.Provider value={{ cart, addToCart }}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  return useContext(CartContext);
}