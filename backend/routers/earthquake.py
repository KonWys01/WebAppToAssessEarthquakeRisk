from typing import Any, List
from io import BytesIO

import pandas as pd
import geopandas as gpd
from fastapi import APIRouter, Depends, status, HTTPException, Query
from shapely.geometry import Point
from sqlalchemy.orm import Session
from starlette.responses import FileResponse, Response
from openpyxl.utils.dataframe import dataframe_to_rows
from openpyxl import Workbook

from database_postgis.database import SessionLocal
from database_postgis.schemas import Geojson, GeojsonSingle, ResponseModel, ResponseModelNoCount, TypeResponseModel
from database_postgis.crud import \
    add_single_earthquake, \
    add_multiple_earthquakes, \
    get_single_earthquake, \
    get_multiple_earthquakes, \
    delete_earthquake, \
    get_types, get_earthquakes_to_export

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


@earthquake_router.get("/ml/{id}")
async def get_prediction_per_polygon():
    return None

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
        eq_data = Geojson.validate(data)
        crud_data = add_multiple_earthquakes(db=db, file=eq_data)
        return ResponseModel(
            data="Added multiple earthquakes",
            status_code=status.HTTP_200_OK,
            count=crud_data
        )
    except:
        try:
            eq_data = GeojsonSingle.validate(data)
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


@earthquake_router.get("/types/", response_model=TypeResponseModel)
async def get_all_types(db: Session = Depends(get_db)):
    crud_data = get_types(db=db)
    return TypeResponseModel(
        data=crud_data,
        status_code=status.HTTP_200_OK,
        count=len(crud_data)
    )


@earthquake_router.get("/geojson/")
async def get_geojson_data(db: Session = Depends(get_db), ids: List[int] = Query(None)):

    crud_data = get_earthquakes_to_export(db=db, ids=ids)
    items_dict = [item.dict() for item in crud_data]

    df = pd.DataFrame(items_dict)
    geometry = [Point(lon, lat, depth) for lon, lat, depth in zip(df['lng'], df['lat'], df['depth'])]

    columns_to_drop = ['lng', 'lat', 'depth']
    df = df.drop(columns=columns_to_drop)

    gdf = gpd.GeoDataFrame(df, geometry=geometry)

    response = Response(content=gdf.to_json())
    response.headers["Content-Disposition"] = "attachment; filename=data.geojson"
    response.headers["Content-Type"] = "application/json"
    return response

@earthquake_router.get("/csv/")
async def get_csv_data(db: Session = Depends(get_db), ids: List[int] = Query(None)):

    crud_data = get_earthquakes_to_export(db=db, ids=ids)
    items_dict = [item.dict() for item in crud_data]

    df = pd.DataFrame(items_dict)

    csv_data = df.to_csv(index=False)

    response = Response(content=csv_data)
    response.headers["Content-Disposition"] = "attachment; filename=data.csv"
    response.headers["Content-Type"] = "text/csv"
    return response


@earthquake_router.get("/xlsx/")
async def get_xlsx_data(db: Session = Depends(get_db), ids: List[int] = Query(None)):
    crud_data = get_earthquakes_to_export(db=db, ids=ids)
    items_dict = [item.dict() for item in crud_data]

    df = pd.DataFrame(items_dict)

    wb = Workbook()
    ws = wb.active

    for r in dataframe_to_rows(df, index=False, header=True):
        ws.append(r)

    xlsx_io = BytesIO()
    wb.save(xlsx_io)
    xlsx_io.seek(0)

    response = Response(content=xlsx_io.getvalue())
    response.headers["Content-Disposition"] = "attachment; filename=data.xlsx"
    response.headers["Content-Type"] = (
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
    )
    return response


def dataframe_to_xml(df):
    xml = ['<root>']
    for _, row in df.iterrows():
        xml.append('<row>')
        for col_name, col_value in row.items():
            xml.append(f'<{col_name}>{col_value}</{col_name}>')
        xml.append('</row>')
    xml.append('</root>')
    return '\n'.join(xml)


@earthquake_router.get("/xml/")
async def get_xml_data(db: Session = Depends(get_db), ids: List[int] = Query(None)):
    crud_data = get_earthquakes_to_export(db=db, ids=ids)
    items_dict = [item.dict() for item in crud_data]

    df = pd.DataFrame(items_dict)
    xml_data = dataframe_to_xml(df)

    response = Response(xml_data)
    response.headers["Content-Disposition"] = "attachment; filename=data.xml"
    response.headers["Content-Type"] = "application/xml"

    return response


@earthquake_router.get("/picture/")
def image_endpoint():
    return FileResponse("C:\\Users\\sirko\\PycharmProjects\\stock\\src\\assets\\backtrader.png")
