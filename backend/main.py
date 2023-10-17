from fastapi import FastAPI
import uvicorn

from routers.earthquake import earthquake_router
from database_postgis.models import Base
from database_postgis.database import engine


Base.metadata.create_all(bind=engine)
app = FastAPI()
app.include_router(earthquake_router)


@app.get("/")
async def default():
    return {"message": "default"}


if __name__ == "__main__":
    uvicorn.run('main:app', host="127.0.0.1", port=9999, reload=True)