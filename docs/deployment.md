# Deployment checklist

## Railway (backend)

- [ ] Root directory: `backend`
- [ ] `OPENAI_API_KEY` set in Railway variables
- [ ] `CORS_ORIGINS` includes production Vercel URL
- [ ] Health check path: `/health`
- [ ] Note public API URL for frontend env

## Vercel (frontend)

- [ ] Root directory: `frontend`
- [ ] `NEXT_PUBLIC_API_URL` points to Railway URL
- [ ] Redeploy after backend CORS update if needed

## Smoke test

1. Open deployed frontend.
2. Confirm assistant greeting loads.
3. Answer all five questions.
4. Verify JSON card appears with all fields filled.
