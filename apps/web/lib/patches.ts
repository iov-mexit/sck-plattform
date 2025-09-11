import { z } from "zod";
import { PrismaClient, $Enums } from "@prisma/client";
import { ethers } from "ethers";

const prisma = new PrismaClient();

/** =========================
 * 1️⃣ Zod Schema & Role-Agent Validation
 * ========================== */
export const roleAgentSchema = z.object({
  organizationId: z.string().min(1),
  roleTemplateId: z.string().min(1),
  assignedToDid: z.string().min(1),
  name: z.string().min(3), // e.g., "L1 Developer"
  level: z.number().int().min(1),
  approvalStatus: z.enum(["PENDING", "APPROVED", "REJECTED"]),
});

export type RoleAgentInput = z.infer<typeof roleAgentSchema>;

export function parseRoleAgent(input: unknown): RoleAgentInput | null {
  try {
    const parsed = roleAgentSchema.parse(input);
    console.log("[DEBUG] RoleAgent payload:", { ...parsed, assignedToDid: "REDACTED" });
    return parsed;
  } catch (err) {
    console.error("[ERROR] RoleAgent validation failed:", err);
    return null;
  }
}

/** =========================
 * 2️⃣ AnsSyncStatus Enum Mapping
 * ========================== */
export const ansStatusMap: Record<string, $Enums.AnsSyncStatus> = {
  not_registered: "NOT_REGISTERED" as $Enums.AnsSyncStatus,
  registered: "REGISTERED" as $Enums.AnsSyncStatus,
  synced: "SYNCED" as $Enums.AnsSyncStatus,
  failed: "FAILED" as $Enums.AnsSyncStatus,
};

export function mapAnsStatus(inputStatus: string): $Enums.AnsSyncStatus {
  return ansStatusMap[inputStatus.toLowerCase()] ?? "NOT_REGISTERED";
}

/** =========================
 * 3️⃣ Blockchain Mint Preflight Check
 * ========================== */
export async function preflightMintCheck(
  provider: ethers.Provider,
  wallet: ethers.Wallet,
  gasLimit: bigint,
  gasPrice: bigint,
  value: bigint
): Promise<boolean> {
  const balance = await provider.getBalance(wallet.address);
  const cost = gasLimit * gasPrice + value;
  if (balance < cost) {
    console.warn("[MINT BLOCKED] Insufficient funds", { balance: balance.toString(), cost: cost.toString() });
    return false;
  }
  return true;
}

/** =========================
 * 4️⃣ Prisma Transaction Record Guard
 * ========================== */
interface TransactionData {
  txHash?: string;
  network: string;
  from: string;
  to: string;
  status: string;
  cost: string;
  [key: string]: any;
}

export async function createTransactionRecord(tx: TransactionData) {
  if (!tx.txHash) {
    console.warn("[TRANSACTION SKIPPED] No tx submitted", tx);
    return;
  }

  await prisma.blockchainTransaction.create({
    data: {
      transactionHash: tx.txHash,
      network: tx.network,
      gasUsed: (tx as any).gasUsed,
      gasPrice: (tx as any).gasPrice,
      status: (tx as any).status ?? "pending",
      roleAgentId: (tx as any).roleAgentId,
      tokenId: (tx as any).tokenId,
      contractAddress: (tx as any).contractAddress,
      metadata: (tx as any).metadata,
    },
  });
}

/** =========================
 * 5️⃣ Syntax Error Debugging Helper
 * ========================== */
export function runVerboseDev() {
  console.log(
    "Run dev server with verbose import/trace logging:\n" +
    "NODE_OPTIONS='--trace-warnings --trace-imports' yarn dev"
  );
  console.log("Capture 'Import trace for requested module' to identify offending files.");
}

/** =========================
 * 6️⃣ Vector Index Empty Handling & Healthcheck
 * ========================== */
interface VectorStore {
  query: (opts: { queryVector: number[]; topK: number }) => Promise<any[]>;
  count: () => Promise<number>;
}

export async function queryVectorSafe(vectorStore: VectorStore, queryVector: number[], topK = 5) {
  const results = await vectorStore.query({ queryVector, topK });
  if (!results.length) {
    console.info("[VECTOR SEARCH EMPTY] No matches found.");
    return [];
  }
  return results;
}

export async function vectorStoreHealthCheck(vectorStore: VectorStore) {
  const count = await vectorStore.count();
  return { status: count > 0 ? "ok" : "empty", count };
}

/** =========================
 * Optional: Helper to integrate all patches
 * ========================== */
export async function applyAllPatches() {
  runVerboseDev();
  console.log("[PATCHES READY] Zod, AnsSyncStatus, Mint, Transaction guard, Vector check helpers loaded.");
}


