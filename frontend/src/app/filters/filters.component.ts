import {
  AfterViewInit,
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output,
} from '@angular/core';
import {
  AbstractControl,
  FormControl,
  FormGroup,
  ValidationErrors,
  ValidatorFn,
} from '@angular/forms';

import { MatDialog } from '@angular/material/dialog';

import * as moment from 'moment';

import { CoordinatePickerDialogComponent } from './coordinate-picker-dialog/coordinate-picker-dialog.component';
import { Filters } from '../models/earthquake.model';
import { EarthquakeService } from '../services/earthquake.service';

@Component({
  selector: 'app-filters',
  templateUrl: './filters.component.html',
  styleUrls: ['./filters.component.scss'],
})
export class FiltersComponent implements OnInit, AfterViewInit {
  @Input() hasBackdrop: any;
  step: number = 0;
  form: FormGroup;
  types: string[];
  loading: boolean = true;
  formValid: boolean = false;
  @Output() filterTransfer: EventEmitter<Filters> = new EventEmitter();

  constructor(
    public dialog: MatDialog,
    private earthquakeService: EarthquakeService
  ) {
    this.form = new FormGroup({
      magnitude_min: new FormControl(null),
      magnitude_max: new FormControl(null),
      date_start: new FormControl(null),
      date_end: new FormControl(null),
      top_left_lat: new FormControl(null, [this.numberValidator()]),
      top_left_lng: new FormControl(null, [this.numberValidator()]),
      top_right_lat: new FormControl(null, [this.numberValidator()]),
      top_right_lng: new FormControl(null, [this.numberValidator()]),
      bottom_right_lat: new FormControl(null, [this.numberValidator()]),
      bottom_right_lng: new FormControl(null, [this.numberValidator()]),
      bottom_left_lat: new FormControl(null, [this.numberValidator()]),
      bottom_left_lng: new FormControl(null, [this.numberValidator()]),
      type: new FormControl(null),
    });
  }

  ngOnInit() {
    this.earthquakeService.getAllTypes().subscribe((data) => {
      this.types = data.data;
      this.loading = false;
    });
  }

  ngAfterViewInit() {
    this.form.valueChanges.subscribe((form) => {
      let localValid: boolean = false;
      Object.keys(form).forEach((key) => {
        if (form[key] !== null && form[key] !== undefined) {
          localValid = true;
        }
      });
      localValid = this.allEightCoordinates() ? localValid : false;
      this.formValid = this.form.valid ? localValid : false;
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

  clearDate() {
    this.form.get('date_start')?.reset();
    this.form.get('date_end')?.reset();
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
          this.form.get('top_left_lng')?.value,
          this.form.get('top_left_lat')?.value,
        ],
        [
          this.form.get('top_right_lng')?.value,
          this.form.get('top_right_lat')?.value,
        ],
        [
          this.form.get('bottom_right_lng')?.value,
          this.form.get('bottom_right_lat')?.value,
        ],
        [
          this.form.get('bottom_left_lng')?.value,
          this.form.get('bottom_left_lat')?.value,
        ],
        [
          this.form.get('top_left_lng')?.value,
          this.form.get('top_left_lat')?.value,
        ],
      ];
    }
    this.filterTransfer.emit(filters);
  }

  numberValidator(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      if (control.value === null) {
        return null;
      }
      if (control.value === '') {
        control.patchValue(null);
        return null;
      }
      if (!Number(control.value)) {
        return { numberValidator: true };
      }
      return null;
    };
  }

  allEightCoordinates(): boolean {
    let hasValue: number = 0;
    if (this.form.get('top_left_lat')?.value) {
      hasValue += 1;
    }
    if (this.form.get('top_left_lng')?.value) {
      hasValue += 1;
    }
    if (this.form.get('top_right_lat')?.value) {
      hasValue += 1;
    }
    if (this.form.get('top_right_lng')?.value) {
      hasValue += 1;
    }
    if (this.form.get('bottom_right_lat')?.value) {
      hasValue += 1;
    }
    if (this.form.get('bottom_right_lng')?.value) {
      hasValue += 1;
    }
    if (this.form.get('bottom_left_lat')?.value) {
      hasValue += 1;
    }
    if (this.form.get('bottom_left_lng')?.value) {
      hasValue += 1;
    }
    return hasValue === 0 || hasValue === 8;
  }
}
