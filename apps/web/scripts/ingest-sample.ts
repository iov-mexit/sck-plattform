// Using built-in fetch for Node 18+
// import fetch from 'node-fetch';

async function main() {
  const r = await fetch('http://localhost:3000/api/knowledge/ingest', {
    method: 'POST',
    headers: {'content-type': 'application/json'},
    body: JSON.stringify({
      title: 'EU AI Act Overview (sample)',
      content: 'The EU AI Act introduces a risk-based framework with obligations by risk tier...',
      framework: 'EU AI Act',
      jurisdiction: 'EU',
      version: '2024-06',
      sourceType: 'manual'
    })
  });
  console.log(await r.json());
}
main().catch(console.error);
