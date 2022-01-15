import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import {map} from 'rxjs/operators';
import {Router} from '@angular/router';
import {By} from '@angular/platform-browser';
import {Component} from '@angular/core';

import {
  Ng3TourService,
  Ng3TourComponent,
  Ng3TourModule,
  Ng3TourModalDirective,
  Ng3TourBackdropComponent
} from '../../public_api';
import {IStepProps, ITourStep} from '../interfaces/ng3-tour.interface';

const DummyApp = document.createElement('div');
DummyApp.setAttribute("ng3TourStep", "first");
const styles = {
  top: '100px',
  left: '200px',
  position: 'absolute',
  width: '100%',
  height: '100%'
};

const steps2: IStepProps[] = [
  { 
    stepName: 'first',
    route: 'home',
    title: 'Your tour started',
    description: 'Almost default settings. Only "top" placement is setted.',
    modal: {withoutCounter: true}, 
    backdrop: {isBackdrop: false}
  },
  {
    stepName: 'second',
    route: 'courses',
    title: 'Courses Page',
    description: 'Lazily loaded',
    adds: 'Some adds',
    modal: {modalStyles: {color: '#333333', position: 'fixed'}}
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
  let service: Ng3TourService;
  let routerSpy = {navigate: jasmine.createSpy('navigate')};
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [Ng3TourModule],
      declarations: [Ng3TourComponent, Ng3TourModalDirective, Ng3TourBackdropComponent],
      providers: [Ng3TourService, {provide: Router, useValue: routerSpy}],
    }).compileComponents();
    service = TestBed.inject(Ng3TourService);
  }));
  let component: Ng3TourComponent;
  let fixture: ComponentFixture<Ng3TourComponent>;
  let tourWrapper: Element;
  let target: Element;
  beforeEach(() => {
    fixture = TestBed.createComponent(Ng3TourComponent);
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
    console.log("Modal: ", modal, modal.styles);
    expect(component).toBeTruthy();
    expect(modal.styles['position']).toBe("absolute");
    // expect(modal.styles['color']).toBe(convertToRGB(service.getLastStep().tourModalOptions.modalStyles.color));  
  });

  it ('should appropriately handle the click event on the done button of the Tour Modal', () => {
    service.stopTour();
    service.startTour({steps: steps2})
    DummyApp.setAttribute('ngStepTour', 'fourth');
    DummyApp.classList.add('target4');
    service.initStep(3);
    service.getStepTargetStream().next({stepName: 'fourth', delay: 1000, stepTarget: DummyApp});
    fixture.detectChanges();
    const next = fixture.debugElement.query(By.css('.tour-btn-next'));
    const prev = fixture.debugElement.query(By.css('.tour-btn-prev'));
    const close = fixture.debugElement.query(By.css('.tour-btn-close'));
    const done = fixture.debugElement.query(By.css('.tour-btn-done'));
    expect(next).toBeFalsy();
    expect(prev).toBeTruthy();
    expect(done).toBeTruthy();
    expect(close).toBeTruthy();
    expect(service.getLastStep().index).toBe(3);
    done.triggerEventHandler('click', {});
    fixture.detectChanges();
    expect(service.getHistory()).toEqual([]);
  })
  it ('should appropriately handle the click event on the next and buttons of the Tour Modal', () => {
    service.stopTour();
    service.startTour({steps: steps2});
    service.initStep(1);
    DummyApp.setAttribute('ngStepTour', 'second');
    DummyApp.classList.add('target2');
    service.getStepTargetStream().next({stepName: 'second', delay: 1000, stepTarget: DummyApp});
    fixture.detectChanges();
    const next = fixture.debugElement.query(By.css('.tour-btn-next'));
    const prev = fixture.debugElement.query(By.css('.tour-btn-prev'));
    const close = fixture.debugElement.query(By.css('.tour-btn-close'));
    const done = fixture.debugElement.query(By.css('.tour-btn-done'));
    expect(next).toBeTruthy();
    expect(prev).toBeTruthy();
    expect(close).toBeTruthy();
    expect(done).toBeFalsy();
    expect(service.getLastStep().index).toBe(1);
    next.triggerEventHandler('click', {});
    fixture.detectChanges();
    expect(service.getLastStep().index).toBe(2);
    // console.error(next, prev, close, done);
    fixture.detectChanges();
  })
  // it ('simple test2', () => {
  //   DummyApp.setAttribute('ngStepTour', 'second');
  //   DummyApp.classList.add('target2');
  //   service.getStepTargetStream().next({stepName: 'second', delay: 1000, stepTarget: DummyApp});
  //   fixture.detectChanges();
  //   const app = fixture.debugElement.query(By.css('.tour-step-modal'));
  //   expect(app).toBeTruthy();
  //   const tag2 = fixture.debugElement.query(By.css('.target2'));
  //   fixture.detectChanges();
  //   console.error('app', app.nativeNode, tag2.nativeNode, tag2.nativeElement.getBoundingClientRect())
  // })
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
  template: `<div class="app">
            <div ng3TourStep="first" [style]="Style.dd" class="target1" ></div>
            <div ng3TourStep="second" [style]="Style.dd" class="target2" ></div>
            <div ng3TourStep="third" [style]="styles" class="target3" ></div>
            <div ng3TourStep="fourth" [style]="styles" class="target4" ></div>
              <ng3-tour-template #gg="tour" (next)="onNext($event)" (done)="onDone($event)">
                  <div  class="tour-step-modal__content">
                    Content: <pre>{{gg.className}}</pre>
                  </div>
              </ng3-tour-template>
            </div>`,
  styleUrls: ['./ng3-tour.component.scss'],
})
class AppComponent {
  Style = {};
  
  // constructor() {
  //   this.Style['dd'] = {
  //     color: "#121212",
  //     left: "290px",
  //     height: "100px",
  //     width: "200px",
  //     position: "absolute",
  //     top: "388px"
  //   };
  // }
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