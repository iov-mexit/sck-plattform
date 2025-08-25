import prisma from "@/lib/database";
import crypto from "crypto";

export type TrustLedgerEventInput = {
  artifactType: string;
  artifactId: string;
  action: string;
  payload: any;
};

export async function createTrustLedgerEvent(input: TrustLedgerEventInput) {
  // 1. Canonicalize payload
  const canonicalPayload = JSON.stringify(input.payload, Object.keys(input.payload).sort());
  const contentHash = crypto.createHash("sha256").update(canonicalPayload).digest("hex");

  // 2. Get previous hash for threading
  const lastEvent = await prisma.trustLedgerEvent.findFirst({
    where: { artifactId: input.artifactId },
    orderBy: { createdAt: "desc" }
  });

  // 3. Create event
  const event = await prisma.trustLedgerEvent.create({
    data: {
      artifactType: input.artifactType,
      artifactId: input.artifactId,
      action: input.action,
      payload: input.payload,
      contentHash,
      prevHash: lastEvent?.contentHash || null
    }
  });

  return event;
}

export async function getTrustLedgerEvents(
  artifactId: string,
  limit: number = 50
) {
  return prisma.trustLedgerEvent.findMany({
    where: { artifactId },
    orderBy: { createdAt: "desc" },
    take: limit
  });
}

export async function getTrustLedgerChain(artifactId: string) {
  const events = await prisma.trustLedgerEvent.findMany({
    where: { artifactId },
    orderBy: { createdAt: "asc" }
  });

  // Verify chain integrity
  const chain = [];
  let prevHash = null;

  for (const event of events) {
    if (event.prevHash !== prevHash) {
      throw new Error(`Chain integrity violation at event ${event.id}`);
    }
    chain.push(event);
    prevHash = event.contentHash;
  }

  return chain;
}
