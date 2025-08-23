#!/usr/bin/env node

/**
 * Quick Deploy AI Tables to Your Existing Supabase
 * This script uses your existing Supabase configuration
 */

console.log('🚀 Quick Deploy: AI & RAG to Your Existing Supabase\n');

console.log('📋 Your Supabase Configuration:');
console.log('   URL: https://vqftrdxexmsdvhbbyjff.supabase.co');
console.log('   Database: postgres://postgres.vqftrdxexmsdvhbbyjff:CPGQ3DOml9iD3QID@aws-1-eu-central-1.pooler.supabase.com:5432/postgres?sslmode=require\n');

console.log('🔧 To deploy immediately:\n');

console.log('1. Update your .env.local with Supabase DATABASE_URL:');
console.log('   DATABASE_URL="postgres://postgres.vqftrdxexmsdvhbbyjff:CPGQ3DOml9iD3QID@aws-1-eu-central-1.pooler.supabase.com:5432/postgres?sslmode=require"\n');

console.log('2. Run the database push:');
console.log('   npm run db:push\n');

console.log('3. Test the AI functionality:');
console.log('   npm run dev');
console.log('   # Then visit: http://localhost:3000/admin/ai-status\n');

console.log('4. Deploy to Vercel:');
console.log('   git add .');
console.log('   git commit -m "🚀 Add Milestone 1: AI & RAG Implementation"');
console.log('   git push\n');

console.log('🎯 Your AI platform will be live at: https://sck-plattform.vercel.app/admin/ai-status\n');

console.log('💡 What gets deployed:');
console.log('   ✅ knowledge_documents table (with pgvector support)');
console.log('   ✅ ai_recommendations table');
console.log('   ✅ trust_ledger table');
console.log('   ✅ policy_bundles table');
console.log('   ✅ artifact_risk_profiles table');
console.log('   ✅ AI policy draft API');
console.log('   ✅ Knowledge ingest API');
console.log('   ✅ Admin AI status page\n');

console.log('🔒 Safe by default:');
console.log('   - Stub mode (no external LLM calls)');
console.log('   - Deterministic responses');
console.log('   - Complete audit trail');
console.log('   - Organization isolation\n');

console.log('🚀 Ready to deploy? Just update your .env.local and run npm run db:push!');
