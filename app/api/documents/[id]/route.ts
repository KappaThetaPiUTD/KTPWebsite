import { NextResponse } from "next/server";

import { RAGPipeline } from "@/lib/rag/pipeline";

export async function GET(_: Request, { params }: { params: { id: string } }) {
  const pipeline = await RAGPipeline.getInstance();
  const document = pipeline.getDocument(params.id);

  if (!document) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  return NextResponse.json(document);
}