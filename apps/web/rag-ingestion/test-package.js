#!/usr/bin/env node
/**
 * Quick test to verify the RAG ingestion package is working
 */

import { createClient } from '@supabase/supabase-js';
import * as cheerio from 'cheerio';
import { RecursiveCharacterTextSplitter } from 'langchain/text_splitter';
import fs from 'fs';
import path from 'path';

console.log("🧪 Testing SCK RAG Ingestion Package...");
console.log("========================================");

try {
  // Test 1: Check if we can import dependencies
  console.log("📦 Testing dependencies...");

  console.log("✅ @supabase/supabase-js imported successfully");
  console.log("✅ cheerio imported successfully");
  console.log("✅ langchain imported successfully");

  console.log("✅ All core dependencies working!");

  // Test 2: Check environment
  console.log("\n🔧 Environment check...");
  const supabaseUrl = process.env.SUPABASE_URL || "https://vqftrdxexmsdvhbbyjff.supabase.co";
  const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  console.log(`📊 Supabase URL: ${supabaseUrl}`);
  if (supabaseKey) {
    console.log("✅ SUPABASE_SERVICE_ROLE_KEY is set");
  } else {
    console.log("⚠️  SUPABASE_SERVICE_ROLE_KEY not set");
    console.log("   You need this to run the ingestion");
  }

  // Test 3: Check file structure
  console.log("\n📁 File structure check...");

  const requiredFiles = [
    'package.json',
    'tsconfig.json',
    'scripts/seed-rag-with-sml.ts',
    'README.md'
  ];

  for (const file of requiredFiles) {
    if (fs.existsSync(file)) {
      console.log(`✅ ${file} exists`);
    } else {
      console.log(`❌ ${file} missing`);
    }
  }

  console.log("\n🎉 Package test complete!");
  console.log("\n🚀 Next steps:");
  console.log("1. Set your service role key:");
  console.log("   export SUPABASE_SERVICE_ROLE_KEY='your-key'");
  console.log("2. Run the ingestion:");
  console.log("   npm run seed");

} catch (error) {
  console.error("❌ Test failed:", error.message);
  process.exit(1);
}
