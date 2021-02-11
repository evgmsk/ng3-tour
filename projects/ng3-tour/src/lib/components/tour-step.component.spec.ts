import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import {map} from 'rxjs/operators';
import {Router} from '@angular/router';
import {By} from '@angular/platform-browser';
import {Component, ElementRef} from '@angular/core';

import {
  TourService,
  TourStepComponent,
  AngularTourModule,
  TourStepDirective,
} from '../../public_api';
import {TourStep} from '../interfaces/tour.interface';

const DummyApp = document.createElement('div');
DummyApp.setAttribute("ngTourStep", "first");
const styles = {
  top: '100px',
  left: '200px',
  position: 'absolute',
  width: '100%',
  height: '100%'
};

const steps2: TourStep[] = [
  { 
    stepName: 'first',
    route: 'home',
    title: 'Your tour started',
    description: 'Almost default settings. Only "top" placement is setted.',
    tourModalOptions: {withoutCounter: true}, 
    backdropOptions: {isBackdrop: false}
  },
  {
    stepName: 'second',
    route: 'courses',
    title: 'Courses Page',
    description: 'Lazily loaded',
    adds: 'Some adds',
  //   options: {customTemplate: true, smoothScroll: true, themeColor: '#254689', opacity: .9}
  },
  {
    stepName: 'third',
    route: 'courses/WAUQDI',
    title: {
      'en-EN': 'My first feature',
      'ru-RU': 'Моя первая фича',
      'fr-FR': 'Mon premier long métrage',
  },
  //   options: {customTemplate: true, placement: 'down', stepTargetResize: [5] }
  },
  {stepName: 'fourth', route: 'home', customData: 'Custom Data'},
  // {stepName: 'fifth', route: 'home', options: { placement: 'center', smoothScroll: true, stepTargetResize: [5], fixed: true }},
];
describe('TourStepComponent', () => {
  let service: TourService;
  let routerSpy = {navigate: jasmine.createSpy('navigate')};
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [AngularTourModule],
      declarations: [TourStepComponent, TourStepDirective],
      providers: [TourService, {provide: Router, useValue: routerSpy}],
    }).compileComponents();
    service = TestBed.inject(TourService);
  }));
  let component: TourStepComponent;
  let fixture: ComponentFixture<TourStepComponent>;
  let tourWrapper: Element;
  let target: Element;
  beforeEach(() => {
    fixture = TestBed.createComponent(TourStepComponent);
    component = fixture.componentInstance;
    tourWrapper = fixture.nativeElement.querySelector('.tour-step-wrapper');
    service.startTour({steps: steps2});
    fixture.detectChanges();
  });
 
  it('should create tour step component', async() => {
    DummyApp.setAttribute('ngStepTour', 'first');
    DummyApp.classList.add('target1');
    service.getStepTargetStream().next({stepName: 'first', delay: 1000, stepTarget: DummyApp});
    fixture.detectChanges();
    const modal = fixture.debugElement.query(By.css('.tour-step-modal'));
    console.log("Modal: ", modal)
    expect(component).toBeTruthy();
    // console.log('Modal', modal, component.currentStep.tourModalOptions);
    // expect(modal.styles['position']).toBe("absolute");
    // expect(modal.styles['color']).toBe(convertToRGB(component.currentStep.tourModalOptions.modalStyles.color)); 
    // console.log('Color', convertToRGB(component.currentStep.tourModalOptions.color)) 
    // const modal = fixture.debugElement.query(By.css('.tour-step-modal'));
    // console.log('Modal', modal, component.currentStep.tourModalOptions);
    // expect(modal.styles['position']).toBe("absolute");
    // expect(modal.styles['color']).toBe("000000");  
  });
  it ('simple test', () => {
    expect(true).toBe(true) 
  })
});

function convertToRGB(color: string): string {
  if (color.slice(0,1) !== '#') {
    return color;
  }
  if (color.length < 7) {
    return `rgb(${parseInt(color.slice(1,2), 16)}, ${parseInt(color.slice(2,3), 16)}, ${parseInt(color.slice(3), 16)})`;
  }

  return `rgb(${parseInt(color.slice(1,3), 16)}, ${parseInt(color.slice(3,5), 16)}, ${parseInt(color.slice(5), 16)})`;
}
@Component({
  selector: 'app-component',
  template: `<div>
            <div ngTourStep="first" [style]="styles" class="target1" ></div>
            <div ngTourStep="second" [style]="styles" class="target2" ></div>
            <div ngTourStep="third" [style]="styles" class="target3" ></div>
            <div ngTourStep="fourth" [style]="styles" class="target4" ></div>
              <ng-tour-step-template #gg="tour" (next)="onNext($event)" (done)="onDone($event)">
                  <div  class="tour-step-modal__content">
                    Content: {{gg}}
                  </div>
              </ng-tour-step-template>
            </div>`,
  styleUrls: ['./tour-step.component.scss'],
})
class AppComponent {
  constructor() {
    
  }
}

// <div >
// <div class="tour-step-modal__header">
//     <h3 class="tour-step-modal__title"> 
//       {{step.title}}
//     </h3>
//     <button class="tour-btn-close" type="button" stepEvent="close" (break)="onBreak($event)" (done)="onDone($event)">
//       &times;
//     </button>
// </div>
// <div class="tour-step-modal__body">
//     <p class="tour-step-modal__description">
//       {{step.description}}
//     </p>
//     <p class="tour-step-modal__adds">
//       {{step.adds}}
//     </p>
//     <p class="tour-step-modal__adds">
//       {{step.customData}}
//     </p>
//     <p *ngIf="step.index===3" class="tour-step-modal__adds"> 
//       StepName of this step is {{step.StepName}}
//     </p>
// </div>
// <div class="tour-step-modal__footer">
//     <div *ngIf="!step.options.withoutCounter" class="tour-step-modal__counter">
//       {{step.index + 1}} of {{step.total}}
//     </div>
//     <button
//       *ngIf="!step.options.withoutPrev && step.index" 
//       type="button" 
//       class="tour-btn"
//       stepEvent="prev"
//     >
//       {{step.ctrlBtns.prev}}
//     </button>
//     <button
//       *ngIf="step.index + 1 !== step.total"
//       type="button"
//       class="tour-btn tour-btn-next"
//       stepEvent="next"  
//       (next)="onNext($event)"
//     >
//       {{step.ctrlBtns.next}}
//     </button>
//     <button
//       *ngIf="step.index + 1 === step.total"
//       type="button"
//       class="tour-btn tour-btn-done"
//       stepEvent="close"
//       (done)="onDone($event)"
//     >
//       {{step.ctrlBtns.done}}
//     </button>
// </div>
// </div>