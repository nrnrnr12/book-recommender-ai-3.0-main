'use client';

import { useState, useEffect } from 'react';
import { FaShoppingCart } from 'react-icons/fa';
import { Prompt } from 'next/font/google';
import { useCart } from '@/context/CartContext';
import Link from 'next/link';
import './MarketPage.css';


const prompt = Prompt({
  subsets: ['thai', 'latin'],
  weight: ['300', '400', '500', '600'],
});

export default function MarketPage() {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [hoveredId, setHoveredId] = useState(null);
  const { addToCart } = useCart();

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8; 

  useEffect(() => {
    fetchMarketBooks();
  }, []);

  const fetchMarketBooks = async () => {
    try {
      const res = await fetch('/api/market');
      const data = await res.json();
      setBooks(data);
      setLoading(false);
    } catch (error) {
      console.error('Error:', error);
      setLoading(false);
    }
  };

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentBooks = books.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(books.length / itemsPerPage);

  const handleAddToCart = (book) => {
    addToCart(book);
  };

  if (loading) return <div className={`p-20 text-center text-gray-500 ${prompt.className}`}>Loading...</div>;

  return (
    <div className={prompt.className + ' marketPage'}>
      <div className="marketContainer">

        <div className="marketHeader">
          <h1>Marketplace</h1>
          <p>คัดสรรหนังสือดี E-Book คุณภาพเพื่อคุณ</p>
        </div>

        {books.length === 0 ? (
          <p style={{ textAlign: 'center', color: '#999', marginTop: '50px', fontWeight: '300' }}>ยังไม่มีหนังสือวางขาย</p>
        ) : (
          <div className="booksGrid">
            {currentBooks.map((book) => (
              <div 
                key={book.id} 
                className={`bookCard ${hoveredId === book.id ? 'hovered' : ''}`}
                onMouseEnter={() => setHoveredId(book.id)}
                onMouseLeave={() => setHoveredId(null)}
              >
                <Link href={`/market/${book.id}`} style={{ textDecoration: 'none', flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
                  <div className="bookCover">
                    <img src={book.cover_image || 'https://via.placeholder.com/300x450'} alt={book.title} />
                  </div>
                  <div className="bookInfo">
                    <h3>{book.title}</h3>
                    <p>{book.author || 'Unknown Author'}</p>
                  </div>
                </Link>

                <div className="bookCardFooter">
                  <span className="bookPrice">
                    {parseFloat(book.price).toLocaleString()} <span>NWN</span>
                  </span>
                  <button 
                    className={`addToCartBtn ${hoveredId === book.id ? 'hovered' : ''}`}
                    onClick={(e) => { e.stopPropagation(); handleAddToCart(book); }}
                    title="Add to Cart"
                  >
                    <FaShoppingCart style={{ fontSize: '0.9rem' }} />
                  </button>
                </div>

              </div>
            ))}
          </div>
        )}

        {totalPages > 1 && (
          <div className="pagination">
            <button 
              disabled={currentPage === 1} 
              onClick={() => setCurrentPage(prev => prev - 1)}
            >
              Previous
            </button>
            <button 
              disabled={currentPage === totalPages} 
              onClick={() => setCurrentPage(prev => prev + 1)}
            >
              Next
            </button>
          </div>
        )}

      </div>
    </div>
  );
}