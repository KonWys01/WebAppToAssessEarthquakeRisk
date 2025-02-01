export interface GeojsonSingle {
    type: 'Feature';
    properties: Properties;
    geometry: Point;
    id: string;
  }
  
  export interface Metadata {
    generated: number;
    url: string;
    title: string;
    status: number;
    api: string;
    count: number;
  }
  
  export interface Geojson {
    type: string;
    metadata: Metadata;
    features: GeojsonSingle[];
    bbox: number[];
  }
  
  export interface Properties {
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
  }
  
  export interface Point {
    type: 'Point';
    coordinates: [number | null, number | null, number | null];
  }
  
  export interface EarthquakesFiltered {
    id: number;
    mag: number;
    date: string;
    geometry: Point;
    id_geom: string;
    type: string;
    time: number;
  }
  
  export interface ResponseModelNoCount {
    data: EarthquakesFiltered[] | GeojsonSingle | string;
    status_code: number;
  }
  
  export interface ResponseModel extends ResponseModelNoCount {
    count: number;
  }
  
  export interface TypesResponseModel {
    data: string[];
    status_code: number;
    count: number;
  }
  
  export interface ResponseModelEarthquakeFiltered {
    data: EarthquakesFiltered[];
    status_code: number;
    count: number;
  }
  
  export interface ResponseModelSingleEarthquake {
    data: GeojsonSingle;
    status_code: number;
    count: number;
  }
  
  export interface Filters {
    mag_min?: number | null;
    mag_max?: number | null;
    date_start?: string | null;
    date_end?: string | null;
    coordinates?: [number, number][] | null | string;
    type?: string | null;
  }
  
  export interface EarthquakeCoordinates {
    mag: number | null;
    x: number | null;
    y: number | null;
    h: number | null;
  }
  