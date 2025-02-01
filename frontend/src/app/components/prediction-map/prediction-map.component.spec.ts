import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PredictionMapComponent } from './prediction-map.component';

describe('PredictionMapComponent', () => {
  let component: PredictionMapComponent;
  let fixture: ComponentFixture<PredictionMapComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [PredictionMapComponent]
    });
    fixture = TestBed.createComponent(PredictionMapComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
