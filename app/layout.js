import './globals.css'
import { Tinos } from 'next/font/google'
import Navbar from '@/components/Navbar' 

const tinos = Tinos({
  subsets: ['latin'],
  weight: ['400'],
  variable: '--font-tinos',
})

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={tinos.variable}>
      <body>
        <Navbar /> {/* <-- 2. วาง Navbar ไว้ตรงนี้ มันจะโผล่ทุกหน้า */}
        {children}
      </body>
    </html>
  )
}