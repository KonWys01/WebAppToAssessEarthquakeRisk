import { Injectable } from '@angular/core';
import { EARTHQUAKES } from '../../assets/test-data/earthquakes';
import { EarthquakeCoordinates } from '../models/earthquake.model';

@Injectable({
  providedIn: 'root',
})
export class EarthquakeService {
  constructor() {}
  getEarthquakes(): EarthquakeCoordinates[] {
    return EARTHQUAKES.map((eq) => ({
      mag: eq.properties.mag,
      x: eq.geometry.coordinates[0],
      y: eq.geometry.coordinates[1],
      h: eq.geometry.coordinates[2],
    }));
  }
}
