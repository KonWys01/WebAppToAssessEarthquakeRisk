import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EarthquakeMapComponent } from './earthquake-map.component';

describe('MapComponent', () => {
  let component: EarthquakeMapComponent;
  let fixture: ComponentFixture<EarthquakeMapComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [EarthquakeMapComponent],
    });
    fixture = TestBed.createComponent(EarthquakeMapComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
