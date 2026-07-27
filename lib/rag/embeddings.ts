// /lib/rag/embedding.ts

import { GoogleGenerativeAI } from "@google/generative-ai";

const EMBEDDING_MODEL = "models/gemini-embedding-exp-03-07";
const MOCK_DIMENSION = 768; // Match Gemini's output dimension

function normalize(vec: number[]): number[] {
  const magnitude = Math.sqrt(vec.reduce((sum, v) => sum + v * v, 0)) || 1;
  return vec.map((v) => v / magnitude);
}

function mockEmbedding(text: string): number[] {
  const vector = new Array<number>(MOCK_DIMENSION).fill(0);
  for (let i = 0; i < text.length; i += 1) {
    const code = text.charCodeAt(i);
    const slot = i % MOCK_DIMENSION;
    vector[slot] += ((code % 97) + 1) / 100;
  }
  return normalize(vector);
}

export class EmbeddingService {
  private readonly genAI: GoogleGenerativeAI | null;

  constructor() {
    const apiKey = process.env.GEMINI_API_KEY?.trim();
    this.genAI = apiKey ? new GoogleGenerativeAI(apiKey) : null;
  }

  async embedText(text: string): Promise<number[]> {
    const clean = text.trim();
    if (!clean) return mockEmbedding("empty");
    if (!this.genAI) {
      return mockEmbedding(clean);
    }
    try {
      const model = this.genAI.getGenerativeModel({ model: EMBEDDING_MODEL });
      const result = await model.embedContent(clean);
      return normalize(result.embedding.values);
    } catch {
      return mockEmbedding(clean);
    }
  }

  async embedBatch(texts: string[]): Promise<number[][]> {
    if (texts.length === 0) return [];
    if (!this.genAI) return texts.map((t) => mockEmbedding(t));

    try {
      const model = this.genAI.getGenerativeModel({ model: EMBEDDING_MODEL });

      // Gemini has no native batch endpoint — run in parallel instead
      const results = await Promise.all(
        texts.map((text) => model.embedContent(text.trim() || "empty"))
      );

      return results.map((r) => normalize(r.embedding.values));
    } catch {
      return texts.map((t) => mockEmbedding(t));
    }
  }
}
