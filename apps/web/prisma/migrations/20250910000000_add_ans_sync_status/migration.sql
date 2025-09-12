-- CreateEnum
CREATE TYPE "public"."AnsSyncStatus" AS ENUM ('NOT_REGISTERED', 'PENDING', 'SYNCED', 'ERROR');

-- Update existing data to map 'not_registered' to 'NOT_REGISTERED'
UPDATE "role_agents" SET "ansRegistrationStatus" = 'NOT_REGISTERED' WHERE "ansRegistrationStatus" = 'not_registered';

-- AlterTable
ALTER TABLE "role_agents" ALTER COLUMN "ansRegistrationStatus" SET DATA TYPE "public"."AnsSyncStatus" USING "ansRegistrationStatus"::"public"."AnsSyncStatus";
ALTER TABLE "role_agents" ALTER COLUMN "ansRegistrationStatus" SET DEFAULT 'NOT_REGISTERED';
