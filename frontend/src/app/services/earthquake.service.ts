import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';

import { Observable } from 'rxjs';

import {
  Filters,
  ResponseModelEarthquakeFiltered,
  ResponseModelSingleEarthquake,
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

  getSingleEarthquake(eqId: number): Observable<ResponseModelSingleEarthquake> {
    return this.http.get<ResponseModelSingleEarthquake>(
      this.configService.apiBaseUrl + this.configService.apiEarthquake + eqId
    );
  }

  getAllTypes(): Observable<TypesResponseModel> {
    return this.http.get<TypesResponseModel>(
      this.configService.apiBaseUrl +
        this.configService.apiEarthquake +
        this.configService.apiTypes
    );
  }

  exportEarthquakes(ids: number[], type: string) {
    let queryParams = ids.map((id) => `ids=${id}`).join('&');
    let url = this.configService.apiBaseUrl + this.configService.apiEarthquake;
    if (type === 'csv') {
      url = url + this.configService.export_csv;
    } else if (type === 'geojson') {
      url = url + this.configService.export_geojson;
    } else if (type === 'xlsx') {
      url = url + this.configService.export_xlsx;
    } else {
      url = url + this.configService.export_xml;
    }
    url = url + '?' + queryParams;
    window.open(url, '_blank');
  }
}
