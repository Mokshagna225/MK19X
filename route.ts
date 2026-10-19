import OpenAI from "openai";
import { NextResponse } from "next/server";

export const runtime = "nodejs";

const systemPrompt = `You are MK19X, a friendly agentic website-building consultant for beginners.
Your job is to discover what a user wants before generating a website. Ask exactly ONE concise, useful question per turn, unless the request already gives enough detail to create a useful first draft.
Use the conversation history. Avoid repeating questions already answered.
Explore these details naturally: purpose, audience, visual style, pages/sections, features, brand name/colors, content, and whether they need a simple frontend or backend. Do not ask all questions at once; prioritize what changes the design most.
Be practical and encouraging. If the user is unsure, suggest sensible defaults and let them proceed.
When the user says they are ready, summarize the brief in plain language and say they can click Build website. Do not output code in interview mode.
Safety: never ask for passwords, API keys, payment-card numbers, or sensitive personal data. Warn that generated previews are untrusted prototypes and should be reviewed before production.`;

export async function POST(req: Request) {
  try {
    if (!process.env.OPENAI_API_KEY) {
      return NextResponse.json({ error: "Add OPENAI_API_KEY to .env.local, then restart the dev server." }, { status: 503 });
    }
    const body = await req.json();
    const messages = Array.isArray(body.messages) ? body.messages : [];
    if (messages.length > 40) return NextResponse.json({ error: "Please start a fresh brief for a new project." }, { status: 400 });

    const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
    const completion = await client.chat.completions.create({
      model: process.env.OPENAI_MODEL || "gpt-4.1-mini",
      temperature: 0.6,
      max_tokens: 350,
      messages: [
        { role: "system", content: systemPrompt },
        ...messages.slice(-20).filter((m: any) => ["user", "assistant"].includes(m.role) && typeof m.content === "string")
      ]
    });
    const reply = completion.choices[0]?.message?.content?.trim() || "Tell me a little more about the website you have in mind.";
    return NextResponse.json({ reply });
  } catch (error) {
    console.error("Agent route failed", error);
    return NextResponse.json({ error: "The agent could not respond. Check your API configuration and try again." }, { status: 500 });
  }
}