from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from database_postgis.database import SessionLocal
from database_postgis.schemas import Geojson
from database_postgis.crud import add_earthquake_db

earthquake_router = APIRouter(
    prefix='/earthquake',
    tags=['earthquake']
)


# Dependency
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


@earthquake_router.get("/")
async def get_all_earthquakes():
    return {"message": "returns all earthquakes"}


@earthquake_router.post("/")
async def add_earthquake(file: Geojson, db: Session = Depends(get_db)):
    return add_earthquake_db(db=db, file=file)


@earthquake_router.get("/{id}")
async def get_specific_earthquake(id: int):
    return {"message": f"return earthquake with {id=}"}


@earthquake_router.delete("/{id}")
async def remove_earthquake(id: int):
    return {"message": f"removes earthquake with {id=}"}
