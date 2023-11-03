import { AfterViewInit, Component, Input } from '@angular/core';

import { MatDialog } from '@angular/material/dialog';

import { CoordinatePickerDialogComponent } from './coordinate-picker-dialog/coordinate-picker-dialog.component';
import { FormControl, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-filters',
  templateUrl: './filters.component.html',
  styleUrls: ['./filters.component.scss'],
})
export class FiltersComponent implements AfterViewInit {
  @Input() hasBackdrop: any;
  panelOpenState = false;
  form: FormGroup;

  id: string;

  constructor(public dialog: MatDialog) {
    this.form = new FormGroup({
      magnitude_min: new FormControl(0),
      magnitude_max: new FormControl(10),
      date_start: new FormControl(''),
      date_end: new FormControl(''),
      top_left_y: new FormControl(0),
      top_left_x: new FormControl(0),
      top_right_y: new FormControl(0),
      top_right_x: new FormControl(0),
      bottom_right_y: new FormControl(0),
      bottom_right_x: new FormControl(0),
      bottom_left_y: new FormControl(0),
      bottom_left_x: new FormControl(0),
      type: new FormControl(''),
    });
  }

  ngAfterViewInit() {
    this.form.valueChanges.subscribe((_) => {
      console.log(this.form.get('magnitude_min')!.value);
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
