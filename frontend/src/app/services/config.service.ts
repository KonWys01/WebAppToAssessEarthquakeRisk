import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { firstValueFrom } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ConfigService {
  private appConfig: any;
  constructor(public http: HttpClient) {}
  async loadConfig(): Promise<void> {
    await firstValueFrom(this.http.get('/assets/config.json')).then(
      (config) => {
        this.appConfig = config;
      }
    );
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
