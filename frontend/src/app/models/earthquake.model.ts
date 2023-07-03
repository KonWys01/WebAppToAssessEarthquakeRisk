export interface Earthquake {
  type: 'Feature';
  properties: {
    mag: number | null;
    place: string | null;
    time: number | null;
    updated: number | null;
    tz: any | null;
    url: string | null;
    detail: string | null;
    felt: any | null;
    cdi: any | null;
    mmi: any | null;
    alert: any | null;
    status: string | null;
    tsunami: number | null;
    sig: number | null;
    net: string | null;
    code: string | null;
    ids: string | null;
    sources: string | null;
    types: string | null;
    nst: any | null;
    dmin: any | null;
    rms: number | null;
    gap: any | null;
    magType: string | null;
    type: string | null;
    title: string | null;
  };
  geometry: {
    type: 'Point';
    coordinates: [number | null, number | null, number | null];
  };
  id: string;
}

export interface EarthquakeCoordinates {
  mag: number | null;
  x: number | null;
  y: number | null;
  h: number | null;
}
