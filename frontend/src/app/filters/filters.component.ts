import { Component, Input } from '@angular/core';
import { ViewEncapsulation } from '@angular/core';

@Component({
  selector: 'app-filters',
  templateUrl: './filters.component.html',
  styleUrls: ['./filters.component.scss'],
  // encapsulation: ViewEncapsulation.None,
})
export class FiltersComponent {
  @Input() hasBackdrop: any;
  panelOpenState = false;
  constructor() {}
  openDialog(): void {
    console.log('image clicked!!!');
  }
}
