from fastapi import FastAPI
import uvicorn
from starlette.middleware.cors import CORSMiddleware

from routers.earthquake import earthquake_router
from database_postgis.models import Base
from database_postgis.database import engine


Base.metadata.create_all(bind=engine)
app = FastAPI()
app.include_router(earthquake_router)
origins = [
    "http://localhost:4200",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/")
async def default():
    return {"message": "default"}


if __name__ == "__main__":
    uvicorn.run('main:app', host="127.0.0.1", port=9999, reload=True)