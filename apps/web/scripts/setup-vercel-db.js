#!/usr/bin/env node

/**
 * Vercel Database Setup Script
 * 
 * This script helps you set up a PostgreSQL database for your Vercel deployment.
 * Run this script to get step-by-step instructions and verify your setup.
 */

const fs = require('fs');
const path = require('path');

console.log('🚀 SCK Platform - Vercel Database Setup\n');

// Check if we're in the right directory
const packageJsonPath = path.join(process.cwd(), 'package.json');
if (!fs.existsSync(packageJsonPath)) {
  console.error('❌ Error: Please run this script from the apps/web directory');
  process.exit(1);
}

console.log('📋 Current Status Check:\n');

// Check for environment files
const envFiles = ['.env.local', '.env.production', '.env'];
const hasEnvFile = envFiles.some(file => fs.existsSync(file));

if (hasEnvFile) {
  console.log('✅ Environment file found');
} else {
  console.log('❌ No environment file found');
}

// Check for Prisma schema
const prismaSchemaPath = path.join(process.cwd(), 'prisma', 'schema.prisma');
if (fs.existsSync(prismaSchemaPath)) {
  console.log('✅ Prisma schema found');
} else {
  console.log('❌ Prisma schema not found');
}

console.log('\n🔧 Setup Instructions:\n');

console.log('1. 🌐 Choose a PostgreSQL provider:');
console.log('   • Vercel Postgres (easiest): https://vercel.com/docs/storage/vercel-postgres');
console.log('   • Supabase (free tier): https://supabase.com');
console.log('   • Neon (free tier): https://neon.tech');
console.log('   • PlanetScale (free tier): https://planetscale.com');

console.log('\n2. 🔑 Get your database connection string');
console.log('   Format: postgresql://username:password@host:port/database');

console.log('\n3. ⚙️ Add environment variables to Vercel:');
console.log('   • Go to your Vercel project dashboard');
console.log('   • Navigate to Settings → Environment Variables');
console.log('   • Add: DATABASE_URL = your_connection_string');
console.log('   • Add: NEXTAUTH_SECRET = random_secret_string');
console.log('   • Add: NEXTAUTH_URL = https://your-domain.vercel.app');

console.log('\n4. 🗄️ Run database migrations:');
console.log('   • Local: npx prisma db push');
console.log('   • Or: npx prisma migrate deploy');

console.log('\n5. 🧪 Test your deployment:');
console.log('   • Visit: https://your-domain.vercel.app/api/health');
console.log('   • Should return database connection status');

console.log('\n📝 Quick Commands:\n');

console.log('# Check current environment variables');
console.log('vercel env ls');

console.log('\n# Add environment variable');
console.log('vercel env add DATABASE_URL');

console.log('\n# Pull latest environment variables');
console.log('vercel env pull .env.local');

console.log('\n# Deploy with latest changes');
console.log('vercel --prod');

console.log('\n🔍 Troubleshooting:\n');

console.log('• If you see "Database connection failed", check your DATABASE_URL');
console.log('• If you see "relation does not exist", run database migrations');
console.log('• If you see "connection timeout", check your database is accessible');
console.log('• Check Vercel function logs for detailed error messages');

console.log('\n📞 Need Help?');
console.log('• Vercel Docs: https://vercel.com/docs');
console.log('• Prisma Docs: https://www.prisma.io/docs');
console.log('• SCK Platform: Check your project documentation');

console.log('\n✨ Happy deploying!');
