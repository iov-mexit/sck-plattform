-- CreateEnum
CREATE TYPE "public"."AnsSyncStatus" AS ENUM ('PENDING', 'SYNCED', 'ERROR');

-- AlterTable
ALTER TABLE "public"."RoleAgent" ALTER COLUMN "ansRegistrationStatus" SET DATA TYPE "public"."AnsSyncStatus" USING "ansRegistrationStatus"::"public"."AnsSyncStatus";
ALTER TABLE "public"."RoleAgent" ALTER COLUMN "ansRegistrationStatus" SET DEFAULT 'PENDING';
