import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import * as L from 'leaflet';
import { firstValueFrom } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ConfigService {
  private appConfig: any;
  private tectonicPlates: any;
  constructor(public http: HttpClient) {}
  async loadConfig(): Promise<void> {
    await firstValueFrom(this.http.get('/assets/config.json')).then(
      (config) => {
        this.appConfig = config;
      }
    );
    await firstValueFrom(
      this.http.get('/assets/tectonic_plates_boundaries.json')
    ).then((resp) => {
      this.tectonicPlates = resp;
    });
  }

  get tectonicPlatesGeoJSON(): L.GeoJSON {
    return L.geoJson(this.tectonicPlates);
  }

  get apiBaseUrl(): string {
    return this.appConfig.baseUrl;
  }

  get apiEarthquake(): string {
    return this.appConfig.earthquake;
  }

  get apiTypes(): string {
    return this.appConfig.types;
  }
}
