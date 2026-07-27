// /lib/rag/llm.ts

import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = process.env.GEMINI_API_KEY
  ? new GoogleGenerativeAI(process.env.GEMINI_API_KEY)
  : null;

export class LLMService {
  async answer(question: string, context: string): Promise<string> {
    if (!genAI) {
      return `No LLM configured. Context:\n${context}`;
    }

    try {
      const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

      const prompt = `
You are KTPilot, an assistant that answers questions using only the provided context.

Rules:
- Be clear, direct, and accurate.
- Use only the provided context. Do not invent facts.
- If the context partially answers the question, give the partial answer and briefly say what is missing.
- Only reply with "I don't know based on the provided documents." when the context does not contain enough information to answer at all.
- Prefer concrete details such as names, dates, policies, and requirements when they are present.

Context:
${context}

Question:
${question}
`;

      const result = await model.generateContent(prompt);
      return result.response.text() ?? "I don't know based on the provided documents.";
    } catch (error: any) {
      console.error("Gemini LLM error:", JSON.stringify(error, null, 2));
      if (error.status === 429) {
        return "LLM service temporarily unavailable due to API quota limits. Please try again later.";
      }
      throw error;
    }
  }
}

export async function generateAnswer(context: string, question: string) {
  const llm = new LLMService();
  return llm.answer(question, context);
}
