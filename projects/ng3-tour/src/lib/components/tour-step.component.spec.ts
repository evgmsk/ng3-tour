import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TourStepComponent } from './tour-step.component';

describe('TourStepComponent', () => {
  let component: TourStepComponent;
  let fixture: ComponentFixture<TourStepComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TourStepComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TourStepComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
