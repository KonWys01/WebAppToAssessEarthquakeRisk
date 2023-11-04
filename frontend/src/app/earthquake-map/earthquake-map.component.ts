import { Component, AfterViewInit, OnInit } from '@angular/core';

import * as L from 'leaflet';
import 'leaflet.markercluster';

import { EarthquakeService } from '../services/earthquake.service';
import {
  EarthquakesFiltered,
  ResponseModelEarthquakeFiltered,
} from '../models/earthquake.model';

@Component({
  selector: 'app-earthquake-map',
  templateUrl: './earthquake-map.component.html',
  styleUrls: ['./earthquake-map.component.scss'],
})
export class EarthquakeMapComponent implements AfterViewInit, OnInit {
  private map: any;
  earthquakesFiltered: EarthquakesFiltered[];

  constructor(private earthquakeService: EarthquakeService) {}

  ngOnInit() {
    this.earthquakeService
      .getAllEarthquakes({ date_start: '1995-03-01', date_end: '1995-03-31' })
      .subscribe((data: ResponseModelEarthquakeFiltered) => {
        this.earthquakesFiltered = data.data;
        this.addEarthquakes();
      });
  }

  private initMap(): void {
    this.map = L.map('map', {
      center: [39.8282, -98.5795],
      zoom: 3,
      zoomControl: false,
    });

    L.control
      .zoom({
        position: 'topright',
      })
      .addTo(this.map);

    const tiles = L.tileLayer(
      // 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
      'https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}.png',
      {
        maxZoom: 18,
        minZoom: 3,
        attribution:
          '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>',
      }
    );

    tiles.addTo(this.map);
  }

  private addEarthquakes(): void {
    let markers = new L.MarkerClusterGroup({
      maxClusterRadius: 15,
    });
    this.earthquakesFiltered.forEach((eq: EarthquakesFiltered): void => {
      const marker = L.circle(
        [
          eq.geometry.coordinates[1] as number,
          eq.geometry.coordinates[0] as number,
        ],
        {
          stroke: false,
          fillOpacity: 0.8,
          fillColor: this.circleColor(eq.geometry.coordinates[2] as number),
          radius: this.circleSize(eq.mag as number),
        }
      );
      markers.addLayer(marker);
    });
    this.map.addLayer(markers);
  }

  ngAfterViewInit(): void {
    this.initMap();
  }

  circleColor(depth: number): string {
    if (depth < 10) {
      return '#FFEDA0';
    } else if (depth < 30) {
      return '#FEB24C';
    } else if (depth < 50) {
      return '#FD8D3C';
    } else if (depth < 70) {
      return '#E31A1C';
    } else {
      return '#570707';
    }
  }

  circleSize(mag: number): number {
    // return mag * 5;
    return mag * 20000;
  }
}
