from fastapi import FastAPI

app = FastAPI(title="Reelspin API")


@app.get("/")
async def root():
    return {
        "message": "Welcome to Reelspin API"
    }


@app.get("/health")
async def health_check():
    return {
        "status": "healthy"
    }