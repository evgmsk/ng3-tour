import { TestBed, async} from '@angular/core/testing';
import {Router} from '@angular/router';

import {
  Ng3TourService,
  DefaultModalProps,
  DefaultBackdropProps,
  TourStep,
  ButtonsDefaultTranslation,
  TourEventHandlers
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
  },
  // {stepName: 'fourth', route: 'home', customData: 'Custom Data'},
  // {stepName: 'fifth', route: 'home', options: { placement: 'center', smoothScroll: true, stepTargetResize: [5], fixed: true }},
];

  const tourEvents: TourEventHandlers = {
    tourStart: ({tour}) => console.log(tour),
    next: ({step, history}) => console.log(step, history),
    prev: ({step}) => console.log(step),
    tourBreak: ({step}) => console.log(step),
    tourEnd: ({step}) => console.log(step),
  };

describe('TourService', async () => {
  let service: Ng3TourService;
  let routerSpy = {navigate: jasmine.createSpy('navigate')};
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [Ng3TourService, {provide: Router, useValue: routerSpy}],
    });
    service = TestBed.inject(Ng3TourService);
    // service.startTour({steps: steps2});
  });

  // it('should be created', () => {
  //   expect(service).toBeTruthy();
  // });
  // it('should create tour with 1 step', () => {
  //   const expectedStep = {
  //     stepName: 'first',
  //     route: 'home',
  //     title: 'Your tour started',
  //     index: 0,
  //     description: 'Almost default settings. Only "top" placement is setted.',
  //     backdropOptions: DefaultBackdropProps,
  //     tourModalOptions: DefaultModalProps,
  //     ctrlBtns: {
  //       done: ButtonsDefaultTranslation['done'][service.getLang()],
  //       prev: ButtonsDefaultTranslation['prev'][service.getLang()],
  //       next: ButtonsDefaultTranslation['next'][service.getLang()],
  //       of: ButtonsDefaultTranslation['of'][service.getLang()],
  //     },
  //   }
  //   service.stopTour();
  //   service.startTour({steps: steps1})
  //   expect(service.getTourStatus()).toBe(true);
  //   expect(service.getStepByIndex(0)).toEqual(expectedStep);
  // });
  // it('should create tour with 2 step with correct options', () => {
  //   const expectedStep: TourStep = {
  //     stepName: 'second',
  //     route: 'courses',
  //     title: 'Courses Page',
  //     description: 'Lazily loaded',
  //     adds: 'Some adds',
  //     backdropOptions: DefaultBackdropProps,
  //     tourModalOptions: DefaultModalProps,
  //     index: 1,
  //     ctrlBtns: {
  //       done: ButtonsDefaultTranslation['done'][service.getLang()],
  //       prev: ButtonsDefaultTranslation['prev'][service.getLang()],
  //       next: ButtonsDefaultTranslation['next'][service.getLang()],
  //       of: ButtonsDefaultTranslation['of'][service.getLang()],
  //     },
  //   }
  //   service.stopTour();
  //   service.startTour({steps: steps2})
  //   const step = service.getStepByIndex(0);
  //   expect(service.getStepByIndex(1)).toEqual(expectedStep);
  //   expect(step.backdropOptions.isBackdrop).toBe(false);
  //   expect(step.tourModalOptions.withoutCounter).toBe(true);
  // });
  // it('should stop tour correctly', () => {
  //   service.startTour({steps: steps2});
  //   service.stopTour();
  //   expect(service.getTourStatus()).toBe(false);
  // }); 
  // it('should choose language correctly', () => {
  //   service.startTour({steps: steps2});
  //   expect(service.getTourStatus()).toBe(true)
  //   const step = service.getStepByIndex(2);
  //   switch (service.getLang()) {
  //     case'en-EN':
  //       expect(step.title).toBe('My first feature');
  //       return;
  //     case'ru-RU':
  //       expect(step.title).toBe('Моя первая фича');
  //       return;
  //     case'fr-FR':
  //       expect(step.title).toBe('Mon premier long métrage')
  //       return;
  //     default:
  //       expect(step.title).toBe('My first feature');
  //   }
  // });
  // it('should be right history', async () => {
  //   console.log('service history ', service.getHistory(), service.getLastStep(), service.getTourStatus())
  //   service.nextStep();
  //   service.nextStep();
  //   service.prevStep();
    
  //   expect(service.getHistory()).toEqual([0, 1, 2, 1])
  // })
});
