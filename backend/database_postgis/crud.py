from sqlalchemy.orm import Session

from pprint import pprint

from . import schemas


def add_earthquake_db(db: Session, file: schemas.Geojson):
    for feature in file.features:
        pprint(feature.properties.mag)