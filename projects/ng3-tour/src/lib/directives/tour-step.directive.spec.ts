import { async, ComponentFixture, TestBed} from '@angular/core/testing';
import {map, delay} from 'rxjs/operators';
import {Router} from '@angular/router';
import {By} from '@angular/platform-browser';
import {Component, ElementRef} from '@angular/core';
import {
    TourService,
    TourStepComponent,
    AngularTourModule,
    TourStepDirective,
  } from '../../public_api';
import {StepSubject} from '../interfaces/tour.interface';

describe('TourStepDirective', () => {
  let service: TourService;
  let routerSpy = {navigate: jasmine.createSpy('navigate')};
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [AngularTourModule],
      declarations: [TestApp],
      providers: [TourService, {provide: Router, useValue: routerSpy}],
    }).compileComponents();
    service = TestBed.inject(TourService);
  }));
  let component: TestApp;
  let fixture: ComponentFixture<TestApp>;
  let target: Element;
  let step$: any;
  // beforeEach(() => {
  //   fixture = TestBed.createComponent(TestApp);
  //   component = fixture.componentInstance;
  //   target = fixture.nativeElement.querySelector('.target');
  //   service.startTour({steps: [{stepName: 'first'}]});
  //   fixture.detectChanges();
  // });
  // it ('directive add target to step', async () => {
  //   step$ = service.getStepsStream().subscribe((step: StepSubject) => {
  //       console.log('sTep', step)
  //       expect(step.stepTarget).toBeTruthy();
  //   });
  // });
})

@Component({
selector: 'test-app-component',
template:   `<div>
                <div ngTourStep="first" class="target" [style]="styles" ></div>
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

