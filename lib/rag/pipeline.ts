import { readFile } from "node:fs/promises";
import path from "node:path";

import { EmbeddingService } from "@/lib/rag/embeddings";
import { LLMService } from "@/lib/rag/llm";
import { InMemoryVectorStore, ScoredChunk, StoredChunk } from "@/lib/rag/vectorStore";

export interface DocumentItem {
  id: string;
  title: string;
  content: string;
}

interface ChunkedText {
  chunkId: string;
  text: string;
  docId: string;
  title: string;
}

let singleton: RAGPipeline | null = null;
let initPromise: Promise<RAGPipeline> | null = null;

function cleanText(input: string): string {
  return input.replace(/\r\n/g, "\n").replace(/\n{3,}/g, "\n\n").replace(/[ \t]+/g, " ").trim();
}

function chunkByChars(content: string, minSize = 500, maxSize = 1000): string[] {
  const text = cleanText(content);
  if (text.length <= maxSize) return [text];

  const chunks: string[] = [];
  let start = 0;
  while (start < text.length) {
    const targetEnd = Math.min(start + maxSize, text.length);
    let split = text.lastIndexOf(" ", targetEnd);
    if (split <= start + minSize) split = targetEnd;
    const piece = text.slice(start, split).trim();
    if (piece) chunks.push(piece);
    if (split >= text.length) break;
    start = Math.max(0, split - 120);
  }
  return chunks;
}

export class RAGPipeline {
  private readonly embeddingService = new EmbeddingService();
  private readonly vectorStore = new InMemoryVectorStore();
  private readonly llm = new LLMService();
  private documents: DocumentItem[] = [];

  static async getInstance(): Promise<RAGPipeline> {
    if (singleton) return singleton;
    if (!initPromise) {
      initPromise = (async () => {
        const p = new RAGPipeline();
        await p.initialize();
        singleton = p;
        return p;
      })();
    }
    return initPromise;
  }

  private async initialize(): Promise<void> {
    this.documents = await this.loadDocuments();
    const chunkObjects = this.chunkDocuments(this.documents);
    const embeddings = await this.embeddingService.embedBatch(chunkObjects.map((c) => c.text));
    const storedChunks: StoredChunk[] = chunkObjects.map((chunk, index) => ({
      ...chunk,
      embedding: embeddings[index],
    }));
    this.vectorStore.setChunks(storedChunks);
  }

  listDocuments(): Array<{ id: string; title: string; length: number; contentLength: number }> {
    return this.documents.map((doc) => ({
      id: doc.id,
      title: doc.title,
      length: doc.content.length,
      contentLength: doc.content.length,
    }));
  }

  getDocument(id: string): DocumentItem | null {
    return this.documents.find((doc) => doc.id === id) ?? null;
  }

  async search(query: string, topK = 5): Promise<ScoredChunk[]> {
    const embedding = await this.embeddingService.embedText(query);
    return this.vectorStore.hybridSearch(query, embedding, topK);
  }

  async ask(question: string, topK = 5): Promise<{ answer: string; context: string; results: ScoredChunk[] }> {
    const results = await this.search(question, Math.max(topK, 6));
    console.log("RAG results:", results.map(r => ({ score: r.score, title: r.title, preview: r.text.slice(0, 80) })));
    const context = this.buildContext(results);
    const answer = await this.llm.answer(question, context);
    return { answer, context, results: results.slice(0, topK) };
  }

  private buildContext(results: ScoredChunk[]): string {
    if (results.length === 0) return "No matching context found.";
    return results
      .map((r) => `[${r.title} | ${r.chunkId}]\n${r.text}`)
      .join("\n\n---\n\n");
  }

  private async loadDocuments(): Promise<DocumentItem[]> {
    const jsonPath = path.join(process.cwd(), "data", "documents.json");
    const raw = await readFile(jsonPath, "utf-8");
    const parsed = JSON.parse(raw) as DocumentItem[];
    return parsed.map((doc) => ({
      ...doc,
      content: cleanText(doc.content),
    }));
  }

  private chunkDocuments(documents: DocumentItem[]): ChunkedText[] {
    return documents.flatMap((doc) =>
      chunkByChars(doc.content).map((text, index) => ({
        chunkId: `${doc.id}_chunk_${index}`,
        text,
        docId: doc.id,
        title: doc.title,
      }))
    );
  }
}
