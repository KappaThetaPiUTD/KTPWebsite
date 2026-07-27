export interface StoredChunk {
  embedding: number[];
  text: string;
  docId: string;
  title: string;
  chunkId: string;
}

export interface ScoredChunk extends StoredChunk {
  score: number;
}

function clamp(value: number, min = 0, max = 1): number {
  return Math.min(max, Math.max(min, value));
}

function tokenize(input: string): string[] {
  return input
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, " ")
    .split(/\s+/)
    .filter((token) => token.length > 1);
}

function uniqueOverlapCount(source: string[], target: string[]): number {
  if (source.length === 0 || target.length === 0) return 0;
  const targetSet = new Set(target);
  return Array.from(new Set(source)).filter((token) => targetSet.has(token)).length;
}

function cosineSimilarity(a: number[], b: number[]): number {
  if (a.length !== b.length) return -1;
  let dot = 0;
  let normA = 0;
  let normB = 0;
  for (let i = 0; i < a.length; i += 1) {
    dot += a[i] * b[i];
    normA += a[i] * a[i];
    normB += b[i] * b[i];
  }
  const denom = Math.sqrt(normA) * Math.sqrt(normB);
  if (!denom) return -1;
  return dot / denom;
}

export class InMemoryVectorStore {
  private chunks: StoredChunk[] = [];

  setChunks(chunks: StoredChunk[]): void {
    this.chunks = chunks;
  }

  hybridSearch(queryText: string, queryEmbedding: number[], topK = 5): ScoredChunk[] {
    const queryTokens = tokenize(queryText);
    const loweredQuery = queryText.trim().toLowerCase();

    return this.chunks
      .map((chunk) => {
        const semanticRaw = cosineSimilarity(queryEmbedding, chunk.embedding);
        const semanticScore = semanticRaw < 0 ? 0 : (semanticRaw + 1) / 2;

        const titleCoverage = uniqueOverlapCount(queryTokens, tokenize(chunk.title)) / Math.max(queryTokens.length, 1);
        const textCoverage = uniqueOverlapCount(queryTokens, tokenize(chunk.text)) / Math.max(queryTokens.length, 1);
        const exactMatchBoost =
          loweredQuery && (chunk.title.toLowerCase().includes(loweredQuery) || chunk.text.toLowerCase().includes(loweredQuery))
            ? 0.2
            : 0;

        const lexicalScore = clamp((titleCoverage * 0.45) + (textCoverage * 0.45) + exactMatchBoost);
        const combinedScore = (semanticScore * 0.65) + (lexicalScore * 0.35);

        return {
          ...chunk,
          score: combinedScore,
        };
      })
      .sort((a, b) => b.score - a.score)
      .slice(0, topK);
  }

  search(queryEmbedding: number[], topK = 5): ScoredChunk[] {
    return this.chunks
      .map((chunk) => ({
        ...chunk,
        score: cosineSimilarity(queryEmbedding, chunk.embedding),
      }))
      .sort((a, b) => b.score - a.score)
      .slice(0, topK);
  }
}
