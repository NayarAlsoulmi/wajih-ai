

# وجيه AI — Wajih AI

**Smart financial & regulatory guidance, powered by AI.**

Wajih AI (وجيه — Arabic for "guide/facilitator") is a concept prototype for an
AI assistant that helps individuals and businesses in Saudi Arabia navigate
financial and regulatory processes: complaints, fraud reports, fintech
licensing, AML/KYC compliance, and document readiness — all in one
conversational interface.

> This is an unofficial concept/demo built with Google AI Studio and styled
> after SAMA's (Saudi Central Bank) visual identity to explore what an
> AI-native regulatory guidance experience could look like. It is not an
> official SAMA product.

## What it does

The app splits into two guided paths:

- **Individuals** — file complaints, report suspicious transactions/scams,
  ask financial questions, and track a personal "financial health" view.
- **Businesses** — apply for fintech/payment licenses, draft AML/KYC
  policies, and manage regulatory case readiness.

Core features:

- **Wajih AI chat assistant** — answers common financial/regulatory
  questions and can automatically open a tracked case (e.g. a complaint or
  license request) based on what you ask.
- **Case management** — each case tracks required documents, a completion
  ("readiness") score, and status as documents are submitted.
- **Document analysis** — upload a file (e.g. a bank statement or an AML
  policy draft) and get a simulated AI audit: a summary, issues found, and
  recommendations.
- **Alerts** — a notification feed that surfaces case updates and audit
  results as they happen.
- **Light/dark theme**, RTL Arabic interface.

## How it's built

- React 19 + Vite frontend (`src/`)
- Express server (`server.ts`) serving the app and a `/api/wajih-ai/chat`
  endpoint
- Optional Gemini API integration (`@google/genai`) for live AI responses —
  without an API key the app runs in a **mock simulation mode** using
  canned FAQ responses, so it's fully runnable out of the box.

## Run Locally

**Prerequisites:** Node.js

1. Install dependencies:
   `npm install`
2. (Optional) Set `GEMINI_API_KEY` in `.env.local` to enable real Gemini
   responses instead of the mock simulation. See `.env.example`.
3. Run the app:
   `npm run dev`
