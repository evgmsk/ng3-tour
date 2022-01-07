import { async, ComponentFixture, TestBed} from '@angular/core/testing';
// import {map, delay} from 'rxjs/operators';
import {Router} from '@angular/router';
import {Component, ElementRef} from '@angular/core';
import {
  Ng3TourService,
  Ng3TourModule,
} from '../../public_api';

describe('TourStepDirective', () => {
  let service: Ng3TourService;
  let routerSpy = {navigate: jasmine.createSpy('navigate')};
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [Ng3TourModule],
      declarations: [TestApp],
      providers: [Ng3TourService, {provide: Router, useValue: routerSpy}],
    }).compileComponents();
    service = TestBed.inject(Ng3TourService);
  }));
  let component: TestApp;
  let fixture: ComponentFixture<TestApp>;
  let target: Element;
  let step$: any;
  beforeEach(() => {
    fixture = TestBed.createComponent(TestApp);
    component = fixture.componentInstance;
    target = fixture.nativeElement.querySelector('.target');
  });
  // it ('directive add target to step', async () => {
  //   service.startTour({steps: [{stepName: 'first'}]});
  //   fixture.detectChanges();
  //   step$ = service.getStepsStream().subscribe((step: StepSubject) => {
  //       console.log('sTep', step)
  //       expect(step.stepTarget).toBeTruthy();
  //   });
  //   // service.stopTour();
  // });
})

@Component({
selector: 'test-app-component',
template:   `<div>
                <div ng3TourStep="first" class="target" [style]="styles" ></div>
            </div>`,
styles: [''],
})

class TestApp {
    styles = {
    top: '100px',
    left: '200px',
    position: 'absolute',
    width: '100%',
    height: '100%'
    }
};

