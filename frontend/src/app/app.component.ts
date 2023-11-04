import { Component } from '@angular/core';
import { Filters } from './models/earthquake.model';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {
  title = 'frontend';
  filters: Filters;
}
