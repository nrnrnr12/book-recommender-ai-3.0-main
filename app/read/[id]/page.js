'use client';

import { useState, useEffect, Suspense } from 'react';
import { useParams, useRouter, useSearchParams } from 'next/navigation';
import { Prompt } from 'next/font/google';
import { FaArrowLeft } from 'react-icons/fa';

const prompt = Prompt({
  subsets: ['thai', 'latin'],
  weight: ['300', '400', '500', '600'],
});

// สร้าง Component เนื้อหาแยก เพื่อรองรับ useSearchParams
function ReadContent() {
  const { id } = useParams();
  const router = useRouter();
  const searchParams = useSearchParams();

  const [book, setBook] = useState(null);
  const [loading, setLoading] = useState(true);

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

  if (loading) return <div className="p-20 text-center text-white">Loading Book...</div>;
  if (!book) return <div className="p-20 text-center text-white">Book not found</div>;

  // เลือกไฟล์ที่จะแสดง: ถ้าโหมด Full ให้เอาไฟล์เต็ม ถ้าไม่ใช่ ให้เอาไฟล์ทดลองอ่าน
  // (ถ้าไม่มีไฟล์เต็ม ให้ fallback กลับไปใช้ไฟล์ทดลองอ่านกันเหนียว)
  // ต้องมีการดึงค่า mode=full
  const isFullMode = searchParams.get('mode') === 'full';

  // ต้องมีการเลือกไฟล์
  const pdfSource = isFullMode 
    ? (book.full_file_url || book.ebook_file_url) // ถ้ามี full ให้ใช้ full ถ้าไม่มีกลับไปใช้ตัวอย่าง
    : book.ebook_file_url;

  return (
    <div className={prompt.className} style={{ 
        height: '100vh', 
        display: 'flex', 
        flexDirection: 'column', 
        backgroundColor: '#2D2D2D' 
    }}>
      
      {/* Header */}
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
            style={{ background: 'none', border: 'none', color: 'white', fontSize: '1.2rem', cursor: 'pointer', display: 'flex', alignItems: 'center' }}
        >
            <FaArrowLeft />
        </button>
        <span style={{ fontSize: '1.1rem', fontWeight: '500', overflow: 'hidden', whiteSpace: 'nowrap', textOverflow: 'ellipsis' }}>
            {/* บอก User ว่ากำลังอ่านแบบไหน */}
            {isFullMode ? '📖 ฉบับเต็ม: ' : '📄 ทดลองอ่าน: '} 
            {book.title}
        </span>
      </div>

      {/* PDF Viewer */}
      <div style={{ flexGrow: 1, overflow: 'hidden' }}>
        {pdfSource ? (
            <iframe 
                src={`${pdfSource}#toolbar=0`} 
                width="100%" 
                height="100%" 
                style={{ border: 'none' }}
                title="PDF Reader"
            />
        ) : (
            <div style={{ color: 'white', textAlign: 'center', marginTop: '50px' }}>
                ไม่พบไฟล์หนังสือ
            </div>
        )}
      </div>

    </div>
  );
}

// Wrap ด้วย Suspense ตามกฎ Next.js
export default function ReadBookPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
        <ReadContent />
    </Suspense>
  );
}