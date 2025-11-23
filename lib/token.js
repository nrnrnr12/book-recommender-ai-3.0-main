import { ethers } from "ethers";
import IERC20 from "@/abi/abitoken.json";



export function getTokenContract(signerOrProvider) {
  const TOKEN_ADDRESS = "0x30b32EE29623350E94206Ce0f83483E5cAF69416";
  return new ethers.Contract(TOKEN_ADDRESS, IERC20, signerOrProvider);
}
