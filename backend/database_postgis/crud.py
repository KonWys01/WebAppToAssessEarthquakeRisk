from datetime import datetime

from sqlalchemy.orm import Session
from geoalchemy2.shape import from_shape
from shapely.geometry import Point

from . import schemas, models


def add_earthquake_db(db: Session, file: schemas.Geojson):
    for eq in file['features']:
        db_item = models.Earthquake(**eq['properties'])
        db_item.date = datetime.fromtimestamp(eq['properties']['time'] // 1000)

        point = Point(eq['geometry']['coordinates'])
        db_item.geom = from_shape(point, srid=4326)
        db.add(db_item)
        db.commit()
        db.refresh(db_item)
        break
    test = db.query(models.Earthquake).order_by(models.Earthquake.id.desc()).first()
    return test
