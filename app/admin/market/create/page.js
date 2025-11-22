'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import styles from '../../../styles/Result.module.css' // เช็ค path styles ให้ถูกนะครับ ถ้ามัน error ให้แก้ path

export default function CreateMarketBookPage() {
  const router = useRouter()
  
  // 1. เพิ่ม State ให้ครบตามตาราง book_market
  const [formData, setFormData] = useState({
    title: '',
    author: '',
    translator: '', // (Optional)
    category: '',
    original_language: '',
    description: '',
    price: '',      // ราคา NWN
    cover_image: '', // เปลี่ยนจาก image_url เป็น cover_image ให้ตรง DB
    ebook_file_url: '' // ลิงก์ไฟล์ PDF
  })

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    // 2. ส่งไปที่ API /api/market (เดี๋ยวเราไปสร้าง method POST กัน)
    const res = await fetch('/api/market', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(formData),
    })

    if (res.ok) {
      alert('ลงขายหนังสือเรียบร้อย!')
      router.push('/market') // บันทึกเสร็จให้เด้งไปหน้าร้านค้า
      router.refresh()
    } else {
      alert('เกิดข้อผิดพลาดในการเพิ่มหนังสือ')
    }
  }

  return (
    <div className={styles.container}>
      <div className={styles.wrapperBox + ' mt-6'}>
        <h1 className={styles.title}>Add New E-Book to Market</h1>
        
        <form onSubmit={handleSubmit} className={styles.formVertical}>
          
          {/* Title */}
          <label className={styles.inputLabel}>Book Title</label>
          <input
            type="text"
            value={formData.title}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            className={styles.inputField}
            required
          />

          {/* Author & Translator (จัดให้อยู่แถวเดียวกันถ้าย่อหน้าจอได้ หรือเรียงลงมาก็ได้) */}
          <label className={styles.inputLabel}>Author (นักเขียน)</label>
          <input
            type="text"
            value={formData.author}
            onChange={(e) => setFormData({ ...formData, author: e.target.value })}
            className={styles.inputField}
            required
          />

          <label className={styles.inputLabel}>Translator (ผู้แปล - ถ้ามี)</label>
          <input
            type="text"
            value={formData.translator}
            onChange={(e) => setFormData({ ...formData, translator: e.target.value })}
            className={styles.inputField}
            placeholder="ไม่ระบุก็ได้"
          />

          {/* Category & Language */}
          <label className={styles.inputLabel}>Category (หมวดหมู่)</label>
          <input
            type="text"
            value={formData.category}
            onChange={(e) => setFormData({ ...formData, category: e.target.value })}
            className={styles.inputField}
            required
          />

          <label className={styles.inputLabel}>Original Language (ภาษาต้นฉบับ)</label>
          <input
            type="text"
            value={formData.original_language}
            onChange={(e) => setFormData({ ...formData, original_language: e.target.value })}
            className={styles.inputField}
            placeholder="เช่น English, Japanese"
            required
          />

          {/* Price */}
          <label className={styles.inputLabel}>Price (NWN Token)</label>
          <input
            type="number"
            step="0.01" // ให้ใส่ทศนิยมได้
            value={formData.price}
            onChange={(e) => setFormData({ ...formData, price: e.target.value })}
            className={styles.inputField}
            required
          />

          {/* Description */}
          <label className={styles.inputLabel}>Description</label>
          <textarea
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            className={styles.inputField}
            rows={4}
            required
          />

          {/* Images & Files */}
          <label className={styles.inputLabel}>Cover Image URL (รูปปก)</label>
          <input
            type="url"
            value={formData.cover_image}
            onChange={(e) => setFormData({ ...formData, cover_image: e.target.value })}
            className={styles.inputField}
            required
          />

          <label className={styles.inputLabel}>E-Book File URL/Path (ไฟล์หนังสือ)</label>
          <input
            type="text"
            value={formData.ebook_file_url}
            onChange={(e) => setFormData({ ...formData, ebook_file_url: e.target.value })}
            className={styles.inputField}
            placeholder="/ebooks/my-book.pdf" // แนะนำ format ให้ user
          />

          {/* Buttons */}
          <div className={styles.btnGroup}>
            <button type="submit" className={styles.btnAdd}>Sell Book</button>
            <button type="button" onClick={() => router.push('/market')} className={styles.btnDelete}>Cancel</button>
          </div>

        </form>
      </div>
    </div>
  )
}