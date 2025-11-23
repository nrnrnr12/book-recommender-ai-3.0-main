'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Prompt } from 'next/font/google';
import { FaArrowLeft } from 'react-icons/fa';

const prompt = Prompt({
  subsets: ['thai', 'latin'],
  weight: ['300', '400', '500', '600'],
});

export default function ReadBookPage() {
  const { id } = useParams();
  const router = useRouter();
  const [book, setBook] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // ดึงข้อมูลหนังสือเพื่อเอา URL ไฟล์ PDF
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

  if (loading) return <div className="p-20 text-center text-black">Loading Book...</div>;
  if (!book) return <div className="p-20 text-center text-black">Book not found</div>;

  return (
    <div className={prompt.className} style={{ 
        height: '100vh', 
        display: 'flex', 
        flexDirection: 'column', 
        backgroundColor: '#2D2D2D' // พื้นหลังสีเข้มเวลาอ่านจะได้สบายตา
    }}>
      
      {/* Header ของหน้าอ่าน (มีปุ่มย้อนกลับ) */}
      <div style={{ 
          height: '60px', 
          backgroundColor: '#1a1a1a', 
          color: 'white', 
          display: 'flex', 
          alignItems: 'center', 
          padding: '0 20px',
          gap: '15px',
          boxShadow: '0 2px 10px rgba(0,0,0,0.3)'
      }}>
        <button 
            onClick={() => router.back()} 
            style={{ 
                background: 'none', border: 'none', color: 'white', 
                fontSize: '1.2rem', cursor: 'pointer', display: 'flex', alignItems: 'center' 
            }}
        >
            <FaArrowLeft />
        </button>
        <span style={{ fontSize: '1.1rem', fontWeight: '500', overflow: 'hidden', whiteSpace: 'nowrap', textOverflow: 'ellipsis' }}>
            กำลังอ่าน: {book.title}
        </span>
      </div>

      {/* ส่วนแสดงผล PDF */}
      <div style={{ flexGrow: 1, overflow: 'hidden' }}>
        {book.ebook_file_url ? (
            <iframe 
                src={`${book.ebook_file_url}#toolbar=0`} // #toolbar=0 คือพยายามซ่อนเครื่องมือของ Chrome (บาง Browser อาจไม่ซ่อน)
                width="100%" 
                height="100%" 
                style={{ border: 'none' }}
                title="PDF Reader"
            />
        ) : (
            <div style={{ color: 'white', textAlign: 'center', marginTop: '50px' }}>
                ไม่พบไฟล์ E-Book ของหนังสือเล่มนี้
            </div>
        )}
      </div>

    </div>
  );
}