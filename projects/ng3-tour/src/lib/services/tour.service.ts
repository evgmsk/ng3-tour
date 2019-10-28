import {Injectable} from '@angular/core';
import {BehaviorSubject, Observable} from 'rxjs';
import {Router} from '@angular/router';

import {StepTargetService} from './step-target.service';

export interface TourI {
  steps: TourStepI[];
  tourOptions?: StepOptionsI;
  withoutLogs?: boolean;
}

export interface TourStepI {
  stepName: string;
  route?: string;
  index?: number;
  title?: string;
  description?: string;
  options?: StepOptionsI;
}

export interface StepOptionsI {
  className?: string;
  withoutCounter?: boolean;
  withoutPrev?: boolean;
  customTemplate?: boolean;
  themeColor?: string;
  opacity?: number;
  placement?: string;
  arrowToTarget?: boolean;
  backdrop?: boolean;
  animatedStep?: boolean;
  smoothScroll?: boolean;
  scrollTo?: boolean;
  fixed?: boolean;
  continueIfTargetAbsent?: boolean; // init next step if target is not found for current one
  stepTargetResize?: number[]; // change size of a 'window' for step target
  delay?: number; // for the case of the lazy routing
}

export const defaultOptions: StepOptionsI = {
  className: '',
  continueIfTargetAbsent: true,
  withoutCounter: false,
  withoutPrev: false,
  customTemplate: false,
  smoothScroll: false,
  scrollTo: true,
  themeColor: 'rgb(20, 60, 60)',
  opacity: .6,
  placement: 'down',
  arrowToTarget: true,
  stepTargetResize: [0],
  delay: 500,
  animatedStep: true,
  fixed: false,
  backdrop: true,
};

export class StepOptions implements StepOptionsI {
  className?: string;
  withoutCounter?: boolean;
  withoutPrev?: boolean;
  customTemplate?: boolean;
  themeColor?: string;
  opacity?: number;
  placement: string;
  arrowToTarget?: boolean;
  backdrop?: boolean;
  backdropColor?: string;
  animatedStep?: boolean;
  smoothScroll?: boolean;
  scrollTo?: boolean;
  continueIfTargetAbsent?: boolean;
  stepTargetResize?: number[];
  delay?: number;
  fixed?: boolean;
  constructor(options: StepOptionsI = defaultOptions) {
    const {
      className,
      continueIfTargetAbsent,
      withoutCounter,
      withoutPrev,
      customTemplate,
      smoothScroll,
      scrollTo,
      themeColor,
      opacity,
      placement,
      arrowToTarget,
      stepTargetResize,
      delay,
      animatedStep,
      fixed,
      backdrop,
    } = options;
    this.className = className;
    this.placement = placement;
    this.arrowToTarget = arrowToTarget;
    this.themeColor = themeColor;
    this.opacity = opacity;
    this.backdrop = backdrop;
    this.customTemplate = customTemplate;
    this.withoutCounter = withoutCounter;
    this.withoutPrev = withoutPrev;
    this.continueIfTargetAbsent = continueIfTargetAbsent;
    this.stepTargetResize = stepTargetResize;
    this.delay = delay;
    this.animatedStep = animatedStep;
    this.smoothScroll = smoothScroll;
    this.scrollTo = scrollTo;
    this.fixed = fixed;
  }
}

export interface TourHandlersI {
  handlePrev(): void;
  handleNext(): void;
  handleClose(): void;
}

@Injectable()
export class TourService {
  private steps: TourStepI[];
  private tourStarted = false;
  private currentStep$ = new BehaviorSubject<any>(null);
  private history = [];
  private routeChanged = false;
  private firstStepOptions: StepOptionsI;
  private withoutLogs = false;
  private presets: StepOptionsI = {};
  constructor(private router: Router, private readonly targetService: StepTargetService) { }

  private setSteps(tour: TourI): void {
    const options = new StepOptions({...defaultOptions, ...this.presets, ...tour.tourOptions});
    this.steps = tour.steps.map((x, i) => {
      x.index = i;
      x.options = x.options ? {...options, ...x.options} : options;
      return x;
    });
    if (!this.withoutLogs) {
      console.log('gn-tour init with steps: ');
      console.log(this.steps);
    }
    this.firstStepOptions = this.steps[0].options;
  }
  public setPresets(presets: StepOptionsI): void {
    this.presets = {...this.presets, ...presets};
  }

  public initStep(step: number): void {
    const previousStep = this.getHistory() ? this.steps[this.history.slice(-1)[0]] : {route: null};
    const currentStep = this.steps[step];
    this.routeChanged = previousStep.route !== currentStep.route;
    this.history.push(step);
    if (this.routeChanged) {
      this.router.navigate([currentStep.route]);
    }
    this.currentStep$.next(currentStep.stepName);
  }
  validateOptions(tour: TourI): boolean {
    const regExpr = /^top$|^down$|^left$|^right$|^center$/i;
    let isValid = true;
    tour.steps.forEach((step: TourStepI) => {
      if (step.options && step.options.placement) {
        isValid = regExpr.test(step.options.placement);
      }
    });
    if (tour.tourOptions.placement) {
      isValid = regExpr.test(tour.tourOptions.placement);
    }
    return isValid;
  }
  public getStepSubject(): Observable<string> {
    return this.currentStep$;
  }
  public getStepByName(stepName: string): TourStepI {
    return this.steps.filter(step => step.stepName === stepName)[0];
  }

  public isRouteChanged() {
    return this.routeChanged;
  }
  public getFirstStepOptions() {
    return this.firstStepOptions;
  }
  public getTotal(): number {
    return this.steps.length;
  }

  public setTourStatus(status: boolean): void {
    this.tourStarted = status;
  }
  public getTourStatus() {
    return this.tourStarted;
  }
  public startTour(tour: TourI) {
    if (!this.validateOptions(tour)) {
      throw new Error('Placement option of the ng-tour or one of it step is invalid');
    }
    this.setTourStatus(true);
    this.withoutLogs = !!tour.withoutLogs;
    this.setSteps(tour);
    this.initStep(0);
  }
  public getHistory() {
    return this.history.length;
  }

  public stopTour() {
    this.setTourStatus(false);
    this.steps.length = 0;
    this.currentStep$.next(null);
    this.history.length = 0;
    this.targetService.setTargetSubject(null);
  }
}
