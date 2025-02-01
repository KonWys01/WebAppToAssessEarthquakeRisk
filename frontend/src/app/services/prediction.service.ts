import { Injectable } from '@angular/core';
import { PREDICTIONS } from 'src/assets/test-data/prediction';

@Injectable({
  providedIn: 'root'
})
export class PredictionService {

  constructor() { }

  prediction_values(polygon_index: number): any {
    return PREDICTIONS[polygon_index];
  }
}
