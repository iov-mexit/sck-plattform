-- Fix Production ANS Sync Status Enum
-- This script creates the missing AnsSyncStatus enum in production

-- Create the enum if it doesn't exist
DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'AnsSyncStatus') THEN
        CREATE TYPE "public"."AnsSyncStatus" AS ENUM ('PENDING', 'SYNCED', 'ERROR');
    END IF;
END $$;

-- Update the column to use the enum
ALTER TABLE "public"."RoleAgent" 
ALTER COLUMN "ansRegistrationStatus" SET DATA TYPE "public"."AnsSyncStatus" 
USING CASE 
    WHEN "ansRegistrationStatus" = 'not_registered' THEN 'PENDING'::"public"."AnsSyncStatus"
    WHEN "ansRegistrationStatus" = 'registered' THEN 'SYNCED'::"public"."AnsSyncStatus"
    WHEN "ansRegistrationStatus" = 'failed' THEN 'ERROR'::"public"."AnsSyncStatus"
    ELSE 'PENDING'::"public"."AnsSyncStatus"
END;

-- Set default value
ALTER TABLE "public"."RoleAgent" 
ALTER COLUMN "ansRegistrationStatus" SET DEFAULT 'PENDING'::"public"."AnsSyncStatus";
