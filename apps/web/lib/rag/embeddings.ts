import crypto from 'crypto';

const PROVIDER = process.env.EMBEDDING_PROVIDER || 'stub';
const DIM = parseInt(process.env.EMBEDDING_DIM || '768', 10);

// Deterministic stub: SHA256 => repeat into vector space
export async function embedText(text: string): Promise<number[]> {
  if (PROVIDER === 'stub') {
    const hash = crypto.createHash('sha256').update(text).digest();
    const arr: number[] = [];
    for (let i = 0; i < DIM; i++) {
      arr.push((hash[i % hash.length] - 128) / 128.0);
    }
    return arr;
  }
  // TODO: plug your local embedding server
  return new Array(DIM).fill(0);
}
