#!/usr/bin/env ts-node

// Clean Regulatory Data Script
// Run this to extract clean, structured regulatory content

import { RegulatoryDataCleaner } from './clean-regulatory-data';

async function main() {
  console.log('🧹 Starting regulatory data cleaning process...');

  try {
    const cleaner = new RegulatoryDataCleaner();

    console.log('📚 Cleaning all regulatory frameworks...');
    await cleaner.cleanAllRegulatoryData();

    console.log('✅ Data cleaning completed successfully!');
    console.log('📁 Check the ./cleaned-data directory for cleaned JSON files');

  } catch (error) {
    console.error('❌ Error during data cleaning:', error);
    process.exit(1);
  }
}

// Run the cleaning process
if (require.main === module) {
  main();
}
