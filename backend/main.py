from fastapi import FastAPI

from routers.earthquake import earthquake_router
from database_postgis.models import  Base
from database_postgis.database import engine


Base.metadata.create_all(bind=engine)
app = FastAPI()
app.include_router(earthquake_router)


@app.get("/")
async def default():
    return {"message": "default"}
