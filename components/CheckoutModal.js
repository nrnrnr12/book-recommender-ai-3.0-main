'use client';

import { Prompt } from 'next/font/google';
import { FaWallet, FaExclamationCircle, FaArrowRight } from 'react-icons/fa';
import Link from 'next/link';
import './CheckoutModal.css';

const prompt = Prompt({
  subsets: ['thai', 'latin'],
  weight: ['300', '400', '500', '600', '800'],
});

export default function CheckoutModal({
  isOpen,
  onClose,
  total,
  balance,
  onConfirm,
  isProcessing
}) {
  if (!isOpen) return null;

  const numTotal = parseFloat(total);
  const numBalance = parseFloat(balance);
  const remaining = numBalance - numTotal;
  const isInsufficient = remaining < 0;
  const missingAmount = Math.abs(remaining);

  return (
    <div className={`checkout-overlay ${prompt.className}`}>
      <div className="checkout-container">
        
        <h2 className="checkout-title">ยืนยันการชำระเงิน</h2>

        <div className="checkout-box">

          <div className="checkout-row">
            <span><FaWallet className="inline-icon"/> กระเป๋าของคุณ:</span>
            <span className="checkout-value">{numBalance.toLocaleString()} NWN</span>
          </div>

          <div className="checkout-row checkout-price">
            <span>ราคาสินค้า:</span>
            <span className="checkout-value">- {numTotal.toLocaleString()} NWN</span>
          </div>

          <hr className="checkout-divider" />

          <div className="checkout-row checkout-total">
            <span>คงเหลือ:</span>
            <span className={isInsufficient ? 'checkout-red' : 'checkout-green'}>
              {remaining.toLocaleString()} NWN
            </span>
          </div>

        </div>

        {isInsufficient ? (
          <div className="checkout-warning-box">
            <div className="checkout-warning-text">
              <FaExclamationCircle /> ยอดเงินไม่เพียงพอ (ขาด {missingAmount.toLocaleString()} NWN)
            </div>

            <Link href={`/buy-token?amount=${missingAmount}`}>
              <button className="checkout-button-dark">
                เติม Token เดี๋ยวนี้ <FaArrowRight />
              </button>
            </Link>
          </div>
        ) : (
          <button
            onClick={onConfirm}
            disabled={isProcessing}
            className={`checkout-button-confirm ${isProcessing && 'disabled'}`}
          >
            {isProcessing ? 'กำลังทำรายการ...' : 'ยืนยันชำระเงิน'}
          </button>
        )}

        <button
          onClick={onClose}
          disabled={isProcessing}
          className="checkout-cancel"
        >
          ยกเลิก / กลับไปแก้ไข
        </button>

      </div>
    </div>
  );
}
