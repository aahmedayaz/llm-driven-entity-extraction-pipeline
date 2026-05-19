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

## Required fields

| Field | Values |
|-------|--------|
| Property type | detached, semi-detached, terraced, flat |
| Annual electricity bill | Number (GBP) |
| Occupants | Positive integer |
| Heating system | gas boiler, oil, LPG, electric, other |
| Interest | solar only, solar + battery storage |

## Prerequisites

- Node.js 18+
- Python 3.11+
- [OpenAI API key](https://platform.openai.com/api-keys)

## Environment variables

### Backend (`backend/.env`)

```env
OPENAI_API_KEY=your_key_here
OPENAI_MODEL=gpt-4o-mini
# Optional in local dev — any localhost port is allowed by default
# CORS_ORIGINS=https://your-app.vercel.app
```

### Frontend (`frontend/.env.local`)

```env
NEXT_PUBLIC_API_URL=http://localhost:8000
```

Copy from `.env.example` / `.env.local.example` files.

## Run locally

### Backend

```bash
cd backend
python -m venv venv
# Windows (use the venv — do not pip install globally)
venv\Scripts\activate
venv\Scripts\pip install -r requirements.txt
# Or: .\scripts\install.ps1

# macOS/Linux
source venv/bin/activate
pip install -r requirements.txt
cp .env.example .env
# Edit .env with your OPENAI_API_KEY

uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

API: `http://localhost:8000`  
Health: `GET /health`  
Chat: `POST /chat`

### Frontend

```bash
cd frontend
npm install
cp .env.local.example .env.local

npm run dev
```

App: `http://localhost:3000`

## API contract

**POST** `/chat`

Request:

```json
{
  "messages": [
    { "role": "user", "content": "..." },
    { "role": "assistant", "content": "..." }
  ]
}
```

Response:

```json
{
  "reply": "Assistant message",
  "complete": false,
  "data": {
    "propertyType": null,
    "annualElectricityBill": null,
    "occupants": null,
    "heatingSystem": null,
    "interest": null
  }
}
```

When `complete` is `true`, all fields in `data` are populated.

## Deployment

### Backend → Railway

1. Push this repo to GitHub.
2. Create a new [Railway](https://railway.app) project → **Deploy from GitHub**.
3. Set the **root directory** to `backend`.
4. Add environment variables:
   - `OPENAI_API_KEY`
   - `OPENAI_MODEL` (optional, default `gpt-4o-mini`)
   - `CORS_ORIGINS` = your Vercel URL (e.g. `https://your-app.vercel.app`)
5. Railway sets `PORT` automatically; `railway.toml` / `Procfile` start Uvicorn.
6. Copy the public Railway URL (e.g. `https://xxx.up.railway.app`).

### Frontend → Vercel

1. Import the GitHub repo in [Vercel](https://vercel.com).
2. Set **Root Directory** to `frontend`.
3. Framework preset: **Next.js**.
4. Environment variable:
   - `NEXT_PUBLIC_API_URL` = your Railway backend URL (no trailing slash)
5. Deploy.

After deploy, update Railway `CORS_ORIGINS` if the Vercel domain changed, then redeploy the backend.

## Tech stack

| Layer | Stack |
|-------|--------|
| Frontend | Next.js 15, TypeScript, Tailwind CSS |
| Backend | FastAPI, Pydantic, Uvicorn |
| LLM | OpenAI (gpt-4o-mini) |
| Hosting | Vercel + Railway |

## License

MIT
