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
    for (let i = 0; i < data.length; i++) {
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
