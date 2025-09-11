import { ethers } from "ethers";
import dotenv from "dotenv";

dotenv.config();

const RPC_URL = process.env.RPC_URL || process.env.FLARE_RPC_URL || "";
const PRIVATE_KEY = process.env.FLARE_PRIVATE_KEY || "";
const provider = new ethers.JsonRpcProvider(RPC_URL);
const wallet = new ethers.Wallet(PRIVATE_KEY, provider);

const gasLimit = ethers.toBigInt(21000);
const gasPrice = ethers.parseUnits("10", "gwei");
const value = ethers.parseEther("0.01");

async function preflightCheck() {
  const balance = await wallet.getBalance();
  const cost = gasLimit * gasPrice + value;

  console.log("[BALANCE CHECK] Wallet balance:", ethers.formatEther(balance));
  console.log("[COST ESTIMATE] Gas + value:", ethers.formatEther(cost));

  if (balance < cost) {
    console.error("[FAILED] Insufficient funds for minting.");
    process.exit(1);
  }

  console.log("[PASSED] Sufficient funds. Ready to mint.");
}

preflightCheck().catch((err) => {
  console.error("[ERROR] Preflight failed:", err);
  process.exit(1);
});


