-- CreateEnum
CREATE TYPE "public"."AnsSyncStatus" AS ENUM ('NOT_REGISTERED', 'PENDING', 'SYNCED', 'ERROR');

-- Drop the existing default to avoid casting issues
ALTER TABLE "role_agents" ALTER COLUMN "ansRegistrationStatus" DROP DEFAULT;

-- Update existing data to map 'not_registered' to 'NOT_REGISTERED'
UPDATE "role_agents" SET "ansRegistrationStatus" = 'NOT_REGISTERED' WHERE "ansRegistrationStatus" = 'not_registered';

-- AlterTable - change column type
ALTER TABLE "role_agents" ALTER COLUMN "ansRegistrationStatus" SET DATA TYPE "public"."AnsSyncStatus" USING "ansRegistrationStatus"::"public"."AnsSyncStatus";

-- Set new default
ALTER TABLE "role_agents" ALTER COLUMN "ansRegistrationStatus" SET DEFAULT 'NOT_REGISTERED';
