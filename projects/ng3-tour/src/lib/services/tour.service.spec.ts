import { TestBed } from '@angular/core/testing';
import {Router} from '@angular/router';

import {
  TourService,
  DefaultModalProps,
  DefaultBackdropProps,
  TourStep,
  defaultTranslation
} from '../../public_api'

const steps1: TourStep[] = [
    {
      stepName: 'first',
      route: 'home',
      title: 'Your tour started',
      description: 'Almost default settings. Only "top" placement is setted.',
    }
  ];
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
  // {stepName: 'fourth', route: 'home', customData: 'Custom Data'},
  // {stepName: 'fifth', route: 'home', options: { placement: 'center', smoothScroll: true, stepTargetResize: [5], fixed: true }},
];
//   const tourOptions: Options = {
//     placement: 'top',
//     opacity: 0.7,
//     delay: 400,
//     // customTemplate: false,
//   };
//   const tourEvents: TourEvents = {
//     tourStart: ({tour}) => console.log(tour),
//     next: ({step, history}) => console.log(step, history),
//     prev: ({step}) => console.log(step),
//     tourBreak: ({step}) => console.log(step),
//     tourEnd: ({step}) => console.log(step),
//   };

describe('TourService', () => {
  let service: TourService;
  let routerSpy = {navigate: jasmine.createSpy('navigate')};
  beforeEach(() => {
    TestBed.configureTestingModule({
      // imports: [RouterModule, AngularTourModule],
      providers: [TourService, {provide: Router, useValue: routerSpy}],
    });
    service = TestBed.inject(TourService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
  it('should create tour with 1 step', () => {
    const expectedStep = {
      stepName: 'first',
      route: 'home',
      title: 'Your tour started',
      index: 0,
      description: 'Almost default settings. Only "top" placement is setted.',
      backdropOptions: DefaultBackdropProps,
      tourModalOptions: DefaultModalProps,
      ctrlBtns: {
        done: defaultTranslation['done'][service.getLang()],
        prev: defaultTranslation['prev'][service.getLang()],
        next: defaultTranslation['next'][service.getLang()],
        of: defaultTranslation['of'][service.getLang()],
      },
    }
    service.startTour({steps: steps1})
    expect(service.getTourStatus()).toBe(true);
    expect(service.getStepByIndex(0)).toEqual(expectedStep);
  });
  it('should create tour with 2 step with correct options', () => {
    const expectedStep: TourStep = {
      stepName: 'second',
      route: 'courses',
      title: 'Courses Page',
      description: 'Lazily loaded',
      adds: 'Some adds',
      backdropOptions: DefaultBackdropProps,
      tourModalOptions: DefaultModalProps,
      index: 1,
      ctrlBtns: {
        done: defaultTranslation['done'][service.getLang()],
        prev: defaultTranslation['prev'][service.getLang()],
        next: defaultTranslation['next'][service.getLang()],
        of: defaultTranslation['of'][service.getLang()],
      },
    }
    service.startTour({steps: steps2})
    const step = service.getStepByIndex(0);
    expect(service.getStepByIndex(1)).toEqual(expectedStep);
    expect(step.backdropOptions.isBackdrop).toBe(false);
    expect(step.tourModalOptions.withoutCounter).toBe(true);
  });
  it('should stop tour correctly', () => {
    service.startTour({steps: steps2});
    service.stopTour();
    expect(service.getTourStatus()).toBe(false);
  }); 
  it('should choose language correctly', () => {
    service.startTour({steps: steps2});
    expect(service.getTourStatus()).toBe(true)
    const step = service.getStepByIndex(2);
    switch (service.getLang()) {
      case'en-EN':
        expect(step.title).toBe('My first feature');
        return;
      case'ru-RU':
        expect(step.title).toBe('Моя первая фича');
        return;
      case'fr-FR':
        expect(step.title).toBe('Mon premier long métrage')
        return;
      default:
        expect(step.title).toBe('My first feature');
    }
  }); 
});
