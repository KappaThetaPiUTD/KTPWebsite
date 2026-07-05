const SYSTEM_PROMPT = `You are the friendly assistant for Kappa Theta Pi (KTP), Mu Chapter — a professional technology fraternity at The University of Texas at Dallas (UT Dallas / UTD).

Answer questions from prospective members, current students, and visitors about KTP. Keep replies short (1-3 sentences), warm, and helpful.

Key facts you can use:
- KTP is a co-ed professional technology fraternity focused on more than just technical skills.
- Our five pillars: Academic Support, Tech Advancement, Alumni Connections, Social Growth, and Professional Development.
- Recruitment happens each semester. Point people to the Recruitment page to apply, and encourage them to follow @utdktp on Instagram for dates and events.
- The site has these pages: Home, About, Brothers, Alumni, Recruitment, Blog, Gallery, and Contact.
- Contact: email kappathetapiutd@gmail.com, Instagram @utdktp, LinkedIn "ktputd".

Rules:
- If you do not know something (specific dates, personal member info, application status), say so honestly and direct them to email kappathetapiutd@gmail.com or the relevant page.
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
    const res = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        systemInstruction: { parts: [{ text: SYSTEM_PROMPT }] },
        contents,
        generationConfig: { temperature: 0.6, maxOutputTokens: 400 },
      }),
    });

    if (!res.ok) {
      const detail = await res.text();
      console.error("Gemini API error:", res.status, detail);
      return Response.json(
        {
          reply:
            "Sorry, I'm having trouble responding right now. Please try again, or email kappathetapiutd@gmail.com.",
        },
        { status: 200 }
      );
    }

    const data = await res.json();
    const reply =
      data?.candidates?.[0]?.content?.parts
        ?.map((p) => p.text)
        .filter(Boolean)
        .join("") ||
      "Sorry, I didn't catch that. Could you rephrase, or email kappathetapiutd@gmail.com?";

    return Response.json({ reply }, { status: 200 });
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
