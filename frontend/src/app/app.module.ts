import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { CommonModule } from '@angular/common';

import { MatExpansionModule } from '@angular/material/expansion';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSliderModule } from '@angular/material/slider';

import { LeafletModule } from '@asymmetrik/ngx-leaflet';
import { LeafletMarkerClusterModule } from '@asymmetrik/ngx-leaflet-markercluster';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { EarthquakeMapComponent } from './earthquake-map/earthquake-map.component';
import { FiltersComponent } from './filters/filters.component';
import { MatDialogModule } from '@angular/material/dialog';

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
    MatFormFieldModule,
    MatInputModule,
    MatSliderModule,
    MatDialogModule,
    LeafletMarkerClusterModule,
  ],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
