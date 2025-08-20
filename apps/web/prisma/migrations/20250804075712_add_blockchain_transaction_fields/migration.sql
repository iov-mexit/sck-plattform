-- AlterTable
ALTER TABLE "blockchain_transactions" ADD COLUMN     "contractAddress" TEXT,
ADD COLUMN     "metadata" JSONB,
ADD COLUMN     "tokenId" TEXT,
ADD COLUMN     "transactionType" TEXT;

-- CreateIndex
CREATE INDEX "idx_blockchain_tx_type" ON "blockchain_transactions"("transactionType");

-- CreateIndex
CREATE INDEX "idx_blockchain_tx_token" ON "blockchain_transactions"("tokenId");
