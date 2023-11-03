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
  step: number = 0;
  form: FormGroup;
  types: string[] = ['earthquake', 'blast'];

  id: string;

  constructor(public dialog: MatDialog) {
    this.form = new FormGroup({
      magnitude_min: new FormControl(''),
      magnitude_max: new FormControl(''),
      date_start: new FormControl(''),
      date_end: new FormControl(''),
      top_left_lat: new FormControl(''),
      top_left_lng: new FormControl(''),
      top_right_lat: new FormControl(''),
      top_right_lng: new FormControl(''),
      bottom_right_lat: new FormControl(''),
      bottom_right_lng: new FormControl(''),
      bottom_left_lat: new FormControl(''),
      bottom_left_lng: new FormControl(''),
      type: new FormControl(''),
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
}
