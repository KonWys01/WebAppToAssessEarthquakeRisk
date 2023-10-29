from typing import Union, Any, List

from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from database_postgis.database import SessionLocal
from database_postgis.schemas import Geojson, Earthquake, GeojsonSingle, GetAll
from database_postgis.crud import \
    add_single_earthquake, \
    add_multiple_earthquakes, \
    get_single_earthquake, \
    get_multiple_earthquakes

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


@earthquake_router.get("/", response_model=List[GetAll])
async def get_all_earthquakes(
        mag_min: float = 0.0,
        mag_max: float = 10.0,
        date_start: str = '-infinity',
        date_end: str = 'infinity',
        coordinates: str = None,
        type: str = '',
        db: Session = Depends(get_db),
):
    return get_multiple_earthquakes(
        db=db,
        mag_min=mag_min,
        mag_max=mag_max,
        date_start=date_start,
        date_end=date_end,
        coordinates=coordinates,
        type_eq=type
    )


@earthquake_router.post("/", response_model=Union[Earthquake, int, str, GeojsonSingle])
async def add_earthquake(data: Geojson | GeojsonSingle | Any, db: Session = Depends(get_db)):
    """
    trzeba zmienic nazwe zmiennej file. Możliwe do przekazania są:
    * dane z pliku ../downloaded_data - czyli plik zawierający wiele trzesien ziemi
    * dane pojedynczego trzaesienia ziemi
    """

    try:
        eq_data = Geojson.model_validate(data)
        return add_multiple_earthquakes(db=db, file=eq_data)
    except:
        # try:
        eq_data = GeojsonSingle.model_validate(data)
        return add_single_earthquake(db=db, earthquake=eq_data)
        # except:
        #     print('none')
        #     return 'Wrong type of Earthquake data'


@earthquake_router.get("/{id}", response_model=GeojsonSingle)
async def get_specific_earthquake(id: int, db: Session = Depends(get_db)):
    return get_single_earthquake(db=db, id=id)


@earthquake_router.delete("/{id}")
async def remove_earthquake(id: int):
    return {"message": f"removes earthquake with {id=}"}
