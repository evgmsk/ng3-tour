import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TourStepBackComponent } from './tour-step-back.component';

describe('TourStepBackComponent', () => {
  let component: TourStepBackComponent;
  let fixture: ComponentFixture<TourStepBackComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TourStepBackComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TourStepBackComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
