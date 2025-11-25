'use client';

import { useState, useEffect } from 'react';
import { Prompt } from 'next/font/google';
import { FaShoppingCart, FaStar, FaShoppingBag } from 'react-icons/fa';
import { useCart } from '@/context/CartContext';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import './BookDetailPage.css';


const prompt = Prompt({
  subsets: ['thai', 'latin'],
  weight: ['300', '400', '500', '600', '700'],
});

export default function BookDetailPage() {
  const { id } = useParams();
  const [book, setBook] = useState(null);
  const [loading, setLoading] = useState(true);
  const { addToCart, cart } = useCart(); 
  const router = useRouter();
  const { addandgocart } = useCart();


  useEffect(() => {
    if (id) {
      fetch(`/api/market/${id}`)
        .then((res) => res.json())
        .then((data) => {
          setBook(data);
          setLoading(false);
        })
        .catch((err) => console.error(err));
    }
  }, [id]);

  if (loading) return <div className={`p-20 text-center text-black ${prompt.className}`}>Loading...</div>;
  if (!book || book.error) return <div className="text-center p-20 text-black">Book not found</div>;

  return (
    <div className={`${prompt.className} bookDetailPage`}>
      <div className="bookDetailContainer">
        <div className="bookDetailHeader">รายละเอียดเพิ่มเติม : {book.title}</div>

        <div className="bookDetailBody">
          <div className="bookDetailLeft">
            <div className="bookCover">
              <img src={book.cover_image} alt={book.title} />
            </div>
            <button className="readBtn" onClick={() => router.push(`/read/${book.id}`)}>ทดลองอ่าน</button>
          </div>

          <div className="bookDetailRight">
            <h1 className="bookTitle">{book.title}</h1>

            <div className="bookInfoRow">
              <span className="bookInfoLabel">นักเขียน :</span>
              <span className="bookInfoValue">{book.author || '-'}</span>
            </div>
            <div className="bookInfoRow">
              <span className="bookInfoLabel">นักแปล :</span>
              <span className="bookInfoValue">{book.translator || '-'}</span>
            </div>

            <div className="bookRating">
              {[...Array(5)].map((_, i) => <FaStar key={i} style={{ opacity: i < 4 ? 1 : 0.3 }} />)}
              <span>0 (รีวิว)</span>
            </div>

            <div className="bookTags">
              <span>{book.category}</span>
              <span>ภาษาต้นฉบับ: {book.original_language || '-'}</span>
            </div>

            <p className="bookDescription">{book.description || 'ไม่มีคำอธิบายสินค้า'}</p>

            <div className="bookPrice">
              {parseFloat(book.price).toLocaleString()} <span>NWN</span>
            </div>

            <div className="bookActions">
              <button className="buyBtn" onClick={() => addandgocart(book)}>ซื้อเลย </button>
              <button className="addCartBtn" onClick={() => addToCart(book)}>
                <FaShoppingCart /> ใส่ตะกร้า
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}