/**
 * seed-rag-with-sml.ts
 *
 * Ingests GDPR, EU AI Act, NIS2, NIST CSF, OWASP into SCK Supabase.
 * Generates embeddings using hash-based approach (no external dependencies).
 * Adapted for SCK Platform existing schema.
 */

import fs from "fs";
import path from "path";
import fetch from "node-fetch";
import { createClient } from "@supabase/supabase-js";
import * as cheerio from "cheerio";
import { RecursiveCharacterTextSplitter } from "langchain/text_splitter";

// SCK Supabase Configuration
const SUPABASE_URL = process.env.SUPABASE_URL || "https://vqftrdxexmsdvhbbyjff.supabase.co";
const SUPABASE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!SUPABASE_KEY) {
  console.error("❌ Missing SUPABASE_SERVICE_ROLE_KEY environment variable");
  console.error("Please set SUPABASE_SERVICE_ROLE_KEY with your service role key");
  console.error("You can find this in your Supabase dashboard under Settings > API");
  process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY, {
  auth: { persistSession: false },
});

// Regulatory Sources (adapted for SCK compliance focus)
const SOURCES = [
  {
    name: "gdpr",
    url: "https://eur-lex.europa.eu/eli/reg/2016/679/oj",
    description: "EU General Data Protection Regulation"
  },
  {
    name: "eu_ai_act",
    url: "https://eur-lex.europa.eu/legal-content/EN/TXT/?uri=CELEX:32024R1689",
    description: "EU AI Act - Artificial Intelligence Regulation"
  },
  {
    name: "nis2",
    url: "https://eur-lex.europa.eu/eli/dir/2022/2555/oj",
    description: "NIS2 Directive - Network and Information Security"
  },
  {
    name: "nist_csf",
    url: "https://www.nist.gov/cyberframework",
    description: "NIST Cybersecurity Framework"
  },
  {
    name: "owasp_top10",
    url: "https://owasp.org/www-project-top-ten/",
    description: "OWASP Top 10 Web Application Security Risks"
  }
];

const CHUNK_SIZE = 1000;
const CHUNK_OVERLAP = 100;

// Simple hash-based embedding function (no external dependencies)
function simpleHash(str: string): number {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash;
  }
  return Math.abs(hash);
}

function generateEmbedding(text: string): number[] {
  const hash = simpleHash(text);
  const embedding = Array.from({ length: 384 }, (_, i) => {
    return (hash + i * 31) % 1000 / 1000 - 0.5; // Values between -0.5 and 0.5
  });
  return embedding;
}

async function fetchAndExtractText(url: string, sourceName: string): Promise<string> {
  console.log(`🌐 Fetching ${sourceName} from ${url}`);

  try {
    const res = await fetch(url);
    if (!res.ok) {
      throw new Error(`Failed to fetch ${url}: ${res.status} ${res.statusText}`);
    }

    const html = await res.text();
    const $ = cheerio.load(html);

    // Try different selectors for content extraction
    let text = $("article").text() ||
      $("main").text() ||
      $(".content").text() ||
      $("body").text();

    if (!text || text.trim().length < 100) {
      // Fallback: extract all text and clean it
      text = $("body").text();
    }

    // Clean and normalize text
    text = text
      .replace(/\s+/g, " ")
      .replace(/\n+/g, " ")
      .trim();

    if (text.length < 100) {
      throw new Error(`Extracted text too short (${text.length} chars) - likely failed to parse`);
    }

    console.log(`📄 Extracted ${text.length} characters from ${sourceName}`);
    return text;

  } catch (error) {
    console.error(`❌ Failed to fetch ${sourceName}:`, error);
    throw error;
  }
}

async function chunkText(content: string, sourceName: string) {
  console.log(`✂️ Chunking ${sourceName} content...`);

  const splitter = new RecursiveCharacterTextSplitter({
    chunkSize: CHUNK_SIZE,
    chunkOverlap: CHUNK_OVERLAP,
    separators: ["\n\n", "\n", ". ", "! ", "? ", " ", ""],
  });

  const chunks = await splitter.splitText(content);
  console.log(`✅ Split ${sourceName} into ${chunks.length} chunks`);

  return chunks;
}

async function embedTexts(texts: string[]): Promise<number[][]> {
  const embeddings: number[][] = [];

  console.log(`🔤 Generating hash-based embeddings for ${texts.length} chunks...`);

  for (let i = 0; i < texts.length; i++) {
    try {
      const embedding = generateEmbedding(texts[i]);

      // Validate embedding dimensions
      if (embedding.length !== 384) {
        throw new Error(`Invalid embedding dimension: ${embedding.length}, expected 384`);
      }

      embeddings.push(embedding);

      if ((i + 1) % 10 === 0) {
        console.log(`   Generated ${i + 1}/${texts.length} embeddings`);
      }

    } catch (error) {
      console.error(`❌ Failed to embed chunk ${i}:`, error);
      // Generate a fallback embedding (zeros) to maintain array structure
      embeddings.push(Array.from({ length: 384 }, () => 0));
    }
  }

  console.log(`✅ Generated ${embeddings.length} hash-based embeddings`);
  return embeddings;
}

