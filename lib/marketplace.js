import { ethers } from "ethers";
import MarketplaceABI from "../abi/abismart.json";

export function getMarketplaceContract(signerOrProvider) {
  const contractAddress = "0xA53AA2e082A38cea862d59a4DDc8633f5e4b7328";
  return new ethers.Contract(contractAddress, MarketplaceABI.abi, signerOrProvider);
}
