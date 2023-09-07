from pydantic import BaseModel
from typing import List
from geojson_pydantic.geometries import Point


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
    alert: int | None
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


class Earthquake(Properties):
    id: int
    geom: Point


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

    class Config:
        from_attributes = True
