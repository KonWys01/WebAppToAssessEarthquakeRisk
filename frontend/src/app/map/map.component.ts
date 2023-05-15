import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import * as L from 'leaflet';

@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.scss'],
})
export class MapComponent implements OnInit {
  private centroid: L.LatLngExpression = [52.22, 21];
  private map: L.Map;

  constructor() {}

  ngOnInit(): void {
    this.initMap();
  }

  initMap(): void {
    this.map = L.map('map', {
      center: this.centroid,
      zoom: 12,
    });
    const tiles = L.tileLayer(
      'https://tile.openstreetmap.org/{z}/{x}/{y}.png',
      {
        attribution:
          '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
      }
    );

    tiles.addTo(this.map);
  }
}
//   map!: L.Map;
//   markers: L.Marker[] = [];
//   options = {
//     layers: [
//       L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
//         attribution:
//           '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
//       }),
//     ],
//     zoom: 16,
//     center: { lat: 28.626137, lng: 79.821603 },
//   };
//
//   initMarkers() {
//     const initialMarkers = [
//       {
//         position: { lat: 28.625485, lng: 79.821091 },
//         draggable: true,
//       },
//       {
//         position: { lat: 28.625293, lng: 79.817926 },
//         draggable: false,
//       },
//       {
//         position: { lat: 28.625182, lng: 79.81464 },
//         draggable: true,
//       },
//     ];
//     for (let index = 0; index < initialMarkers.length; index++) {
//       const data = initialMarkers[index];
//       const marker = this.generateMarker(data, index);
//       marker
//         .addTo(this.map)
//         .bindPopup(`<b>${data.position.lat},  ${data.position.lng}</b>`);
//       this.map.panTo(data.position);
//       this.markers.push(marker);
//     }
//   }
//
//   generateMarker(data: any, index: number) {
//     return L.marker(data.position, { draggable: data.draggable })
//       .on('click', (event: any) => this.markerClicked(event, index))
//       .on('dragend', (event: any) => this.markerDragEnd(event, index));
//   }
//
//   onMapReady($event: L.Map) {
//     this.map = $event;
//     this.initMarkers();
//   }
//
//   mapClicked($event: any) {
//     console.log($event.latlng.lat, $event.latlng.lng);
//   }
//
//   markerClicked($event: any, index: number) {
//     console.log($event.latlng.lat, $event.latlng.lng);
//   }
//
//   markerDragEnd($event: any, index: number) {
//     console.log($event.target.getLatLng());
//   }
//
//   ngOnInit() {}
// }
