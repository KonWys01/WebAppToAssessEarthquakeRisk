import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';

import { Observable } from 'rxjs';

import {
  Filters,
  ResponseModelEarthquakeFiltered,
  TypesResponseModel,
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
      if (filters['coordinates']) {
        filters['coordinates'] = JSON.stringify(filters['coordinates']);
      }
      // @ts-ignore
      params = new HttpParams({ fromObject: filters }).toString();
    }
    return this.http.get<ResponseModelEarthquakeFiltered>(
      this.configService.apiBaseUrl +
        this.configService.apiEarthquake +
        '?' +
        params
    );
  }

  getAllTypes(): Observable<TypesResponseModel> {
    return this.http.get<TypesResponseModel>(
      this.configService.apiBaseUrl +
        this.configService.apiEarthquake +
        this.configService.apiTypes
    );
  }
}
