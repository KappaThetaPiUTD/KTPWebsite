import { NextResponse } from "next/server";

import { RAGPipeline } from "@/lib/rag/pipeline";

export async function GET() {
  const pipeline = await RAGPipeline.getInstance();
  return NextResponse.json({
    documents: pipeline.listDocuments(),
  });
}