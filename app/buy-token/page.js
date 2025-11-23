'use client';

import { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { Prompt } from 'next/font/google';
import { ethers } from 'ethers';
import { FaEthereum, FaArrowUp, FaExchangeAlt } from 'react-icons/fa';
import Image from 'next/image';

const prompt = Prompt({
  subsets: ['thai', 'latin'],
  weight: ['300', '400', '500', '600', '700'],
});

// สร้าง Component เนื้อหาแยกออกมาเพื่อรองรับ SearchParams
function BuyTokenContent() {
  const searchParams = useSearchParams();
  
  const [ethAmount, setEthAmount] = useState('');
  const [nwnAmount, setNwnAmount] = useState('');
  const [account, setAccount] = useState(null);
  const [loading, setLoading] = useState(false);

  // ⚙️ Rate: 1 ETH = 1,000,000 NWN
  const RATE = 1000000; 
  
  // ⚙️ ใส่เลข Contract Address ของเหรียญ NWN (เพื่อส่ง ETH เข้าตู้)
  const RECEIVER_ADDRESS = "0x28F935a443189a57a3ec7C8c753Cd53D4aB72803"; 

  useEffect(() => {
    checkWallet();
    
    // 🚀 Logic: ถ้ามีค่า amount ส่งมาจาก URL (เช่น กดมาจากหน้าตะกร้า)
    const amountFromUrl = searchParams.get('amount');
    if (amountFromUrl) {
        // กรอกค่า NWN และคำนวณ ETH ให้อัตโนมัติ
        setNwnAmount(amountFromUrl);
        const calculatedEth = parseFloat(amountFromUrl) / RATE;
        setEthAmount(parseFloat(calculatedEth.toFixed(8)).toString());
    }
  }, [searchParams]);

  const checkWallet = async () => {
    if (typeof window.ethereum !== 'undefined') {
      const accounts = await window.ethereum.request({ method: 'eth_accounts' });
      if (accounts.length > 0) setAccount(accounts[0]);
    }
  };

  const handleNwnChange = (e) => {
    const val = e.target.value;
    setNwnAmount(val); 

    if (val && !isNaN(val) && parseFloat(val) > 0) {
      const calculatedEth = parseFloat(val) / RATE;
      setEthAmount(parseFloat(calculatedEth.toFixed(8)).toString());
    } else {
      setEthAmount('');
    }
  };

  const handleBuy = async () => {
    if (!account) return alert("กรุณาเชื่อมต่อกระเป๋า MetaMask ก่อน");
    if (!ethAmount || parseFloat(ethAmount) <= 0) return alert("กรุณากรอกจำนวน Token ที่ถูกต้อง");

    setLoading(true);
    try {
      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();

      const tx = await signer.sendTransaction({
        to: RECEIVER_ADDRESS,
        value: ethers.parseEther(ethAmount.toString()) 
      });

      await tx.wait(); 

      alert(`ซื้อสำเร็จ! คุณจ่าย ${ethAmount} ETH เพื่อแลก ${nwnAmount} NWN\n(เหรียญจะเข้ากระเป๋าเร็วๆ นี้)`);
      
      setEthAmount('');
      setNwnAmount('');

    } catch (error) {
      console.error(error);
      alert("เกิดข้อผิดพลาด: " + (error.reason || error.message));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={prompt.className} style={{ minHeight: '100vh', backgroundColor: '#FFF0E0', display: 'flex', justifyContent: 'center', alignItems: 'center', padding: '20px' }}>
      <div style={{ backgroundColor: 'white', width: '100%', maxWidth: '480px', borderRadius: '24px', padding: '40px', boxShadow: '0 10px 40px rgba(0,0,0,0.05)', textAlign: 'center' }}>
        
        <div style={{ marginBottom: '30px' }}>
          <div style={{ width: '80px', height: '80px', margin: '0 auto 20px', backgroundColor: '#FFFBF5', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 4px 10px rgba(0,0,0,0.05)' }}>
             <Image src="/images/logo.png" alt="NWN Logo" width={50} height={50} style={{ objectFit: 'contain' }} />
          </div>
          <h1 style={{ fontSize: '1.8rem', fontWeight: '700', color: '#333' }}>Get NWN Token</h1>
          <p style={{ color: '#888', fontSize: '0.9rem' }}>Enter amount of tokens you want</p>
        </div>

        <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', backgroundColor: '#f5f5f5', padding: '8px 16px', borderRadius: '20px', fontSize: '0.9rem', color: '#555', marginBottom: '30px', fontWeight: '500' }}>
            <FaExchangeAlt /> 0.0001 ETH = 100 NWN
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
            <div style={{ position: 'relative' }}>
                <label style={{ display: 'block', textAlign: 'left', marginBottom: '5px', fontSize: '0.85rem', color: '#666', fontWeight: '600' }}>จำนวน Token ที่ต้องการ (NWN)</label>
                <div style={{ position: 'relative' }}>
                    <input type="number" value={nwnAmount} onChange={handleNwnChange} placeholder="0" style={{ width: '100%', padding: '15px 15px 15px 50px', borderRadius: '12px', border: '2px solid #28a745', fontSize: '1.2rem', fontWeight: 'bold', color: '#333', outline: 'none', backgroundColor: '#fff' }} autoFocus />
                    <div style={{ position: 'absolute', left: '15px', top: '50%', transform: 'translateY(-50%)', display:'flex', alignItems:'center', justifyContent:'center', width:'24px' }}>
                        <Image src="/images/logo.png" alt="icon" width={24} height={24} />
                    </div>
                </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'center', color: '#ccc', fontSize: '1rem' }}>Requires</div>

            <div style={{ position: 'relative' }}>
                <label style={{ display: 'block', textAlign: 'left', marginBottom: '5px', fontSize: '0.85rem', color: '#666', fontWeight: '600' }}>ต้องชำระด้วย (ETH)</label>
                <div style={{ position: 'relative' }}>
                    <input type="text" value={ethAmount} readOnly placeholder="0.0" style={{ width: '100%', padding: '15px 15px 15px 50px', borderRadius: '12px', border: '2px solid #eee', backgroundColor: '#fafafa', fontSize: '1.2rem', fontWeight: 'bold', color: '#627EEA', outline: 'none' }} />
                    <div style={{ position: 'absolute', left: '15px', top: '50%', transform: 'translateY(-50%)', color: '#627EEA', fontSize: '1.5rem' }}><FaEthereum /></div>
                </div>
            </div>
        </div>

        <button onClick={handleBuy} disabled={loading} style={{ width: '100%', marginTop: '30px', padding: '16px', backgroundColor: '#2D2D2D', color: 'white', border: 'none', borderRadius: '50px', fontSize: '1.1rem', fontWeight: '600', cursor: loading ? 'not-allowed' : 'pointer', boxShadow: '0 5px 15px rgba(0,0,0,0.2)', transition: 'transform 0.2s' }} onMouseOver={(e) => !loading && (e.currentTarget.style.transform = 'scale(1.02)')} onMouseOut={(e) => !loading && (e.currentTarget.style.transform = 'scale(1)')}>
            {loading ? 'Processing...' : `Buy ${nwnAmount || '0'} Token`}
        </button>

        <p style={{ marginTop: '20px', fontSize: '0.8rem', color: '#999' }}>* Payment via SepoliaETH</p>
      </div>
    </div>
  );
}

// ต้อง Wrap ด้วย Suspense เพราะใช้ useSearchParams
export default function BuyTokenPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <BuyTokenContent />
    </Suspense>
  );
}