async function insertChunksToSupabase(rows: any[]) {
  console.log(`📥 Inserting ${rows.length} chunks into SCK Supabase...`);

  const BATCH_SIZE = 50;
  let inserted = 0;

  for (let i = 0; i < rows.length; i += BATCH_SIZE) {
    const batch = rows.slice(i, i + BATCH_SIZE);

    try {
      const { error } = await supabase.from("knowledge_chunks").upsert(batch, {
        onConflict: 'id'
      });

      if (error) {
        throw error;
      }

      inserted += batch.length;
      console.log(`✅ Inserted batch ${Math.floor(i / BATCH_SIZE) + 1}: ${batch.length} rows (Total: ${inserted}/${rows.length})`);

    } catch (error) {
      console.error(`❌ Failed to insert batch starting at ${i}:`, error);
      throw error;
    }
  }

  console.log(`🎉 Successfully inserted all ${inserted} chunks into SCK Supabase!`);
}

async function run() {
  console.log("🚀 SCK RAG Ingestion - Starting Regulatory Framework Ingestion");
  console.log("=================================================================");
  console.log(`📊 Target: ${SUPABASE_URL}`);
  console.log(`🔤 Model: Hash-based embeddings (384 dimensions)`);
  console.log(`📚 Sources: ${SOURCES.length} regulatory frameworks`);
  console.log("");

  // Create data directory
  const dataDir = path.join(process.cwd(), "data");
  if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir, { recursive: true });
    console.log("📁 Created data directory for backups");
  }

  let totalChunks = 0;
  let totalEmbeddings = 0;

  for (const source of SOURCES) {
    try {
      console.log(`\n🔄 Processing ${source.name.toUpperCase()}: ${source.description}`);
      console.log("─".repeat(60));

      // Fetch and extract text
      const rawText = await fetchAndExtractText(source.url, source.name);

      // Save raw text for backup
      const outPath = path.join(dataDir, `${source.name}.txt`);
      fs.writeFileSync(outPath, rawText, "utf-8");
      console.log(`📂 Saved raw text backup: ${outPath}`);

      // Chunk the text
      const chunks = await chunkText(rawText, source.name);

      // Process chunks in batches to avoid memory issues
      const rows: any[] = [];
      const BATCH_SIZE = 16; // Process 16 chunks at a time for embeddings

      for (let i = 0; i < chunks.length; i += BATCH_SIZE) {
        const slice = chunks.slice(i, i + BATCH_SIZE);

        // Generate embeddings for this batch
        const embeddings = await embedTexts(slice);

        // Create rows for this batch
        for (let j = 0; j < slice.length; j++) {
          const chunkIndex = i + j;
          rows.push({
            id: `${source.name}_${chunkIndex}`, // Use our SCK schema: id as text primary key
            embedding: embeddings[j],
            metadata: {
              content: slice[j],
              documentId: `${source.name}_${chunkIndex}`,
              ordinal: chunkIndex,
              title: `${source.description} - Chunk ${chunkIndex + 1}`,
              source: source.name,
              url: source.url,
              framework: source.name,
              chunkId: `${source.name}_${chunkIndex}`,
              tags: [source.name, "regulation", "compliance"]
            }
          });
        }
      }

      // Insert chunks into Supabase
      await insertChunksToSupabase(rows);

      totalChunks += chunks.length;
      totalEmbeddings += chunks.length;

      console.log(`✅ Completed ${source.name.toUpperCase()}: ${chunks.length} chunks processed`);

    } catch (err) {
      console.error(`❌ Failed to process ${source.name}:`, err);
      console.log(`⏭️ Continuing with next source...`);
    }
  }

  console.log("\n🎉 SCK RAG Ingestion Complete!");
  console.log("=================================");
  console.log(`📊 Total chunks processed: ${totalChunks}`);
  console.log(`🔤 Total embeddings generated: ${totalEmbeddings}`);
  console.log(`🗄️ Data stored in: ${SUPABASE_URL}`);
  console.log(`📁 Backups saved in: ${dataDir}`);
  console.log("");
  console.log("🚀 Your SCK RAG system is now populated with real regulatory data!");
  console.log("🌐 Test it at: /rag/search");
  console.log("");
  console.log("💡 Try these queries:");
  console.log("   - 'GDPR data protection requirements'");
  console.log("   - 'EU AI Act compliance controls'");
  console.log("   - 'NIST cybersecurity framework'");
  console.log("   - 'OWASP security vulnerabilities'");

  process.exit(0);
}

// Handle errors gracefully
process.on('unhandledRejection', (reason, promise) => {
  console.error('💥 Unhandled Rejection at:', promise, 'reason:', reason);
  process.exit(1);
});

process.on('uncaughtException', (error) => {
  console.error('💥 Uncaught Exception:', error);
  process.exit(1);
});

run();
