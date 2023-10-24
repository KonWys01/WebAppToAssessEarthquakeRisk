from datetime import datetime

from sqlalchemy.orm import Session
from geoalchemy2.shape import from_shape
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
