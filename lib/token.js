import { ethers } from "ethers";
import IERC20 from "@/abi/abitoken.json";

export function getTokenContract(signerOrProvider) {
  const TOKEN_ADDRESS = "0x2edF1d2D5E4B9Ad9F61628FCe6Ee4a894B6f7Ab4";
  return new ethers.Contract(TOKEN_ADDRESS, IERC20, signerOrProvider);
}
