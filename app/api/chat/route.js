import { executiveBoardMembers, directorBoardMembers } from "../../../lib/roster";
import { getKnowledge } from "../../../lib/knowledge";

const LEADERSHIP = [
  "Current KTP Mu Chapter leadership (Spring 2026):",
  "Executive Board:",
  ...executiveBoardMembers.map((m) => `- ${m.position}: ${m.name}`),
  "Director Board:",
  ...directorBoardMembers.map((m) => `- ${m.position}: ${m.name}`),
].join("\n");

const SYSTEM_PROMPT = `You are the friendly assistant for Kappa Theta Pi (KTP), Mu Chapter — a professional technology fraternity at The University of Texas at Dallas (UT Dallas / UTD).

Answer questions from prospective members, current students, and visitors about KTP. Keep replies short (1-3 sentences), warm, and helpful.

Key facts you can use:
- KTP is a co-ed professional technology fraternity focused on more than just technical skills.
- Our five pillars: Academic Support, Tech Advancement, Alumni Connections, Social Growth, and Professional Development.
- Recruitment happens each semester. Point people to the Recruitment page to apply, and encourage them to follow @utdktp on Instagram for dates and events.
- The site has these pages: Home, About, Brothers, Alumni, Recruitment, Blog, Gallery, and Contact.
- Contact: email kappathetapiutd@gmail.com, Instagram @utdktp, LinkedIn "ktputd".

Rules:
- The leadership roster below is the ONLY authoritative source for who CURRENTLY holds a position (e.g., "who is the VP of Technology?"). Give the person's name from the roster.
- The constitution and its History section may contain names of PAST or FOUNDING officers. NEVER use those names to answer who currently holds a role — only the roster is current.
- Use the additional knowledge base (if provided below) to answer questions about recruitment, events, policies, membership rules, and chapter details.
- For people or roles not listed in the roster, or other details you do not know (specific dates, application status, full member list), say so honestly and direct them to the Brothers/Alumni pages or email kappathetapiutd@gmail.com.
- Never invent facts, dates, or names.
- Stay on topics related to KTP and UT Dallas student life.`;

export async function POST(request) {
  const apiKey = process.env.GEMINI_API_KEY;

  if (!apiKey) {
    return Response.json(
      {
        reply:
          "The chat assistant isn't fully set up yet. Please email us at kappathetapiutd@gmail.com and we'll be happy to help!",
        configured: false,
      },
      { status: 200 }
    );
  }

  let body;
  try {
    body = await request.json();
  } catch {
    return Response.json({ error: "Invalid request body." }, { status: 400 });
  }

  const messages = Array.isArray(body?.messages) ? body.messages : [];
  if (messages.length === 0) {
    return Response.json({ error: "No messages provided." }, { status: 400 });
  }

  // Map the client conversation to Gemini's expected format, keeping only recent turns.
  const contents = messages
    .filter((m) => m && typeof m.text === "string" && m.text.trim())
    .slice(-12)
    .map((m) => ({
      role: m.role === "assistant" ? "model" : "user",
      parts: [{ text: m.text }],
    }));

  const model = process.env.GEMINI_MODEL || "gemini-2.5-flash";
  const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`;

  try {
    const lastUser = [...messages].reverse().find((m) => m.role !== "assistant");
    const knowledge = await getKnowledge(lastUser?.text || "");
    const systemText = [SYSTEM_PROMPT, LEADERSHIP, knowledge]
      .filter(Boolean)
      .join("\n\n");

    const res = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        systemInstruction: { parts: [{ text: systemText }] },
        contents,
        generationConfig: {
          temperature: 0.6,
          maxOutputTokens: 600,
          thinkingConfig: { thinkingBudget: 0 },
        },
      }),
    });

    if (!res.ok) {
      const detail = await res.text();
      console.error("Gemini API error:", res.status, detail);
      return Response.json(
        {
          reply:
            "Sorry, I'm having trouble responding right now. Please try again, or email kappathetapiutd@gmail.com.",
          _debug: { status: res.status, detail: detail.slice(0, 300) },
        },
        { status: 200 }
      );
    }

    const data = await res.json();
    const cand = data?.candidates?.[0];
    const reply =
      cand?.content?.parts
        ?.map((p) => p.text)
        .filter(Boolean)
        .join("") ||
      "Sorry, I didn't catch that. Could you rephrase, or email kappathetapiutd@gmail.com?";

    return Response.json(
      { reply, _debug: { finishReason: cand?.finishReason || null } },
      { status: 200 }
    );
  } catch (err) {
    console.error("Chat route error:", err);
    return Response.json(
      {
        reply:
          "Sorry, something went wrong. Please try again, or email kappathetapiutd@gmail.com.",
      },
      { status: 200 }
    );
  }
}
