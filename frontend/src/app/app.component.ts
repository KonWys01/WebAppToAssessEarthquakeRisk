import { Component } from '@angular/core';
import { Filters } from './models/earthquake.model';
import { MatIconRegistry } from '@angular/material/icon';
import { DomSanitizer } from '@angular/platform-browser';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {
  title = 'frontend';
  filters: Filters;
  sidenavOpened: string;
  earthquakeIds: number[];

  constructor(
    private matIconRegistry: MatIconRegistry,
    private domSanitizer: DomSanitizer
  ) {
    this.matIconRegistry.addSvgIcon(
      'xlsx',
      this.domSanitizer.bypassSecurityTrustResourceUrl(
        '../assets/xlsx-white2.svg'
      )
    );
    this.matIconRegistry.addSvgIcon(
      'xml',
      this.domSanitizer.bypassSecurityTrustResourceUrl(
        '../assets/xml-white2.svg'
      )
    );
    this.matIconRegistry.addSvgIcon(
      'csv',
      this.domSanitizer.bypassSecurityTrustResourceUrl(
        '../assets/csv-white2.svg'
      )
    );
    this.matIconRegistry.addSvgIcon(
      'json',
      this.domSanitizer.bypassSecurityTrustResourceUrl(
        '../assets/json-white2.svg'
      )
    );
  }
}
