import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PopupPolygonComponent } from './popup-polygon.component';

describe('PopupPolygonComponent', () => {
  let component: PopupPolygonComponent;
  let fixture: ComponentFixture<PopupPolygonComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [PopupPolygonComponent]
    });
    fixture = TestBed.createComponent(PopupPolygonComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
