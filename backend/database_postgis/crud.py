from datetime import datetime
from typing import Type

from sqlalchemy.orm import Session
from geoalchemy2.shape import from_shape
from shapely.geometry import Point

from . import schemas, models


def add_multiple_earthquakes(db: Session, file: schemas.Geojson) -> int:
    # TODO add id field to model and then give its value in these two post requests
    earthquakes_to_add = []
    for eq in file.features:
        db_item = models.Earthquake(**eq.properties.model_dump())
        db_item.date = datetime.fromtimestamp(eq.properties.time // 1000)

        point = Point(eq.geometry.coordinates)
        db_item.geom = from_shape(point, srid=4326)
        earthquakes_to_add.append(db_item)

    latest_earthquake_id = db.query(models.Earthquake).order_by(models.Earthquake.id.desc()).first().id

    db.add_all(earthquakes_to_add)
    db.commit()

    get_count_of_added_earthquakes = db.query(models.Earthquake.id).filter(
        models.Earthquake.id > latest_earthquake_id).count()
    return get_count_of_added_earthquakes


def add_single_earthquake(db: Session, earthquake) -> Type[schemas.Earthquake]:

    db_item = models.Earthquake(**earthquake.properties.model_dump())
    db_item.date = datetime.fromtimestamp(earthquake.properties.time // 1000)

    point = Point(earthquake.geometry.coordinates)
    db_item.geom = from_shape(point, srid=4326)
    db.add(db_item)
    db.commit()
    db.refresh(db_item)

    load_added_earthquake = db.query(models.Earthquake).order_by(models.Earthquake.id.desc()).first()
    return load_added_earthquake
