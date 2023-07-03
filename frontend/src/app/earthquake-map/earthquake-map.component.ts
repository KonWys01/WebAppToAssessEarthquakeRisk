import { Component, AfterViewInit, OnInit } from '@angular/core';
import * as L from 'leaflet';
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
    console.log(this.earthquakes);
  }

  private initMap(): void {
    this.map = L.map('map', {
      center: [39.8282, -98.5795],
      zoom: 3,
    });

    const tiles = L.tileLayer(
      'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
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
    this.earthquakes.forEach((eq) => {
      L.circle([eq.y as number, eq.x as number], {
        stroke: false,
        fillOpacity: 0.8,
        fillColor: this.circleColor(eq.h as number),
        radius: this.circleSize(eq.mag as number),
      }).addTo(this.map);
    });
  }

  ngAfterViewInit(): void {
    this.initMap();
    this.addEarthquakes();
  }

  circleColor(depth: number): string {
    if (depth < 10) {
      return '#FFEDA0';
    } else if (depth < 10) {
      return '#e8ac5d';
    } else if (depth < 30) {
      return '#b77309';
    } else if (depth < 50) {
      return '#c93116';
    } else if (depth < 70) {
      return '#7e1807';
    } else {
      return '#410b01';
    }
  }

  circleSize(mag: number): number {
    return mag * 60000;
  }
}
