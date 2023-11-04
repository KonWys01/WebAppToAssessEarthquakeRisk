import { AfterViewInit, Component, Input } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';

import { MatDialog } from '@angular/material/dialog';

import * as moment from 'moment';

import { CoordinatePickerDialogComponent } from './coordinate-picker-dialog/coordinate-picker-dialog.component';
import { Filters } from '../models/earthquake.model';

@Component({
  selector: 'app-filters',
  templateUrl: './filters.component.html',
  styleUrls: ['./filters.component.scss'],
})
export class FiltersComponent implements AfterViewInit {
  @Input() hasBackdrop: any;
  step: number = 0;
  form: FormGroup;
  types: string[] = ['earthquake', 'quarry blast'];

  id: string;

  constructor(public dialog: MatDialog) {
    this.form = new FormGroup({
      magnitude_min: new FormControl(null),
      magnitude_max: new FormControl(null),
      date_start: new FormControl(null),
      date_end: new FormControl(null),
      top_left_lat: new FormControl(null),
      top_left_lng: new FormControl(null),
      top_right_lat: new FormControl(null),
      top_right_lng: new FormControl(null),
      bottom_right_lat: new FormControl(null),
      bottom_right_lng: new FormControl(null),
      bottom_left_lat: new FormControl(null),
      bottom_left_lng: new FormControl(null),
      type: new FormControl(null),
    });
  }

  ngAfterViewInit() {
    this.form.valueChanges.subscribe((_) => {
      console.log(this.form.get('magnitude_min')!.value);
    });
  }

  setStep(index: number) {
    this.step = index;
  }

  openDialog(): void {
    let dialogRef = this.dialog.open(CoordinatePickerDialogComponent, {
      data: {
        animal: 'panda',
      },
      height: '500px',
    });

    dialogRef.afterClosed().subscribe((res) => {
      if (res.coordinates) {
        this.form.get('top_left_lat')?.patchValue(res.coordinates.lat_max);
        this.form.get('top_left_lng')?.patchValue(res.coordinates.lng_min);
        this.form.get('top_right_lat')?.patchValue(res.coordinates.lat_max);
        this.form.get('top_right_lng')?.patchValue(res.coordinates.lng_max);
        this.form.get('bottom_right_lat')?.patchValue(res.coordinates.lat_min);
        this.form.get('bottom_right_lng')?.patchValue(res.coordinates.lng_max);
        this.form.get('bottom_left_lat')?.patchValue(res.coordinates.lat_min);
        this.form.get('bottom_left_lng')?.patchValue(res.coordinates.lng_min);
        console.log(this.form.value);
      }
    });
  }

  formatLabel(value: number): string {
    if (value >= 1000) {
      return Math.round(value / 1000) + 'k';
    }

    return `${value}`;
  }

  reset(): void {
    this.form.reset();
  }

  submit(): void {
    const filters: Filters = {};
    if (this.form.get('magnitude_min')?.value) {
      filters['mag_min'] = this.form.get('magnitude_min')?.value;
    }
    if (this.form.get('magnitude_max')?.value) {
      filters['mag_max'] = this.form.get('magnitude_max')?.value;
    }
    if (this.form.get('date_start')?.value) {
      filters['date_start'] = moment(this.form.get('date_start')?.value).format(
        'YYYY-MM-DD'
      );
    }
    if (this.form.get('date_end')?.value) {
      filters['date_end'] = moment(this.form.get('date_end')?.value).format(
        'YYYY-MM-DD'
      );
    }
    if (this.form.get('type')?.value) {
      filters['type'] = this.form.get('type')?.value;
    }
    if (this.form.get('top_left_lat')?.value) {
      filters['coordinates'] = [
        [
          this.form.get('top_left_lat')?.value,
          this.form.get('top_left_lng')?.value,
        ],
        [
          this.form.get('top_right_lat')?.value,
          this.form.get('top_right_lng')?.value,
        ],
        [
          this.form.get('bottom_right_lat')?.value,
          this.form.get('bottom_right_lng')?.value,
        ],
        [
          this.form.get('bottom_left_lat')?.value,
          this.form.get('bottom_left_lng')?.value,
        ],
        [
          this.form.get('top_left_lat')?.value,
          this.form.get('top_left_lng')?.value,
        ],
      ];
    }
    console.log(filters);
  }
}
