import { NextRequest, NextResponse } from "next/server";
import { RAGPipeline } from "@/lib/rag/pipeline";

export async function POST(req: NextRequest) {
  const body = await req.json();
  const question = (body.question || body.query || "").toString().trim();
  if (!question) {
    return NextResponse.json({ error: "Question required" }, { status: 400 });
  }

  const pipeline = await RAGPipeline.getInstance();
  const { answer, context, results } = await pipeline.ask(question, 5);
  return NextResponse.json({
    answer,
    context,
    sources: results.map((r) => ({
      id: r.chunkId,
      docId: r.docId,
      title: r.title,
      text: r.text,
      score: r.score,
    })),
  });
}