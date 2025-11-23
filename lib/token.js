import { ethers } from "ethers";
import IERC20 from "@/abi/abitoken.json";

export function getTokenContract(signerOrProvider) {
  const TOKEN_ADDRESS = "0x28F935a443189a57a3ec7C8c753Cd53D4aB72803";
  return new ethers.Contract(TOKEN_ADDRESS, IERC20, signerOrProvider);
}
