'use client'

import { useRouter } from 'next/navigation'
// import Image from 'next/image' <-- ลบบรรทัดนี้ออก หรือ comment ไว้ก็ได้ครับ ไม่ได้ใช้แล้ว
import { useState } from 'react'
import { Prompt } from 'next/font/google'

const prompt = Prompt({
  subsets: ['thai', 'latin'],
  weight: ['300', '400', '600', '700'],
})

export default function HomePage() {
  const router = useRouter()
  const [isHovered, setIsHovered] = useState(false)

  const handleStartQuiz = () => {
    router.push('/quiz')
  }

  return (
    <div className={prompt.className} style={{
      minHeight: '100vh',
      backgroundColor: '#ffebd6',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      padding: '20px',
      overflow: 'hidden'
    }}>

      <main style={{
        maxWidth: '1200px',
        width: '100%',
        display: 'flex',
        flexDirection: 'row',
        flexWrap: 'wrap-reverse',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '40px',
      }}>

        {/* --- 1. Left Character --- */}
        <div style={{
          flex: '1 1 200px',
          maxWidth: '300px',
          animation: 'float 3.5s ease-in-out infinite',
          display: 'flex',
          justifyContent: 'center',
          order: 1
        }}>
          <img
            src="/images/Being.svg"
            alt="Floating reader"
            style={{ width: '110%', height: 'auto', objectFit: 'contain', filter: 'drop-shadow(0 5px 15px rgba(0,0,0,0.1))' }}
          />
        </div>


        {/* --- 2. Central Content --- */}
        <div style={{
          flex: '2 1 400px',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          textAlign: 'center',
          gap: '30px',
          zIndex: 2,
          order: 2
        }}>

          {/* Hero Image (แก้ตรงนี้ครับ เปลี่ยน Image เป็น img) */}
          <div style={{
            position: 'relative',
            width: '100%',
            maxWidth: '350px',
            animation: 'float 3s ease-in-out infinite'
          }}>
            {/* ใช้ img ธรรมดาแทน Next Image เพื่อแก้ Error */}
            <img
              src="https://cdn-icons-png.flaticon.com/512/3389/3389081.png"
              alt="Reading Book Stack"
              style={{ 
                width: '100%', 
                height: 'auto', 
                objectFit: 'contain', 
                filter: 'drop-shadow(0 10px 20px rgba(0,0,0,0.1))' 
              }}
            />
          </div>

          {/* Text Content */}
          <div>
            <h1 style={{
              fontSize: '3rem',
              fontWeight: '700',
              color: '#2D2D2D',
              letterSpacing: '-1px',
              marginBottom: '15px',
              lineHeight: '1.2'
            }}>
              Discover Your <br />
              <span style={{ color: '#D9534F' }}>Next Favorite Book</span> 📚
            </h1>

            <div style={{
              fontSize: '1.1rem',
              color: '#666',
              fontWeight: '300',
              maxWidth: '600px',
              margin: '0 auto',
              lineHeight: '1.6'
            }}>
              เว็บไซต์นี้จะช่วยแนะนำหนังสือที่เหมาะกับคุณ <br className="hidden md:block"/>
              โดยอิงจากความสนใจและบุคลิกของคุณ ผ่านแบบทดสอบสั้น ๆ
            </div>
          </div>

          {/* Button (CTA) */}
          <button
            onClick={handleStartQuiz}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            style={{
              backgroundColor: isHovered ? '#333' : '#2D2D2D',
              color: 'white',
              border: 'none',
              padding: '18px 40px',
              fontSize: '1.1rem',
              fontWeight: '600',
              borderRadius: '50px',
              cursor: 'pointer',
              transition: 'all 0.3s ease',
              boxShadow: isHovered ? '0 10px 20px rgba(0,0,0,0.2)' : '0 4px 10px rgba(0,0,0,0.1)',
              transform: isHovered ? 'translateY(-3px)' : 'translateY(0)',
              display: 'flex',
              alignItems: 'center',
              gap: '10px'
            }}
          >
            TAKE THE TEST 🚀
          </button>
        </div>


        {/* --- 3. Right Character --- */}
        <div style={{
          flex: '1 1 200px',
          maxWidth: '300px',
          animation: 'float 4s ease-in-out infinite 0.5s',
          display: 'flex',
          justifyContent: 'center',
          order: 3
        }}>
          <img
            src="/images/Bring.svg"
            alt="Sitting reader"
            style={{ width: '110%', height: 'auto', objectFit: 'contain', filter: 'drop-shadow(0 5px 15px rgba(0,0,0,0.1))' }}
          />
        </div>

      </main>

      <style jsx global>{`
        @keyframes float {
          0% { transform: translateY(0px); }
          50% { transform: translateY(-15px); }
          100% { transform: translateY(0px); }
        }
      `}</style>
    </div>
  )
}