import {
  Component,
  AfterViewInit,
  OnInit,
  Input,
  OnChanges,
  SimpleChanges,
  createComponent,
  Injector,
  EnvironmentInjector,
  ApplicationRef,
  Output,
  EventEmitter,
} from '@angular/core';

import * as L from 'leaflet';
import 'leaflet.markercluster';

import { PopupInfoComponent } from '../map/popup-info/popup-info.component';
import { ConfigService } from 'src/app/services/config.service';
import { PopupPolygonComponent } from './popup-polygon/popup-polygon.component';

@Component({
  selector: 'app-prediction-map',
  templateUrl: './prediction-map.component.html',
  styleUrls: ['./prediction-map.component.scss']
})
export class PredictionMapComponent
  implements AfterViewInit, OnInit, OnChanges
{
  private map: any;

  constructor(
    private configService: ConfigService,
    private injector: Injector,
    private environmentInjector: EnvironmentInjector,
    private applicationRef: ApplicationRef
  ) {}

  // klasyfikator bayesa
  ngOnInit() {
  }

  ngOnChanges(changes: SimpleChanges) {
  }


  ngAfterViewInit(): void {
    this.initMap();
    this.setPolygons();
  }

  createPopupComponentWithMessage(index: number, latlngs: []): HTMLElement {

    const element = document.createElement('div');
    const component = createComponent(PopupPolygonComponent, {
      elementInjector: this.injector,
      environmentInjector: this.environmentInjector,
      hostElement: element,
    });
    this.applicationRef.attachView(component.hostView);
    component.instance.index = index;
    component.instance.latlngs = latlngs;
    return element;
  }

  private initMap(): void {
    const plates = this.configService.tectonicPlatesGeoJSON;
    this.map = L.map('prediction-map', {
      center: [39.8282, -98.5795],
      zoom: 3,
      zoomControl: false,
      layers: [plates],
    });

    L.control
      .zoom({
        position: 'topright',
      })
      .addTo(this.map);

    const tiles = L.tileLayer(
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

  setPolygons() {
    // start od (-180 -90, -180 -72, -162 -72, -162 -90)
    // koniec na (-180 90, -180 72, -162 72, -162 90)
    let iterator = 18;
    let longitude_start = -90
    let longitude_local = -90
    let latitude_start = -180
    let latitude_local = -180
    let first = []
    let second = []
    let third = []
    let forth = []
    let index = 0;
    for (let i = 11; i < 230; i++) {
      if (index % 10 === 0 && index != 0) {
        longitude_local = -90
        latitude_local += iterator
        index = 0;
        continue
      }
      first = [longitude_local, latitude_local]
      second = [longitude_local+iterator, latitude_local]
      third = [longitude_local+iterator, latitude_local+iterator]
      forth = [longitude_local, latitude_local+iterator]

      longitude_local += iterator

      var latlngs = [first, second, third, forth];
      var polygon = L.polygon(latlngs as any, {color: 'red'}).addTo(this.map);
      index += 1;
      var polygon_map_latlngs = (polygon as any)._latlngs[0]
      polygon.bindPopup((fl) => this.createPopupComponentWithMessage(i, polygon_map_latlngs), {
        maxHeight: 400,
        minWidth: 300,
        maxWidth: 300,
        className: 'popup-height'
      });
      this.map.addLayer(polygon);
    }
    }
}
