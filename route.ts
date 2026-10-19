import OpenAI from "openai";
import { NextResponse } from "next/server";

export const runtime = "nodejs";

const buildPrompt = `You are a senior product designer and frontend engineer working for MK19X.
Generate a polished, responsive, self-contained website prototype from the user brief.
Return ONLY a complete HTML document. No markdown fences or commentary.
Requirements:
- Put all CSS in one <style> block and JavaScript in one <script> block when needed.
- Use semantic HTML, responsive layouts, accessible labels, visible focus states, and reduced-motion support.
- Create a high-quality visual design with a coherent color system, strong typography, generous spacing, clear hierarchy, and realistic copy.
- Make navigation and visible interactions work. If a form is included, show a clear demo success state; do not claim to send data anywhere.
- Use CSS gradients and shapes rather than relying on remote image assets. If images materially help, use stable Unsplash source URLs with descriptive alt text, but ensure layout still looks good if they fail.
- Do not include secrets, API keys, hidden tracking, or external scripts.
- Do not implement real authentication, payment processing, database writes, or production backend behavior. Represent these as clearly labeled demo UI only.
- The HTML will be rendered in a sandboxed iframe. Do not use top navigation, popups, or parent-window access.
- Include a useful title and meta description. Prioritize the user's requested business and features.
- Output valid HTML from <!doctype html> through </html>.`;

export async function POST(req: Request) {
  try {
    if (!process.env.OPENAI_API_KEY) {
      return NextResponse.json({ error: "Add OPENAI_API_KEY to .env.local, then restart the dev server." }, { status: 503 });
    }
    const body = await req.json();
    const brief = typeof body.brief === "string" ? body.brief.slice(0, 12000) : "";
    if (brief.trim().length < 10) return NextResponse.json({ error: "Please add a little more detail to your website brief." }, { status: 400 });

    const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
    const completion = await client.chat.completions.create({
      model: process.env.OPENAI_MODEL || "gpt-4.1-mini",
      temperature: 0.7,
      max_tokens: 9000,
      messages: [
        { role: "system", content: buildPrompt },
        { role: "user", content: `Build a website based on this brief:\n\n${brief}` }
      ]
    });
    let html = completion.choices[0]?.message?.content?.trim() || "";
    html = html.replace(/^```(?:html)?\s*/i, "").replace(/\s*```$/, "");
    if (!html.toLowerCase().includes("<!doctype html") && !html.toLowerCase().includes("<html")) {
      return NextResponse.json({ error: "The generator returned an incomplete page. Please try building again." }, { status: 502 });
    }
    return NextResponse.json({ html });
  } catch (error) {
    console.error("Build route failed", error);
    return NextResponse.json({ error: "Website generation failed. Please check your API configuration and try again." }, { status: 500 });
  }
}