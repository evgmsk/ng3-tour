import {Injectable, isDevMode, PLATFORM_ID, Inject} from '@angular/core';
import {isPlatformBrowser} from '@angular/common'
import {BehaviorSubject, Observable} from 'rxjs';
import {Router} from '@angular/router';

import {
  Tour,
  TourEvent,
  TourEvents,
  CtrlBtns,
  TourStep,
} from '../interfaces/tour.interface';
import {Steps, setTourProps} from '../interfaces/step.interface'
import { TargetWindowSize } from '../interfaces/backdrop.interface';

export const defaultTranslation = {
  done: {
   'en-EN': 'done',
   'ru-RU': 'закр',
   'fr-FR': 'fini',
  },
  prev: {
    'en-EN': 'prev',
    'ru-RU': 'пред',
    'fr-FR': 'préc'
  },
  next: {
    'en-EN': 'next',
    'ru-RU': 'след',
    'fr-FR': 'proch',
  },
  of: {
    'en-EN': 'of',
    'fr-FR': 'de',
    'ru-RU': "из",
  }
}

export const defaultTourEvent: TourEvent = (props) => {};

export const TourDefaultEvents = {
  tourStart: defaultTourEvent,
  tourEnd: defaultTourEvent,
  tourBreak: defaultTourEvent,
  next: defaultTourEvent,
  prev: defaultTourEvent,
};

 // @dynamic
@Injectable()
export class TourService {
  private steps: TourStep[];
  private tourStarted = false;
  private stepsStream$ = new BehaviorSubject<Steps>({stepName: null});
  private history = [];
  private routeChanged = false;
  private presets: {[propName: string]: any};
 // private tourStart = TourDefaultEvents.tourStart;
  private tourBreak = defaultTourEvent;
  private tourEnd = defaultTourEvent;
  private next = defaultTourEvent;
  private prev = defaultTourEvent;
  private isBrowser: boolean;
  private lang: string;
  constructor(
    private router: Router,
    // @dynamic
    @Inject(PLATFORM_ID) platformId: {}) {
    this.nextStep = this.nextStep.bind(this);
    this.prevStep = this.prevStep.bind(this);
    this.stopTour = this.stopTour.bind(this);
    this.isBrowser = isPlatformBrowser(platformId);
    this.lang = this.isBrowser ? navigator.language : '';
  }
  private validateTour(tour: Tour): void | never {
    this.validateOptions(tour);
  }

  private validateOptions(tour: Tour): void | never {
    const regExpr = /^top$|^down$|^left$|^right$|^center$|^right-center$|^left-center$|^right-top$|^left-top$/i;
    let isValid = true;
    tour.steps.forEach((step: TourStep) => {
      if (step.options && step.options.modalProps.placement) {
        isValid = regExpr.test(step.options.modalProps.placement);
      }
    });
    if (tour.tourOptions && tour.tourOptions.modalProps.placement) {
      isValid = regExpr.test(tour.tourOptions.modalProps.placement);
    }
    if (!isValid) {
      throw Error('Placement option of the ng3-tour or one of it step is invalid');
    }
  }

  private setSteps(tour: Tour): void {
    const options = setTourProps(tour.tourOptions);
    this.steps = tour.steps.map((x, i) => {
      x.index = i;
      if (x.description && typeof x.description === 'object') {
        x.description = this.defineLocalName(x.description);
      }
      if (x.title && typeof x.title === 'object') {
        x.title = this.defineLocalName(x.title)
      }
      x.options = x.options ? {...options, ...x.options} : options;
      x.total = tour.steps.length;
      x.ctrlBtns = this.defineDefaultNames(tour.ctrlBtns || defaultTranslation)
      return x;
    });
    if (isDevMode()) {
      console.log('Development mode: ', isDevMode())
      console.log('ng3-tour is initiated with steps:');
      console.log(this.steps);
    }
  }

  private defineLocalName(obj: any): string {
    let result: string;
    if (!this.isBrowser) {
      return '';
    }
    if (obj.hasOwnProperty(this.lang)) {
      result = obj[this.lang];
    } else {
      const setLanguages = Object.keys(obj);
      const ralatedLang = setLanguages.filter(l => l.includes(this.lang.slice(0, 2)))[0];
      if (ralatedLang) {
        result = obj[ralatedLang]
      } else {
        result = obj[setLanguages[0]];
      }
    }
    if (typeof result === 'string') {
      return result;
    }
    console.error(`Tour configuration error with ${JSON.stringify(obj)}`)
    return 'Error'
  }

