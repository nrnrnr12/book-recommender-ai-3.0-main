'use client';

import { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { Prompt } from 'next/font/google';
import { ethers } from 'ethers';
import { FaEthereum, FaExchangeAlt } from 'react-icons/fa';
import Image from 'next/image';
import './token.css';

const prompt = Prompt({
  subsets: ['thai', 'latin'],
  weight: ['300', '400', '500', '600', '700'],
});

function BuyTokenContent() {
  const searchParams = useSearchParams();
  const [ethAmount, setEthAmount] = useState('');
  const [nwnAmount, setNwnAmount] = useState('');
  const [account, setAccount] = useState(null);
  const [loading, setLoading] = useState(false);

  const RATE = 1000000; 
  const RECEIVER_ADDRESS = "0x28F935a443189a57a3ec7C8c753Cd53D4aB72803"; 

  useEffect(() => {
    checkWallet();
    const amountFromUrl = searchParams.get('amount');
    if (amountFromUrl) {
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
    <div className={prompt.className + ' buyTokenPage'}>
      <div className="buyTokenCard">
        <div className="buyTokenHeader">
          <div className="buyTokenLogoWrapper">
            <Image src="/images/logo.png" alt="NWN Logo" width={50} height={50} style={{ objectFit: 'contain' }} />
          </div>
          <h1>Get NWN Token</h1>
          <p>Enter amount of tokens you want</p>
        </div>

        <div className="rateInfo">
          <FaExchangeAlt /> 0.0001 ETH = 100 NWN
        </div>

        <div className="buyTokenForm">
          <div className="inputWrapper nwn">
            <label>จำนวน Token ที่ต้องการ (NWN)</label>
            <input type="number" value={nwnAmount} onChange={handleNwnChange} placeholder="0" autoFocus />
            <div className="inputIcon">
              <Image src="/images/logo.png" alt="icon" width={24} height={24} />
            </div>
          </div>

          <div className="requiresText">Requires</div>

          <div className="inputWrapper eth">
            <label>ต้องชำระด้วย (ETH)</label>
            <input type="text" value={ethAmount} readOnly placeholder="0.0" />
            <div className="inputIcon eth"><FaEthereum /></div>
          </div>
        </div>

        <button onClick={handleBuy} disabled={loading} className="buyTokenBtn">
          {loading ? 'Processing...' : `Buy ${nwnAmount || '0'} Token`}
        </button>

        <p className="paymentNote">* Payment via SepoliaETH</p>
      </div>
    </div>
  );
}

export default function BuyTokenPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <BuyTokenContent />
    </Suspense>
  );
}
