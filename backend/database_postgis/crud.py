from datetime import datetime
from typing import List, Text
import ast

from sqlalchemy.orm import Session
from geoalchemy2.shape import from_shape
from geoalchemy2 import functions
from shapely.geometry import Point

from . import schemas, models


def model_to_schema(eq: models.Earthquake) -> schemas.GeojsonSingle:
    type = 'Feature'
    properties = schemas.PropertiesFile(
        mag=eq.mag,
        place=eq.place,
        time=eq.time,
        updated=eq.updated,
        tz=eq.tz,
        url=eq.url,
        detail=eq.detail,
        felt=eq.felt,
        cdi=eq.cdi,
        mmi=eq.mmi,
        alert=eq.alert,
        status=eq.status,
        tsunami=eq.tsunami,
        sig=eq.sig,
        net=eq.net,
        code=eq.code,
        ids=eq.ids,
        sources=eq.sources,
        types=eq.types,
        nst=eq.nst,
        dmin=eq.dmin,
        rms=eq.rms,
        gap=eq.gap,
        magType=eq.magType,
        type=eq.type,
        title=eq.title
    )
    geometry = eq.geom
    id_geom = eq.id_geom
    geojson_single = schemas.GeojsonSingle(
        type=type,
        properties=properties,
        geometry=geometry,
        id=id_geom
    )
    return geojson_single


def add_multiple_earthquakes(db: Session, file: schemas.Geojson) -> int:
    # TODO add id field to model and then give its value in these two post requests
    earthquakes_to_add = []
    for eq in file.features:
        db_item = models.Earthquake(**eq.properties.model_dump())
        db_item.date = datetime.fromtimestamp(eq.properties.time // 1000)

        point = Point(eq.geometry.coordinates)
        db_item.geom = from_shape(point, srid=4326)

        db_item.id_geom = eq.id

        earthquakes_to_add.append(db_item)

    latest_earthquake_id = db.query(models.Earthquake).order_by(models.Earthquake.id.desc()).first().id

    db.add_all(earthquakes_to_add)
    db.commit()

    get_count_of_added_earthquakes = db.query(models.Earthquake.id).filter(
        models.Earthquake.id > latest_earthquake_id).count()
    return get_count_of_added_earthquakes


def add_single_earthquake(db: Session, earthquake: schemas.GeojsonSingle) -> schemas.GeojsonSingle:
    db_item = models.Earthquake(**earthquake.properties.model_dump())
    db_item.date = datetime.fromtimestamp(earthquake.properties.time // 1000)

    point = Point(earthquake.geometry.coordinates)
    db_item.geom = from_shape(point, srid=4326)

    db_item.id_geom = earthquake.id

    db.add(db_item)
    db.commit()
    db.refresh(db_item)

    load_added_earthquake = db.query(models.Earthquake).order_by(models.Earthquake.id.desc()).first()

    return model_to_schema(load_added_earthquake)


def get_single_earthquake(db: Session, id: int) -> schemas.GeojsonSingle:
    return model_to_schema(db.query(models.Earthquake).filter(models.Earthquake.id == id).first())


def all_earthquakes_to_schema(filtered_earthquakes) -> List[schemas.GetAll]:
    eq_list = []
    for eq in filtered_earthquakes:
        eq_list.append(
            schemas.GetAll(
                id=eq[0],
                mag=eq[1],
                date=eq[2],
                geometry=eq[3],
                id_geom=eq[4],
                type=eq[5]
            )
        )
    return eq_list


def get_multiple_earthquakes(
        db: Session,
        mag_min: float,
        mag_max: float,
        date_start: str,
        date_end: str,
        coordinates: str | None,
        type_eq: str) -> List[schemas.GetAll]:
    filters = []
    if mag_min:
        filters.append(models.Earthquake.mag >= mag_min)
    if mag_max:
        filters.append(models.Earthquake.mag <= mag_max)
    if date_start:
        filters.append(models.Earthquake.date >= date_start)
    if date_end:
        filters.append(models.Earthquake.date <= date_end)
    if coordinates:
        """
        format -> [[-180,-90],[180,-90],[180,90],[-180,90],[-180,-90]]
        """
        st_within_text = 'SRID=4326;POLYGON(('
        str_to_list = ast.literal_eval(coordinates)
        formatted_coordinates = ', '.join(
            ' '.join(str(j) for j in i) for i in str_to_list)
        st_within_text = st_within_text + formatted_coordinates + '))'

        geom_filter = functions.ST_Within(
            models.Earthquake.geom,
            functions.ST_GeomFromEWKT(st_within_text))
        filters.append(geom_filter)
    if type_eq:
        type_filter = f"%{type_eq}%"
        filters.append(models.Earthquake.type.ilike(type_filter))

    filtered_earthquakes = db.query(models.Earthquake) \
        .with_entities(
        models.Earthquake.id,
        models.Earthquake.mag,
        models.Earthquake.date,
        models.Earthquake.geom,
        models.Earthquake.id_geom,
        models.Earthquake.type) \
        .filter(*filters)\
        .all()

    return all_earthquakes_to_schema(filtered_earthquakes)


def delete_earthquake(db: Session, id: int) -> int:
    delete_query = db.query(models.Earthquake).filter(models.Earthquake.id == id).delete()
    db.commit()
    return delete_query


def get_types(db: Session) -> List[Text]:
    query = db.query(models.Earthquake.type).distinct(models.Earthquake.type)
    return db.scalars(query).all()
