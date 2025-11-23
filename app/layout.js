import './globals.css'
import { Tinos } from 'next/font/google'
import Navbar from '@/components/Navbar'
import { CartProvider } from '@/context/CartContext' // 1. Import เข้ามา

const tinos = Tinos({
  subsets: ['latin'],
  weight: ['400'],
  variable: '--font-tinos',
})

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={tinos.variable}>
      <body>
        <CartProvider> {/* 2. ครอบทั้ง Navbar และ Children */}
          <Navbar />
          {children}
        </CartProvider>
      </body>
    </html>
  )
}