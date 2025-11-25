import { ethers } from "ethers";
import MarketplaceABI from "@/abi/abismart.json";

const CONTRACT_ADDRESS = "0x1806fA3b37a4923418BdB8C2B674C6C8537cBd79"; // ใส่ Address ของ BookSalesStorage

export function getMarketplaceContract(signerOrProvider) {
  return new ethers.Contract(CONTRACT_ADDRESS, MarketplaceABI, signerOrProvider);
}
