'use client';

import { useState, useEffect } from 'react';
import { Prompt } from 'next/font/google';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { FaBookOpen, FaInfoCircle, FaCalendarAlt } from 'react-icons/fa';
import './Bookshelf.css';

const prompt = Prompt({
  subsets: ['thai', 'latin'],
  weight: ['300', '400', '500', '600', '700'],
});

export default function BookshelfPage() {
  const [books, setBooks] = useState([]);
  const [account, setAccount] = useState(null);
  const [loading, setLoading] = useState(true);

  const router = useRouter();

  useEffect(() => {
    const checkWallet = async () => {
      if (typeof window.ethereum !== 'undefined') {
        const accounts = await window.ethereum.request({ method: 'eth_accounts' });
        if (accounts.length > 0) {
          setAccount(accounts[0]);
          fetchMyBooks(accounts[0]);
        } else {
          setLoading(false);
        }
      }
    };
    checkWallet();
  }, []);

  const fetchMyBooks = async (wallet) => {
    try {
      const res = await fetch(`/api/orders?wallet=${wallet}`);
      const data = await res.json();
      setBooks(data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  if (!account)
    return <div className={`p-20 text-center text-gray-500 ${prompt.className}`}>กรุณาเชื่อมต่อกระเป๋าเพื่อดูชั้นหนังสือของคุณ</div>;

  if (loading)
    return <div className={`p-20 text-center text-gray-500 ${prompt.className}`}>Loading Library...</div>;

  return (
    <div className={`bookshelf-container ${prompt.className}`}>
      <div className="bookshelf-box">

        <div className="bookshelf-header">
          <h1 className="bookshelf-title">My Bookshelf</h1>
          <p className="bookshelf-subtitle">หนังสือทั้งหมดที่คุณเป็นเจ้าของ</p>
        </div>

        {books.length === 0 ? (
          <div className="no-books">
            <p>ยังไม่มีหนังสือในชั้น</p>
            <Link href="/market">ไปเลือกซื้อหนังสือที่ Market</Link>
          </div>
        ) : (
          <div className="books-grid">
            {books.map((book) => (
              <div key={book.id} className="book-card">

                <Link href={`/market/${book.id}`} style={{ textDecoration: 'none' }}>
                  <div className="book-cover">
                    <img src={book.cover_image || book.image_url} alt={book.title} />
                  </div>

                  <h3 className="book-title">{book.title}</h3>

                  <p className="book-date">
                    <FaCalendarAlt />
                    ซื้อเมื่อ: {book.purchase_date ? new Date(book.purchase_date).toLocaleString() : '-'}
                  </p>
                </Link>

                <div className="book-btn-row">
                  <Link href={`/market/${book.id}`} style={{ flex: 1 }}>
                    <button className="btn-detail">
                      <FaInfoCircle /> รายละเอียด
                    </button>
                  </Link>

                  <Link href={`/read/${book.id}?mode=full`} style={{ flex: 1 }}>
                    <button className="btn-read">
                      <FaBookOpen /> อ่านเลย
                    </button>
                  </Link>
                </div>

              </div>
            ))}
          </div>
        )}

      </div>
    </div>
  );
}
