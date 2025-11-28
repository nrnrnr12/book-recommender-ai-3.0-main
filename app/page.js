'use client'

import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { Prompt } from 'next/font/google'
import './globals.css'

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
    <div className={`${prompt.className} homepage-container`}>
      <main className="homepage-main">
        {/* Left Character */}
        <div className="left-character">
          <img src="/images/Being.svg" alt="Floating reader" />
        </div>

        {/* Central Content */}
        <div className="central-content">
          <div className="hero-image">
            <img src="https://cdn-icons-png.flaticon.com/512/3389/3389081.png" alt="Reading Book Stack" />
          </div>

          <div>
            <h1>
              Discover Your <br />
              <span>Next Favorite Book</span>
            </h1>

            <div className="description">
              เว็บไซต์นี้จะช่วยแนะนำหนังสือที่เหมาะกับคุณ <br className="hidden md:block"/>
              โดยอิงจากความสนใจและบุคลิกของคุณ ผ่านแบบทดสอบสั้น ๆ
            </div>
          </div>

          <button
            onClick={handleStartQuiz}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            className="cta-button"
          >
            TAKE THE TEST 🚀
          </button>
        </div>

        {/* Right Character */}
        <div className="right-character">
          <img src="/images/Bring.svg" alt="Sitting reader" />
        </div>
      </main>
    </div>
  )
}
