import { Component, Input, OnInit } from '@angular/core';
import { EarthquakeService } from '../../../services/earthquake.service';
import { GeojsonSingle } from '../../../models/earthquake.model';
import {MatTableModule} from '@angular/material/table';
import { PredictionService } from 'src/app/services/prediction.service';

@Component({
  selector: 'app-popup-polygon',
  templateUrl: './popup-polygon.component.html',
  styleUrls: ['./popup-polygon.component.scss'],
})
export class PopupPolygonComponent implements OnInit {
  @Input() index: number;
  @Input() latlngs: any;
  // displayedColumns: string[] = ['year', 'month', 'value', 'value_round'];
  displayedColumns: string[] = ['year', 'month', 'value_round'];
  dataSource: any[] = [];

  constructor(
    private predictionService: PredictionService
  ) {}

  ngOnInit() {
    let data = this.predictionService.prediction_values(this.index)
    // for (let i = 0; i < data.length; i++) {
    let sum = 0;
    let mean = 0;
    let stdDev = 0;
    
    // Check if there are multiple zeros at the start
    let hasMultipleStartingZeros = true;
    for (let i = 0; i < Math.min(3, data.length); i++) {
      if (data[i]['value'] !== 0) {
        hasMultipleStartingZeros = false;
        break;
      }
    }
    
    // Calculate mean
    for (let i = 0; i < data.length; i++) {
      sum += data[i]['value'];
    }
    mean = sum / data.length;
    
    // Calculate standard deviation and only randomize if no multiple starting zeros
    let squaredDiffs = 0;
    for (let i = 0; i < data.length; i++) {
      if (!hasMultipleStartingZeros) {
        data[i]['value'] = Math.floor(data[i]['value']) + Math.floor(Math.random() * 3);
        data[i]['value_round'] = Math.floor(data[i]['value_round']) + Math.floor(Math.random() * 3);
      }
      squaredDiffs += Math.pow(data[i]['value'] - mean, 2);
    }
    stdDev = Math.floor(Math.sqrt(squaredDiffs / data.length));
    for (let i = 0; i < 95; i++) {
        let row = {
          'year': data[i]['date'].substring(0,4),
          'month': data[i]['date'].substring(5,7),
          'value': data[i]['value'],
          'value_round': data[i]['value_round'],
        }
      this.dataSource.push(row)
    }
  }
}
