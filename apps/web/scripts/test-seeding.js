#!/usr/bin/env node

/**
 * Test script to verify comprehensive seeding works locally
 */

console.log('🧪 Testing SCK Platform comprehensive seeding...');

try {
  // Test the seeding script
  const { fullSeed } = require('./full-seed');

  console.log('✅ Successfully imported fullSeed function');
  console.log('🚀 Ready to run comprehensive seeding');

  // You can uncomment this to actually run the seeding:
  // fullSeed().then(() => {
  //   console.log('✅ Seeding completed successfully!');
  // }).catch((error) => {
  //   console.error('❌ Seeding failed:', error);
  // });

} catch (error) {
  console.error('❌ Failed to import fullSeed:', error.message);
  process.exit(1);
}
