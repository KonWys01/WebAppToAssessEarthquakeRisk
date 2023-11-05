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
} from '@angular/core';

import { MatSnackBar } from '@angular/material/snack-bar';

import * as L from 'leaflet';
import 'leaflet.markercluster';

import { EarthquakeService } from '../../../services/earthquake.service';
import {
  EarthquakesFiltered,
  Filters,
  ResponseModelEarthquakeFiltered,
} from '../../../models/earthquake.model';
import { LoadingNotificationComponent } from '../../filters/loading-notification/loading-notification.component';
import { SnackbarService } from '../../../services/snackbar.service';
import { PopupInfoComponent } from '../popup-info/popup-info.component';
import { ConfigService } from '../../../services/config.service';

@Component({
  selector: 'app-earthquake-map',
  templateUrl: './earthquake-map.component.html',
  styleUrls: ['./earthquake-map.component.scss'],
})
export class EarthquakeMapComponent
  implements AfterViewInit, OnInit, OnChanges
{
  private map: any;
  markers = new L.MarkerClusterGroup({
    maxClusterRadius: 15,
  });
  earthquakesFiltered: EarthquakesFiltered[];
  @Input() filtersTransfered: Filters;

  constructor(
    private earthquakeService: EarthquakeService,
    private configService: ConfigService,
    private snackBar: MatSnackBar,
    private snackbarService: SnackbarService,
    private injector: Injector,
    private environmentInjector: EnvironmentInjector,
    private applicationRef: ApplicationRef
  ) {}

  ngOnInit() {
    this.getEarthquakes({
      date_start: '1995-03-01',
      date_end: '1995-03-31',
    });
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['filtersTransfered'] && this.filtersTransfered) {
      this.getEarthquakes(this.filtersTransfered);
    }
  }

  getEarthquakes(filters: Filters): void {
    this.snackBar.openFromComponent(LoadingNotificationComponent, {
      verticalPosition: 'top',
    });
    this.earthquakeService
      .getAllEarthquakes(filters)
      .subscribe((data: ResponseModelEarthquakeFiltered) => {
        this.earthquakesFiltered = data.data;
        this.addEarthquakes();
        this.snackbarService.updateSnackbarContent('loaded');
        setTimeout(() => {
          this.snackBar.dismiss();
        }, 2000);
      });
  }

  private initMap(): void {
    const plates = this.configService.tectonicPlatesGeoJSON;
    this.map = L.map('map', {
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
    if (this.markers) {
      this.markers.clearLayers();
    }
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
      marker.bindPopup((fl) => this.createPopupComponentWithMessage(eq.id), {
        minWidth: 486,
        maxWidth: 486,
      });
      this.markers.addLayer(marker);
    });
    this.map.addLayer(this.markers);
  }

  ngAfterViewInit(): void {
    this.initMap();
  }

  createPopupComponentWithMessage(eqId: number): HTMLElement {
    const element = document.createElement('div');
    const component = createComponent(PopupInfoComponent, {
      elementInjector: this.injector,
      environmentInjector: this.environmentInjector,
      hostElement: element,
    });
    this.applicationRef.attachView(component.hostView);
    component.instance.eqId = eqId;
    return element;
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
