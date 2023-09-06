import { Component, AfterViewInit, OnInit } from '@angular/core';

import * as L from 'leaflet';
import 'leaflet.markercluster';

import { EarthquakeService } from '../services/earthquake.service';
import { EarthquakeCoordinates } from '../models/earthquake.model';

@Component({
  selector: 'app-earthquake-map',
  templateUrl: './earthquake-map.component.html',
  styleUrls: ['./earthquake-map.component.scss'],
})
export class EarthquakeMapComponent implements AfterViewInit, OnInit {
  private map: any;
  earthquakes: EarthquakeCoordinates[];

  constructor(private earthquakeService: EarthquakeService) {}

  ngOnInit() {
    this.earthquakes = this.earthquakeService.getEarthquakes();
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
    this.earthquakes.forEach((eq) => {
      const marker = L.circle([eq.y as number, eq.x as number], {
        stroke: false,
        fillOpacity: 0.8,
        fillColor: this.circleColor(eq.h as number),
        radius: this.circleSize(eq.mag as number),
      });
      markers.addLayer(marker);
    });
    this.map.addLayer(markers);
  }

  ngAfterViewInit(): void {
    this.initMap();
    this.addEarthquakes();
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
