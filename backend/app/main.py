import os

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.core.config import get_settings
from app.routes import chat, conversations, property

settings = get_settings()

app = FastAPI(
    title="Property Chat API",
    description="AI-powered property information collection",
    version="2.0.0",
)

cors_kwargs: dict = {
    "allow_credentials": True,
    "allow_methods": ["*"],
    "allow_headers": ["*"],
}

if settings.cors_origin_list:
    cors_kwargs["allow_origins"] = settings.cors_origin_list

if settings.cors_localhost_regex:
    cors_kwargs["allow_origin_regex"] = settings.cors_localhost_regex

app.add_middleware(CORSMiddleware, **cors_kwargs)

app.include_router(chat.router)
app.include_router(conversations.router)
app.include_router(property.router)


@app.get("/health")
async def health() -> dict[str, str]:
    return {"status": "ok"}


if __name__ == "__main__":
    import uvicorn

    port = int(os.environ.get("PORT", "8000"))
    uvicorn.run("app.main:app", host="0.0.0.0", port=port, reload=True)
