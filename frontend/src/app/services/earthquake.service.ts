import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';

import { Observable } from 'rxjs';

import {
  Filters,
  ResponseModelEarthquakeFiltered,
} from '../models/earthquake.model';
import { ConfigService } from './config.service';

@Injectable({
  providedIn: 'root',
})
export class EarthquakeService {
  constructor(private http: HttpClient, private configService: ConfigService) {}

  getAllEarthquakes(
    filters?: Filters
  ): Observable<ResponseModelEarthquakeFiltered> {
    let params: string = '';
    if (filters) {
      // @ts-ignore
      params = new HttpParams({ fromObject: filters }).toString();
    }
    console.log(
      this.configService.apiBaseUrl + this.configService.apiEarthquake
    );
    return this.http.get<ResponseModelEarthquakeFiltered>(
      this.configService.apiBaseUrl +
        this.configService.apiEarthquake +
        '?' +
        params
    );
  }
}
