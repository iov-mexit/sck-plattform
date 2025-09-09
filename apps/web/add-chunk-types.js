const fs = require('fs');
const path = require('path');

// Read existing JSONL file
const jsonlPath = path.join(__dirname, 'rag-ingestion/cleaned-data/role_chunks/regulatory_knowledge.embedded.jsonl');
const existingContent = fs.readFileSync(jsonlPath, 'utf8');
const lines = existingContent.trim().split('\n').filter(line => line.trim());

// Parse existing entries and add chunkType
const updatedEntries = lines.map(line => {
  const entry = JSON.parse(line);

  // Add chunkType based on content
  if (!entry.chunkType) {
    if (entry.id.includes('developer') || entry.id.includes('dev')) {
      entry.chunkType = 'IMPLEMENTATION';
    } else if (entry.id.includes('compliance') || entry.id.includes('audit')) {
      entry.chunkType = 'COMPLIANCE';
    } else if (entry.id.includes('policy') || entry.id.includes('governance')) {
      entry.chunkType = 'POLICY';
    } else {
      entry.chunkType = 'REQUIREMENT';
    }
  }

  // Ensure metadata exists
  if (!entry.metadata) {
    entry.metadata = {};
  }

  // Add confidence if missing
  if (!entry.metadata.confidence) {
    entry.metadata.confidence = 0.95;
  }

  // Add framework if missing
  if (!entry.metadata.framework) {
    if (entry.id.includes('owasp')) {
      entry.metadata.framework = 'owasp-top10-2021';
    } else if (entry.id.includes('iso')) {
      entry.metadata.framework = 'iso-27001-2022';
    } else if (entry.id.includes('ai-act')) {
      entry.metadata.framework = 'eu-ai-act-2024';
    } else if (entry.id.includes('nis2')) {
      entry.metadata.framework = 'nis2-2023';
    } else if (entry.id.includes('dora')) {
      entry.metadata.framework = 'dora-2024';
    } else if (entry.id.includes('cra')) {
      entry.metadata.framework = 'cra-2024';
    }
  }

  // Add jurisdiction if missing
  if (!entry.metadata.jurisdiction) {
    if (entry.id.includes('eu') || entry.id.includes('ai-act') || entry.id.includes('nis2') || entry.id.includes('dora') || entry.id.includes('cra')) {
      entry.metadata.jurisdiction = 'EU';
    } else {
      entry.metadata.jurisdiction = 'global';
    }
  }

  // Add difficulty if missing
  if (!entry.metadata.difficulty) {
    entry.metadata.difficulty = 'intermediate';
  }

  return entry;
});

// Write back to JSONL file
const newContent = updatedEntries.map(entry => JSON.stringify(entry)).join('\n');
fs.writeFileSync(jsonlPath, newContent + '\n');

console.log(`Updated ${updatedEntries.length} entries with chunkType and metadata`);
console.log('Chunk types added:');
const chunkTypes = {};
updatedEntries.forEach(entry => {
  chunkTypes[entry.chunkType] = (chunkTypes[entry.chunkType] || 0) + 1;
});
Object.entries(chunkTypes).forEach(([type, count]) => {
  console.log(`- ${type}: ${count} entries`);
});


