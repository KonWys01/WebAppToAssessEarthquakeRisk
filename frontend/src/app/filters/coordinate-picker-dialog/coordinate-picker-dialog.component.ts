import { AfterViewInit, Component, OnInit } from '@angular/core';

import { MatDialogRef } from '@angular/material/dialog';

import * as L from 'leaflet';
import 'leaflet-draw';

@Component({
  selector: 'app-coordinate-picker-dialog',
  templateUrl: './coordinate-picker-dialog.component.html',
  styleUrls: ['./coordinate-picker-dialog.component.scss'],
})
export class CoordinatePickerDialogComponent implements AfterViewInit, OnInit {
  private map_dialog: any;
  private lat_min_result: number;
  private lng_min_result: number;
  private lat_max_result: number;
  private lng_max_result: number;

  constructor(
    private dialogRef: MatDialogRef<CoordinatePickerDialogComponent>
  ) {}

  ngOnInit() {}
  private initMap(): void {
    this.map_dialog = L.map('map_dialog', {
      center: [43.022088, 9.53944],
      zoom: 1,
      minZoom: 1,
      zoomControl: false,
    });

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
    // this.blockMovement();
    this.drawRectangle();
  }

  blockMovement(): void {
    this.map_dialog.touchZoom.disable();
    this.map_dialog.doubleClickZoom.disable();
    this.map_dialog.scrollWheelZoom.disable();
    this.map_dialog.boxZoom.disable();
    this.map_dialog.keyboard.disable();
  }

  drawRectangle(): void {
    this.removeRectangles();
    const drawnItems: L.FeatureGroup = new L.FeatureGroup();
    this.map_dialog.addLayer(drawnItems);
    const drawControl: L.Control.Draw = new L.Control.Draw({
      draw: {
        polygon: false,
        marker: false,
        circle: false,
        circlemarker: false,
        polyline: false,
        rectangle: <any>{ showArea: false },
      },
    });

    this.map_dialog.addControl(drawControl);
    this.map_dialog.on('draw:created', (e: any): void => {
      this.removeRectangles(); // remove not seen rectangle

      const [lat_min, lng_min, lat_max, lng_max] =
        this.getLatLngFromRectangleLayer(e);

      this.lat_min_result = lat_min;
      this.lng_min_result = lng_min;
      this.lat_max_result = lat_max;
      this.lng_max_result = lng_max;

      const rectangle: L.Rectangle = L.rectangle([
        [lat_min, lng_min],
        [lat_max, lng_max],
      ]);
      this.map_dialog.addLayer(rectangle);
      this.map_dialog.removeControl(drawControl);
    });
  }

  removeRectangles(): void {
    this.map_dialog.eachLayer((layer: any) => {
      if (layer instanceof L.Rectangle) {
        this.map_dialog.removeLayer(layer);
      }
    });
  }

  getLatLngFromRectangleLayer(e: any): [any, any, any, any] {
    const bounds = e.layer._bounds;
    const lat_min = bounds._southWest.lat;
    const lng_min = bounds._southWest.lng;
    const lat_max = bounds._northEast.lat;
    const lng_max = bounds._northEast.lng;
    return [lat_min, lng_min, lat_max, lng_max];
  }
  close(): void {
    this.dialogRef.close({
      coordinates: {
        lat_min: this.lat_min_result,
        lng_min: this.lng_min_result,
        lat_axn: this.lat_max_result,
        lng_max: this.lng_max_result,
      },
    });
  }
}
