import { Component, Input } from '@angular/core';

import { MatDialog } from '@angular/material/dialog';

import { CoordinatePickerDialogComponent } from './coordinate-picker-dialog/coordinate-picker-dialog.component';
import {
  FormGroup,
  UntypedFormControl,
  UntypedFormGroup,
} from '@angular/forms';

@Component({
  selector: 'app-filters',
  templateUrl: './filters.component.html',
  styleUrls: ['./filters.component.scss'],
})
export class FiltersComponent {
  @Input() hasBackdrop: any;
  panelOpenState = false;
  form: FormGroup;

  id: string;
  magMin: number = 2;
  magMax: number = 10;

  constructor(public dialog: MatDialog) {
    this.form = new UntypedFormGroup({
      id: new UntypedFormControl(''),
      area: new UntypedFormControl(''),
      magnitude_min: new UntypedFormControl(''),
      magnitude_max: new UntypedFormControl(''),
      date_from: new UntypedFormControl(''),
      date_to: new UntypedFormControl(''),
      tsunami: new UntypedFormControl(''),
    });
  }
  openDialog(): void {
    let dialogRef = this.dialog.open(CoordinatePickerDialogComponent, {
      data: {
        animal: 'panda',
      },
      height: '500px',
    });

    dialogRef.afterClosed().subscribe((res) => {
      this.form.get('area')?.setValue(res);
    });
  }

  formatLabel(value: number): string {
    if (value >= 1000) {
      return Math.round(value / 1000) + 'k';
    }

    return `${value}`;
  }
}
