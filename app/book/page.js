'use client';

import { useEffect, useState } from 'react';
import { Prompt } from 'next/font/google';
import './BookPage.css';

const prompt = Prompt({
  subsets: ['thai', 'latin'],
  weight: ['300', '400', '500', '600'],
});

export default function BookPage() {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [hoveredId, setHoveredId] = useState(null);

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;

  useEffect(() => {
    const fetchBooks = async () => {
      try {
        const res = await fetch('/api/books');
        const data = await res.json();
        setBooks(data);
      } catch (err) {
        console.error('Failed to load books:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchBooks();
  }, []);

  const indexOfLast = currentPage * itemsPerPage;
  const indexOfFirst = indexOfLast - itemsPerPage;
  const currentBooks = books.slice(indexOfFirst, indexOfLast);
  const totalPages = Math.ceil(books.length / itemsPerPage);

  if (loading) return <div className={`loading ${prompt.className}`}>Loading...</div>;

  return (
    <div className={`page-wrapper ${prompt.className}`}>
      <div className="content-container">

        <div className="header">
          <h1>Recommended Books</h1>
          <p>หนังสือแนะนำที่คัดสรรมาเพื่อคุณ</p>
        </div>

        <div className="books-grid">
          {currentBooks.map((book) => (
            <div
              key={book.id}
              className={`book-card ${hoveredId === book.id ? 'hovered' : ''}`}
              onMouseEnter={() => setHoveredId(book.id)}
              onMouseLeave={() => setHoveredId(null)}
            >
              <div className="book-image">
                <img
                  src={book.image_url || 'https://via.placeholder.com/300x450?text=No+Image'}
                  alt={book.title}
                />
              </div>

              <div className="book-info">
                {book.category && <span className="book-category">{book.category}</span>}
                <h3 className="book-title">{book.title}</h3>
                <p className="book-author">{book.author || 'Unknown Author'}</p>
              </div>
            </div>
          ))}
        </div>

        {totalPages > 1 && (
          <div className="pagination">
            <button
              disabled={currentPage === 1}
              onClick={() => setCurrentPage((p) => p - 1)}
            >
              Previous
            </button>

            <button
              disabled={currentPage === totalPages}
              onClick={() => setCurrentPage((p) => p + 1)}
            >
              Next
            </button>
          </div>
        )}

      </div>
    </div>
  );
}
