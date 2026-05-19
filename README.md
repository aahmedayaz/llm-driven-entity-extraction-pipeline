# LLM-Driven Property Chat

AI-powered conversational web app that collects structured property information through natural chat and returns final JSON output when all required fields are gathered.

## Features

- Natural language chat with OpenAI
- Progressive extraction of 5 property fields
- One question at a time (non-overwhelming UX)
- Automatic conversation completion with structured JSON display
- Monorepo: Next.js frontend + FastAPI backend

## Project structure

```
llm-driven-entity-extraction-pipeline/
├── frontend/     # Next.js (App Router) + Tailwind
├── backend/      # FastAPI + OpenAI
├── docs/         # Deployment notes
└── README.md
```

## LLM API used

The project uses the paid OpenAI API, originally configured with `gpt-4o-mini`.

I chose the paid API because unpaid/free access was taking too much time for an interactive chatbot experience. The paid OpenAI API was faster, more reliable, cost-effective, and strong enough for short conversational extraction tasks where the assistant needs to understand natural user replies like “450 pounds + we are 8 people + LPG” and turn them into structured fields.

## One thing AI got wrong

During development, the LLM repeatedly asked the same questions even after the user had already answered them. For example, after the user provided `flat`, `450 pounds`, `8 people`, `LPG`, and `solar + battery storage`, the assistant sometimes asked again for interest, occupants, or annual bill.

The exact fix was to stop using the LLM as the source of truth for collected fields. I made the backend use deterministic extraction from `backend/app/services/fallback_chat_service.py` through `backend/app/services/openai_service.py`. The rules-based extractor now decides which of the five required fields are present, and the chatbot only asks for the next missing field.

## Improvements with more time

- Add authentication so users can securely return to their own property surveys.
- Save chat history and extracted JSON summaries in a database.
- Add voice input for a more natural survey experience.
- Add a proper admin dashboard for reviewing completed property submissions.
- Improve validation and clarification for edge cases like unusual heating systems or unclear bill amounts.
- Add automated tests for the extraction flow and deployment checks.


## Web App Interface


