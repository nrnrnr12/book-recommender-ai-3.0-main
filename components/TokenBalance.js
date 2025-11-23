"use client";
import { useEffect, useState } from "react";
import { ethers } from "ethers";
import IERC20 from "@/abi/abitoken.json";

export default function TokenBalance({ account, tokenAddress }) {
  const [balance, setBalance] = useState(0);

  useEffect(() => {
    if (!account) return;

    const loadBalance = async () => {
      const provider = new ethers.BrowserProvider(window.ethereum);
      const token = new ethers.Contract(tokenAddress, IERC20, provider);
      const bal = await token.balanceOf(account);
      setBalance(ethers.formatEther(bal));
    };
    loadBalance();
  }, [account]);

  return <p>NWN Token Balance: {balance}</p>;
}
