from typing import List
from datetime import date

from geojson_pydantic.geometries import Point
from geoalchemy2.shape import to_shape
from geoalchemy2.elements import WKBElement
from pydantic import BaseModel, validator


class Properties(BaseModel):
    mag: float | None
    place: str | None
    time: int | None
    updated: int | None
    tz: int | None
    url: str | None
    detail: str | None
    felt: int | None
    cdi: float | None
    mmi: float | None
    alert: str | None
    status: str | None
    tsunami: int | None
    sig: int | None
    net: str | None
    code: str | None
    ids: str | None
    sources: str | None
    types: str | None
    nst: int | None
    dmin: float | None
    rms: float | None
    gap: float | None
    magType: str | None
    type: str | None
    title: str | None

    class Config:
        from_attributes = True


def convert_to_point(point: WKBElement) -> Point:
    point = to_shape(point)
    type = 'Point'
    coordinates = [point.x, point.y, point.z]
    return Point(type=type, coordinates=coordinates)


class Earthquake(Properties):
    id: int
    date: date
    geom: Point

    @validator('geom', pre=True, allow_reuse=True, always=True)
    def correct_geom_format(cls, v):
        if not isinstance(v, WKBElement):
            raise ValueError('must be a valid WKBE element')
        return convert_to_point(v)


class GeojsonSingle(BaseModel):
    type: str
    properties: Properties
    geometry: Point
    id: str

    class Config:
        from_attributes = True


class Metadata(BaseModel):
    generated: int
    url: str
    title: str
    status: int
    api: str
    count: int

    class Config:
        from_attributes = True


class Geojson(BaseModel):
    type: str
    metadata: Metadata
    features: List[GeojsonSingle]
    bbox: List[float]

    class Config:
        from_attributes = True