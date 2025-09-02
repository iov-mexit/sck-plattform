import fs from 'fs';
import path from 'path';
import readline from 'readline';
import { generateEmbedding } from '../../lib/rag/embedding.ts';

async function processJsonl(inputPath: string, outputPath: string) {
  const absIn = path.resolve(process.cwd(), inputPath);
  const absOut = path.resolve(process.cwd(), outputPath);

  const inStream = fs.createReadStream(absIn, 'utf-8');
  const rl = readline.createInterface({ input: inStream, crlfDelay: Infinity });
  const outStream = fs.createWriteStream(absOut, { encoding: 'utf-8' });

  let count = 0;
  for await (const line of rl) {
    if (!line.trim()) continue;
    const obj = JSON.parse(line);
    const text: string = [
      obj.coreDescription,
      obj.roles?.Developer?.phrasing,
      obj.roles?.ProductManager?.phrasing,
      obj.roles?.ComplianceOfficer?.phrasing,
      obj.roles?.CISO?.phrasing
    ].filter(Boolean).join(' \n ');

    try {
      const vec = await generateEmbedding(text);
      obj.embedding = vec;
    } catch (e) {
      obj.embedding = [];
      console.error('Embedding failed for id:', obj.id || obj.requirementId, e);
    }

    outStream.write(JSON.stringify(obj) + '\n');
    count++;
    if (count % 100 === 0) console.log(`Embedded ${count} lines...`);
  }

  outStream.end();
  console.log(`Completed embeddings for ${count} lines -> ${absOut}`);
}

function main() {
  const input = process.argv[2];
  const output = process.argv[3];
  if (!input || !output) {
    console.error('Usage: ts-node embed_jsonl.ts <input.jsonl> <output.jsonl>');
    process.exit(1);
  }
  processJsonl(input, output).catch(err => {
    console.error(err);
    process.exit(1);
  });
}

main();


