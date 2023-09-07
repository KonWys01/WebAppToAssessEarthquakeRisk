from fastapi import APIRouter

earthquake_router = APIRouter(
    prefix='/earthquake',
    tags=['earthquake']
)


@earthquake_router.get("/")
async def get_all_earthquakes():
    return {"message": "returns all earthquakes"}


@earthquake_router.post("/")
async def add_earthquake(earthquake: dict):
    return {"message": "adding earthquake to database",
            "earthquake": earthquake}


@earthquake_router.get("/{id}")
async def get_specific_earthquake(id: int):
    return {"message": f"return earthquake with {id=}"}


@earthquake_router.delete("/{id}")
async def remove_earthquake(id: int):
    return {"message": f"removes earthquake with {id=}"}
