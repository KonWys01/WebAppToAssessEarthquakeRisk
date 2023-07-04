import { Component, Input } from '@angular/core';

import { MatDialog } from '@angular/material/dialog';

import { CoordinatePickerDialogComponent } from './coordinate-picker-dialog/coordinate-picker-dialog.component';

@Component({
  selector: 'app-filters',
  templateUrl: './filters.component.html',
  styleUrls: ['./filters.component.scss'],
})
export class FiltersComponent {
  @Input() hasBackdrop: any;
  panelOpenState = false;
  constructor(public dialog: MatDialog) {}
  openDialog(): void {
    this.dialog.open(CoordinatePickerDialogComponent, {
      data: {
        animal: 'panda',
      },
      height: '500px',
    });
  }

  formatLabel(value: number): string {
    if (value >= 1000) {
      return Math.round(value / 1000) + 'k';
    }

    return `${value}`;
  }
}
