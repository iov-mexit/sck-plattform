#!/usr/bin/env node

const { Client } = require('pg');
const connectionString = process.env.DATABASE_URL || 'postgresql://postgres:password@localhost:5432/sck_database';

const MAX_RETRIES = 10;
const RETRY_DELAY = 2000; // ms

async function checkDb() {
  let retries = 0;
  while (retries < MAX_RETRIES) {
    try {
      const client = new Client({ connectionString });
      await client.connect();
      await client.end();
      console.log('✅ Database is reachable.');
      process.exit(0);
    } catch (err) {
      retries++;
      console.log(`⏳ Waiting for database... (${retries}/${MAX_RETRIES})`);
      await new Promise(res => setTimeout(res, RETRY_DELAY));
    }
  }
  console.error('❌ Database is not reachable after several attempts.');
  process.exit(1);
}

checkDb(); 