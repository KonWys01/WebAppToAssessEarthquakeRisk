import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CoordinatePickerDialogComponent } from './coordinate-picker-dialog.component';

describe('CoordinatePickerDialogComponent', () => {
  let component: CoordinatePickerDialogComponent;
  let fixture: ComponentFixture<CoordinatePickerDialogComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [CoordinatePickerDialogComponent]
    });
    fixture = TestBed.createComponent(CoordinatePickerDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