  private defineDefaultNames(btns: CtrlBtns): CtrlBtns {
    const btnCtrls = {};
    for (let prop in btns) {
      if (btns.hasOwnProperty(prop)) {
        let result: string;
        if (typeof btns[prop] === 'string') {
          result = btns[prop];
        } else if (typeof btns[prop] === 'object' && btns[prop][this.lang] === 'string') {
          result = btns[prop][this.lang]
        } else {
          const setLanguages = Object.keys(btns[prop]);
          const ralatedLang = setLanguages.filter(l => l.includes(this.lang.slice(0, 2)))[0];
          if (ralatedLang) {
            result = btns[prop][ralatedLang]
          } else {
            result = btns[prop][setLanguages[0]];
          }
          if (typeof result === 'string') {
            btnCtrls[prop] = result;
          } else if (this.isBrowser) {
            console.error(`Tour configuration error with ${JSON.stringify(btns)}`);
            btnCtrls[prop] = 'Error'
          }  
        }
      }
    }
    return btnCtrls;
  }

  private initStep(step: number): void {
    const previousStep = this.history.length ? this.getLastStep() : {route: null};
    const newStep = this.steps[step];
    this.routeChanged = previousStep.route !== newStep.route;
    this.history.push(step);
    if (newStep.route && this.routeChanged) {
      this.router.navigate([newStep.route]);
    }
    this.stepsStream$.next({stepName: newStep.stepName});
  }


  public getHistory() {
    return this.history;
  }
  public setPresets(presets: {customTemplate: boolean}): void {
    this.presets = {...presets};
  }
  public resetStep(stepName: string | number, step: TourStep) {
    const index = typeof stepName === 'number' ? stepName : this.getStepByName(stepName).index;
    this.steps[index] = {...step};
  }
  public getStepByName(stepName: string): TourStep {
    return this.steps.filter(step => step.stepName === stepName)[0];
  }
  public getStepByIndex(index = 0): TourStep {
    return this.steps[index];
  }
  public getLastStep(): TourStep {
    if (this.history.length) return this.steps[this.history.slice(-1)[0]];
    return null;
  }
  public getStepsStream(): Observable<Steps> {
    return this.stepsStream$;
  }
  public isRouteChanged() {
    return this.routeChanged;
  }
  private setTourStatus(status: boolean): void {
    this.tourStarted = status;
  }
  public getTourStatus() {
    return this.tourStarted;
  }
  public startTour(tour: Tour): void {
    this.validateTour(tour);
    const {tourBreak, tourStart, tourEnd, next, prev} = {...TourDefaultEvents, ...tour.tourEvents};
    tourStart({tourEvent: 'Tour start', tour});
    this.tourBreak = tourBreak;
    this.tourEnd = tourEnd;
    this.next = next;
    this.prev = prev;
    this.setSteps(tour);
    this.initStep(0);
    this.setTourStatus(true);
  }
  public stopTour() {
    const index = this.getLastStep().index;
    const latestStepIndex = this.steps.length - 1;
    if ( index < latestStepIndex) {
      this.tourBreak({tourEvent: 'Tour break', step: index, history: this.history});
    } else if (latestStepIndex === index) {
      this.tourEnd({tourEvent: 'Tour end', step: index, history: this.history});
    }
    this.setTourStatus(false);
    this.steps.length = 0;
    this.stepsStream$.next(null);
    this.history.length = 0;
  }
  public nextStep() {
    const step = this.getLastStep().index + 1;
    this.next({tourEvent: 'Init next', step, history: this.history});
    this.initStep(step);
  }
  public prevStep() {
    const step = this.getLastStep().index - 1;
    this.prev({tourEvent: 'Init prev', step, history: this.history});
    this.initStep(step);
  }
  public maxHeight() {
    return Math.round(Math.max(
      document.body.scrollHeight,
      document.documentElement.scrollHeight,
      document.body.offsetHeight,
      document.documentElement.offsetHeight,
      document.body.clientHeight,
      document.documentElement.clientHeight,
      window.innerHeight
    ));
  }
  public getSizeAndPosition(el: Element) {
    const targetRect = el.getBoundingClientRect();
    const bodyRect = document.body.getBoundingClientRect();
    const top = Math.round(targetRect.top - bodyRect.top);
    const left = Math.round(targetRect.left - bodyRect.left);
    const bottom = Math.round(targetRect.bottom - bodyRect.top);
    const right = Math.round(targetRect.left - bodyRect.left);
    const height = Math.round(targetRect.height || bottom - top);
    const width = Math.round(targetRect.width || right - left);
    const pageHeight = this.maxHeight();
    return {top, left, bottom, right, width, height, pageHeight};
  }

  public resizeTarget(target: TargetWindowSize, size: number[]): TargetWindowSize {
    target.left -= size[0];
    target.right += size[0];
    target.top -= size[1] || size[0];
    target.bottom += size[1] || size[0];
    target.width += 2 * size[0];
    target.height += 2 * (size[1] || size[0]);
    return target;
  }
}
