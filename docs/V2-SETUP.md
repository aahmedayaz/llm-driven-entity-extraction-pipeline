# Version 2 setup

Branches:

- `version-1` — frozen MVP (same as original main)
- `version-2` — auth, Supabase, HomeData insights, voice, dossier UI

## Supabase (free tier)

1. Create a project at [supabase.com](https://supabase.com).
2. Run `docs/supabase-schema.sql` in the SQL editor.
3. Copy **Project URL**, **anon key**, and **service_role key** (Settings → API).

### Backend (`backend/.env`)

```env
SUPABASE_URL=https://xxxx.supabase.co
SUPABASE_ANON_KEY=eyJ...
SUPABASE_SERVICE_ROLE_KEY=eyJ...
HOMEDATA_API_KEY=your_homedata_key
CORS_ORIGINS=http://localhost:3000,https://your-v2.vercel.app
```

Never commit real keys. Do not put `HOMEDATA_API_KEY` in the frontend.

### Frontend (`frontend/.env.local`)

```env
# Must include https:// (no protocol = broken relative URLs on Vercel)
NEXT_PUBLIC_API_URL=http://localhost:8000
NEXT_PUBLIC_SUPABASE_URL=https://xxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJ...
```

## Deploy two URLs

| Version | Vercel project | Production branch | URL |
|---------|----------------|-------------------|-----|
| V1 | `llm-driven-entity-extraction-pipeline` | `main` | https://llm-driven-entity-extraction-chatbot-ayaz.vercel.app |
| V2 | `llm-driven-entity-extraction-pipeline-v2` | `version-2` | https://v2-llm-driven-entity-extraction-chatbot-ayaz.vercel.app |

V2 Vercel settings: **Root Directory** = `frontend`.  
`NEXT_PUBLIC_API_URL` must be a full URL, e.g. `https://your-app.up.railway.app` (not host-only).

```powershell
cd "e:\Ayaz Work\llm-driven-entity-extraction-pipeline"
vercel deploy --prod --yes
```

## Features without login

- Property survey (voice or type)
- Postcode → address → EPC + solar report

## Requires sign-in

- Saved chat history (`/history`)
- Save property report to account
