import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { LeafletModule } from '@asymmetrik/ngx-leaflet';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { EarthquakeMapComponent } from './earthquake-map/earthquake-map.component';
import { FiltersComponent } from './filters/filters.component';
import { MatAccordion, MatExpansionModule } from '@angular/material/expansion';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';

@NgModule({
  declarations: [AppComponent, EarthquakeMapComponent, FiltersComponent],
  imports: [
    BrowserModule,
    AppRoutingModule,
    LeafletModule,
    MatExpansionModule,
    BrowserAnimationsModule,
    MatSidenavModule,
    MatCheckboxModule,
    MatSelectModule,
    MatButtonModule,
    MatIconModule,
    CommonModule,
  ],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
