# MK19X Agentic Website Builder

A Next.js starter for a conversational AI website builder. It interviews users, turns a brief into a single-file responsive HTML prototype, previews it in a sandboxed iframe, and lets the user export the HTML.

## What works in this MVP
- Guided conversation with an AI discovery agent (one question at a time)
- Starter ideas for an online store, portfolio, business site, or SaaS landing page
- Generate a standalone HTML prototype from the conversation or an edited brief
- Desktop/mobile preview modes and source-code view
- Download generated HTML and the written brief
- Responsive dark UI branded as MK19X
- Server-side API key handling; the key is never sent to the browser
- Sandboxed iframe preview (`allow-scripts`, without `allow-same-origin`)

## Requirements
- Node.js 20.9+ recommended
- An OpenAI API key with API access and billing configured

## Run locally
1. Extract the ZIP.
2. In this folder run `npm install`.
3. Copy `.env.example` to `.env.local`.
4. Add your private key to `.env.local`:
   ```
   OPENAI_API_KEY=your_key_here
   OPENAI_MODEL=gpt-4.1-mini
   ```
5. Start the app:
   ```
   npm run dev
   ```
6. Open `http://localhost:3000`.

Do not commit `.env.local` or expose your API key in frontend code.

## Important scope limits
This is a functional starter, not yet a production multi-user SaaS. Website generation returns a single HTML file. The prototype does not create real databases, user accounts, payment processing, server APIs, or deploy a site to the public internet. Forms and commerce interactions in generated websites should be treated as demos.

Before public launch, add authentication, project persistence, rate limiting, usage quotas, billing if needed, abuse protection, automated HTML validation, isolated preview hosting, error monitoring, privacy/terms pages, and security review. Do not execute untrusted generated code outside the sandbox. Test the project in your own environment with a valid API key; no live API test is performed by this package.
