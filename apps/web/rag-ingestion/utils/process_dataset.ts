import fs from 'fs';
import path from 'path';
import { execSync } from 'child_process';
import dotenv from 'dotenv';
import { createClient } from '@supabase/supabase-js';

// Load env from project root and apps/web/.env.local if present
(() => {
  const rootEnv = path.resolve(process.cwd(), '.env');
  const webEnv = path.resolve(process.cwd(), 'apps/web/.env.local');
  if (fs.existsSync(rootEnv)) {
    dotenv.config({ path: rootEnv });
  }
  if (fs.existsSync(webEnv)) {
    dotenv.config({ path: webEnv });
  }
})();

async function fileExists(p: string): Promise<boolean> {
  return new Promise((resolve) => fs.access(p, fs.constants.F_OK, (err) => resolve(!err)));
}

function run(cmd: string) {
  console.log(`$ ${cmd}`);
  execSync(cmd, { stdio: 'inherit' });
}

async function maybeDownloadFromSupabase(localPath: string, bucket: string, key: string) {
  const url = process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL;
  const token = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_ANON_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !token) {
    console.log('Supabase env not set; skipping remote download');
    return false;
  }

  // Use storage API REST endpoint
  const endpoint = `${url}/storage/v1/object/${bucket}/${key}`;
  const res = await fetch(endpoint, { headers: { Authorization: `Bearer ${token}` } });
  if (!res.ok) {
    console.log(`Supabase download failed: ${res.status}`);
    return false;
  }
  const buf = Buffer.from(await res.arrayBuffer());
  fs.mkdirSync(path.dirname(localPath), { recursive: true });
  fs.writeFileSync(localPath, buf);
  console.log(`Downloaded from Supabase to ${localPath}`);
  return true;
}

async function maybeUploadToSupabase(localPath: string, bucket: string, key: string) {
  const url = process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL;
  const token = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_ANON_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !token) {
    console.log('Supabase env not set; skipping remote upload');
    return false;
  }
  if (!(await fileExists(localPath))) {
    console.log(`File not found, skipping upload: ${localPath}`);
    return false;
  }
  const supabase = createClient(url, token);
  // Ensure bucket exists (idempotent)
  try {
    const { data: buckets, error: listErr } = await supabase.storage.listBuckets();
    if (listErr) throw listErr;
    const exists = buckets?.some(b => b.name === bucket);
    if (!exists) {
      const { error: createErr } = await supabase.storage.createBucket(bucket, { public: false });
      if (createErr) throw createErr;
      console.log(`Created bucket: ${bucket}`);
    }
  } catch (e) {
    console.log('Bucket check/create failed:', e);
  }

  // Upload with upsert
  const fileBuf = fs.readFileSync(localPath);
  const { error: upErr } = await supabase.storage.from(bucket).upload(key, fileBuf, { upsert: true, contentType: 'application/jsonl' });
  if (upErr) {
    console.log('Supabase upload failed:', upErr.message || upErr);
    return false;
  }
  console.log(`Uploaded to Supabase: ${bucket}/${key}`);
  return true;
}

async function main() {
  const defaultLocal = path.resolve(process.cwd(), 'datasets/regulatory_knowledge.json');
  const bucket = process.env.KNOWLEDGE_BUCKET || 'sck-knowledge';
  const remoteKey = process.env.KNOWLEDGE_KEY || 'regulatory/regulatory_knowledge.json';

  const inputPath = process.argv[2] ? path.resolve(process.cwd(), process.argv[2]) : defaultLocal;
  const outDir = path.resolve(process.cwd(), 'apps/web/rag-ingestion/cleaned-data/role_chunks');
  fs.mkdirSync(outDir, { recursive: true });
  const jsonlPath = path.join(outDir, 'regulatory_knowledge.jsonl');
  const embeddedPath = path.join(outDir, 'regulatory_knowledge.embedded.jsonl');

  let haveLocal = await fileExists(inputPath);
  if (!haveLocal) {
    console.log(`Local dataset not found at ${inputPath}, attempting Supabase download...`);
    await maybeDownloadFromSupabase(inputPath, bucket, remoteKey);
    haveLocal = await fileExists(inputPath);
  }
  if (!haveLocal) {
    console.error('Dataset not found locally or in Supabase; aborting.');
    process.exit(1);
  }

  // Convert to JSONL with enrichment
  run(`npx ts-node json_to_jsonl.ts ${inputPath} ${jsonlPath}`);

  // Generate embeddings
  run(`npx ts-node embed_jsonl.ts ${jsonlPath} ${embeddedPath}`);

  // Upload outputs back to Supabase if available
  await maybeUploadToSupabase(jsonlPath, bucket, 'regulatory/regulatory_knowledge.jsonl');
  await maybeUploadToSupabase(embeddedPath, bucket, 'regulatory/regulatory_knowledge.embedded.jsonl');
}

main().catch(err => {
  console.error(err);
  process.exit(1);
});


