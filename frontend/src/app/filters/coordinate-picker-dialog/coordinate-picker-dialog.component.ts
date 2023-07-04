import { AfterViewInit, Component, OnInit } from '@angular/core';
import * as L from 'leaflet';

@Component({
  selector: 'app-coordinate-picker-dialog',
  templateUrl: './coordinate-picker-dialog.component.html',
  styleUrls: ['./coordinate-picker-dialog.component.scss'],
})
export class CoordinatePickerDialogComponent implements AfterViewInit, OnInit {
  private map_dialog: any;

  constructor() {}

  ngOnInit() {}
  private initMap(): void {
    this.map_dialog = L.map('map_dialog', {
      center: [43.022088, 9.53944],
      zoom: 1,
      zoomControl: false,
    });

    L.control
      .zoom({
        position: 'topright',
      })
      .addTo(this.map_dialog);

    const tiles = L.tileLayer(
      'https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}.png',
      {
        maxZoom: 18,
        minZoom: 0,
        attribution:
          '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, &copy; <a href="https://carto.com/attribution">CARTO</a>',
      }
    );
    tiles.addTo(this.map_dialog);
  }

  ngAfterViewInit(): void {
    this.initMap();
    this.map_dialog.invalidateSize();
  }
}
