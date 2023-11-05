import { Component, Input, OnInit } from '@angular/core';
import { EarthquakeService } from '../../../services/earthquake.service';
import { GeojsonSingle } from '../../../models/earthquake.model';

@Component({
  selector: 'app-popup-info',
  templateUrl: './popup-info.component.html',
  styleUrls: ['./popup-info.component.scss'],
})
export class PopupInfoComponent implements OnInit {
  @Input() eqId: number;
  earthquake: GeojsonSingle;
  keys: string[];
  isLoaded: boolean = false;

  constructor(private earthquakeService: EarthquakeService) {}

  ngOnInit() {
    this.earthquakeService.getSingleEarthquake(this.eqId).subscribe((data) => {
      this.earthquake = data.data;
      this.keys = Object.keys(this.earthquake.properties);
      this.isLoaded = true;
    });
  }
}
