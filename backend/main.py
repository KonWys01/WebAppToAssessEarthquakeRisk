from fastapi import FastAPI

from routers.earthquake import earthquake_router
app = FastAPI()
app.include_router(earthquake_router)


@app.get("/")
async def default():
    return {"message": "default"}
