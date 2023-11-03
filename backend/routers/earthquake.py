from typing import Any

from fastapi import APIRouter, Depends, status, HTTPException
from sqlalchemy.orm import Session

from database_postgis.database import SessionLocal
from database_postgis.schemas import Geojson, GeojsonSingle, ResponseModel, ResponseModelNoCount
from database_postgis.crud import \
    add_single_earthquake, \
    add_multiple_earthquakes, \
    get_single_earthquake, \
    get_multiple_earthquakes, \
    delete_earthquake

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


@earthquake_router.get("/", response_model=ResponseModel)
async def get_all_earthquakes(
        mag_min: float = None,
        mag_max: float = None,
        date_start: str = None,
        date_end: str = None,
        coordinates: str = None,
        type: str = None,
        db: Session = Depends(get_db),
):
    crud_data = get_multiple_earthquakes(
        db=db,
        mag_min=mag_min,
        mag_max=mag_max,
        date_start=date_start,
        date_end=date_end,
        coordinates=coordinates,
        type_eq=type
    )
    return ResponseModel(
        data=crud_data,
        status_code=status.HTTP_200_OK,
        count=len(crud_data)
    )


@earthquake_router.post("/", response_model=ResponseModel)
async def add_earthquake(data: Geojson | GeojsonSingle | Any, db: Session = Depends(get_db)):
    """
    trzeba zmienic nazwe zmiennej file. Możliwe do przekazania są:
    * dane z pliku ../downloaded_data - czyli plik zawierający wiele trzesien ziemi
    * dane pojedynczego trzaesienia ziemi
    """

    try:
        eq_data = Geojson.model_validate(data)
        crud_data = add_multiple_earthquakes(db=db, file=eq_data)
        return ResponseModel(
            data="Added multiple earthquakes",
            status_code=status.HTTP_200_OK,
            count=crud_data
        )
    except:
        try:
            eq_data = GeojsonSingle.model_validate(data)
            crud_data = add_single_earthquake(db=db, earthquake=eq_data)
            return ResponseModel(
                data=crud_data,
                status_code=status.HTTP_200_OK,
                count=1
            )
        except:
            raise HTTPException(
                status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
                detail='Incorrect post body data'
            )


@earthquake_router.get("/{id}", response_model=ResponseModel)
async def get_specific_earthquake(id: int, db: Session = Depends(get_db)):
    try:
        crud_data = get_single_earthquake(db=db, id=id)
        return ResponseModel(
            data=crud_data,
            status_code=status.HTTP_200_OK,
            count=1
        )
    except:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail='Earthquake with that id does not exist'
        )


@earthquake_router.delete("/{id}", response_model=ResponseModelNoCount)
async def remove_earthquake(id: int, db: Session = Depends(get_db)):
    data_crud = delete_earthquake(db=db, id=id)
    if data_crud == 1:
        return ResponseModelNoCount(
            data=f"Deleted earthquake with {id=}",
            status_code=status.HTTP_200_OK
        )
    elif data_crud == 0:
        return ResponseModelNoCount(
            data=f"Earthquake with {id=} does not exist. Delete process aborted",
            status_code=status.HTTP_404_NOT_FOUND
        )

