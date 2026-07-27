import { NextRequest, NextResponse } from "next/server";
import { RAGPipeline } from "@/lib/rag/pipeline";

export async function POST(req: NextRequest) {
  const { query } = await req.json();
  if (!query) return NextResponse.json({ error: "Query required" }, { status: 400 });

  const pipeline = await RAGPipeline.getInstance();
  const results = await pipeline.search(query, 5);

  return NextResponse.json({
    results: results.map((r) => ({
      id: r.chunkId,
      docId: r.docId,
      title: r.title,
      text: r.text,
      snippet: r.text.slice(0, 220),
      score: r.score,
    })),
  });
}