'use client';

import { Prompt } from 'next/font/google';
import { FaWallet, FaExclamationCircle, FaArrowRight } from 'react-icons/fa';
import Link from 'next/link';

const prompt = Prompt({
  subsets: ['thai', 'latin'],
  weight: ['300', '400', '500', '600', '800'], 
});

export default function CheckoutModal({ isOpen, onClose, total, balance, onConfirm, isProcessing }) {
  if (!isOpen) return null;

  const numTotal = parseFloat(total);
  const numBalance = parseFloat(balance);
  const remaining = numBalance - numTotal;
  const isInsufficient = remaining < 0;
  
  // คำนวณยอดที่ขาด (เอาค่า Absolute เพื่อตัดเครื่องหมายลบออก)
  const missingAmount = Math.abs(remaining);

  return (
    <div className={prompt.className} style={{
      position: 'fixed', top: 0, left: 0, width: '100%', height: '100%',
      backgroundColor: 'rgba(0,0,0,0.5)',
      display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 2000,
      backdropFilter: 'blur(5px)'
    }}>
      
      <div style={{
        backgroundColor: 'white', padding: '30px', borderRadius: '20px',
        width: '90%', maxWidth: '400px', boxShadow: '0 10px 30px rgba(0,0,0,0.2)',
        textAlign: 'center'
      }}>

        <h2 style={{ fontSize: '1.5rem', fontWeight: '600', marginBottom: '20px', color: '#333' }}>
          ยืนยันการชำระเงิน
        </h2>

        <div style={{ backgroundColor: '#f9f9f9', borderRadius: '15px', padding: '20px', marginBottom: '20px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px', color: '#666' }}>
            <span><FaWallet style={{marginRight:'5px'}}/> กระเป๋าของคุณ:</span>
            <span style={{ fontWeight: '600' }}>{numBalance.toLocaleString()} NWN</span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px', color: '#D9534F' }}>
            <span>ราคาสินค้า:</span>
            <span style={{ fontWeight: '600' }}>- {numTotal.toLocaleString()} NWN</span>
          </div>
          
          <hr style={{ border: 'none', borderTop: '1px dashed #ccc', margin: '10px 0' }} />
          
          <div style={{ 
            display: 'flex', 
            justifyContent: 'space-between', 
            fontSize: '1.3rem', 
            color: '#000', 
            fontWeight: '500px',
            marginTop: '15px' 
          }}>
            <span>คงเหลือ:</span>
            <span style={{ color: isInsufficient ? '#D9534F' : '#28a745' }}>
              {remaining.toLocaleString()} NWN
            </span>
          </div>
        </div>

        {isInsufficient ? (
          <div style={{ marginBottom: '20px' }}>
            <div style={{ color: '#D9534F', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '5px', marginBottom: '10px', fontSize: '0.9rem' }}>
              <FaExclamationCircle /> ยอดเงินไม่เพียงพอ (ขาด {missingAmount.toLocaleString()} NWN)
            </div>
            
            {/* --- แก้ไขลิงก์ให้ถูกต้อง --- */}
            {/* ส่งค่า amount ไปทาง URL Query Params */}
            <Link href={`/buy-token?amount=${missingAmount}`}>
              <button style={{
                width: '100%', padding: '12px', borderRadius: '50px', border: 'none',
                backgroundColor: '#333', color: 'white', fontWeight: '600', cursor: 'pointer',
                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px'
              }}>
                เติม Token เดี๋ยวนี้ <FaArrowRight />
              </button>
            </Link>
            {/* ------------------------- */}

          </div>
        ) : (
          <button 
            onClick={onConfirm}
            disabled={isProcessing}
            style={{
              width: '100%', padding: '14px', borderRadius: '50px', border: 'none',
              backgroundColor: isProcessing ? '#ccc' : '#28a745', 
              color: 'white', fontWeight: '600', fontSize: '1.1rem', cursor: isProcessing ? 'not-allowed' : 'pointer',
              marginBottom: '15px', boxShadow: '0 4px 15px rgba(40, 167, 69, 0.3)'
            }}
          >
            {isProcessing ? 'กำลังทำรายการ...' : 'ยืนยันชำระเงิน'}
          </button>
        )}

        <button onClick={onClose} disabled={isProcessing} style={{ background: 'none', border: 'none', color: '#999', cursor: 'pointer', fontSize: '0.9rem', textDecoration: 'underline' }}>
          ยกเลิก / กลับไปแก้ไข
        </button>

      </div>
    </div>
  );
}