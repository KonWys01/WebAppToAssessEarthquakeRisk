from geoalchemy2 import Geometry
from sqlalchemy import Column, Integer, String, Double, Date, BigInteger

from .database import Base


class Earthquake(Base):
    __tablename__ = 'earthquake'

    id = Column(Integer, primary_key=True)
    date = Column(Date)
    mag = Column(Double)
    place = Column(String)
    time = Column(BigInteger)
    updated = Column(BigInteger)
    tz = Column(Integer)
    url = Column(String)
    detail = Column(String)
    felt = Column(Integer)
    cdi = Column(Double)
    mmi = Column(Double)
    alert = Column(String)
    status = Column(String)
    tsunami = Column(Integer)
    sig = Column(Integer)
    net = Column(String)
    code = Column(String)
    ids = Column(String)
    sources = Column(String)
    types = Column(String)
    nst = Column(Integer)
    dmin = Column(Double)
    rms = Column(Double)
    gap = Column(Double)
    magType = Column(String)
    type = Column(String)
    title = Column(String)
    geom = Column(Geometry(geometry_type='POINTZ', srid=4326, dimension=3))
