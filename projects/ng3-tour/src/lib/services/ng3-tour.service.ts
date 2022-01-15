import {Injectable, isDevMode, PLATFORM_ID, Inject} from '@angular/core';
import {isPlatformBrowser} from '@angular/common'
import {BehaviorSubject, Observable} from 'rxjs';
import {Router} from '@angular/router';

import {
  ITour,
  ICtrlBtns,
  ITourStep,
  DefaultTourEventHandler,
  ButtonsDefaultTranslation,
  DefaultTourEventHandlers,
  setTourProps,
  StepSubject,
  ITargetFrameSize
} from '../../public_api';
import { IStepProps, ITourEventHandlers, ITourProps } from '../interfaces/ng3-tour.interface';

 // @dynamic
@Injectable()
export class Ng3TourService {
  private steps!: ITourStep[];
  private tourStarted = false;
  private stepsStream$ = new BehaviorSubject<StepSubject>(null as unknown as StepSubject);
  private stepTargetStream$ = new BehaviorSubject<StepSubject>(null as unknown as StepSubject);
  private history: number[] = [];
  private routeChanged = false;
  private tourBreak = DefaultTourEventHandler;
  private tourEnd = DefaultTourEventHandler;
  private next = DefaultTourEventHandler;
  private prev = DefaultTourEventHandler;
  private isBrowser: boolean;
  private lang: string;
  constructor(
    private router: Router,
    // @dynamic
    @Inject(PLATFORM_ID) platformId: {}) {
    this.nextStep = this.nextStep.bind(this);
    this.prevStep = this.prevStep.bind(this);
    this.stopTour = this.stopTour.bind(this);
    this.getLang = this.getLang.bind(this);
    this.isBrowser = isPlatformBrowser(platformId);
    this.lang = this.isBrowser ? navigator.language : '';
  }


  private validateOptions(tour: ITourProps): void | never {
    const regExpr = /^top$|^down$|^left$|^right$|^center$|^right-center$|^left-center$|^right-top$|^left-top$/i;
    tour.steps.forEach((step: IStepProps, i: number) => {
      if (step['modal']?.placement && !regExpr.test(step['modal']?.placement)) {
        throw Error(`Placement option of the step ${i} of the ng3-tour is invalid ${step['modal']?.placement}`);
      }
    });
    if (tour['tourModal']?.placement && !regExpr.test(tour['tourModal']?.placement)) {
      throw Error(`Placement option of the ng3-tour is invalid ${tour['tourModal']?.placement}`);
    }
  }

  private setSteps(tour: ITourProps): void {
    const {steps, ...restProps} = tour;
    const tourOptions = setTourProps(restProps);
    this.steps = {...tour}.steps.map((step, i) => {
      step['index'] = i;
      step['total'] = steps.length;
      if (step['description'] && typeof step['description'] === 'object') {
        step['description'] = this.defineLocalName(step['description']);
      }
      if (step['title'] && typeof step['title'] === 'object') {
        step['title'] = this.defineLocalName(step['title'])
      }
      step['backdrop'] = {...tourOptions.tourBackdrop, ...step['backdrop']};
      let {modalStyles, ...restProps} = step['modal'] || {};
      modalStyles = {...tourOptions.tourModal!.modalStyles, ...modalStyles};
      step['modal'] = {...tourOptions.tourModal, ...restProps, modalStyles};
      step['ctrlBtns'] = this.defineBtnsNames(tour['tourCtrlBtns'] || ButtonsDefaultTranslation);
      return step as ITourStep;
    });
    if (isDevMode()) {
      console.log('Development mode: ', isDevMode())
      console.log('ng3-tour is initiated with steps:');
      console.log(this.steps);
    }
  }

  private defineLocalName(obj: {[key: string]: string}): string {
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

  private defineBtnsNames(btns: ICtrlBtns): {[propName: string]: string} {
    const btnCtrls = {} as {[propName: string]: string};
    for (let prop in btns) {
      if (btns.hasOwnProperty(prop)) {
        let result: string;
        if (typeof btns[prop] === 'string') {
          result = btns[prop];
        } else if (typeof btns[prop] === 'object' && btns[prop][this.lang] === 'string') {
          result = btns[prop][this.lang]
        } else {
          const setOfLanguages = Object.keys(btns[prop]);
          const ralatedLang = setOfLanguages.filter(l => l.includes(this.lang.slice(0, 2)))[0];
          if (ralatedLang) {
            result = btns[prop][ralatedLang]
          } else {
            result = btns[prop][setOfLanguages[0]];
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

  public initStep(step: number): void {
    // console.log(step, this.history)
    const previousStep = this.history.length ? this.getLastStep() : {route: null};
    const newStep = this.steps[step];
    this.routeChanged = previousStep.route !== newStep.route;
    this.history.push(step);
    if (newStep.route && this.routeChanged) {
      this.router.navigate([newStep.route]);
    }
    const delay = newStep.modal!.delay;
    this.stepsStream$.next({stepName: newStep.stepName, delay});
  }

  public getLang() {
    return this.lang;
  }
  public getHistory() {
    return this.history;
  }
  public getStepsLength() {
    return this.steps.length;
  }
  public resetStep(stepName: string | number, step: ITourStep) {
    const index = typeof stepName === 'number' ? stepName : this.getStepByName(stepName).index!;
    this.steps[index] = {...step};
  }
  public getStepByName(stepName: string): ITourStep {
    return this.steps.filter(step => step.stepName === stepName)[0];
  }
  public getStepByIndex(index = 0): ITourStep {
    return this.steps[index];
  }
  public getLastStep(): ITourStep {
    if (this.history.length) return this.steps[this.history.slice(-1)[0]];
    return null as unknown as ITourStep;
  }
  public getStepsStream(): BehaviorSubject<StepSubject> {
    return this.stepsStream$;
  }
  public getStepTargetStream(): BehaviorSubject<StepSubject> {
    return this.stepTargetStream$;
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
  public startTour(tour: ITourProps): void {
    this.validateOptions(tour);
    const tourEvantHendlers = {...DefaultTourEventHandlers, ...tour['tourEvents']} as ITourEventHandlers;
    const  {tourBreak, tourStart, tourEnd, next, prev} = tourEvantHendlers
    tourStart({tourEvent: 'start', tour});
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
    if ( index! < latestStepIndex) {
      this.tourBreak({tourEvent: 'break', step: index, history: this.history});
    } else if (latestStepIndex === index) {
      this.tourEnd({tourEvent: 'end', step: index, history: this.history});
    }
    this.setTourStatus(false);
    this.stepTargetStream$.next(null as unknown as ITourStep);
    this.stepsStream$.next(null as unknown as ITourStep);
    this.steps.length = 0;
    this.history.length = 0;
  }
  public nextStep() {
    const step = this.getLastStep().index! + 1;
    this.next({tourEvent: 'next', step, history: this.history});
    this.initStep(step);
  }
  public prevStep() {
    const step = this.getLastStep().index! - 1;
    this.prev({tourEvent: 'prev', step, history: this.history});
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
    if (isDevMode() && (!targetRect || !el) ) {
      console.error(el, targetRect)
    }
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

  public resizeTarget(target: ITargetFrameSize, size: number[]): ITargetFrameSize {
    target['left'] -= size[0];
    target['right'] += size[0];
    target['top'] -= size[1] || size[0];
    target['bottom'] += size[1] || size[0];
    target['width'] += 2 * size[0];
    target['height'] += 2 * (size[1] || size[0]);
    return target;
  }
}
